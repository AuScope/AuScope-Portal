package org.auscope.portal.server.web.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.auscope.portal.server.web.HttpServiceCaller;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URL;

/**
 * Controller that handles GetFeatureInfo WMS requests
 * 
 * @author Jarek Sanders
 * @version $Id$ - %I%, %G%
 */

@Controller
public class WMSPopupController {
   private Logger log = Logger.getLogger(getClass());
   
   @RequestMapping("/wmsMarkerPopup.do")
   public void wmsUnitPopup(HttpServletRequest request,
                            HttpServletResponse response,
                            @RequestParam("WMS_URL") String wms_url,
                            @RequestParam("lat") String latitude,
                            @RequestParam("lng") String longitude,
                            @RequestParam("QUERY_LAYERS") String quary_layers,
                            @RequestParam("x") String x,
                            @RequestParam("y") String y,
                            @RequestParam("BBOX") String bbox, 
                            @RequestParam("WIDTH") String width,
                            @RequestParam("HEIGHT") String height) throws IOException {

      log.debug("wms_url: " + wms_url);
      log.debug("latitude: " + latitude);
      log.debug("longitude: " + longitude);
      log.debug("quary_layers: " + quary_layers);
      log.debug("x: " + x);
      log.debug("y: " + y);
      log.debug("BBOX: " + bbox);
      log.debug("WIDTH: " + width);
      log.debug("HEIGHT: " + height);

      String AMP = "&";
      String url = wms_url;
      // "&" character cannot be passed within url string
      // We need this check for urls such as Geoscience Australia.
      if ( !url.endsWith("?") || !url.endsWith("&") || !url.endsWith("="))
         url += AMP;
      url += "REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml" + AMP;
      url += "VERSION=1.1.0" + AMP;
      url += "BBOX=" + bbox + AMP;
      url += "X=" + x + "&Y=" + y + AMP;
      url += "INFO_FORMAT=text/html" + AMP;
      url += "QUERY_LAYERS=" + quary_layers + AMP;
      url += "FEATURE_COUNT=50" + AMP;
      url += "Srs=EPSG:4326" + AMP;
      url += "Layers=" + quary_layers + AMP;
      //url += "Styles=" + AMP;
      url += "WIDTH=" + width + "&HEIGHT=" + height + AMP;
      url += "format=text/html";
      
      log.debug(url);       

      HttpServiceCaller serviceCaller = new HttpServiceCaller();
      String responseFromCall = serviceCaller.callHttpUrlGET(new URL(url));
      
      log.debug(responseFromCall);
      
      // Send response back to client
      response.getWriter().write(responseFromCall);
   }
}
