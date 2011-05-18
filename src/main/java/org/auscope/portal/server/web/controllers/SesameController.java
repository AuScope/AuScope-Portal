package org.auscope.portal.server.web.controllers;

import java.util.List;

import org.auscope.portal.registry.InformationModel;
import org.auscope.portal.server.web.service.SesameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * A controller class for access to the high level, portal specific, sesame interface
 * @author Josh Vote
 *
 */
@Controller
public class SesameController extends BaseJSONResponseController {
	
	@Autowired
	private SesameService sesameService;
	
	/**
	 * Attempts to query an underlying sesame store for all information models and returns the results of the query as a JSON view
	 * @return
	 */
	@RequestMapping("/getAllInformationModels.do")
	public ModelAndView getAllInformationModels() {
		try {
			List<InformationModel> infoModels = sesameService.getAllInformationModels();
			
			return makeModelAndView(true, "", infoModels);
		} catch (Exception ex) {
			return makeModelAndView(false, ex.getClass().toString() + " : " + ex.getMessage(), null);
		}
	}
	
	
	
}
