package org.auscope.portal.server.web.controllers;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.auscope.portal.server.web.service.HttpServiceCaller;
import org.auscope.portal.server.web.view.JSONView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Provides a controller interface into some basic administration functionality/tests
 * @author Josh Vote
 *
 */
@Controller
public class AdminController {

    /** For testing basic requests */
    private HttpServiceCaller serviceCaller;

    /**
     * Creates a new instance of this class
     */
    @Autowired
    public AdminController(HttpServiceCaller serviceCaller) {
        this.serviceCaller = serviceCaller;
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
}
