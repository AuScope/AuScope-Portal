package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.namespaces.IterableNamespace;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
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
    private String ensureTrailingForwardslash(String string) {
        // Make sure the trailing separator is in place:
        return string.endsWith("/") ? string : string + "/";
    }
    
    @RequestMapping("/getIRISStations.do")
    public ModelAndView getIRISStations(
        @RequestParam("serviceUrl") String serviceUrl,
        @RequestParam("networkCode") String networkCode) {
        serviceUrl = ensureTrailingForwardslash(serviceUrl);

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
            
            NodeList stations = irisDoc.getDocumentElement().getElementsByTagName("Station");
            XPathExpression nameExpression = xPath.compile("default:StationEpoch/default:Site/default:Name/text()");
            XPathExpression latExpression = xPath.compile("default:StationEpoch/default:Lat/text()");
            XPathExpression lonExpression = xPath.compile("default:StationEpoch/default:Lon/text()"); 
            
            StringBuilder kml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>GML Links to KML</name><description><![CDATA[GeoSciML data converted to KML]]></description>");
            
            // For each station:
            for (int i = 0; i < stations.getLength(); i++) {
                Node station = stations.item(i);
                Node staCode = station.getAttributes().getNamedItem("sta_code");
                kml.append(
                        String.format(
                                "<Placemark><name>%s</name><description><![CDATA[GENERIC_PARSER:%s]]></description>" +
                                "<MultiGeometry><Point><coordinates>%s,%s,0</coordinates></Point></MultiGeometry></Placemark>",
                                nameExpression.evaluate(station, XPathConstants.STRING),
                                staCode.getTextContent(),
                                lonExpression.evaluate(station, XPathConstants.STRING),
                                latExpression.evaluate(station, XPathConstants.STRING)));
            }
            
            kml.append("</Document></kml>");

            return generateJSONResponseMAV(true, "gml", kml.toString(), null);
        } catch (Exception e) {
            return generateJSONResponseMAV(false, e, "Failed.");
        }
    }
    
    @RequestMapping("/getStationChannels.do")
    public ModelAndView getStationChannels(
        @RequestParam("serviceUrl") String serviceUrl,
        @RequestParam("networkCode") String networkCode,
        @RequestParam("stationCode") String stationCode) {
        serviceUrl = ensureTrailingForwardslash(serviceUrl);
        try {
            // TODO: validate input!
            InputStream inputStream = new URL(serviceUrl + "station/query?net=" + networkCode + "&station=" + stationCode + "&level=chan").openStream();
            Scanner scanner = new Scanner(inputStream, "ISO-8859-1");
            String irisResponse = scanner.useDelimiter("\\A").next();
            scanner.close();
            inputStream.close();
            
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
            
            NodeList channels = irisDoc.getDocumentElement().getElementsByTagName("Channel");
            
            String[] channelCodes = new String[channels.getLength()];
            
            // For each station:
            for (int i = 0; i < channels.getLength(); i++) {
                Node channel = channels.item(i);
                channelCodes[i] = channel.getAttributes().getNamedItem("chan_code").getTextContent();
            }
                
            String startDate = xPath.compile("//default:Station[@sta_code='" + stationCode + "']/default:StationEpoch/default:StartDate").evaluate(irisDoc, XPathConstants.STRING).toString();
            String endDate = xPath.compile("//default:Station[@sta_code='" + stationCode + "']/default:StationEpoch/default:EndDate").evaluate(irisDoc, XPathConstants.STRING).toString();
            
            ModelMap channelInfo = new ModelMap();
            channelInfo.put("start_date", startDate);
            channelInfo.put("end_date", endDate);
            channelInfo.put("channel_codes", channelCodes);
            
            return generateJSONResponseMAV(true, channelInfo, "OK");
        } catch (Exception e) {
            return generateJSONResponseMAV(false, e, "Failed.");
        }
    }
}