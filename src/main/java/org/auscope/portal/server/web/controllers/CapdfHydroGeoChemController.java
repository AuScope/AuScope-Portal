package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.util.FileIOUtil;
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
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam(required = false, value ="project") String project,
            @RequestParam(required = false, value = "bbox" , defaultValue="") String bboxJson,
            HttpServletResponse response)throws Exception {


        //Vt: wms shouldn't need the bbox because it is tiled.
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);

        String filter=this.capdfHydroGeoChemService.getHydroGeoChemFilter(project,bbox);

        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();

        InputStream results = this.capdfHydroGeoChemService.downloadWFS(serviceUrl, CAPDF_HYDROGEOCHEMTYPE, filter, null);
        FileIOUtil.writeInputToOutputStream(results, outputStream, 8 * 1024, true);
        outputStream.close();

    }



    @RequestMapping("/doCapdfHydroScatterPlotList.do")
    public ModelAndView doCapdfHydroScatterPlotList(
            @RequestParam(required = false, value = "project") String project,
            @RequestParam("xaxis") String xaxis,
            @RequestParam("yaxis") String yaxis,
            @RequestParam(required = false, value = "bbox" , defaultValue="") String bboxJson,
            HttpServletResponse response)throws Exception {


        int [] xValue = {4,2,7,8,9,11,5,18};
        int [] yValue = {7,4,9,11,14,3,2,7};

        boolean [] highlight ={true,false,false,true,true,false,false,true};




        ArrayList<ModelMap> series = new ArrayList<ModelMap>();

        ModelMap relatedValues = null;


        for (int i = 0; i < xValue.length; i++) {
            relatedValues = new ModelMap();
            relatedValues.put(xaxis, xValue[i]);
            relatedValues.put(yaxis, yValue[i]);
            relatedValues.put("highlight",highlight[i]);
            series.add(relatedValues);
        }

        ModelMap data = new ModelMap();
        data.put("series", series);
        return generateJSONResponseMAV(true, data, null);

    }


    @RequestMapping("/doCapdfHydro3DScatterPlotList.do")
    public ModelAndView doCapdfHydro3DScatterPlotList(
            @RequestParam(required = false, value = "project") String project,
            @RequestParam("xaxis") String xaxis,
            @RequestParam("yaxis") String yaxis,
            @RequestParam("zaxis") String zaxis,
            @RequestParam(required = false, value = "bbox" , defaultValue="") String bboxJson,
            HttpServletResponse response)throws Exception {




        int [] xValue = {4,2,7,8,9,11,5,18};
        int [] yValue = {7,4,9,11,14,3,2,7};
        int [] zValue = {5,8,3,7,11,7,12,17};

        boolean [] highlight ={true,false,false,true,true,false,false,true};




        ArrayList<ModelMap> series = new ArrayList<ModelMap>();

        ModelMap relatedValues = null;


        for (int i = 0; i < xValue.length; i++) {
            relatedValues = new ModelMap();
            relatedValues.put(xaxis, xValue[i]);
            relatedValues.put(yaxis, yValue[i]);
            relatedValues.put(zaxis, zValue[i]);
            relatedValues.put("highlight",highlight[i]);
            series.add(relatedValues);
        }

        ModelMap data = new ModelMap();
        data.put("series", series);
        return generateJSONResponseMAV(true, data, null);

    }


    @RequestMapping("/doCapdfHydroBoxPlotList.do")
    public ModelAndView doCapdfHydroBoxPlotList(
            @RequestParam(required = false, value = "project") String project,
            @RequestParam("box1") final String box1,
            @RequestParam("box2") final String box2,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            HttpServletResponse response)throws Exception {

        int [] b1Value = {4,2,7,8,9,11,5,18};
        int [] b2Value = {43,22,17,40,19,11,35,18};

        ArrayList<ModelMap> series = new ArrayList<ModelMap>();

        ModelMap relatedValues = null;


        for (int i = 0; i < b1Value.length; i++) {
            relatedValues = new ModelMap();
            relatedValues.put(box1, b1Value[i]);
            relatedValues.put(box2, b2Value[i]);
            series.add(relatedValues);
        }

        ModelMap data = new ModelMap();

        data.put("series", series);
        return generateJSONResponseMAV(true, data, null);
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
            style=this.getColorCodedStyle(stylefilterRules,ccq.getColorCodingConfig(),CAPDF_HYDROGEOCHEMTYPE);
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


    public String getColorCodedStyle(List<IFilter> stylefilterRules,ColorCodingConfig ccc,String name){

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
                    "<CssParameter name=\"fill\">" + ccc.getColor(i) + "</CssParameter>" +
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
