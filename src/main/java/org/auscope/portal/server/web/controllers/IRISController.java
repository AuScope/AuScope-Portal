package org.auscope.portal.server.web.controllers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IRISController extends BasePortalController {
    // TODO: This is being called by FeatureDownloadManager.js but it isn't
    // really suitable: the FDM is specifically for WFS whereas the
    // IRIS service doesn't use that interface, it has its own.
    // typeName is being passed in which doesn't do anything....
    @RequestMapping("/doIRISFilter.do")
    public ModelAndView doIRISFilter(
        @RequestParam("serviceUrl") String serviceUrl,
        @RequestParam(required = false, value = "maxFeatures", defaultValue="0") int maxFeatures,
        @RequestParam(required = false, value = "bbox") String bboxJson) {
        
//        StringBuilder irisResponse = new StringBuilder();
//        try
//        {
//            URL irisURL = new URL("http://www.iris.edu/ws/station/query?net=S");
//            URLConnection connection = irisURL.openConnection();
//            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//            
//            String line;
//            while ((line = in.readLine()) != null) { 
//                sb.append(line);
//            }
//            
//            in.close();
//        }
//        catch (Exception e) {
//            return generateJSONResponseMAV(false, e, "Failed.");    
//        }
//        
//        // We need to convert the IRIS response into KML to render the points
//        // on the map:
//       StringBuilder kml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>GML Links to KML</name><description><![CDATA[GeoSciML data converted to KML]]></description>");
//       
//       //"<Placemark><name>1</name><description><![CDATA[GENERIC_PARSER:1]]></description><MultiGeometry><Point><Style><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href></Icon></IconStyle></Style><coordinates>142.32423823611,-37.75559655,0</coordinates></Point></MultiGeometry></Placemark><Placemark><name>2</name><description><![CDATA[GENERIC_PARSER:2]]></description><MultiGeometry><Point><Style><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href></Icon></IconStyle></Style><coordinates>142.515,-37.46436,0</coordinates></Point></MultiGeometry></Placemark>";
//       
//        
//       kml.append("</Document></kml>");
//        
//       return generateJSONResponseMAV(true, "gml", kml, null);
        return generateJSONResponseMAV(true, "gml", "");
    }
}


















