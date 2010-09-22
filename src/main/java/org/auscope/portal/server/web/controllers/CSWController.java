package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.server.util.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.server.web.service.CSWService;
import org.auscope.portal.server.web.view.JSONModelAndView;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @version $Id$
 */
@Controller
public class CSWController {

    protected final Log log = LogFactory.getLog(getClass());
    private CSWService cswService;
    private ViewCSWRecordFactory viewCSWRecordFactory;
    
    /**
     * Construct
     * @param
     */
    @Autowired
    public CSWController(CSWService cswService,
                         ViewCSWRecordFactory viewCSWRecordFactory,
                         PortalPropertyPlaceholderConfigurer propertyResolver) {

        this.cswService = cswService;
        this.viewCSWRecordFactory = viewCSWRecordFactory;

        try {
        	cswService.setServiceUrl(propertyResolver.resolvePlaceholder("HOST.cswservice.url"));
            cswService.updateRecordsInBackground();
        } catch (Exception e) {
            log.error(e);
        }
    }

    /**
     * Utility for generating a response model
     * @param success
     * @param records Can be null
     * @return
     */
    private JSONModelAndView generateJSONResponse(boolean success, String message, List<ModelMap> records) {
    	ModelMap response = new ModelMap();
    	
    	response.put("success", success);
    	response.put("msg", message);
    	if (records != null) {
    		response.put("records", records);
    	}
    	
    	return new JSONModelAndView(response);
    }
    
    /**
     * This controller method returns a representation of each and every CSWRecord from the internal cache
     * @throws Exception 
     */
    @RequestMapping("/getCSWRecords.do")
    public ModelAndView getCSWRecords() {
    	try {
			this.cswService.updateRecordsInBackground();
		} catch (Exception ex) {
			log.error("Error updating cache", ex);
			return generateJSONResponse(false, "Error updating cache", null);
		}
    	
    	List<ModelMap> recordRepresentations = new ArrayList<ModelMap>();
    	
    	try {
	    	for (CSWRecord record : this.cswService.getDataRecords()) {
	    		recordRepresentations.add(this.viewCSWRecordFactory.toView(record));
	    	}
    	 } catch (Exception ex) {
    		 log.error("Error getting data records:", ex);
    		 return generateJSONResponse(false, "Error getting data records", null);
    	 }
    	
    	return generateJSONResponse(true, "No errors", recordRepresentations);
    }
}