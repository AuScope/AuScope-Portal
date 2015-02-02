package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.service.CapdfHydroGeoChemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class CapdfHydroGeoChemController extends BasePortalController {

    private CapdfHydroGeoChemService capdfHydroGeoChemService;

    public static final String CAPDF_HYDROGEOCHEMTYPE = "capdf:hydrogeochem";

    @Autowired
    public CapdfHydroGeoChemController(CapdfHydroGeoChemService capdfHydroGeoChemService) {
        this.capdfHydroGeoChemService = capdfHydroGeoChemService;
    }


    @RequestMapping("/doCapdfHydroGeoChemDownload.do")
    public void doCapdfHydroGeoChemDownload(
            @RequestParam("name") String name,
            @RequestParam(required = false, value = "tenementType") String tenementType,
            @RequestParam("owner") String owner,
            @RequestParam(required = false, value = "size") String size,
            @RequestParam(required = false, value = "endDate") String endDate,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            HttpServletResponse response)throws Exception {




    }

    /**
     * Handles getting the style of the mineral tenement filter queries.
     * (If the bbox elements are specified, they will limit the output response to 200 records implicitly)
     *
     * @param serviceUrl
     * @param name
     * @param tenementType
     * @param owner
     * @param status
     * @throws Exception
     */
    @RequestMapping("/getCapdfHydroGeoChemStyle.do")
    public void getCapdfHydroGeoChemStyle(
            @RequestParam(required = false, value ="type") String type,
            @RequestParam(required = false, value = "value") String value,
            HttpServletResponse response)throws Exception {

        //Vt: wms shouldn't need the bbox because it is tiled.
        FilterBoundingBox bbox = null;
        String stylefilter=this.capdfHydroGeoChemService.getHydroGeoChemFilterWithStyling(type,value); //VT:get filter from service

        String filter=this.capdfHydroGeoChemService.getHydroGeoChemFilter(bbox); //VT:get filter from service

        String style=this.getPolygonStyle(stylefilter, filter,CAPDF_HYDROGEOCHEMTYPE, "#00FF00","#00FF00");



        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,false);

        styleStream.close();
        outputStream.close();
    }


    public String getPolygonStyle(String stylefilter,String filter, String name, String color,String borderColor){

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" "+
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" "+
                "xmlns=\"http://www.opengis.net/sld\" "+
                "xmlns:capdf=\"http://capdf.csiro.au/\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" "+
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" "+
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + name + "</Name>" +
                "<UserStyle>" +
                "<Title>default Title</Title>" +
                "<Abstract>default abstract</Abstract>" +
                "<FeatureTypeStyle>" +
                "<Rule>" +
                "<Name>Hydrogeo Chemistry</Name>" +
                "<Title>Hydrogeo Chemistry</Title>" +
                "<Abstract>50% transparent green fill with a red outline 1 pixel in width</Abstract>" +
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
                "<Rule>" +
                "<Name>Polygon for mineral tenement</Name>" +
                "<Title>Active Tenement</Title>" +
                "<Abstract>50% transparent green fill with a red outline 1 pixel in width</Abstract>" +
                stylefilter +
                "<PolygonSymbolizer>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + "#6666FF" + "</CssParameter>" +
                "<CssParameter name=\"fill-opacity\">0.6</CssParameter>" +
                "</Fill>" +
                "<Stroke>" +
                "<CssParameter name=\"stroke\">" + "#6666FF" + "</CssParameter>" +
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

}
