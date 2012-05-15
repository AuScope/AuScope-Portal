package org.auscope.portal.server.web.service;

import java.io.InputStream;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.util.DOMUtil;
import org.auscope.portal.pressuredb.AvailableOMResponse;
import org.auscope.portal.pressuredb.PressureDBExceptionParser;
import org.auscope.portal.server.web.PressureDBMethodMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * A service class for making requests to the pressure DB web service
 * @author Josh Vote
 *
 */
@Service
public class PressureDBService {

    private final Log log = LogFactory.getLog(getClass());

    private PressureDBMethodMaker methodMaker;
    private HttpServiceCaller httpServiceCaller;

    @Autowired
    public PressureDBService(PressureDBMethodMaker methodMaker, HttpServiceCaller httpServiceCaller) {
        this.methodMaker = methodMaker;
        this.httpServiceCaller = httpServiceCaller;
    }

    private boolean attemptParseBoolean(Object obj) {
        String s = obj == null ? "" : obj.toString();

        if (s.length() == 1) {
            if (s.equalsIgnoreCase("y") || s.equalsIgnoreCase("t")) {
                return true;
            } else if (s.equalsIgnoreCase("n") || s.equalsIgnoreCase("f")) {
                return false;
            }
        }

        if (s.length() > 0) {
            if (s.equalsIgnoreCase("yes")) {
                return true;
            } else if (s.equalsIgnoreCase("no")) {
                return false;
            }

            //At this point assume we have a number
            try {
                return Integer.parseInt(s) > 0;
            } catch (NumberFormatException ex) {
                return false;
            }
        }

        //The default catch all
        return false;
    }

    /**
     * Shorthand method for extracting boolean responses from an Xpath content.
     * @param xPathString
     * @param node
     * @return
     * @throws XPathExpressionException
     */
    private boolean extractBooleanXPath(String xPathString, Node node) throws XPathExpressionException {
        return attemptParseBoolean(DOMUtil.compileXPathExpr(xPathString).evaluate(node, XPathConstants.STRING));
    }

    /**
     * Makes a pressure DB getAvailableOM request, parses the response and returns it as a formatted POJO.
     *
     * @param wellID
     * @param serviceUrl
     * @return
     * @throws Exception
     */
    public AvailableOMResponse makeGetAvailableOMRequest(String wellID, String serviceUrl) throws PortalServiceException {

        //Generate and then make the request
        HttpMethodBase method = null;
        Document doc = null;
        try {
            method = methodMaker.makeGetAvailableOMMethod(serviceUrl, wellID);
            InputStream stream = httpServiceCaller.getMethodResponseAsStream(method);
            doc = DOMUtil.buildDomFromStream(stream, false);
        } catch (Exception ex) {
            throw new PortalServiceException(method, "Unable to make/parse response", ex);
        } finally {
            if (method != null) {
                method.releaseConnection();
            }
        }

        //ensure we don't have an error response
        PressureDBExceptionParser.checkForExceptionResponse(doc);

        //Parse the XML document into a AvailableOMResponse
        AvailableOMResponse response = new AvailableOMResponse();
        try {


            response.setWellID((String) DOMUtil.compileXPathExpr("AvailableOM/Observations/@Well__Id").evaluate(doc, XPathConstants.STRING));
            response.setOmUrl((String) DOMUtil.compileXPathExpr("AvailableOM/Observations/omUrl").evaluate(doc, XPathConstants.STRING));
            response.setObsTemperature(extractBooleanXPath("AvailableOM/Observations/temperature", doc));
            response.setObsPressureData(extractBooleanXPath("AvailableOM/Observations/pressureData", doc));
            response.setObsSalinity(extractBooleanXPath("AvailableOM/Observations/salinity", doc));

            response.setPressureRft(extractBooleanXPath("AvailableOM/PressureFeature/rft", doc));
            response.setPressureDst(extractBooleanXPath("AvailableOM/PressureFeature/dst", doc));
            response.setPressureFitp(extractBooleanXPath("AvailableOM/PressureFeature/fitp", doc));

            response.setSalinityTds(extractBooleanXPath("AvailableOM/SalinityFeature/tds", doc));
            response.setSalinityNacl(extractBooleanXPath("AvailableOM/SalinityFeature/nacl", doc));
            response.setSalinityCl(extractBooleanXPath("AvailableOM/SalinityFeature/cl", doc));

            response.setTemperatureT(extractBooleanXPath("AvailableOM/TemperatureFeature/t", doc));
        } catch (Exception e) {
            throw new PortalServiceException(method, "Unable to parse <AvailableOM> XML response", e);
        }
        return response;
    }

    /**
     * Makes a Pressure DB dataservice download request and returns the resulting ZIP stream as an InputStream.
     *
     * @param wellID
     * @param serviceUrl
     * @param features
     * @return
     * @throws Exception
     */
    public InputStream makeDownloadRequest(String wellID, String serviceUrl, String[] features) throws Exception {
        HttpMethodBase method = methodMaker.makeDownloadMethod(serviceUrl, wellID, features);
        return httpServiceCaller.getMethodResponseAsStream(method);
    }
}
