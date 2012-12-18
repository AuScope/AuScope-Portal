package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.net.URL;
import java.util.Scanner;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.namespaces.IterableNamespace;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

@Controller
public class IRISController extends BasePortalController {
    @RequestMapping("/getIRISStations.do")
    public ModelAndView getIRISStations(
        @RequestParam("serviceUrl") String serviceUrl,
        @RequestParam("networkCode") String networkCode) {
        // Make sure the trailing separator is in place:
        serviceUrl = serviceUrl.endsWith("/") ? serviceUrl : serviceUrl + "/";

        try {
            String irisResponse = new Scanner(new URL(serviceUrl + "station/query?net=" + networkCode).openStream(), "ISO-8859-1").useDelimiter("\\A").next();

            DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
            domFactory.setNamespaceAware(true); // never forget this!
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document irisDoc = builder.parse(new ByteArrayInputStream(irisResponse.getBytes("ISO-8859-1")));
            
            XPath xPath = XPathFactory.newInstance().newXPath();
            xPath.setNamespaceContext(new IterableNamespace() {
                {
                    map.put("default", "http://www.data.scec.org/xml/station/");
                }
            });
            
            NodeList stationEpochs = irisDoc.getDocumentElement().getElementsByTagName("StationEpoch");
            XPathExpression nameExpression = xPath.compile("default:Site/default:Name/text()");
            XPathExpression latExpression = xPath.compile("default:Lat/text()");
            XPathExpression lonExpression = xPath.compile("default:Lon/text()"); 
            
            StringBuilder kml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>GML Links to KML</name><description><![CDATA[GeoSciML data converted to KML]]></description>");
            
            // For each stationEpoch:
            for (int i = 0; i < stationEpochs.getLength(); i++) {
                Node stationEpoch = stationEpochs.item(i);
                kml.append(
                        String.format(
                                "<Placemark><name>%s</name><description><![CDATA[GENERIC_PARSER:%s]]></description>" +
                                "<MultiGeometry><Point><coordinates>%s,%s,0</coordinates></Point></MultiGeometry></Placemark>",
                                nameExpression.evaluate(stationEpoch, XPathConstants.STRING),
                                i,
                                lonExpression.evaluate(stationEpoch, XPathConstants.STRING),
                                latExpression.evaluate(stationEpoch, XPathConstants.STRING)));
            }
            
            kml.append("</Document></kml>");

            return generateJSONResponseMAV(true, "gml", kml.toString(), null);
        } catch (Exception e) {
            return generateJSONResponseMAV(false, e, "Failed.");
        }
    }
}