package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.entity.CapdfHydroChemColorCoding;
import org.auscope.portal.server.web.service.CapdfHydroGeoChemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class CapdfHydroGeoChemController extends BasePortalController {

    private CapdfHydroGeoChemService capdfHydroGeoChemService;

    public static final String CAPDF_HYDROGEOCHEMTYPE = "public:hydrogeochem";

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
            @RequestParam(required = false, value ="project") String project,
            @RequestParam(required = false, value ="field") String field,
            HttpServletResponse response)throws Exception {

        //Vt: wms shouldn't need the bbox because it is tiled.
        FilterBoundingBox bbox = null;

        String style="";

        if(!field.isEmpty() && field != null){
            CapdfHydroChemColorCoding ccq=new CapdfHydroChemColorCoding(field);
            List<IFilter> stylefilterRules=this.capdfHydroGeoChemService.getHydroGeoChemFilterWithColorCoding(project,ccq); //VT:get filter from service
            style=this.getColorCodedStyle(stylefilterRules,ccq,CAPDF_HYDROGEOCHEMTYPE);
        }else{
            String stylefilterRules=this.capdfHydroGeoChemService.getHydroGeoChemFilter(project,bbox); //VT:get filter from service
            style=this.getStyle(stylefilterRules,CAPDF_HYDROGEOCHEMTYPE,"#DB70B8");
        }

        response.setContentType("text/xml");

        ByteArrayInputStream styleStream = new ByteArrayInputStream(
                style.getBytes());
        OutputStream outputStream = response.getOutputStream();

        FileIOUtil.writeInputToOutputStream(styleStream, outputStream, 1024,false);

        styleStream.close();
        outputStream.close();
    }


    public String getColorCodedStyle(List<IFilter> stylefilterRules,CapdfHydroChemColorCoding ccq,String name){

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" "+
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" "+
                "xmlns=\"http://www.opengis.net/sld\" "+
                "xmlns:public=\"http://capdf.csiro.au/\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" "+
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" "+
                "xmlns:ows=\"http://www.opengis.net/ows\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
                "<NamedLayer>" +
                "<Name>" + name + "</Name>" +
                "<UserStyle>" +
                "<Title>default Title</Title>" +
                "<Abstract>default abstract</Abstract>" +
                "<FeatureTypeStyle>";

        for(int i=0;i<stylefilterRules.size();i++){

            style += "<Rule>" +
                    "<Name>Hydrogeo Chemistry</Name>" +
                    "<Title>Hydrogeo Chemistry</Title>" +
                    "<Abstract>Light purple square boxes</Abstract>" +
                    stylefilterRules.get(i).getFilterStringAllRecords() +
                    "<PointSymbolizer>" +
                    "<Graphic>" +
                    "<Mark>" +
                    "<WellKnownName>square</WellKnownName>" +
                    "<Fill>" +
                    "<CssParameter name=\"fill\">" + ccq.getShades()[i] + "</CssParameter>" +
                    "</Fill>" +
                    "</Mark>" +
                    "<Size>6</Size>" +
                    "</Graphic>" +
                    "</PointSymbolizer>" +
                    "</Rule>" ;
        }




        style +="</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";

        System.out.println(style);
        return style;
    }

    public String getStyle(String stylefilterRules,String name,String color){

        String style = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>" +
                "<StyledLayerDescriptor version=\"1.0.0\" "+
                "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" "+
                "xmlns=\"http://www.opengis.net/sld\" "+
                "xmlns:public=\"http://capdf.csiro.au/\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
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
                "<Abstract>Light purple square boxes</Abstract>" +
                stylefilterRules +
                "<PointSymbolizer>" +
                "<Graphic>" +
                "<Mark>" +
                "<WellKnownName>square</WellKnownName>" +
                "<Fill>" +
                "<CssParameter name=\"fill\">" + color + "</CssParameter>" +
                "</Fill>" +
                "</Mark>" +
                "<Size>6</Size>" +
                "</Graphic>" +
                "</PointSymbolizer>" +
                "</Rule>" +
                "</FeatureTypeStyle>" +
                "</UserStyle>" +
                "</NamedLayer>" +
                "</StyledLayerDescriptor>";

        System.out.println(style);
        return style;
    }

}
