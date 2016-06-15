package org.auscope.portal.server.web.controllers;

import java.awt.Menu;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller that handles all {@link Menu}-related requests,
 *
 * @author Jarek Sanders
 */
@Controller
public class MenuController {

    private final Log logger = LogFactory.getLog(getClass());

    @RequestMapping("/gmap.html")
    public ModelAndView gmap(@Value("${HOST.googlemap.key}") String googleKey,
            @Value("${HOST.vocabService.url}") String vocabServiceUrl,
            @Value("${HOST.maxFeatures.value}") String maxFeatureValue,
            @Value("${HOST.google.analytics.key}") String analyticKey,
            @Value("${HOST.piwik.site.id}") String piwikSiteId) {

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

        ModelAndView mav = new ModelAndView("gmap");
        mav.addObject("googleKey", googleKey);
        mav.addObject("vocabServiceUrl", vocabServiceUrl);
        mav.addObject("maxFeatureValue", maxFeatureValue);
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
    public ModelAndView mosaic_image(@Value("${HOST.googlemap.key}") String googleKey) {
        logger.debug(googleKey);

        ModelAndView mav = new ModelAndView("mosaic_image");
        mav.addObject("googleKey", googleKey);
        return mav;
    }

    @RequestMapping("/plotted_images.html")
    public ModelAndView plotted_images(@Value("${HOST.googlemap.key}") String googleKey) {
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
