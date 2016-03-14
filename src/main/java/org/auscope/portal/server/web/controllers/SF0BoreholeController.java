package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.service.BoreholeService;
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

    private SF0BoreholeService boreholeService;

    @Autowired
    public SF0BoreholeController(SF0BoreholeService sf0BoreholeService, CSWCacheService cswService) {
        this.boreholeService = sf0BoreholeService;
    }

    /**
     * Handles the borehole filter queries.
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param mineName
     *            the name of the mine to query for
     * @param request
     *            the HTTP client request
     * @return a WFS response converted into KML
     * @throws Exception
     */
    @RequestMapping("/doBoreholeViewFilter.do")
    public ModelAndView doBoreholeFilter(@RequestParam(required = false, value = "serviceUrl", defaultValue = "") String serviceUrl,
            @RequestParam(required = false, value = "boreholeName", defaultValue = "") String boreholeName,
            @RequestParam(required = false, value = "custodian", defaultValue = "") String custodian,
            @RequestParam(required = false, value = "dateOfDrilling", defaultValue = "") String dateOfDrilling,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") Integer maxFeatures,
            @RequestParam(required = false, value = "bbox") String bbox,
            @RequestParam(required=false, value="outputFormat") String outputFormat) throws Exception {

        try {
            FilterBoundingBox box = FilterBoundingBox.attemptParseFromJSON(bbox);
            WFSResponse response = this.boreholeService.getAllBoreholes(serviceUrl, boreholeName, custodian,
                    dateOfDrilling, maxFeatures, box, outputFormat);
            return generateNamedJSONResponseMAV(true, "gml", response.getData(), response.getMethod());
        } catch (Exception e) {
            return this.generateExceptionResponse(e, serviceUrl);
        }
    }

    /**
     * Handles getting the style of the SF0 borehole filter queries. (If the bbox elements are specified, they will limit the output response to 200 records
     * implicitly)
     *
     * @param mineName
     *            the name of the mine to query for
     * @param bbox
     * @param maxFeatures
     * @throws Exception
     */
    @RequestMapping("/doBoreholeViewFilterStyle.do")
    public void doFilterStyle(
            HttpServletResponse response,
            @RequestParam(required = false, value = "serviceUrl", defaultValue = "") String serviceUrl,
            @RequestParam(required = false, value = "boreholeName", defaultValue = "") String boreholeName,
            @RequestParam(required = false, value = "custodian", defaultValue = "") String custodian,
            @RequestParam(required = false, value = "dateOfDrilling", defaultValue = "") String dateOfDrilling,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") Integer maxFeatures,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "serviceFilter", defaultValue = "") String serviceFilter,
            @RequestParam(required = false, value = "color", defaultValue = "") String color)
                    throws Exception {

        FilterBoundingBox bbox = null;

        List<String> hyloggerBoreholeIDs = null;

        String filter = this.boreholeService.getFilter(boreholeName,
                custodian, dateOfDrilling, maxFeatures, bbox,
                null);

        String hyloggerFilter = this.boreholeService.getFilter(boreholeName,
                custodian, dateOfDrilling, maxFeatures, bbox,
                hyloggerBoreholeIDs);

        String style = this.boreholeService.getStyle(filter, hyloggerFilter, "#F87217", BoreholeService.Styles.ALL_BOREHOLES);

        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,
                false);

        styleStream.close();
        outputStream.close();
    }

}
