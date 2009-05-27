package org.auscope.portal.server.web.controllers;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.auscope.portal.server.util.GmlToKml;
import org.auscope.portal.server.util.XmlMerge;
import org.auscope.portal.server.util.KMLSplitter;
import org.auscope.portal.server.web.view.JSONView;
import org.auscope.portal.server.web.mineraloccurrence.*;
import org.auscope.portal.server.web.HttpServiceCaller;
import org.xml.sax.SAXException;
import org.apache.log4j.Logger;
import org.w3c.dom.NodeList;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.dom.DOMSource;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;
import java.util.Iterator;
import net.sf.json.JSONArray;

/**
 * User: Mathew Wyatt
 * Date: 20/03/2009
 * Time: 2:26:21 PM
 */

@Controller
public class MineralOccurrencesFilterController {

    private Logger logger = Logger.getLogger(getClass());
    private static String ALL_MINES = "All Mines..";

    private HttpServiceCaller serviceCaller;
    private IMineralOccurrencesCSWHelper mineralOccurrencesCSWHelper;

    @Autowired
    public MineralOccurrencesFilterController(HttpServiceCaller serviceCaller, IMineralOccurrencesCSWHelper mineralOccurrencesCSWHelper) {
        this.serviceCaller = serviceCaller;
        this.mineralOccurrencesCSWHelper = mineralOccurrencesCSWHelper;
    }

    @RequestMapping("/getMineNames.do")
    public ModelAndView populateFilterPanel(@RequestParam("serviceUrl") String serviceUrl,
                                            ModelMap model) throws IOException, SAXException, XPathExpressionException, ParserConfigurationException {
        /*
        The following code will make json look like this
        {"success":true,
            "data":[
                {"mineDisplayName":"Balh1"},
                {"mineDisplayName":"Blah2"}
                ]
         }
         */

        //make mine names list
        Map mineNameAll = new HashMap();
        mineNameAll.put("mineDisplayName", ALL_MINES);


        String mineResponse = doMineQuery(serviceUrl, ""); // empty mine name to get all mines
        Collection<Mine> mines = MineralOccurrencesResponseHandler.getMines(mineResponse);

        JSONArray recordsArray = new JSONArray();
        recordsArray.add(mineNameAll);

        Iterator<Mine> it = mines.iterator();
        while( it.hasNext() )
        {
            Mine mine = it.next();
            Map<String, String> mineName = new HashMap<String, String>();
            mineName.put("mineDisplayName", mine.getMineNamePreffered());
            recordsArray.add(mineName);
        }

        model.put("success", true);
        model.put("data", recordsArray);

        Map<String, HashMap<String, Comparable>> jsonViewModel = new HashMap<String, HashMap<String, Comparable>>();
        jsonViewModel.put("JSON_OBJECT", model);

        //TODO: query the given service url for all of the mines and get their names, then send that back as json

        return new ModelAndView(new JSONView(), jsonViewModel);
    }

    @RequestMapping("/doMineFilter.do")
    public ModelAndView doMineFilter(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("mineName") String mineName,
            HttpServletRequest request) {

        //TODO: find a better place for this pre processing of strings!
        if(mineName.equals(ALL_MINES)) mineName = "";

        try {
            String mineResponse = doMineQuery(serviceUrl, mineName);
            return makeModelAndViewSuccess(convertToKML(mineResponse, request));
        } catch (IOException e) {
            logger.error(e);
            return makeModelAndViewFailure("An error occurred when performing this operation. Please try a different filter request.");
        }
    }

    /**
     * This method is responsible for querying all of the available MineralOccurrence WFS services. Its job is to
     * send the query to each of the services with the specified filter parameters, then return a KML response.
     * 
     * @param commodityName
     * @param commodityGroup
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param cutOffGrade
     * @param cutOffGradeUOM
     * @param request
     * @return
     */
    @RequestMapping("/doAllMineralOccurrenceFilter.do")
    public ModelAndView doAllMineralOccurrenceFilter(
            @RequestParam("commodityName")         String commodityName,
            @RequestParam("commodityGroup")        String commodityGroup,
            @RequestParam("measureType")           String measureType,
            @RequestParam("minOreAmount")          String minOreAmount,
            @RequestParam("minOreAmountUOM")       String minOreAmountUOM,
            @RequestParam("minCommodityAmount")    String minCommodityAmount,
            @RequestParam("minCommodityAmountUOM") String minCommodityAmountUOM,
            @RequestParam("cutOffGrade")           String cutOffGrade,
            @RequestParam("cutOffGradeUOM")        String cutOffGradeUOM,
            HttpServletRequest request
    ) throws IOException, SAXException, XPathExpressionException, ParserConfigurationException, TransformerException {
        //query geonetwork and get all of the service URLS
        ArrayList<String> serviceUrls = mineralOccurrencesCSWHelper.getMineralOccurrenceServiceUrls();

        //a list to hold converted KML documents
        ArrayList<String> kmlDocuments = new ArrayList<String>();

        //call each of the services
        for(String serviceUrl : serviceUrls) {
            Collection<String> commodityURIs = getCommodityURIs(serviceUrl, commodityGroup, commodityName);
            if( commodityURIs.size() >=1 ) {
                String mineralOccurrenceResponse = doMineralOccurrenceQuery(  serviceUrl,
                                                                              commodityURIs,
                                                                              measureType,
                                                                              minOreAmount,
                                                                              minOreAmountUOM,
                                                                              minCommodityAmount,
                                                                              minCommodityAmountUOM,
                                                                              cutOffGrade,
                                                                              cutOffGradeUOM);
                kmlDocuments.add(convertToKML(mineralOccurrenceResponse, request));
            }
        }

        //merge the kml documents
        String kml = this.mergeKMLDocuments(kmlDocuments);
        System.out.println(kml);
        return makeModelAndViewSuccess(kml);
    }

    @RequestMapping("/doMineralOccurrenceFilter.do")
    public ModelAndView doMineralOccurrenceFilter(
            
            @RequestParam("serviceUrl")            String serviceUrl,
            @RequestParam("commodityName")         String commodityName,
            @RequestParam("commodityGroup")        String commodityGroup,
            @RequestParam("measureType")           String measureType,
            @RequestParam("minOreAmount")          String minOreAmount,
            @RequestParam("minOreAmountUOM")       String minOreAmountUOM,
            @RequestParam("minCommodityAmount")    String minCommodityAmount,
            @RequestParam("minCommodityAmountUOM") String minCommodityAmountUOM,
            @RequestParam("cutOffGrade")           String cutOffGrade,
            @RequestParam("cutOffGradeUOM")        String cutOffGradeUOM,
            
            HttpServletRequest request)
    {
        try
        {
            String mineralOccurrenceResponse = "";

            Collection<String> commodityURIs = getCommodityURIs(serviceUrl, commodityGroup, commodityName);

            if( commodityURIs.size() >=1 )
            {
                mineralOccurrenceResponse = doMineralOccurrenceQuery( serviceUrl,
                                                                      commodityURIs,
                                                                      measureType,
                                                                      minOreAmount,
                                                                      minOreAmountUOM,
                                                                      minCommodityAmount,
                                                                      minCommodityAmountUOM,
                                                                      cutOffGrade,
                                                                      cutOffGradeUOM);
                
                if( MineralOccurrencesResponseHandler.getNumberOfFeatures(mineralOccurrenceResponse).compareTo("0")==0 )
                    return makeModelAndViewFailure("No results matched your query.");
            } else {
                return makeModelAndViewFailure("No results matched your query.");
            }

            return makeModelAndViewSuccess(convertToKML(mineralOccurrenceResponse, request));

        } catch(Exception e) {
            logger.error(e);
            return makeModelAndViewFailure("An error occurred when performing this operation. Please try a different filter request.");
        }
    }

    @RequestMapping("/doMiningActivityFilter.do")
    public ModelAndView doMiningActivityFilter(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("mineName") String mineName,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("oreProcessed") String oreProcessed,
            @RequestParam("producedMaterial") String producedMaterial,
            @RequestParam("cutOffGrade") String cutOffGrade,
            @RequestParam("production") String production,
            HttpServletRequest request) throws IOException, SAXException, XPathExpressionException, ParserConfigurationException {

        try {
            //TODO: find a better place for this pre processing of strings!
            startDate = startDate.toUpperCase();
            endDate = endDate.toUpperCase();
            if(mineName.equals(ALL_MINES)) mineName = "";

            String mineResponse = doMineQuery(serviceUrl, mineName);
            String miningActivityResponse = "";

            Collection<Mine> mines = MineralOccurrencesResponseHandler.getMines(mineResponse);

            if( mines.size() >=1 ) {
                //iterate through and build up a string arrray of mine uris
                String[] mineURIs = new String[mines.size()];
                Mine[] minesArr = mines.toArray(new Mine[mines.size()]);
                for(int i=0; i<minesArr.length; i++)
                    mineURIs[i] = minesArr[i].getMineNameURI();


                miningActivityResponse = doMiningActivityQuery( serviceUrl,
                                                                mineURIs,
                                                                startDate,
                                                                endDate,
                                                                oreProcessed,
                                                                producedMaterial,
                                                                cutOffGrade,
                                                                production);
            } else {
                System.out.println("failed");
                return makeModelAndViewFailure("No results matched your query.");
            }

            //return makeModelAndViewSuccess(convertToKML(mineResponse, miningActivityResponse));
            System.out.println("OK");
            return makeModelAndViewSuccess(convertToKML(miningActivityResponse, request));

        } catch(Exception e) {
            System.out.println("failed");
            logger.error(e);
            return makeModelAndViewFailure("An error occurred when prforming this operation. Please try a different filter request.");
        }
    }

    private Collection<String> getCommodityURIs(String serviceUrl, String commodityGroup, String commodityName) throws IOException, SAXException, XPathExpressionException, ParserConfigurationException {
        String commodityResponse = doCommodityQuery(serviceUrl,
                                                        commodityGroup,
                                                        commodityName);

        Collection<Commodity> commodities = MineralOccurrencesResponseHandler.getCommodities(commodityResponse);

        Collection<String> commodityURIs = new ArrayList<String>();
        Commodity[] commoditiesArr = commodities.toArray(new Commodity[commodities.size()]);

        for(int i=0; i<commoditiesArr.length; i++)
            commodityURIs.add(commoditiesArr[i].getMineralOccurrenceURI());

        return commodityURIs;
    }

    private String doMineQuery(String serviceUrl, String mineName) throws IOException {
        //URL service = new URL(URLEncoder.encode(serviceUrl + new MineFilter(mineName).getFilterString(), "UTF-8"));

        MineFilter mineFilter = new MineFilter(mineName);

        return serviceCaller.responseToString(serviceCaller.callHttpUrlPost(serviceUrl, mineFilter.getFilterString()));
    }

    private String doCommodityQuery(String serviceUrl, String commodityGroup, String commodityName) throws IOException {
        CommodityFilter commodityFilter = new CommodityFilter(commodityGroup, commodityName);

        return serviceCaller.responseToString(serviceCaller.callHttpUrlPost(serviceUrl, commodityFilter.getFilterString()));
    }

    private String doMiningActivityQuery(String serviceUrl, String[] mineNameURIs, String startDate, String endDate, String oreProcessed, String producedMaterial, String cutOffGrade, String production) throws IOException {

        MiningActivityFilter miningActivityFilter = new MiningActivityFilter(mineNameURIs, startDate, endDate, oreProcessed, producedMaterial, cutOffGrade, production);

        return serviceCaller.responseToString(serviceCaller.callHttpUrlPost(serviceUrl, miningActivityFilter.getFilterString()));
    }

    private String doMineralOccurrenceQuery(String serviceUrl,
                                            Collection<String> commodityURIs,
                                            String measureType,
                                            String minOreAmount,
                                            String minOreAmountUOM,
                                            String minCommodityAmount,
                                            String minCommodityAmountUOM,
                                            String cutOffGrade,
                                            String cutOffGradeUOM) throws IOException {

        MineralOccurrenceFilter mineralOccurrenceFilter =
            new MineralOccurrenceFilter(commodityURIs,
                                        measureType,
                                        minOreAmount,
                                        minOreAmountUOM,
                                        minCommodityAmount,
                                        minCommodityAmountUOM,
                                        cutOffGrade,
                                        cutOffGradeUOM);

        return serviceCaller.responseToString(
                   serviceCaller.callHttpUrlPost(
                       serviceUrl,
                       mineralOccurrenceFilter.getFilterString()));
    }

    public String convertToKML(String gmlString, HttpServletRequest request) {
        String out = "";
        HttpSession session = request.getSession();
        InputStream inXSLT = session.getServletContext().getResourceAsStream("/WEB-INF/xsl/kml.xsl");
        out = GmlToKml.convert(gmlString, inXSLT);

        /*System.out.println("KMLSTART-----");
        System.out.println(out);
        System.out.println("KMLEND-----");*/

        return out;
    }

    public String convertToKML(InputStream is1, InputStream is2, HttpServletRequest request) throws IOException, SAXException, ParserConfigurationException {
       String out = "";
       InputStream inXSLT = request.getSession().getServletContext().getResourceAsStream("/WEB-INF/xsl/kml.xsl");
       out = GmlToKml.convert(XmlMerge.merge(is1, is2), inXSLT);

        /*System.out.println("KMLSTART-----");
        System.out.println(out);
        System.out.println("KMLEND-----");*/

       return out;
    }

    public String mergeKMLDocuments(ArrayList<String> kmlDocuments) throws IOException, SAXException, ParserConfigurationException, XPathExpressionException, TransformerException {
        //a NodeList array to hold all of the <placemarks>
        ArrayList<NodeList> placemarkNodeLists = new ArrayList<NodeList>();

        //pull out the placemarks from all of the documents
        for(String kmlDoc : kmlDocuments) {
            placemarkNodeLists.add(new KMLSplitter(kmlDoc).getPlacemarks());
        }

        //add them all to a new kml document
        //create a new document
        Document newDoc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();

        Element kml = newDoc.createElement("kml");
        newDoc.appendChild(kml);

        Element document = newDoc.createElement("Document");
        kml.appendChild(document);

        for(NodeList nodeList : placemarkNodeLists)
            for(int i = 0; i < nodeList.getLength(); i++) {
                Node importedNode = newDoc.importNode(nodeList.item(i), true);
                document.appendChild(importedNode);
            }

        //the strign writer to contain the newly formed kml
        StringWriter sw = new StringWriter();

        //transform the new document to a string
        TransformerFactory.newInstance().newTransformer().transform(new DOMSource(newDoc), new StreamResult(sw));

        return sw.toString();
    }

    private ModelAndView makeModelAndViewSuccess(String kmlBlob) {
        HashMap<String, Object> model = new HashMap<String, Object>();
        model.put("success", true);

        //JSONArray dataArray = new JSONArray();
        Map<String, Serializable> data = new HashMap<String, Serializable>();
        data.put("kml", kmlBlob);
        //dataArray.add(data);

        model.put("data", data);

        Map<String, HashMap<String, Object>> jsonViewModel = new HashMap<String, HashMap<String, Object>>();
        jsonViewModel.put("JSON_OBJECT", model);

        return new ModelAndView(new JSONView(), jsonViewModel);
    }

    private ModelAndView makeModelAndViewFailure(String message) {
        HashMap<String, Object> model = new HashMap<String, Object>();
        model.put("success", false);
        model.put("msg", message);

        Map<String, HashMap<String, Object>> jsonViewModel = new HashMap<String, HashMap<String, Object>>();
        jsonViewModel.put("JSON_OBJECT", model);

        return new ModelAndView(new JSONView(), jsonViewModel);
    }
}
