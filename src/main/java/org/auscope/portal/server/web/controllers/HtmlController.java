package org.auscope.portal.server.web.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.PortalPropertyPlaceholderConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller that handles all html page requests and loads properties that are needed by that page.
 * 
 * For example, the main page requires configuration details from config.properties and version.properties
 * and the admin page accesses values from the Manifest.
 */
@Controller
public class HtmlController {

    private final Log logger = LogFactory.getLog(getClass());

    @Autowired
    @Qualifier(value = "propertyConfigurer")
    private PortalPropertyPlaceholderConfigurer hostConfigurer;

    @RequestMapping("/gmap.html")
    public ModelAndView gmap() {
        String googleKey = hostConfigurer.resolvePlaceholder("HOST.googlemap.key");
        String vocabServiceUrl = hostConfigurer.resolvePlaceholder("HOST.vocabService.url");
        String maxFeatureValue = hostConfigurer.resolvePlaceholder("HOST.maxFeatures.value");
        String analyticKey = hostConfigurer.resolvePlaceholder("HOST.google.analytics.key");
        String piwikSiteId = hostConfigurer.resolvePlaceholder("HOST.piwik.site.id");               
        String buildVersion = hostConfigurer.resolvePlaceholder("portal.build.version");
        String buildTimestamp = hostConfigurer.resolvePlaceholder("portal.build.date.timestamp");
        int buildTimestampHashcode = buildTimestamp.hashCode();

        String localhost = null;
        try {
            localhost = InetAddress.getLocalHost().getCanonicalHostName();
        } catch (UnknownHostException e) {
            logger.warn(e);
            return null;
        }

        logger.debug("googleKey: " + googleKey);
        logger.debug("vocabServiceUrl: " + vocabServiceUrl);
        logger.debug("maxFeatureValue: " + maxFeatureValue);
        logger.debug("analyticKey: " + analyticKey);
        logger.debug("hostname: " + localhost);
        logger.debug("piwikSiteId: " + piwikSiteId);        
        logger.debug("buildVersion: " + buildVersion);
        logger.debug("buildTimestamp: " + buildTimestampHashcode);
        
        ModelAndView mav = new ModelAndView("gmap");
        mav.addObject("googleKey", googleKey);
        mav.addObject("vocabServiceUrl", vocabServiceUrl);
        mav.addObject("maxFeatureValue", maxFeatureValue);        
        mav.addObject("buildVersion", buildVersion);
        mav.addObject("buildTimestamp", buildTimestampHashcode);
        
        if (analyticKey != null && !analyticKey.isEmpty()) {
            mav.addObject("analyticKey", analyticKey);
        }
        if (piwikSiteId != null && !piwikSiteId.isEmpty()) {
            mav.addObject("piwikSiteId", piwikSiteId);
        }
        if (localhost != null && !localhost.isEmpty()) {
            mav.addObject("localhost", localhost);
        }
        return mav;
    }

    @RequestMapping("/mosaic_image.html")
    public ModelAndView mosaic_image() {
        String googleKey = hostConfigurer.resolvePlaceholder("HOST.googlemap.key");
        logger.debug(googleKey);

        ModelAndView mav = new ModelAndView("mosaic_image");
        mav.addObject("googleKey", googleKey);
        return mav;
    }

    @RequestMapping("/plotted_images.html")
    public ModelAndView plotted_images() {
        String googleKey = hostConfigurer.resolvePlaceholder("HOST.googlemap.key");
        logger.debug(googleKey);

        ModelAndView mav = new ModelAndView("plotted_images");
        mav.addObject("googleKey", googleKey);
        return mav;
    }

    @RequestMapping("/links.html")
    public ModelAndView links() {
        return new ModelAndView("links");
    }

    @RequestMapping("/qunit.test")
    public ModelAndView tests() {
        return new ModelAndView("qunit");
    }

    @RequestMapping("/admin.html")
    public ModelAndView admin(HttpServletRequest request) {
        return generateViewFromManifest(request, "admin");
    }

    private ModelAndView generateViewFromManifest(HttpServletRequest request, String viewName) {
        String appServerHome = request.getSession().getServletContext().getRealPath("/");
        File manifestFile = new File(appServerHome, "META-INF/MANIFEST.MF");
        Manifest mf = new Manifest();
        ModelAndView mav = new ModelAndView(viewName);
        try {
            mf.read(new FileInputStream(manifestFile));
            Attributes atts = mf.getMainAttributes();
            if (mf != null) {
                mav.addObject("specificationTitle", atts.getValue("Specification-Title"));
                mav.addObject("implementationVersion", atts.getValue("Implementation-Version"));
                mav.addObject("implementationBuild", atts.getValue("Implementation-Build"));
                mav.addObject("buildDate", atts.getValue("buildDate"));
                mav.addObject("buildJdk", atts.getValue("Build-Jdk"));
                mav.addObject("javaVendor", atts.getValue("javaVendor"));
                mav.addObject("builtBy", atts.getValue("Built-By"));
                mav.addObject("osName", atts.getValue("osName"));
                mav.addObject("osVersion", atts.getValue("osVersion"));
                mav.addObject("serverName", request.getServerName());
                mav.addObject("serverInfo", request.getSession().getServletContext().getServerInfo());
                mav.addObject("serverJavaVersion", System.getProperty("java.version"));
                mav.addObject("serverJavaVendor", System.getProperty("java.vendor"));
                mav.addObject("javaHome", System.getProperty("java.home"));
                mav.addObject("serverOsArch", System.getProperty("os.arch"));
                mav.addObject("serverOsName", System.getProperty("os.name"));
                mav.addObject("serverOsVersion", System.getProperty("os.version"));
            }
        } catch (IOException e) {
            /* ignore, since we'll just leave an empty form */
            logger.debug(e.getMessage());
        }
        return mav;
    }

    @RequestMapping("/about.html")
    public ModelAndView about(HttpServletRequest request) {
        return generateViewFromManifest(request, "about");
    }
}
