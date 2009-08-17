package org.auscope.portal.server.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.auscope.portal.server.web.HttpServiceCaller;
import org.auscope.portal.server.util.PortalURIResolver;
import org.auscope.portal.server.util.PortalPropertyPlaceholderConfigurer;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.net.URL;

/**
 * User: Jarek Sanders
 * Date: 07/08/2009
 */

@Controller
public class WMSPopupController {
   private Logger log = Logger.getLogger(getClass());

   @Autowired
   @Qualifier(value = "propertyConfigurer")
   private PortalPropertyPlaceholderConfigurer hostConfigurer;
   
   @RequestMapping("/wmsMarkerPopup.do")
   public void wmsUnitPopup(HttpServletRequest request,
                            HttpServletResponse response,
                            @RequestParam("lat") String latitude,
                            @RequestParam("lng") String longitude,
                            @RequestParam("QUERY_LAYERS") String quary_layers,
                            @RequestParam("x") String x,
                            @RequestParam("y") String y,
                            @RequestParam("BBOX") String BBOX, 
                            @RequestParam("WIDTH") String WIDTH,
                            @RequestParam("HEIGHT") String HEIGHT) throws IOException {

      log.debug("latitude: " + latitude);
      log.debug("longitude: " + longitude);
      log.debug("quary_layers: " + quary_layers);
      log.debug("x: " + x);
      log.debug("y: " + y);
      log.debug("BBOX: " + BBOX);
      log.debug("WIDTH: " + WIDTH);
      log.debug("HEIGHT: " + HEIGHT);

       //deegree does not like fully encoded URLS, it only likes spaces to be encoded with %20
       //String url = "http://www.gsv-tb.dpi.vic.gov.au/AuScope-GeoSciML/services?service=WFS&version=1.1.0&request=GetFeature&typeName=gsml:GeologicUnit&filter=<ogc:Filter xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\"><ogc:BBOX><ogc:PropertyName>gsml:occurrence/gsml:MappedFeature/gsml:shape</ogc:PropertyName><gml:Envelope srsName=\"EPSG:4326\"><gml:lowerCorner>"+longitude+" "+latitude+"</gml:lowerCorner><gml:upperCorner>"+longitude+" "+latitude+"</gml:upperCorner></gml:Envelope></ogc:BBOX></ogc:Filter>";
/*
       String url = hostConfigurer.resolvePlaceholder("gsv.gu.url") 
          + "WFS&version=1.1.0&request=GetFeature&typeName=gsml:GeologicUnit&filter=<ogc:Filter xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\"><ogc:BBOX><ogc:PropertyName>gsml:occurrence/gsml:MappedFeature/gsml:shape</ogc:PropertyName><gml:Envelope srsName=\"EPSG:4326\"><gml:lowerCorner>"+longitude+" "+latitude+"</gml:lowerCorner><gml:upperCorner>"+longitude+" "+latitude+"</gml:upperCorner></gml:Envelope></ogc:BBOX></ogc:Filter>";
       url = url.replace(" ", "%20");
*/
       String AMP = "&";
       String WMS_URL = "http://auscope-services-test.arrc.csiro.au/earth-imaging/wms?";
       String REQUEST = "REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml" + AMP;
       String BOUNDS = "BBOX=" + BBOX + AMP;
       String XY = "X=" + x + "&Y=" + y + AMP;
       String INFO_FORMAT = "INFO_FORMAT=text/html" + AMP;
       String QUERY_LAYERS = "QUERY_LAYERS=" + quary_layers + AMP; //"QUERY_LAYERS=ei:BBSTA_experiments_view&";
       String FEATURE_COUNT = "FEATURE_COUNT=50" + AMP;
       String SRS = "Srs=EPSG:4326" + AMP;
       String LAYERS = "Layers=" + quary_layers + AMP;  //"Layers=ei:BBSTA_experiments_view" + AMP;
       String STYLES = "Styles=&WIDTH=" + WIDTH + "&HEIGHT=" + HEIGHT + AMP;
       String FORMAT = "format=text/html";
       
       String url = WMS_URL + REQUEST + BOUNDS + XY + INFO_FORMAT + QUERY_LAYERS + FEATURE_COUNT + SRS + LAYERS + STYLES + FORMAT;
       
       //String url = "http://www.gsv-tb.dpi.vic.gov.au/AuScope-GeoSciML/services?service=WFS&version=1.1.0&request=GetFeature&outputFormat=text/xml;%20subtype=geoscimlhtml&featureid=gsml.geologicunit.16777549126932018";
      log.debug(url);
      
      HttpServiceCaller serviceCaller = new HttpServiceCaller();
      String responseFromCall = serviceCaller.callHttpUrlGET(new URL(url));
      //response.getWriter().write(serviceCaller.responseToString(responseFromCall));
      // Send response back to client
      //response.getWriter().println(downThePipe.toString());

      log.debug(responseFromCall);
      response.getWriter().write(responseFromCall);
   }
}
