package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.csw.CSWRecordsHostFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.core.util.HttpUtil;
import org.auscope.portal.server.web.service.SF0BoreholeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller for handling requests for the SF0 Borehole
 *
 * @author Florence Tan
 *
 */
@Controller
public class SF0BoreholeController extends BasePortalController {

    private SF0BoreholeService sf0BoreholeService;
    private CSWCacheService cswService;


    @Autowired
    public SF0BoreholeController(SF0BoreholeService sf0BoreholeService,
            CSWCacheService cswService) {

        this.sf0BoreholeService = sf0BoreholeService;
        this.cswService = cswService;

    }

    /**
     * Handles the SF0 borehole filter queries.
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param boreholeName
     *            the name of the borehole to query for
     * @param custodian
     *            the custodian of the borehole to query for
     * @param dateOfDrilling
     *            the dateOfDrilling of the borehole to query for
     * @param request
     *            the HTTP client request
     * @return a WFS response converted into KML
     * @throws Exception
     */
    @RequestMapping("/doSF0BoreholeFilter.do")
    public ModelAndView doSF0BoreholeFilter(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "boreholeName", defaultValue = "") String boreholeName,
            @RequestParam(required = false, value = "custodian", defaultValue = "") String custodian,
            @RequestParam(required = false, value = "dateOfDrilling", defaultValue = "") String dateOfDrilling,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "onlyHylogger") String onlyHyloggerString,
            @RequestParam(required = false, value = "serviceFilter", defaultValue = "") String serviceFilter)
            throws Exception {

        String[] serviceFilterArray = serviceFilter.split(",");

        if (!serviceFilter.equals("")
                && !(HttpUtil.containHost(serviceUrl, serviceFilterArray))) {
            return this.generateJSONResponseMAV(false, null, "Not Queried");
        }

        boolean onlyHylogger = false;
        if (onlyHyloggerString != null && onlyHyloggerString.length() > 0) {
            if (onlyHyloggerString.equals("on")) {
                onlyHylogger = true;
            } else {
                onlyHylogger = Boolean.parseBoolean(onlyHyloggerString);
            }
        }

        FilterBoundingBox bbox = FilterBoundingBox
                .attemptParseFromJSON(bboxJson);
        return doSF0BoreholeFilter(serviceUrl, boreholeName, custodian,
                dateOfDrilling, maxFeatures, bbox, onlyHylogger);
    }


    /**
     * Handles the borehole filter queries.
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param boreholeName
     *            the name of the borehole to query for
     * @param custodian
     *            the name of the custodian to query for
     * @param dateOfDrilling
     *            the drilling date
     * @param maxFeature
     *            maximum features
     * @return a WFS response converted into KML
     * @throws Exception
     */
    public ModelAndView doSF0BoreholeFilter(String serviceUrl,
            String boreholeName, String custodian, String dateOfDrilling,
            int maxFeatures, FilterBoundingBox bbox, boolean onlyHylogger)
            throws Exception {

        List<String> hyloggerBoreholeIDs = null;
        if (onlyHylogger) {
            try {
                hyloggerBoreholeIDs = this.sf0BoreholeService
                        .discoverHyloggerBoreholeIDs(this.cswService,
                                new CSWRecordsHostFilter(serviceUrl));
            } catch (Exception e) {
                log.warn(String
                        .format("Error requesting list of hylogger borehole ID's from %1$s: %2$s",
                                serviceUrl, e));
                log.debug("Exception:", e);
                return generateJSONResponseMAV(false, null,
                        "Failure when identifying which boreholes have Hylogger data.");
            }

            if (hyloggerBoreholeIDs.size() == 0) {
                log.warn("No hylogger boreholes exist (or the services are missing)");
                return generateJSONResponseMAV(false, null,
                        "Unable to identify any boreholes with Hylogger data.");
            }
        }

        try {
            WFSTransformedResponse response = this.sf0BoreholeService
                    .getAllBoreholes(serviceUrl, boreholeName, custodian,
                            dateOfDrilling, maxFeatures, bbox,
                            hyloggerBoreholeIDs);
            return generateJSONResponseMAV(true, response.getGml(),
                    response.getTransformed(), response.getMethod());
        } catch (Exception e) {
            return this.generateExceptionResponse(e, serviceUrl);
        }
    }

    /**
     * Handles getting the style of the SF0 borehole filter queries. (If the
     * bbox elements are specified, they will limit the output response to 200
     * records implicitly)
     *
     * @param mineName
     *            the name of the mine to query for
     * @param bbox
     * @param maxFeatures
     * @throws Exception
     */
    @RequestMapping("/doSF0FilterStyle.do")
    public void doSF0FilterStyle(
            HttpServletResponse response,
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "boreholeName", defaultValue = "") String boreholeName,
            @RequestParam(required = false, value = "custodian", defaultValue = "") String custodian,
            @RequestParam(required = false, value = "dateOfDrilling", defaultValue = "") String dateOfDrilling,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "onlyHylogger") String onlyHyloggerString,
            @RequestParam(required = false, value = "serviceFilter", defaultValue = "") String serviceFilter)
            throws Exception {

        String[] serviceFilterArray = serviceFilter.split(",");

        if (!serviceFilter.equals("")
                && !(HttpUtil.containHost(serviceUrl, serviceFilterArray))) {
            // return this.generateJSONResponseMAV(false,null,"Not Queried");
            log.warn("Not Queried");
        }

        boolean onlyHylogger = false;
        if (onlyHyloggerString != null && onlyHyloggerString.length() > 0) {
            if (onlyHyloggerString.equals("on")) {
                onlyHylogger = true;
            } else {
                onlyHylogger = Boolean.parseBoolean(onlyHyloggerString);
            }
        }

        FilterBoundingBox bbox = FilterBoundingBox
                .attemptParseFromJSON(bboxJson);

        // return doSF0BoreholeFilter(serviceUrl,boreholeName, custodian,
        // dateOfDrilling, maxFeatures, bbox, onlyHylogger);
        List<String> hyloggerBoreholeIDs = null;
        if (onlyHylogger) {
            try {
                hyloggerBoreholeIDs = this.sf0BoreholeService
                        .discoverHyloggerBoreholeIDs(this.cswService,
                                new CSWRecordsHostFilter(serviceUrl));
            } catch (Exception e) {
                log.warn(String
                        .format("Error requesting list of hylogger borehole ID's from %1$s: %2$s",
                                serviceUrl, e));
                log.debug("Exception:", e);
                // return generateJSONResponseMAV(false, null,
                // "Failure when identifying which boreholes have Hylogger data.");
            }

            if (hyloggerBoreholeIDs.size() == 0) {
                log.warn("No hylogger boreholes exist (or the services are missing)");
                // return generateJSONResponseMAV(false, null,
                // "Unable to identify any boreholes with Hylogger data.");
            }
        }

        String filter = this.sf0BoreholeService.getSF0Filter(boreholeName,
                custodian, dateOfDrilling, maxFeatures, bbox,
                hyloggerBoreholeIDs);
        String style = this.getStyle(filter, "gsmlp:BoreholeView", "#2242c7");

        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,
                false);

        styleStream.close();
        outputStream.close();
    }

    public String getStyle(String filter, String name, String color) {
        // VT : This is a hack to get around using functions in feature chaining
        // https://jira.csiro.au/browse/SISS-1374
        // there are currently no available fix as wms request are made prior to
        // knowing app-schema mapping.

        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/2.0\" xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>" + "<Name>"
                + name
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<Abstract>portal-style</Abstract>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + "<Rule>"
                + "<Name>portal-style</Name>"
                + "<Abstract>portal-style</Abstract>"
                + filter
                + "<PointSymbolizer>"
                + "<Graphic>"
                + "<Mark>"
                + "<WellKnownName>square</WellKnownName>"
                + "<Fill>"
                + "<CssParameter name=\"fill\">"
                + color
                + "</CssParameter>"
                + "</Fill>"
                + "</Mark>"
                + "<Size>8</Size>"
                + "</Graphic>"
                + "</PointSymbolizer>"
                + "</Rule>"
                + "</FeatureTypeStyle>"
                + "</UserStyle>" + "</NamedLayer>" + "</StyledLayerDescriptor>";

        return style;
    }

}
