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
import org.auscope.portal.mineraloccurrence.MineralTenementFilter;
import org.auscope.portal.pressuredb.AvailableOMResponse;
import org.auscope.portal.pressuredb.PressureDBFilter;
import org.auscope.portal.server.MineralTenementServiceProviderType;
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
        PRESSURE_DB_COLOUR_MAP.put(1, "#00FFFF");
        PRESSURE_DB_COLOUR_MAP.put(2, "#00FF00");
        PRESSURE_DB_COLOUR_MAP.put(3, "#FFFF00");
        PRESSURE_DB_COLOUR_MAP.put(4, "#FF0000");

        PRESSURE_DB_LENGTH_MAP.put(0, 1000);
        PRESSURE_DB_LENGTH_MAP.put(1, 2000);
        PRESSURE_DB_LENGTH_MAP.put(2, 3000);
        PRESSURE_DB_LENGTH_MAP.put(3, 4000);

        PRESSURE_DB_ELEVATION_MAP.put(0, -200);
        PRESSURE_DB_ELEVATION_MAP.put(1, 0);
        PRESSURE_DB_ELEVATION_MAP.put(2, 200);
        PRESSURE_DB_ELEVATION_MAP.put(3, 400);

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

    /**
     * Returns a stylesheet for styling pressure db legend images
     * @param ccProperty
     *            stylesheet can be styled for a property, e.g. "Length", "Elevation"
     * @return xml stylesheet used for styling legend image
     */
    @RequestMapping("/getPressureDBLegendStyle.do")
    public void getPressureDBLegendStyle(
            @RequestParam(required = false, value = "ccProperty") String ccProperty,
            HttpServletResponse response) throws Exception {
        String style = "";
        if (ccProperty.contains("Length") || 
            ccProperty.contains("Elevation" )) {
            style = getColorCodedStyle(true,"gsmlp:BoreholeView", null,null, null, null, ccProperty, null);
        } else {
            style = getStyle(true,"gsmlp:BoreholeView", "gsmlp:shape", "#2242c7",null,null, null, null,null);
        }
        response.setContentType("text/xml");
        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,false);

        styleStream.close();
        outputStream.close();
    }
    
    /**
     * Returns a stylesheet for styling pressure db queries
     * @param serviceUrl
     *            URL of WMS pressure db service
     * @param boreholeName
     *            Name of borehole
     * @param custodian
     *            Borehole of custodian
     * @param dateOfDrillingStart
     *            earliest borehole drilling date
     * @param dateOfDrillingEnd
     *            latest borehole drilling date
     * @param maxFeatures
     *            (not used)
     * @param bbox
     *            (not used)
     * @param serviceFilter
     *            (not used)
     * @param color
     *            (not used)
     * @param ccProperty
     *            stylesheet can be styled for a property, e.g. "Length", "Elevation"
     * @param optionalFilters
     *            additional filters which can be applied to stylesheet
     * @return xml stylesheet used for styling legend image
     */
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
            @RequestParam(required = false, value = "optionalFilters") String optionalFilters)
                    throws Exception {
        
        String style = "";
        if (ccProperty.contains("Length") || 
            ccProperty.contains("Elevation" )) {
            style = getColorCodedStyle(false,"gsmlp:BoreholeView", boreholeName,custodian, dateOfDrillingStart, dateOfDrillingEnd, ccProperty,optionalFilters);
        } else {
            style = getStyle(false,"gsmlp:BoreholeView", "gsmlp:shape", "#2242c7",boreholeName,custodian, dateOfDrillingStart, dateOfDrillingEnd, optionalFilters);
        }
        response.setContentType("text/xml");
        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,false);

        styleStream.close();
        outputStream.close();
    }

    String getStyle(boolean isLegend,String layerName, String geometryName, String color,String boreholeName,String custodian, String dateOfDrillingStart,String dateOfDrillingEnd, String optionalFilter) {
        String filter ="";
        if (!isLegend) {
            PressureDBFilter pressureDBFilter = new PressureDBFilter(boreholeName, custodian,dateOfDrillingStart,dateOfDrillingEnd,null,0,0,optionalFilter);
            filter = pressureDBFilter.getFilterString(null);
        }
        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/4.0\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>"
                + "<Name>"
                + layerName
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + "<Rule>"
                + "<Name>Boreholes</Name>"
                + filter
                + "<PointSymbolizer>"
                + "<Geometry><ogc:PropertyName>" + geometryName + "</ogc:PropertyName></Geometry>"
                + "<Graphic>"
                + "<Mark>"
                + "<WellKnownName>circle</WellKnownName>"
                + "<Fill>"
                + "<CssParameter name=\"fill\">"
                + color
                + "</CssParameter>"
                + "<CssParameter name=\"fill-opacity\">0.4</CssParameter>"
                + "</Fill>"
                + "<Stroke>"
                + "<CssParameter name=\"stroke\">" + color + "</CssParameter>"  
                + "<CssParameter name=\"stroke-width\">1</CssParameter>"
                + "</Stroke>"
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
    public String getColorCodedStyle(boolean isLegend,String layerName,String boreholeName,String custodian, String dateOfDrillingStart,String dateOfDrillingEnd,String ccProperty, String optionalFilter) {
            String styleRules = "";
            styleRules += getStyleRuleByIndex(isLegend,0,boreholeName,custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,optionalFilter);
            styleRules += getStyleRuleByIndex(isLegend,1,boreholeName,custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,optionalFilter);
            styleRules += getStyleRuleByIndex(isLegend,2,boreholeName,custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,optionalFilter);
            styleRules += getStyleRuleByIndex(isLegend,3,boreholeName,custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,optionalFilter);
            styleRules += getStyleRuleByIndex(isLegend,4,boreholeName,custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,optionalFilter);
        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/4.0\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>"
                + "<Name>"
                + layerName
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + styleRules
                + "</FeatureTypeStyle>"
                + "</UserStyle>"
                + "</NamedLayer>"
                + "</StyledLayerDescriptor>";
        return style;
    }

    public String getStyleRuleByIndex(boolean isLegend, int index, String boreholeName,String custodian, String dateOfDrillingStart,String dateOfDrillingEnd,String ccProperty, String optionalFilter ) {    
        String rule;
        String filter;
        int ccStart;
        int ccEnd;           
        if (index == 0) {            
            ccStart = PressureDBFilter.CC_START;
            if (ccProperty.contains("Elevation")) {
                ccEnd = PRESSURE_DB_ELEVATION_MAP.get(0);
            } else {
                ccEnd = PRESSURE_DB_LENGTH_MAP.get(0);        
            }
            if (!isLegend) {
            PressureDBFilter pressureDBFilter = new PressureDBFilter(boreholeName, custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,ccStart,ccEnd, optionalFilter);
            filter = pressureDBFilter.getFilterString(null);
            } else {
                filter = "";
            }
            
            rule = "<Rule>" + "<Name>Boreholes</Name>"
                    + "<Title>less than " + ccEnd + "m" + "</Title>"
                    + filter
                    + "<PointSymbolizer>"
                    + "<Graphic>"
                    + "<Mark>"
                    + "<WellKnownName>circle</WellKnownName>"
                    + "<Fill>"
                    + "<CssParameter name=\"fill\">"+ PRESSURE_DB_COLOUR_MAP.get(index) + "</CssParameter>"
                    + "<CssParameter name=\"fill-opacity\">0.4</CssParameter>"
                    + "</Fill>"
                    + "<Stroke>"
                    + "<CssParameter name=\"stroke\">" + PRESSURE_DB_COLOUR_MAP.get(index)  + "</CssParameter>"  
                    + "<CssParameter name=\"stroke-width\">1</CssParameter>"
                    + "</Stroke>"
                    + "</Mark>"
                    + "<Size>8</Size>"
                    + "</Graphic>"
                    + "</PointSymbolizer>" + "</Rule>";
        } else if (index == 4) {
            if (ccProperty.contains("Elevation")) {
                ccStart = PRESSURE_DB_ELEVATION_MAP.get(index-1);
            } else {
                ccStart = PRESSURE_DB_LENGTH_MAP.get(index-1);        
            }    
            ccEnd = PressureDBFilter.CC_END;
            if (!isLegend) {
            PressureDBFilter pressureDBFilter = new PressureDBFilter(boreholeName, custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,ccStart,ccEnd, optionalFilter);
            filter = pressureDBFilter.getFilterString(null);
            } else {
                filter = "";
            }
            rule = "<Rule>" + "<Name>Boreholes</Name>"
                    + "<Title>greater than" + ccStart + "m" + "</Title>"
                    + filter
                    + "<PointSymbolizer>"
                    + "<Graphic>"
                    + "<Mark>"
                    + "<WellKnownName>circle</WellKnownName>"
                    + "<Fill>"
                    + "<CssParameter name=\"fill\">"+ PRESSURE_DB_COLOUR_MAP.get(index) + "</CssParameter>"
                    + "<CssParameter name=\"fill-opacity\">0.4</CssParameter>"
                    + "</Fill>"
                    + "<Stroke>"
                    + "<CssParameter name=\"stroke\">" + PRESSURE_DB_COLOUR_MAP.get(index) + "</CssParameter>"  
                    + "<CssParameter name=\"stroke-width\">1</CssParameter>"
                    + "</Stroke>"
                    + "</Mark>"
                    + "<Size>8</Size>"
                    + "</Graphic>"
                    + "</PointSymbolizer>" + "</Rule>";
        } else { //index = 1,2,3,4,5,6,7
            
            if (ccProperty.contains("Elevation")) {
                ccStart = PRESSURE_DB_ELEVATION_MAP.get(index-1);
                ccEnd = PRESSURE_DB_ELEVATION_MAP.get(index);
            } else {
                ccStart = PRESSURE_DB_LENGTH_MAP.get(index-1);
                ccEnd = PRESSURE_DB_LENGTH_MAP.get(index);           
            }
            
            if (!isLegend) {
            PressureDBFilter pressureDBFilter = new PressureDBFilter(boreholeName, custodian,dateOfDrillingStart,dateOfDrillingEnd,ccProperty,ccStart,ccEnd, optionalFilter);
            filter = pressureDBFilter.getFilterString(null);
            } else {
                filter = "";
            }

            rule = "<Rule>" + "<Name>Boreholes</Name>"
                    + "<Title>from "+ ccStart + "m to " + ccEnd+ "m" + "</Title>"
                    + filter
                    + "<PointSymbolizer>"
                    + "<Graphic>"
                    + "<Mark>"
                    + "<WellKnownName>circle</WellKnownName>"
                    + "<Fill>"
                    + "<CssParameter name=\"fill\">"+ PRESSURE_DB_COLOUR_MAP.get(index) + "</CssParameter>"
                    + "<CssParameter name=\"fill-opacity\">0.4</CssParameter>"
                    + "</Fill>"
                    + "<Stroke>"
                    + "<CssParameter name=\"stroke\">" + PRESSURE_DB_COLOUR_MAP.get(index) + "</CssParameter>"  
                    + "<CssParameter name=\"stroke-width\">1</CssParameter>"
                    + "</Stroke>"
                    + "</Mark>"
                    + "<Size>8</Size>"
                    + "</Graphic>"
                    + "</PointSymbolizer>" + "</Rule>";        
        }
        return rule;    
    }
}
