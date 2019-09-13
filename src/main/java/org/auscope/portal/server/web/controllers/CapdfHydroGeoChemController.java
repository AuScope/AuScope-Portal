package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.input.BOMInputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.util.CSVUtil;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.core.util.SLDLoader;
import org.auscope.portal.server.domain.nvcldataservice.CSVDownloadResponse;
import org.auscope.portal.server.web.service.CapdfHydroGeoChemService;
import org.auscope.portal.service.colorcoding.CapdfHydroChemColorCoding;
import org.auscope.portal.service.colorcoding.ColorCodingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Node;

/**
 * Controller for Capricorn distal footprint layer
 *
 */

@Controller
public class CapdfHydroGeoChemController extends BasePortalController {

    private CapdfHydroGeoChemService capdfHydroGeoChemService;

    private final Log logger = LogFactory.getLog(getClass());

    public static final String CAPDF_HYDROGEOCHEMTYPE = "public:hydrogeochem";
    public static final String CAPDF_MEASUREMENTLIMIT = "public:measurement_limit";
    public static final String CAPDF_MEASUREMENTGROUPTYPENAME = "public:measurement_grouptypename";
    
    /* This is a map between the group name in the group selector and the WFS 'typeName' parameter */
    public final HashMap<String, String> AOI_TITLE_TO_LAYER_MAP;

    @Autowired
    public CapdfHydroGeoChemController(CapdfHydroGeoChemService capdfHydroGeoChemService) {
        this.capdfHydroGeoChemService = capdfHydroGeoChemService;
        AOI_TITLE_TO_LAYER_MAP = new HashMap<String, String>();
    }

    /**
     * Handler for the download of the hydrochemistry data.
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param batchid
     *            filter the batchid parameter
     * @param response
     *            the HTTP client response
     * @param bbox
     *            bounding box
     * @return null: writes to the response stream.
     * @throws Exception
     */
    @RequestMapping("/doCapdfHydroGeoChemDownload.do")
    public void doCapdfHydroGeoChemDownload(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "batchid") String batchid,
            @RequestParam(required = false, value = "bbox", defaultValue = "") String bboxJson,
            HttpServletResponse response) throws Exception {

        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);

        String filter = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, bbox,null);

        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();

        InputStream results = this.capdfHydroGeoChemService.downloadWFS(serviceUrl, CAPDF_HYDROGEOCHEMTYPE, filter,
                null);
        FileIOUtil.writeInputToOutputStream(results, outputStream, 8 * 1024, true);
        outputStream.close();

    }

    /**
     * Handler for the download of the hydrochemistry data in CSV format
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param batchid
     *            filter the batchid parameter
     * @param response
     *            the HTTP client response
     * @param north
     *            bounding box - north
     * @param south
     *            bounding box - south
     * @param east
     *            bounding box - east
     * @param west
     *            bounding box - west
     * @return null: writes to the response stream.
     * @throws Exception
     */
    @RequestMapping("/getCapdfCSVDownload.do")
    public void getCapdfCSVDownload(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "batchid") String batchid,
            @RequestParam(required = true, value = "featureType") String featureType,
            @RequestParam(required = false, value = "north", defaultValue = "") String north,
            @RequestParam(required = false, value = "south", defaultValue = "") String south,
            @RequestParam(required = false, value = "east", defaultValue = "") String east,
            @RequestParam(required = false, value = "west", defaultValue = "") String west,
            HttpServletResponse response) throws Exception {

        FilterBoundingBox bbox = null;
        if (!(north.isEmpty() && south.isEmpty() && east.isEmpty() && west.isEmpty())) {
            bbox = FilterBoundingBox.parseFromValues("EPSG:4326", Double.parseDouble(north), Double.parseDouble(south),
                    Double.parseDouble(east), Double.parseDouble(west));
        }

        String filter = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, bbox,null);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition",
                "inline; filename=getCapdfCSVDownload.csv;");
        OutputStream outputStream = response.getOutputStream();

        InputStream results = this.capdfHydroGeoChemService.downloadCSV(serviceUrl, featureType, filter, null);
        FileIOUtil.writeInputToOutputStream(results, outputStream, 8 * 1024, true);
        outputStream.close();

    }

    /**
     * Handler to retrieve grouping of the dataset from the WFS service. 
     *
     * @param serviceUrl
     *            the url of the service to query
     *
     * @throws IOException, PortalServiceException
     *
     * NB: This fills the 'AOI_TITLE_TO_LAYER_MAP' HashMap
     */
    @RequestMapping("/doGetGroupOfInterest")
    public ModelAndView doGetGroupOfInterest(@RequestParam("serviceUrl") String serviceUrl) throws IOException, PortalServiceException {
        
        final CSVParser parser = new CSVParser(this.newReader(this.capdfHydroGeoChemService.downloadCSV(serviceUrl,
                CAPDF_MEASUREMENTGROUPTYPENAME, null, null)), CSVFormat.EXCEL.withHeader());
        
        AOI_TITLE_TO_LAYER_MAP.clear();
        JSONArray dataItems = new JSONArray();
        
        //Turn our map of urns -> labels into an array of arrays for the view
        for (final CSVRecord record : parser) {
            JSONArray tableRow = new JSONArray();
            String groupName = record.get("groupname");
            String wfsTypeName = record.get("wfstypename");
            tableRow.add(groupName);//VT:display
            tableRow.add(wfsTypeName);//VT:value
            AOI_TITLE_TO_LAYER_MAP.put(groupName, wfsTypeName);
            dataItems.add(tableRow);
        }
        parser.close();
        return generateJSONResponseMAV(true, dataItems, "");
    }

    private InputStreamReader newReader(final InputStream inputStream) {
        return new InputStreamReader(new BOMInputStream(inputStream), StandardCharsets.UTF_8);
    }

    /**
     * Handler for the download of the hydrochemistry data in CSV format
     *
     * @param serviceUrl
     *            the url of the service to query
     * @param featureType
     *            The grouping of the dataset correlate to the featureType.
     * @return ModelAndView
     * @throws IOException
     *             ,PortalServiceException
     *
     * NB: Assumes that 'AOI_TITLE_TO_LAYER_MAP' was filled by a prior call to 'doGetGroupOfInterest()' above.
     *     The website should enforce this.
     */
    @RequestMapping("/doGetAOIParam")
    public ModelAndView doGetAOIParam(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("featureType") String featureType) throws IOException, PortalServiceException {

        JSONArray dataItems = new JSONArray();
        String group = "";
        for (String key : this.AOI_TITLE_TO_LAYER_MAP.keySet()) {
            if (this.AOI_TITLE_TO_LAYER_MAP.get(key).equals(featureType)) {
                group = key;
                break;
            }
        }

        String filter = this.capdfHydroGeoChemService.getMeasurementLimits(group);

        final CSVParser parser = new CSVParser(this.newReader(this.capdfHydroGeoChemService.downloadCSV(serviceUrl,
                CAPDF_MEASUREMENTLIMIT, filter, null)), CSVFormat.EXCEL.withHeader());

        for (final CSVRecord record : parser) {
            JSONArray tableRow = new JSONArray();
            tableRow.add(record.get("classifier"));
            tableRow.add(record.get("pref_name"));
            tableRow.add(record.get("min"));
            tableRow.add(record.get("max"));
            dataItems.add(tableRow);

        }
        parser.close();
        return generateJSONResponseMAV(true, dataItems, "");
    }

    /**
     * Returns a list of values for graphing scatter plot
     *
     * @param serviceUrl
     *            - serviceUrl
     * @param xaxis
     *            - x axis value
     * @param yaxis
     *            - y axis value
     * @param batchid
     * @param bboxJson
     *            - the bounding box the user is interested in
     * @param obboxJson
     *            - the bounding box of the map viewport.
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping("/doCapdfHydroScatterPlotList.do")
    public ModelAndView doCapdfHydroScatterPlotList(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("xaxis") String xaxis,
            @RequestParam("yaxis") String yaxis,
            @RequestParam("featureType") String featureType,
            @RequestParam(required = false, value = "batchid") String batchid,
            @RequestParam(required = false, value = "obbox", defaultValue = "") String obboxJson,
            @RequestParam(required = false, value = "bbox", defaultValue = "") String bboxJson,
            HttpServletResponse response) throws Exception {

        FilterBoundingBox obbox = FilterBoundingBox.attemptParseFromJSON(obboxJson);
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);

        String filter = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, obbox,null);
        String filterWithBbox = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, bbox,null);

        CSVUtil csv = new CSVUtil(this.capdfHydroGeoChemService.downloadCSV(serviceUrl, featureType, filter, null));

        CSVUtil csvWithBoundFilter = new CSVUtil(this.capdfHydroGeoChemService.downloadCSV(serviceUrl, featureType,
                filterWithBbox, null));

        HashMap<String, ArrayList<String>> csvMap = csv.getColumnOfInterest(new String[] {"geom", xaxis, yaxis,
                "sample_type", "sample_id"});

        HashMap<String, ArrayList<String>> csvMapWithBoundFilter = csvWithBoundFilter
                .getColumnOfInterest(new String[] {"geom"});

        ArrayList<String> xValue = csvMap.get(xaxis);
        ArrayList<String> yValue = csvMap.get(yaxis);
        ArrayList<String> geom = csvMap.get("geom");
        ArrayList<String> sample_type = csvMap.get("sample_type");
        ArrayList<String> name = csvMap.get("sample_id");
        ArrayList<String> boundFilterGeom = csvMapWithBoundFilter.get("geom");

        ArrayList<ModelMap> series = new ArrayList<ModelMap>();

        ModelMap relatedValues = null;

        for (int i = 0; i < xValue.size(); i++) {
            relatedValues = new ModelMap();
            if (!(xValue.get(i).isEmpty() || yValue.get(i).isEmpty())) {
                relatedValues.put("xaxis", xValue.get(i));
                relatedValues.put("yaxis", yValue.get(i));
                relatedValues.put("tooltip",
                        "sample type:" + (sample_type.get(i).isEmpty() ? "unknown" : sample_type.get(i))
                        + "<br>sample Id:" + (name.get(i).isEmpty() ? "unknown" : name.get(i)));
                if (boundFilterGeom.contains(geom.get(i))) {
                    relatedValues.put("highlight", "Inside Bound");
                } else {
                    relatedValues.put("highlight", "Outside Bound");
                }
                series.add(relatedValues);
            }
        }

        ModelMap data = new ModelMap();
        data.put("series", series);
        return generateJSONResponseMAV(true, data, null);

    }

    /**
     * Returns a list of values for graphing box plot
     *
     * @param serviceUrl
     *            - serviceUrl
     * @param box1
     *            - b1 axis value
     * @param box2
     *            - b2 axis value
     * @param batchid
     * @param bboxJson
     *            - the bounding box the user is interested in
     * @param obboxJson
     *            - the bounding box of the map viewport.
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping("/doCapdfHydroBoxPlotList.do")
    public ModelAndView doCapdfHydroBoxPlotList(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("box1") String box1,
            @RequestParam("box2") String box2,
            @RequestParam("featureType") String featureType,
            @RequestParam(required = false, value = "batchid") String batchid,
            @RequestParam(required = false, value = "obbox", defaultValue = "") String obboxJson,
            @RequestParam(required = false, value = "bbox", defaultValue = "") String bboxJson,
            HttpServletResponse response) throws Exception {

        FilterBoundingBox obbox = FilterBoundingBox.attemptParseFromJSON(obboxJson);
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);

        String filter = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, obbox,null);
        String filterWithBbox = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, bbox,null);

        CSVUtil csv = new CSVUtil(this.capdfHydroGeoChemService.downloadCSV(serviceUrl, featureType, filter, null));

        CSVUtil csvWithBoundFilter = new CSVUtil(this.capdfHydroGeoChemService.downloadCSV(serviceUrl, featureType,
                filterWithBbox, null));

        HashMap<String, ArrayList<String>> csvMap = csv.getColumnOfInterest(new String[] {box1, box2});
        HashMap<String, ArrayList<String>> csvMapWithBound = csvWithBoundFilter.getColumnOfInterest(new String[] {box1,
                box2});

        ArrayList<String> x1Value = csvMap.get(box1);
        ArrayList<String> y1Value = csvMap.get(box2);

        ArrayList<String> x2Value = csvMapWithBound.get(box1);
        ArrayList<String> y2Value = csvMapWithBound.get(box2);

        ArrayList<ModelMap> series = new ArrayList<ModelMap>();

        ModelMap relatedValues = null;

        for (int i = 0; i < x1Value.size(); i++) {
            relatedValues = new ModelMap();
            //VT: set x1 value
            if (i < x1Value.size() && !x1Value.get(i).isEmpty()) {
                relatedValues.put("x1", x1Value.get(i));
                series.add(relatedValues);
            } else {
                relatedValues.put("x1", 2147483646);
                series.add(relatedValues);
            }

            //VT: set y1 value
            if (i < y1Value.size() && !y1Value.get(i).isEmpty()) {
                relatedValues.put("y1", y1Value.get(i));
                series.add(relatedValues);
            } else {
                relatedValues.put("y1", 2147483646);
                series.add(relatedValues);
            }

            //VT: set x2 value
            if (i < x2Value.size() && !x2Value.get(i).isEmpty()) {
                relatedValues.put("x2", x2Value.get(i));
                series.add(relatedValues);
            } else {
                relatedValues.put("x2", 2147483646);
                series.add(relatedValues);
            }
            //VT: set y2 value
            if (i < y2Value.size() && !y2Value.get(i).isEmpty()) {
                relatedValues.put("y2", y2Value.get(i));
                series.add(relatedValues);
            } else {
                relatedValues.put("y2", 2147483646);
                series.add(relatedValues);
            }
        }

        ModelMap data = new ModelMap();
        data.put("series", series);
        return generateJSONResponseMAV(true, data, null);
    }

    /**
     * Handles getting the style of the hydrochemistry (If the bbox elements are specified, they will limit the output response to 200 records implicitly)
     *
     * @param batchid
     * @param featureType
     * @param tenementType
     * @param poi
     *            - parameter of interest
     * @param minMax
     *            - in a csv format, eg 15,30 for min 15 and max 30
     *
     */
    @RequestMapping("/getCapdfHydroGeoChemStyle.do")
    public void getCapdfHydroGeoChemStyle(
            @RequestParam(required = false, value = "batchid") String batchid,
            @RequestParam(required = false, value = "featureType") String featureType,
            @RequestParam(required = false, value = "poi") String poi,
            @RequestParam(required = false, value = "min") String min,
            @RequestParam(required = false, value = "max") String max,
            @RequestParam(required = false, value = "optionalFilters") String optionalFilters,
            HttpServletResponse response) throws Exception {

        //Vt: wms shouldn't need the bbox because it is tiled.
        FilterBoundingBox bbox = null;

        String style = "";

        if (poi != null && !poi.isEmpty()) {           
            style = this.getColorCodedStyle(min,max,poi, featureType);
        } else {
            String stylefilterRules = this.capdfHydroGeoChemService.getHydroGeoChemFilter(batchid, bbox,optionalFilters); //VT:get filter from service
            style = this.getStyle(stylefilterRules, CAPDF_HYDROGEOCHEMTYPE, "#DB70B8");
        }

        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024, false);

        styleStream.close();
        outputStream.close();
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
    public String getColorCodedStyle(String min, String max, String poi, String featureType) {

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:public=\"http://capdf.csiro.au/\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + featureType + "</Name>" +
                "<UserStyle>" +
                "<Title>Capdf</Title>" +
                "<Abstract>Capdf</Abstract>" +
                "<FeatureTypeStyle>";


        style += "<Rule>" +
                "<Name>Capdf</Name>" +
                "<Title>Capdf</Title>" +
                "<Abstract>Capdf</Abstract>" +
                "<ogc:Filter>" +
                "<ogc:Not>" +
                "<ogc:PropertyIsNull>" +
                "<ogc:PropertyName>" +poi+ "</ogc:PropertyName>" +
                "</ogc:PropertyIsNull>" +
                "</ogc:Not>" +
                "</ogc:Filter>" +
                "<PointSymbolizer>" +
                "<Graphic>" +
                "<Mark>" +
                "<WellKnownName>circle</WellKnownName>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" +
                "<ogc:Function name=\"Interpolate\">" +
                "<ogc:PropertyName>" +poi+ "</ogc:PropertyName>" +
                "<ogc:Literal>"+min+"</ogc:Literal>" +
                "<ogc:Literal>#FFFFFF</ogc:Literal>" +
                "<ogc:Literal>" + max + "</ogc:Literal>" +
                "<ogc:Literal>#993333</ogc:Literal>" +
                "<ogc:Literal>color</ogc:Literal>" +
                "</ogc:Function>" +
                "</CssParameter>" +
                "</Fill>" +
                "</Mark>" +
                "<Size>8</Size>" +
                "</Graphic>" +
                "</PointSymbolizer>" +
                "</Rule>";


        style += "</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";

        logger.debug(style);
        return style;
    }

    /**
     * Returns the style for wms request.
     *
     * @param stylefilterRules
     *            - filter rules for color coding
     * @param name
     *            - the name of the layer.
     * @return String the style sld.
     * @throws IOException
     */
    public String getStyle(String stylefilterRules, String name, String color) throws IOException {

        Hashtable<String,String> valueMap = new Hashtable<String,String>();
        valueMap.put("stylefilterRules", stylefilterRules);
        valueMap.put("name", name);
        valueMap.put("color", color);



        return  SLDLoader.loadSLD("/org/auscope/portal/slds/CapdfHydroGeoChemController_getStyle.sld", valueMap,false);
    }

}
