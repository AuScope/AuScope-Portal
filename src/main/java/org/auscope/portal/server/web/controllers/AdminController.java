package org.auscope.portal.server.web.controllers;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.methods.GetMethod;
import org.auscope.portal.csw.CSWGetRecordResponse;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords.ResultType;
import org.auscope.portal.server.domain.ows.OWSExceptionParser;
import org.auscope.portal.server.util.DOMUtil;
import org.auscope.portal.server.web.service.CSWServiceItem;
import org.auscope.portal.server.web.service.HttpServiceCaller;
import org.auscope.portal.server.web.view.JSONView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;

/**
 * Provides a controller interface into some basic administration functionality/tests
 * @author Josh Vote
 *
 */
@Controller
public class AdminController {

    /** For testing basic requests */
    private HttpServiceCaller serviceCaller;
    /** For accessing the various CSW's*/
    @Qualifier(value = "cswServiceList") ArrayList cswServiceList;

    /**
     * Creates a new instance of this class
     */
    @Autowired
    public AdminController(HttpServiceCaller serviceCaller,
            @Qualifier(value = "cswServiceList") ArrayList cswServiceList) {
        this.serviceCaller = serviceCaller;
        this.cswServiceList = cswServiceList;
    }

    /**
     * Generates a ModelAndView JSON response with the specified params
     * @param success Whether a test succeeded or not
     * @param warnings can be null - list of warning strings
     * @param errors can be null - list of error strings
     * @param details can be null - list of general information strings
     * @return
     */
    private ModelAndView generateTestResponse(boolean success, List<String> errors, List<String> warnings, List<String> details) {
        return generateTestResponse(success,
                errors == null ? null : errors.toArray(new String[errors.size()]),
                warnings == null ? null : warnings.toArray(new String[warnings.size()]),
                details == null ? null : details.toArray(new String[details.size()]));
    }

    /**
     * Generates a ModelAndView JSON response with the specified params
     * @param success Whether a test succeeded or not
     * @param warnings can be null - list of warning strings
     * @param errors can be null - list of error strings
     * @param details can be null - list of general information strings
     * @return
     */
    private ModelAndView generateTestResponse(boolean success, String[] errors, String[] warnings, String[] details) {
        JSONView view = new JSONView();
        ModelMap model = new ModelMap();

        if (warnings == null) {
            warnings = new String[0];
        }
        if (errors == null) {
            errors = new String[0];
        }
        if (details == null) {
            details = new String[0];
        }

        model.put("success", success);
        model.put("warnings", warnings);
        model.put("errors", errors);
        model.put("details", details);

        return new ModelAndView(view, model);

    }

    /**
     * Performs an external connectivity test through the HttpServiceCaller
     * @return
     */
    @RequestMapping("/testExternalConnectivity.do")
    public ModelAndView testExternalConnectivity() {
        final String httpGetUrl = "http://www.google.com";
        final String httpsGetUrl = "https://www.google.com";
        GetMethod httpGet = new GetMethod(httpGetUrl);
        GetMethod httpsGet = new GetMethod(httpsGetUrl);

        //Make the request, ignore the response
        try {
            serviceCaller.getMethodResponseAsString(httpGet, serviceCaller.getHttpClient());
        } catch (Exception ex) {
            return generateTestResponse(false, new String[] {String.format("Unable to connect to %1$s. The error was %2$s", httpGetUrl, ex)},null, null);
        }

        //Failing HTTPS is only a warning
        try {
            serviceCaller.getMethodResponseAsString(httpsGet, serviceCaller.getHttpClient());
        } catch (Exception ex) {
            return generateTestResponse(true, null, new String[] {String.format("There was a problem with HTTPS when connecting to %1$s. The error was %2$s", httpsGetUrl, ex)},null);
        }

        String[] details = new String[] {
            String.format("Succesfully connected via HTTP to %1$s", httpGetUrl),
            String.format("Succesfully connected via HTTPS to %1$s", httpsGetUrl)
        };
        return generateTestResponse(true, null, null, details);
    }

    /**
     * Performs an external connectivity test to the various CSW's through the HttpServiceCaller
     * @return
     */
    @RequestMapping("/testCSWConnectivity.do")
    public ModelAndView testCSWConnectivity() {
        List<String> errors = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();
        List<String> details = new ArrayList<String>();
        int successfulRequests = 0;
        final int numRecordsToRequest = 1;

        //Iterate our configured registries performing a simple CSW request to ensure they are 'available'
        for (Object itemObj : cswServiceList) {
            //This will be caused by bad configuration
            if (!(itemObj instanceof CSWServiceItem)) {
                errors.add(String.format("The 'cswServiceList' has an item that cannot be cast into org.auscope.portal.server.web.service.CSWServiceItem: '%1$s'", itemObj));
                continue;
            }

            //We attempt to connect and request a single record
            CSWServiceItem item = (CSWServiceItem) itemObj;
            InputStream response = null;
            try {
                CSWMethodMakerGetDataRecords methodMaker = new CSWMethodMakerGetDataRecords(item.getServiceUrl());
                HttpMethodBase method = methodMaker.makeMethod(null, ResultType.Results, numRecordsToRequest);
                response = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());
            } catch (Exception ex) {
                warnings.add(String.format("Unable to request a CSW record from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }

            //Then test the response
            try {
                Document responseDoc = DOMUtil.buildDomFromStream(response);
                OWSExceptionParser.checkForExceptionResponse(responseDoc);

                CSWGetRecordResponse responseRecs = new CSWGetRecordResponse(item, responseDoc);
                if (numRecordsToRequest != responseRecs.getRecords().size()) {
                    throw new Exception(String.format("Expecting a response with %1$s records. Got %2$s records instead.", numRecordsToRequest, responseRecs.getRecords().size()));
                }

                details.add(String.format("Succesfully requested %1$s record(s) from '%2$s'. There are %3$s records available.", numRecordsToRequest, item.getServiceUrl(), responseRecs.getRecordsMatched()));
                successfulRequests++;
            } catch (Exception ex) {
                warnings.add(String.format("Unable to parse a CSW record response from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }
        }

        boolean success = errors.size() == 0 && successfulRequests > 0;
        return generateTestResponse(success, errors, warnings, details);
    }
}
