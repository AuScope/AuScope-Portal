package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.service.MineralOccurrenceService;
import org.auscope.portal.server.web.service.MineralTenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MineralTenementController extends BasePortalController {

    private MineralTenementService mineralTenementService;

    public static final String MINERAL_TENEMENT = "mt:MineralTenement";

    @Autowired
    public MineralTenementController(MineralTenementService mineralTenementService) {
        this.mineralTenementService = mineralTenementService;
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
        String filter = this.mineralTenementService.getMineralTenementFilter(name, tenementType, owner, size, endDate,
                bbox,null); //VT:get filter from service

        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();

        InputStream results = this.mineralTenementService.downloadWFS(serviceUrl, MINERAL_TENEMENT, filter, null);
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
            String filter = this.mineralTenementService.getMineralTenementFilter(name, tenementType, owner, size, endDate,null,optionalFilters); //VT:get filter from service
            style = this.getPolygonStyle(filter, MINERAL_TENEMENT, "#00FF00", "#00FF00");
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
                "<Name>" + "a" + "</Name>" +
                "<UserStyle>" +
                "<Title>s</Title>" +
                "<FeatureTypeStyle>" +
                "<Rule>" +
                filter +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + color + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
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
                "<Name>" + MINERAL_TENEMENT + "</Name>" +
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
                "<Name>" + MINERAL_TENEMENT + "</Name>" +
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
                "<Name>" + MINERAL_TENEMENT + "</Name>" +
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
                "<Name>" + MINERAL_TENEMENT + "</Name>" +
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
                "<Name>" + MINERAL_TENEMENT + "</Name>" +
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
}
