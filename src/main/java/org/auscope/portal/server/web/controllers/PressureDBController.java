package org.auscope.portal.server.web.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.pressuredb.AvailableOMResponse;
import org.auscope.portal.server.web.service.PressureDBService;
import org.auscope.portal.core.util.FileIOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONArray;

/**
 * A controller class containing methods for supporting the Pressure DB layer and associated dataservice
 *
 * @author Josh Vote
 *
 */
@Controller
public class PressureDBController extends BasePortalController {

    private final Log log = LogFactory.getLog(getClass());

    private PressureDBService pressureDBService;

    private int BUFFERSIZE = 1024 * 32;

    public HashMap<Integer, String> PRESSURE_DB_COLOUR_MAP = new HashMap<Integer, String>();
    public HashMap<Integer, Integer> PRESSURE_DB_LENGTH_MAP = new HashMap<Integer, Integer>();
    public HashMap<Integer, Integer> PRESSURE_DB_ELEVATION_MAP = new HashMap<Integer, Integer>();
    public HashMap<String, String> PRESSURE_DB_POI_MAP;

    @Autowired
    public PressureDBController(PressureDBService pressureDBService) {
        this.pressureDBService = pressureDBService;
        PRESSURE_DB_COLOUR_MAP.put(0, "#0000FF");
        PRESSURE_DB_COLOUR_MAP.put(1, "#0080FF");
        PRESSURE_DB_COLOUR_MAP.put(2, "#00FFFF");
        PRESSURE_DB_COLOUR_MAP.put(3, "#00FF80");
        PRESSURE_DB_COLOUR_MAP.put(4, "#00FF00");
        PRESSURE_DB_COLOUR_MAP.put(5, "#80FF00");
        PRESSURE_DB_COLOUR_MAP.put(6, "#FFFF00");
        PRESSURE_DB_COLOUR_MAP.put(7, "#FF8000");
        PRESSURE_DB_COLOUR_MAP.put(8, "#FF0000");

        PRESSURE_DB_LENGTH_MAP.put(0, 500);
        PRESSURE_DB_LENGTH_MAP.put(1, 1000);
        PRESSURE_DB_LENGTH_MAP.put(2, 1500);
        PRESSURE_DB_LENGTH_MAP.put(3, 2000);
        PRESSURE_DB_LENGTH_MAP.put(4, 2500);
        PRESSURE_DB_LENGTH_MAP.put(5, 3000);
        PRESSURE_DB_LENGTH_MAP.put(6, 3500);
        PRESSURE_DB_LENGTH_MAP.put(7, 4000);
        PRESSURE_DB_LENGTH_MAP.put(8, 4500);

        PRESSURE_DB_ELEVATION_MAP.put(0, -200);
        PRESSURE_DB_ELEVATION_MAP.put(1, -150);
        PRESSURE_DB_ELEVATION_MAP.put(2, -100);
        PRESSURE_DB_ELEVATION_MAP.put(3, -50);
        PRESSURE_DB_ELEVATION_MAP.put(4, 0);
        PRESSURE_DB_ELEVATION_MAP.put(5, 50);
        PRESSURE_DB_ELEVATION_MAP.put(6, 100);
        PRESSURE_DB_ELEVATION_MAP.put(7, 150);
        PRESSURE_DB_ELEVATION_MAP.put(8, 200);

        PRESSURE_DB_POI_MAP = new HashMap<String, String>();
        PRESSURE_DB_POI_MAP.put("Elevation", "public:measurement_general");
        PRESSURE_DB_POI_MAP.put("Length", "public:measurement_index");

    }
    /**
     * Handles requests for the doGetPropertyOfInterest
     *
     * Will return a JSON encoded PropertyOfInterest
     *
     * @param serviceUrl
     * @return
     */
    @RequestMapping("/doGetPropertyOfInterest.do")
    public ModelAndView doGetLayerOfInterest(@RequestParam("serviceUrl") String serviceUrl) {
        JSONArray dataItems = new JSONArray();

        for (String group : this.PRESSURE_DB_POI_MAP.keySet()) {
            JSONArray tableRow = new JSONArray();
            tableRow.add(group);
            tableRow.add(this.PRESSURE_DB_POI_MAP.get(group));
            dataItems.add(tableRow);
        }

        return generateJSONResponseMAV(true, dataItems, "");
    }
    /**
     * Handles requests for the getAvailableOM method
     *
     * Will return a JSON encoded AvailableOMResponse
     *
     * @param serviceUrl
     * @param wellID
     * @return
     */
    @RequestMapping("/pressuredb-getAvailableOM.do")
    public ModelAndView getAvailableOM(String serviceUrl, String wellID) {

        try {
            AvailableOMResponse response = pressureDBService.makeGetAvailableOMRequest(wellID, serviceUrl);

            return generateJSONResponseMAV(true, new AvailableOMResponse[] {response}, "");
        } catch (Exception e) {
            log.warn(String.format("Error making pressure-db service request for '%1$s' to '%2$s': %3$s", wellID,
                    serviceUrl, e));
            log.debug("Exception: ", e);
            return generateJSONResponseMAV(false, null, "Failure communicating with Pressure DB data service");
        }
    }

    /**
     * Handles requests for the download method
     *
     * Will return a stream directly from the service
     *
     * @param serviceUrl
     * @param wellID
     * @return
     * @throws IOException
     */
    @RequestMapping("/pressuredb-download.do")
    public void download(String serviceUrl, String wellID, String[] feature, HttpServletResponse response)
            throws IOException {

        //Make our request and get our inputstream
        InputStream inputStream = null;
        try {
            inputStream = pressureDBService.makeDownloadRequest(wellID, serviceUrl, feature);
        } catch (Exception e) {
            log.warn(String.format("Error making pressure-db download request for '%1$s' to '%2$s': %3$s", wellID,
                    serviceUrl, e));
            log.debug("Exception: ", e);
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return;
        }

        //pipe our input into our output
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", String.format("inline; filename=PressureDB-%1$s.zip;", wellID));
        ServletOutputStream outputStream = response.getOutputStream();
        byte[] buffer = new byte[BUFFERSIZE];
        int numRead;
        while ((numRead = inputStream.read(buffer)) >= 0) {
            outputStream.write(buffer, 0, numRead);
        }
        outputStream.flush();
        outputStream.close();
    }

    /**
     * Handles requests for the pressuredb-plot method
     *
     * Will return a JSON encoded pressuredb-plot data
     *
     * @param serviceUrl
     * @param wellID
     * @return
     */
    @RequestMapping("/pressuredb-plot.do")
    public ModelAndView plot(String serviceUrl, String wellID, String[] features) {
        try {
            String response = pressureDBService.makePlotRequest(wellID,
                    serviceUrl, features);
            return generateJSONResponseMAV(true, response, "");
        } catch (Exception e) {
            log.warn(String.format("Error making pressure-db download request for '%1$s' to '%2$s': %3$s",
                    wellID, serviceUrl, e));
            log.debug("Exception: ", e);
            return generateJSONResponseMAV(false, null, "Failure communicating with Pressure DB data service");
        }
    }
    @RequestMapping("/doPressureDBFilterStyle.do")
    public void doPressureDBFilterStyle(
            HttpServletResponse response,
            @RequestParam(required = false, value = "serviceUrl", defaultValue = "") String serviceUrl,
            @RequestParam(required = false, value = "boreholeName", defaultValue = "") String boreholeName,
            @RequestParam(required = false, value = "custodian", defaultValue = "") String custodian,
            @RequestParam(required = false, value = "dateOfDrillingStart", defaultValue = "") String dateOfDrillingStart,
            @RequestParam(required = false, value = "dateOfDrillingEnd", defaultValue = "") String dateOfDrillingEnd,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "serviceFilter", defaultValue = "") String serviceFilter,
            @RequestParam(required = false, value = "color", defaultValue = "") String color,
            @RequestParam(required = false, value = "ccProperty", defaultValue = "") String ccProperty ,
            @RequestParam(required = false, value = "ccLevels", defaultValue = "9") int ccLevels,
            @RequestParam(required = false, value = "optionalFilters") String optionalFilters)
                    throws Exception {

        String style = "";
        int propertyMode = 0;
        switch (ccProperty) {
        case "Length":
            propertyMode = 1;
            style = getColorCodedStyle("gsmlp:BoreholeView",
                    "gsmlp:boreholeLength_m", ccLevels, propertyMode);
            break;
        case "Elevation":
            propertyMode = 2;
            style = getColorCodedStyle("gsmlp:BoreholeView",
                    "gsmlp:elevation_m", ccLevels, propertyMode);
            break;
        default:
            propertyMode = 0;
            style = getStyle("gsmlp:BoreholeView", "gsmlp:shape", "#2242c7");
            break;
        }

        //String style = getColorCodedStyle("gsmlp:BoreholeView" , "gsmlp:elevation_m",ccLevels);

        response.setContentType("text/xml");
        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,false);

        styleStream.close();
        outputStream.close();
    }

    String getStyle(String layerName, String geometryName, String color) {

        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/2.0\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>" + "<Name>"
                + layerName
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<Abstract>portal-style</Abstract>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + "<Rule>"
                + "<Name>Boreholes</Name>"
                + "<PointSymbolizer>"
                + "<Geometry><ogc:PropertyName>" + geometryName + "</ogc:PropertyName></Geometry>"
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
    /**
     * Returns the style for color coding.
     *
     * @param stylefilterRules
     *            - filter rules for color coding
     * @param ccc
     *            - ColorCodingConfig object
     * @param name
     *            - the name of the layer.
     * @return
     */
    public String getColorCodedStyle(String layerName,String propertyName,int ccLevels,int propertyMode) {
        String styleRules = getStyleRules(propertyName,ccLevels, propertyMode);
        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/2.0\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>"
                + "<Name>"
                + layerName
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<Abstract>portal-style</Abstract>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + styleRules
                + "</FeatureTypeStyle>"
                + "</UserStyle>"
                + "</NamedLayer>"
                + "</StyledLayerDescriptor>";
        return style;
    }

    public String getStyleRules(String propertyName, int numRules,
            int propertyMode) {
        String styleRules = "";
        String header = "";
        String middle = "";
        String tail = "";
        if (numRules > 9)
            numRules = 9;
        int i = 0;
        header = "<Rule>" + "<Name>Boreholes</Name>"
                + "<Title>Boreholes less than "
                + Integer.toString((propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP
                        .get(i) : PRESSURE_DB_ELEVATION_MAP.get(i))
                        + "</Title>"
                        + "<Abstract>Light purple square boxes</Abstract>"
                        + "<ogc:Filter>"
                        + "	<ogc:PropertyIsLessThan matchCase=\"false\" >"
                        + "<ogc:PropertyName>"
                        + propertyName
                        + "</ogc:PropertyName>"
                        + "<ogc:Literal>"
                        + Integer.toString((propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP
                                .get(i) : PRESSURE_DB_ELEVATION_MAP.get(i))
                                + "</ogc:Literal>"
                                + "</ogc:PropertyIsLessThan>"
                                + "</ogc:Filter>"
                                + "<PointSymbolizer>"
                                + "<Graphic>"
                                + "<Mark>"
                                + "<WellKnownName>square</WellKnownName>"
                                + "<Fill>"
                                + "<CssParameter name=\"fill\">"
                                + PRESSURE_DB_COLOUR_MAP.get(i)
                                + "</CssParameter>"
                                + "</Fill>"
                                + "</Mark>"
                                + "<Size>8</Size>"
                                + "</Graphic>"
                                + "</PointSymbolizer>" + "</Rule>";

        for (i = 1; i < (numRules - 1); i++) {
            int low = (propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP.get(i - 1)
                    : PRESSURE_DB_ELEVATION_MAP.get(i - 1);
            int high = (propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP.get(i)
                    : PRESSURE_DB_ELEVATION_MAP.get(i);
            middle += "<Rule>" + "<Name>Boreholes</Name>"
                    + "<Title>Boreholes from "
                    + Integer.toString(low)
                    + "m to "
                    + Integer.toString(high)
                    + "m"
                    + "</Title>"
                    + "<Abstract>Light purple square boxes</Abstract>"
                    + "<ogc:Filter>"
                    + "<ogc:And>"
                    + "<ogc:PropertyIsGreaterThanOrEqualTo matchCase=\"false\" >"
                    + "<ogc:PropertyName>"
                    + propertyName
                    + "</ogc:PropertyName>"
                    + "<ogc:Literal>"
                    + Integer.toString(low)
                    + "</ogc:Literal>"
                    + "</ogc:PropertyIsGreaterThanOrEqualTo>"
                    + "<ogc:PropertyIsLessThan matchCase=\"false\" >"
                    + "<ogc:PropertyName>"
                    + propertyName
                    + "</ogc:PropertyName>"
                    + "<ogc:Literal>"
                    + Integer.toString(high)
                    + "</ogc:Literal>"
                    + "</ogc:PropertyIsLessThan>"
                    + "</ogc:And>"
                    + "</ogc:Filter>"
                    + "<PointSymbolizer>"
                    + "<Graphic>"
                    + "<Mark>"
                    + "<WellKnownName>square</WellKnownName>"
                    + "<Fill>"
                    + "<CssParameter name=\"fill\">"
                    + PRESSURE_DB_COLOUR_MAP.get(i)
                    + "</CssParameter>"
                    + "</Fill>"
                    + "</Mark>"
                    + "<Size>8</Size>"
                    + "</Graphic>"
                    + "</PointSymbolizer>" + "</Rule>";
        }
        tail = "<Rule>" + "<Name>Boreholes</Name>"
                + "<Title>Boreholes greater than "
                + Integer.toString((propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP
                        .get(i - 1) : PRESSURE_DB_ELEVATION_MAP.get(i - 1))
                        + "</Title>"
                        + "<Abstract>Light purple square boxes</Abstract>"
                        + "<ogc:Filter>"
                        + "	<ogc:PropertyIsGreaterThanOrEqualTo matchCase=\"false\" >"
                        + "<ogc:PropertyName>"
                        + propertyName
                        + "</ogc:PropertyName>"
                        + "<ogc:Literal>"
                        + Integer.toString((propertyMode == 1) ? PRESSURE_DB_LENGTH_MAP
                                .get(i - 1) : PRESSURE_DB_ELEVATION_MAP.get(i - 1))
                                + "</ogc:Literal>"
                                + "</ogc:PropertyIsGreaterThanOrEqualTo>"
                                + "</ogc:Filter>"
                                + "<PointSymbolizer>"
                                + "<Graphic>"
                                + "<Mark>"
                                + "<WellKnownName>square</WellKnownName>"
                                + "<Fill>"
                                + "<CssParameter name=\"fill\">"
                                + PRESSURE_DB_COLOUR_MAP.get(i)
                                + "</CssParameter>"
                                + "</Fill>"
                                + "</Mark>"
                                + "<Size>8</Size>"
                                + "</Graphic>"
                                + "</PointSymbolizer>" + "</Rule>";
        styleRules = header + middle + tail;
        return styleRules;
    }

}
