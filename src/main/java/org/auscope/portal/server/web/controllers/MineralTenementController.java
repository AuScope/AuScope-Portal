package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.auscope.portal.core.server.OgcServiceProviderType;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.WMSService;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.core.services.responses.wfs.WFSCountResponse;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.core.util.SLDLoader;
import org.auscope.portal.server.MineralTenementServiceProviderType;
import org.auscope.portal.server.web.service.MineralOccurrenceService;
import org.auscope.portal.server.web.service.MineralTenementService;
import org.auscope.portal.xslt.ArcGISToMineralTenement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;

import com.gargoylesoftware.htmlunit.TextUtil;

@Controller
public class MineralTenementController extends BasePortalController {

    private MineralTenementService mineralTenementService;
    private WMSService mineralTenementWMSService;

    private ArcGISToMineralTenement arcGISToMineralTenementTransformer;

    private static final String ENCODING = "ISO-8859-1";
    private static final int BUFFERSIZE = 1024 * 1024;
    private HashMap<String, String> MINERAL_TENEMENT_COLOUR_MAP = new HashMap<String, String>();    

    @Autowired
    public MineralTenementController(MineralTenementService mineralTenementService, WMSService wmsService, ArcGISToMineralTenement arcGISToMineralTenement) {
        this.mineralTenementService = mineralTenementService;
        this.mineralTenementWMSService = wmsService;
        this.arcGISToMineralTenementTransformer = arcGISToMineralTenement;
        
        MINERAL_TENEMENT_COLOUR_MAP.put("exploration", "#0000FF");
        MINERAL_TENEMENT_COLOUR_MAP.put("prospecting", "#00FFFF");
        MINERAL_TENEMENT_COLOUR_MAP.put("miscellaneous", "#00FF00");
        MINERAL_TENEMENT_COLOUR_MAP.put("mining", "#FFFF00");
        MINERAL_TENEMENT_COLOUR_MAP.put("licence", "#FF0000");
        
        MINERAL_TENEMENT_COLOUR_MAP.put("LIVE", "#0000FF");
        MINERAL_TENEMENT_COLOUR_MAP.put("CURRENT", "#00FF00");
        MINERAL_TENEMENT_COLOUR_MAP.put("PENDING", "#FF0000");
        
        MINERAL_TENEMENT_COLOUR_MAP.put("MineralTenement", "#0000FF");
        
        }

    @RequestMapping("/getAllMineralTenementFeatures.do")
    public ModelAndView getAllMineralTenementFeatures(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "tenementName") String tenementName,
            @RequestParam(required = false, value = "owner") String owner,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures)
                    throws Exception {

        // The presence of a bounding box causes us to assume we will be using this GML for visualizing on a map
        // This will in turn limit the number of points returned to 200
        OgcServiceProviderType ogcServiceProviderType = OgcServiceProviderType.parseUrl(serviceUrl);
        MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.parseUrl(serviceUrl);
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson, ogcServiceProviderType);
        WFSResponse response = null;
        try {
            response = this.mineralTenementService.getAllTenements(serviceUrl, tenementName, owner,
                    maxFeatures, bbox, null, mineralTenementServiceProviderType);
        } catch (Exception e) {
            log.warn(String.format("Error performing filter for '%1$s': %2$s", serviceUrl, e));
            log.debug("Exception: ", e);
            return this.generateExceptionResponse(e, serviceUrl);
        }
        log.warn("GML: " + response.getData());
        return generateJSONResponseMAV(true, "gml", response.getData(), response.getMethod());
    }

    @RequestMapping("/getMineralTenementFeatureInfo.do")
    public void getMineralTenementFeatureInfo(HttpServletRequest request, HttpServletResponse response,
            @RequestParam("serviceUrl") String serviceUrl, @RequestParam("lat") String latitude,
            @RequestParam("lng") String longitude, @RequestParam("QUERY_LAYERS") String queryLayers,
            @RequestParam("x") String x, @RequestParam("y") String y, @RequestParam("BBOX") String bbox,
            @RequestParam("WIDTH") String width, @RequestParam("HEIGHT") String height,
            @RequestParam("INFO_FORMAT") String infoFormat, @RequestParam("SLD_BODY") String sldBody,
            @RequestParam(value = "postMethod", defaultValue = "false") Boolean postMethod,
            @RequestParam("version") String version,
            @RequestParam(value = "feature_count", defaultValue = "0") String feature_count) throws Exception {

        String[] bboxParts = bbox.split(",");
        double lng1 = Double.parseDouble(bboxParts[0]);
        double lng2 = Double.parseDouble(bboxParts[2]);
        double lat1 = Double.parseDouble(bboxParts[1]);
        double lat2 = Double.parseDouble(bboxParts[3]);
        String featureInfoString = this.mineralTenementWMSService.getFeatureInfo(serviceUrl, infoFormat, queryLayers, "EPSG:3857",
                Math.min(lng1, lng2), Math.min(lat1, lat2), Math.max(lng1, lng2), Math.max(lat1, lat2),
                Integer.parseInt(width), Integer.parseInt(height), Double.parseDouble(longitude),
                Double.parseDouble(latitude), (int) (Double.parseDouble(x)), (int) (Double.parseDouble(y)), "", sldBody,
                postMethod, version, feature_count, true);

        Document xmlDocument = getDocumentFromString(featureInfoString);

        String responseString = "";
        if (xmlDocument.getDocumentElement().getLocalName().equals("FeatureInfoResponse")) {
            responseString = this.arcGISToMineralTenementTransformer.convert(featureInfoString, serviceUrl);
        } else {
            responseString = featureInfoString;
        };

        // responseString = getModifiedHTMLForFeatureInfoWindow(responseString);

        InputStream responseStream = new ByteArrayInputStream(responseString.getBytes());
        FileIOUtil.writeInputToOutputStream(responseStream, response.getOutputStream(), BUFFERSIZE, true);
    }



    @RequestMapping("/getMineralTenementCount.do")
    public ModelAndView getMineralTenementCount(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "tenementName") String tenementName,
            @RequestParam(required = false, value = "owner") String owner,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures)
                    throws Exception {

        // The presence of a bounding box causes us to assume we will be using this GML for visualizing on a map
        // This will in turn limit the number of points returned to 200
        OgcServiceProviderType ogcServiceProviderType = OgcServiceProviderType.parseUrl(serviceUrl);
        MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.parseUrl(serviceUrl);
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson, ogcServiceProviderType);
        WFSCountResponse response = null;
        try {
            response = this.mineralTenementService.getTenementCount(serviceUrl, tenementName, owner,
                    maxFeatures, bbox, mineralTenementServiceProviderType);


        } catch (Exception e) {
            log.warn(String.format("Error performing filter for '%1$s': %2$s", serviceUrl, e));
            log.debug("Exception: ", e);
            return this.generateExceptionResponse(e, serviceUrl);
        }


        return generateJSONResponseMAV(true, new Integer(response.getNumberOfFeatures()), "");
    }

    @RequestMapping("/doMineralTenementDownload.do")
    public void doMineralTenementDownload(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("name") String name,
            @RequestParam(required = false, value = "tenementType") String tenementType,
            @RequestParam("owner") String owner,
            @RequestParam(required = false, value = "size") String size,
            @RequestParam(required = false, value = "endDate") String endDate,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            HttpServletResponse response) throws Exception {

        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.parseUrl(serviceUrl);
        String filter = this.mineralTenementService.getMineralTenementFilter(name, tenementType, owner, size, endDate,
                bbox, null,  mineralTenementServiceProviderType); //VT:get filter from service

        // Some ArcGIS servers do not support filters (not enabled?)
        if (mineralTenementServiceProviderType == MineralTenementServiceProviderType.ArcGIS) {
            filter = "";
        }
        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();
        InputStream results = this.mineralTenementService.downloadWFS(serviceUrl, mineralTenementServiceProviderType.featureType(), filter, null);
        FileIOUtil.writeInputToOutputStream(results, outputStream, 8 * 1024, true);
        outputStream.close();

    }
    @RequestMapping("/getMineralTenementLegendStyle.do")
    public void doMineLegendStyle(
            @RequestParam(required = false, value = "ccProperty") String ccProperty,
            HttpServletResponse response) throws Exception {
        String style = "";
        switch (ccProperty) {
        case "TenementType" :
            style = this.getStyle(true,ccProperty,"mt:MineralTenement",null,null,null,null,null);
            break;
        case "TenementStatus":
            style = this.getStyle(true,ccProperty,"mt:MineralTenement",null,null,null,null,null);
            break;
        default:
            MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.GeoServer;
            style = this.getPolygonStyle("", mineralTenementServiceProviderType.featureType(), mineralTenementServiceProviderType.fillColour(), mineralTenementServiceProviderType.borderColour(),
                    mineralTenementServiceProviderType.styleName());
            break;
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
     * Handles getting the style of the mineral tenement filter queries. (If the bbox elements are specified, they will limit the output response to 200 records
     * implicitly)
     *
     * @param serviceUrl
     * @param name
     * @param tenementType
     * @param owner
     * @param status
     * @throws Exception
     */
    @RequestMapping("/getMineralTenementStyle.do")
    public void doMineFilterStyle(
            @RequestParam(required = false, value = "serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "name") String name,
            @RequestParam(required = false, value = "tenementType") String tenementType,
            @RequestParam(required = false, value = "owner") String owner,
            @RequestParam(required = false, value = "size") String size,
            @RequestParam(required = false, value = "endDate") String endDate,
            @RequestParam(required = false, value = "ccProperty", defaultValue="") String ccProperty,
            @RequestParam(required = false, value = "optionalFilters") String optionalFilters,
            HttpServletResponse response) throws Exception {
        String style = "";
        ccProperty = org.auscope.portal.core.util.TextUtil.cleanQueryParameter(ccProperty);
        switch (ccProperty) {
        case "TenementType" :
            style = this.getStyle(false,ccProperty,"mt:MineralTenement",name, tenementType, owner, size, endDate);
            break;
        case "TenementStatus":
            style = this.getStyle(false,ccProperty,"mt:MineralTenement",name, tenementType, owner, size, endDate);
            break;
        default:
            MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.parseUrl(serviceUrl);
            String filter = this.mineralTenementService.getMineralTenementFilter(name, tenementType, owner, size, endDate,null,optionalFilters, mineralTenementServiceProviderType); //VT:get filter from service
            style = this.getPolygonStyle(filter, mineralTenementServiceProviderType.featureType(), mineralTenementServiceProviderType.fillColour(), mineralTenementServiceProviderType.borderColour(),
                    mineralTenementServiceProviderType.styleName());
            break;
        }


        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024, false);

        styleStream.close();
        outputStream.close();
    }

    public String getPolygonStyle(String filter, String name, String color, String borderColor, String styleName) throws IOException {

        Hashtable<String,String> valueMap = new Hashtable<String,String>();
        valueMap.put("name", name);
        valueMap.put("filter", filter);
        valueMap.put("color", color);
        valueMap.put("borderColor", borderColor);
        valueMap.put("styleName", styleName);


        return  SLDLoader.loadSLD("/org/auscope/portal/slds/MineralTenement_getPolygonStyle.sld", valueMap,false);

    }
    public String getStyle(boolean isLegend,String ccProperty,String layerName,String name, String tenementType, String owner, String size, String endDate) {
        String rules = getRules(isLegend,ccProperty,name,  tenementType, owner,  size,  endDate) ;
        String header="";
        if (isLegend) {
            header = "<StyledLayerDescriptor version=\"1.0.0\" " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> ";
        } else {
            header = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                    "<StyledLayerDescriptor version=\"1.0.0\" " +
                    "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                    "xmlns=\"http://www.opengis.net/sld\" " +
                    "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                    "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                    "xmlns:ows=\"http://www.opengis.net/ows\" " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> ";
        }
        String style =  header +
                    "<NamedLayer>" +
                    "<Name>" + layerName + "</Name>" +
                    "<UserStyle>" +
                    "<FeatureTypeStyle>" + rules + "</FeatureTypeStyle>" +
                    "</UserStyle>" +
                    "</NamedLayer>" +
                    "</StyledLayerDescriptor>";
        return style;
    }   
    
    private String getRules(boolean isLegend,String ccProperty,String name, String tenementType,String owner, String size, String endDate) {

        String rules = "";
        if (ccProperty.contains("TenementType")){
            rules += getRuleByName(isLegend,ccProperty,"exploration",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"prospecting",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"miscellaneous",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"mining",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"licence",name,tenementType, owner, size, endDate);
        } else if (ccProperty.contains("TenementStatus")){
            rules += getRuleByName(isLegend,ccProperty,"LIVE",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"CURRENT",name,tenementType, owner, size, endDate);
            rules += getRuleByName(isLegend,ccProperty,"PENDING",name,tenementType, owner, size, endDate);            
        } else {
            rules = getRuleByName(isLegend,ccProperty,"Tenement",name,tenementType, owner, size, endDate);
        }
        return rules;
    }
    
    private String getRuleByName(boolean isLegend,String ccProperty,String ruleName,String name, String tenementType,String owner, String size, String endDate) {
        String filter = "";        
        if (isLegend) { 
            filter = "";
        } else {
            try {
                filter = this.mineralTenementService.getMineralTenementFilterCCProperty(name,tenementType, owner, size, endDate, null, ccProperty,ruleName+ "*");
            } catch (Exception e) {
                e.printStackTrace();
            }            
        }
        String color = MINERAL_TENEMENT_COLOUR_MAP.get(ruleName);
        String rule = "<Rule>" +
        "<Name>T</Name>" +
        "<Title>" + ruleName + "</Title>" +
        filter +
        "<PolygonSymbolizer>" +
        "<Fill>" +
        "<CssParameter name=\"fill\">" + color + "</CssParameter>" +
        "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
        "</Fill>" +
        "<Stroke>" +
        "<CssParameter name=\"stroke\">" + color + "</CssParameter>" +
        "<CssParameter name=\"stroke-width\">1</CssParameter>" +
        "</Stroke>" +
        "</PolygonSymbolizer>" +
        "</Rule>";
        return rule;

    }

    private Document getDocumentFromString(String responseString)
            throws Exception {

        DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        domFactory.setNamespaceAware(true);
        DocumentBuilder builder = domFactory.newDocumentBuilder();
        return builder.parse(new ByteArrayInputStream(responseString.getBytes(ENCODING)));
    }
}

