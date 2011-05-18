package org.auscope.portal.server.web.controllers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.server.web.view.JSONModelAndView;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

public class BaseJSONResponseController {
	protected Log log = LogFactory.getLog(getClass());
	
	/**
     * Creates a generic response ModelAndView
     * @param success
     * @param message
     * @param data
     * @param debugInfo Optional - can be null or empty
     * @return
     */
    protected ModelAndView makeModelAndView(boolean success, String message, Object data) {
        return makeModelAndView(success, message, data, null);
    }
    
    /**
     * Creates a generic response ModelAndView
     * @param success
     * @param message
     * @param data
     * @param debugInfo Optional - can be null or empty
     * @return
     */
    protected ModelAndView makeModelAndView(boolean success, String message, Object data, Object debugInfo) {
        ModelMap model = new ModelMap();
        model.put("success", success);
        model.put("data", data);
        model.put("msg", message);
        if (debugInfo != null) {
            model.put("debugInfo", debugInfo);
        }
        
        return new JSONModelAndView(model);
    }
}
