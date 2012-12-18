package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.net.URL;
import java.util.Scanner;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

@Controller
public class IRISController extends BasePortalController {
    // TODO: This is being called by FeatureDownloadManager.js but it isn't
    // really suitable: the FDM is specifically for WFS whereas the
    // IRIS service doesn't use that interface, it has its own.
    // typeName is being passed in which doesn't do anything....
    @RequestMapping("/getIRISStations.do")
    public ModelAndView getIRISStations(
        @RequestParam("serviceUrl") String serviceUrl,
        @RequestParam("networkCode") String networkCode,
        @RequestParam(required = false, value = "bbox") String bboxJson) {
        // Make sure the trailing separator is in place:
        serviceUrl = serviceUrl.endsWith("/") ? serviceUrl : serviceUrl + "/";

        try {
            String irisResponse = new Scanner(new URL(serviceUrl + "station/query?net=" + networkCode).openStream(), "ISO-8859-1").useDelimiter("\\A").next();

            DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
            domFactory.setNamespaceAware(true); // never forget this!
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document irisDoc = builder.parse(new ByteArrayInputStream(irisResponse.getBytes("ISO-8859-1")));
            NodeList stationEpochs = irisDoc.getDocumentElement().getElementsByTagName("StationEpoch");
             
            StringBuilder kml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>GML Links to KML</name><description><![CDATA[GeoSciML data converted to KML]]></description>");
            
            // For each station:
            for (int i = 0; i < stationEpochs.getLength(); i++) {
                Node stationEpoch = stationEpochs.item(i);
                Node currentNode = stationEpoch.getFirstChild();
                
                String lat = "", lon = "", name = "";
                
                do {
                    String localName = currentNode.getLocalName();
                    if (localName == "Lat") {
                        lat = currentNode.getTextContent().trim();
                    } else if (localName == "Lon") {
                        lon = currentNode.getTextContent().trim();
                    } else if (localName == "Site") {
                        NodeList childNodes = currentNode.getChildNodes();
                        for (int n = 0; n < childNodes.getLength(); n++) {
                            if (childNodes.item(n).getNodeName() == "Name") {
                                name = currentNode.getTextContent().trim();
                            }
                        }
                    }
                    
                    currentNode = currentNode.getNextSibling();
                } while (currentNode != null);
                
                // TODO: Sort out paddle!!! Will all this work with open layers??
                kml.append(
                        String.format(
                                "<Placemark><name>%s</name><description><![CDATA[GENERIC_PARSER:%s]]></description><MultiGeometry><Point><Style><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href></Icon></IconStyle></Style><coordinates>%s,%s,0</coordinates></Point></MultiGeometry></Placemark>",
                                name,
                                i,
                                lon,
                                lat));
            }
            
            kml.append("</Document></kml>");

            return generateJSONResponseMAV(true, "gml", kml.toString(), null);
        } catch (Exception e) {
            return generateJSONResponseMAV(false, e, "Failed.");
        }
    }
}