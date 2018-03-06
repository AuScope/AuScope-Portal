package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.service.GeologicalProvincesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class GeologicalProvincesController extends BasePortalController {
    private GeologicalProvincesService geologicalProvincesService;
    @Autowired
    public GeologicalProvincesController(GeologicalProvincesService geologicalProvincesService) {
    	this.geologicalProvincesService = geologicalProvincesService;
    	//this.geologicalProvincesService = new GeologicalProvincesService();
    	
    }

    /**
     * Handles getting the style of the geological provinces filter queries. (If the bbox elements are specified, they will limit the output response to 200 records
     * implicitly)
     *
     * @param serviceUrl
     * @param name
     * @throws Exception
     */
    @RequestMapping("/getGeologicalProvincestyle.do")
    public void doMineFilterStyle(
            @RequestParam(required = false, value = "serviceUrl") String serviceUrl,
            @RequestParam(required = false, value = "name") String name,
            @RequestParam(required = false, value = "optionalFilters") String optionalFilters,
            HttpServletResponse response) throws Exception {
    	
        response.setContentType("text/xml");    	
        String style = "";        
        String filter = this.geologicalProvincesService.getGeologicalProvincesFilter(name,optionalFilters);
        style = getStyle("gml:ProvinceFullExtent","#ff0000", name, filter);
        ByteArrayInputStream styleStream = new ByteArrayInputStream(style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024, false);

        styleStream.close();
        outputStream.close();
    }

    public String getStyle(String layerName, String color, String name, String filter) {
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
                + "<PolygonSymbolizer>"
                + "<Stroke>"
                + "<CssParameter name=\"stroke\">"
                + color 
                + "</CssParameter>"
                + "<CssParameter name=\"stroke-width\">0.1</CssParameter>"
                + "</Stroke>"
                + "</PolygonSymbolizer>"                
//                + "<PointSymbolizer>"
//                + "<Geometry><ogc:PropertyName>" + geometryName + "</ogc:PropertyName></Geometry>"
//                + "<Graphic>"
//                + "<Mark>"
//                + "<WellKnownName>square</WellKnownName>"
//                + "<Fill>"
//                + "<CssParameter name=\"fill\">"
//                + color
//                + "</CssParameter>"
//                + "</Fill>"
//                + "</Mark>"
//                + "<Size>8</Size>"
//                + "</Graphic>"
//                + "</PointSymbolizer>"
                + "</Rule>"
                + "</FeatureTypeStyle>"
                + "</UserStyle>" + "</NamedLayer>" + "</StyledLayerDescriptor>";      
        return style;
    }   

}

