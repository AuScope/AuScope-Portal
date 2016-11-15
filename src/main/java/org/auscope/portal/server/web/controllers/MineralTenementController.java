package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.auscope.portal.core.server.OgcServiceProviderType;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.WMSService;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.core.util.FileIOUtil;
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

@Controller
public class MineralTenementController extends BasePortalController {

    private MineralTenementService mineralTenementService;
    private WMSService mineralTenementWMSService;
    
    private ArcGISToMineralTenement arcGISToMineralTenementTransformer;

    public static final String MINERAL_TENEMENT_TYPE = "mt:MineralTenement";
    public static final String ARCGIS_MINERAL_TENEMENT_TYPE = "MineralTenement";

    private static final String ENCODING = "ISO-8859-1";
    private static final int BUFFERSIZE = 1024 * 1024;

    @Autowired
    public MineralTenementController(MineralTenementService mineralTenementService, WMSService wmsService, ArcGISToMineralTenement arcGISToMineralTenement) {
        this.mineralTenementService = mineralTenementService;
        this.mineralTenementWMSService = wmsService;
        this.arcGISToMineralTenementTransformer = arcGISToMineralTenement;
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
               FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson, ogcServiceProviderType);
               WFSResponse response = null;
               try {
		   // FIXME
                   //response = this.mineralTenementService.getAllTenements(serviceUrl, tenementName, owner,
                   //    maxFeatures, bbox, null);
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
            @RequestParam("WMS_URL") String wmsUrl, @RequestParam("lat") String latitude,
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
        String featureInfoString = this.mineralTenementWMSService.getFeatureInfo(wmsUrl, infoFormat, queryLayers, "EPSG:3857",
        Math.min(lng1, lng2), Math.min(lat1, lat2), Math.max(lng1, lng2), Math.max(lat1, lat2),
        Integer.parseInt(width), Integer.parseInt(height), Double.parseDouble(longitude),
        Double.parseDouble(latitude), (int) (Double.parseDouble(x)), (int) (Double.parseDouble(y)), "", sldBody,
            postMethod, version, feature_count, true);

        Document xmlDocument = getDocumentFromString(featureInfoString);
        
        String responseString = "";
        if (xmlDocument.getDocumentElement().getLocalName().equals("FeatureInfoResponse")) {
            responseString = this.arcGISToMineralTenementTransformer.convert(featureInfoString, wmsUrl);
        } else {
            responseString = featureInfoString;
        };
        
        // responseString = getModifiedHTMLForFeatureInfoWindow(responseString);

        InputStream responseStream = new ByteArrayInputStream(responseString.getBytes());
        FileIOUtil.writeInputToOutputStream(responseStream, response.getOutputStream(), BUFFERSIZE, true);
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
                bbox,null,  mineralTenementServiceProviderType); //VT:get filter from service

        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();

        InputStream results = this.mineralTenementService.downloadWFS(serviceUrl, MINERAL_TENEMENT_TYPE, filter, null);
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
            style = this.getColorCodeLegendStyleForType();
            break;
        case "TenementStatus":
            style = this.getColorCodeLegendStyleForStatus();
            break;
        default:
            style = this.getPolygonLegendStyle();
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

        switch (ccProperty) {
        case "TenementType" :
            style = this.getColorCodeStyleForType(name,tenementType, owner, size, endDate);
            break;
        case "TenementStatus":
            style = this.getColorCodeStyleForStatus(name, tenementType, owner, size, endDate);
            break;
        default:
	    MineralTenementServiceProviderType mineralTenementServiceProviderType = MineralTenementServiceProviderType.parseUrl(serviceUrl);
            String filter = this.mineralTenementService.getMineralTenementFilter(name, tenementType, owner, size, endDate,null,optionalFilters, mineralTenementServiceProviderType); //VT:get filter from service
            style = this.getPolygonStyle(filter, mineralTenementServiceProviderType.featureType(), mineralTenementServiceProviderType.fillColour(), mineralTenementServiceProviderType.borderColour());
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

    public String getPolygonStyle(String filter, String name, String color, String borderColor) {

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + name + "</Name>" +
                "<UserStyle>" +
                "<Title>Default style</Title>" +
                "<Abstract>A green default style</Abstract>" +
                "<FeatureTypeStyle>" +

                "<Rule>" +
                "<Name>Polygon for mineral tenement</Name>" +
                "<Title>Mineral Tenement</Title>" +
                "<Abstract>50 percent transparent green fill with a red outline 1 pixel in width</Abstract>" +
		"<Name>mineralTenementStyle</Name>" +
                filter +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + color + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">1</CssParameter>" +
                "</Fill>" +
                "<Stroke>" +
                "<CssParameter name=\"stroke\">" + borderColor + "</CssParameter>" +
                "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                "</Stroke>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +

                "</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";
        return style;
    }

    public String getColorCodeStyleForType(String name, String tenementType,String owner, String size, String endDate) {

        String filterExploration = "";
        String filterProspecting = "";
        String filterMiscellaneous = "";
        String filterMiningLease = "";
        String filterLicence = "";
        try {

            filterExploration = this.mineralTenementService.getMineralTenementFilterCCType(name,tenementType, owner, size, endDate, null, "exploration*");
            filterProspecting = this.mineralTenementService.getMineralTenementFilterCCType(name ,tenementType, owner, size, endDate, null, "prospecting*");
            filterMiscellaneous = this.mineralTenementService.getMineralTenementFilterCCType(name,tenementType, owner, size, endDate, null, "miscellaneous*");
            filterMiningLease = this.mineralTenementService.getMineralTenementFilterCCType(name ,tenementType, owner, size, endDate, null, "mining*");
            filterLicence = this.mineralTenementService.getMineralTenementFilterCCType(name,tenementType, owner, size, endDate, null, "licence*");
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + MINERAL_TENEMENT_TYPE + "</Name>" +
                "<UserStyle>" +
                "<Title>Type ColorCode Style</Title>" +
                "<Abstract>A green default style</Abstract>" +
                "<FeatureTypeStyle>" +

                   "<Rule>" +
                   "<Name>r1</Name>" +
                   "<Title>Exploration</Title>" +
                   "<Abstract></Abstract>" +
                   filterExploration +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#0000FF" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "<Stroke>" +
                   "<CssParameter name=\"stroke\">" + "#0000FF" + "</CssParameter>" +
                   "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                   "</Stroke>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +


                   "<Rule>" +
                   "<Name>r2</Name>" +
                   "<Title>Prospecting</Title>" +
                   "<Abstract></Abstract>" +
                   filterProspecting +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#00FFFF" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "<Stroke>" +
                   "<CssParameter name=\"stroke\">" + "#00FFFF" + "</CssParameter>" +
                   "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                   "</Stroke>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +

                   "<Rule>" +
                   "<Name>r3</Name>" +
                   "<Title>Miscellaneous</Title>" +
                   "<Abstract></Abstract>" +
                   filterMiscellaneous +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#00FF00" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "<Stroke>" +
                   "<CssParameter name=\"stroke\">" + "#00FF00" + "</CssParameter>" +
                   "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                   "</Stroke>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +

                   "<Rule>" +
                   "<Name>r4</Name>" +
                   "<Title>Mining Lease</Title>" +
                   "<Abstract></Abstract>" +
                   filterMiningLease+
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#FFFF00" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "<Stroke>" +
                   "<CssParameter name=\"stroke\">" + "#FFFF00" + "</CssParameter>" +
                   "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                   "</Stroke>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +

                   "<Rule>" +
                   "<Name>r5</Name>" +
                   "<Title>Licence</Title>" +
                   "<Abstract></Abstract>" +
                   filterLicence +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#FF0000" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "<Stroke>" +
                   "<CssParameter name=\"stroke\">" + "#FF0000" + "</CssParameter>" +
                   "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                   "</Stroke>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +
                   "</FeatureTypeStyle>" +
                   "</UserStyle>" +
                   "</NamedLayer>" +
                   "</StyledLayerDescriptor>";
        return style;
    }

    public String getColorCodeStyleForStatus(String name, String tenementType, String owner, String size, String endDate) {

        String filterLive = "";
        String filterCurrent = "";
        String filterPending = "";

        try {
            filterLive = this.mineralTenementService.getMineralTenementFilterCCStatus(name, tenementType, owner, size, endDate, null ,"LIVE*");
            filterCurrent = this.mineralTenementService.getMineralTenementFilterCCStatus(name, tenementType, owner, size, endDate, null ,"CURRENT*");
            filterPending = this.mineralTenementService.getMineralTenementFilterCCStatus(name, tenementType, owner, size, endDate, null ,"PENDING*");
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + MINERAL_TENEMENT_TYPE + "</Name>" +
                "<UserStyle>" +
                "<Title>Default style</Title>" +
                "<Abstract>A green default style</Abstract>" +
                "<FeatureTypeStyle>" +

                    "<Rule>" +
                    "<Name>r</Name>" +
                    "<Title>Live</Title>" +
                    "<Abstract>Tenement Status Blue</Abstract>" +
                    filterLive +
                    "<PolygonSymbolizer>" +
                    "<Fill>" +
                    "<CssParameter name=\"fill\">" + "#0000FF" + "</CssParameter>" +
                    "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                    "</Fill>" +
                    "<Stroke>" +
                    "<CssParameter name=\"stroke\">" + "#0000FF" + "</CssParameter>" +
                    "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                    "</Stroke>" +
                    "</PolygonSymbolizer>" +
                    "</Rule>" +


                    "<Rule>" +
                    "<Name>r</Name>" +
                    "<Title>Current</Title>" +
                    "<Abstract>Tenement Status Green</Abstract>" +
                    filterCurrent+
                    "<PolygonSymbolizer>" +
                    "<Fill>" +
                    "<CssParameter name=\"fill\">" + "#00FF00" + "</CssParameter>" +
                    "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                    "</Fill>" +
                    "<Stroke>" +
                    "<CssParameter name=\"stroke\">" + "#00FF00" + "</CssParameter>" +
                    "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                    "</Stroke>" +
                    "</PolygonSymbolizer>" +
                    "</Rule>" +


                    "<Rule>" +
                    "<Name>r</Name>" +
                    "<Title>Pending</Title>" +
                    "<Abstract>Tenement Status Red</Abstract>" +
                    filterPending +
                    "<PolygonSymbolizer>" +
                    "<Fill>" +
                    "<CssParameter name=\"fill\">" + "#FF0000" + "</CssParameter>" +
                    "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                    "</Fill>" +
                    "<Stroke>" +
                    "<CssParameter name=\"stroke\">" + "#FF0000" + "</CssParameter>" +
                    "<CssParameter name=\"stroke-width\">1</CssParameter>" +
                    "</Stroke>" +
                    "</PolygonSymbolizer>" +
                    "</Rule>" +
                    "</FeatureTypeStyle>" +
                    "</UserStyle>" +
                    "</NamedLayer>" +
                    "</StyledLayerDescriptor>";
        return style;
    }
    String getColorCodeLegendStyleForType() {
        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + MINERAL_TENEMENT_TYPE + "</Name>" +
                "<UserStyle>" +
                "<Title>Type ColorCode Style</Title>" +
                "<FeatureTypeStyle>" +

                "<Rule>" +
                "<Name>r1</Name>" +
                "<Title>Exploration</Title>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#0000FF" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +

                "<Rule>" +
                "<Name>r2</Name>" +
                "<Title>Prospecting</Title>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#00FFFF" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +

                "<Rule>" +
                "<Name>r3</Name>" +
                "<Title>Miscellaneous</Title>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#00FF00" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +

                "<Rule>" +
                "<Name>r4</Name>" +
                "<Title>Mining Lease</Title>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#FFFF00" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +

                "<Rule>" +
                "<Name>r5</Name>" +
                "<Title>Licence</Title>" +
                "<Abstract></Abstract>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#FF0000" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +
                "</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";
        return style;
    }

    public String getColorCodeLegendStyleForStatus() {
        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + MINERAL_TENEMENT_TYPE + "</Name>" +
                "<UserStyle>" +
                "<Title>Default style</Title>" +
                "<Abstract>A green default style</Abstract>" +
                "<FeatureTypeStyle>" +

                   "<Rule>" +
                   "<Name>r1</Name>" +
                   "<Title>Live</Title>" +
                   "<Abstract>Tenement Status Blue</Abstract>" +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#0000FF" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +

                   "<Rule>" +
                   "<Name>r2</Name>" +
                   "<Title>Current</Title>" +
                   "<Abstract>Tenement Status Green</Abstract>" +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#00FF00" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +


                   "<Rule>" +
                   "<Name>r3</Name>" +
                   "<Title>Pending</Title>" +
                   "<Abstract>Tenement Status Red</Abstract>" +
                   "<PolygonSymbolizer>" +
                   "<Fill>" +
                   "<CssParameter name=\"fill\">" + "#FF0000" + "</CssParameter>" +
                   "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                   "</Fill>" +
                   "</PolygonSymbolizer>" +
                   "</Rule>" +
                   "</FeatureTypeStyle>" +
                   "</UserStyle>" +
                   "</NamedLayer>" +
                   "</StyledLayerDescriptor>";
        return style;
    }
    public String getPolygonLegendStyle() {

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" " +
                "xmlns=\"http://www.opengis.net/sld\" " +
                "xmlns:mt=\"http://xmlns.geoscience.gov.au/mineraltenementml/1.0\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + MINERAL_TENEMENT_TYPE + "</Name>" +
                "<UserStyle>" +
                "<Title>Default style</Title>" +
                "<Abstract>A green default style</Abstract>" +
                "<FeatureTypeStyle>" +

                "<Rule>" +
                "<Name>Polygon for mineral tenement</Name>" +
                "<Title>Mineral Tenement</Title>" +
                "<Abstract>50 percent transparent green fill with a red outline 1 pixel in width</Abstract>" +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">#00FF00</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "</PolygonSymbolizer>" +
                "</Rule>" +
                "</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";
        return style;
    }

    private Document getDocumentFromString(String responseString)
                throws Exception {

        DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        domFactory.setNamespaceAware(true);
        DocumentBuilder builder = domFactory.newDocumentBuilder();
        return builder.parse(new ByteArrayInputStream(responseString.getBytes(ENCODING)));
    }
}

