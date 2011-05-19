package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.auscope.portal.registry.FeatureType;
import org.auscope.portal.registry.InformationModel;
import org.auscope.portal.registry.WebService;
import org.auscope.portal.server.web.service.SesameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	private List<String> arrayToList(String[] arr) {
		if (arr == null) {
			return null;
		}
		return Arrays.asList(arr);
	}
	
	/**
	 * Attempts to query an underlying sesame store for all information models (matching the specified urns) and returns the results of the query as a JSON view
	 * 
	 * If no urns are specified ALL information models will be returned
	 * @return
	 */
	@RequestMapping("/getInformationModels.do")
	public ModelAndView getInformationModels(@RequestParam(required=false, value="urn") String[] urns) {
		try {
			List<InformationModel> infoModels = sesameService.getInformationModels(arrayToList(urns));
			
			return makeModelAndView(true, "", infoModels);
		} catch (Exception ex) {
			return makeModelAndView(false, ex.getClass().toString() + " : " + ex.getMessage(), null);
		}
	}
	
	/**
	 * Attempts to query an underlying sesame store for all feature types (matching the specified urns) and returns the results of the query as a JSON view
	 * 
	 * If no urns are specified ALL feature types will be returned
	 * @return
	 */
	@RequestMapping("/getFeatureTypes.do")
	public ModelAndView getFeatureTypes(@RequestParam(required=false, value="urn") String[] urns) {
		try {
			List<FeatureType> featureTypes = sesameService.getFeatureTypes(arrayToList(urns));
			
			return makeModelAndView(true, "", featureTypes);
		} catch (Exception ex) {
			return makeModelAndView(false, ex.getClass().toString() + " : " + ex.getMessage(), null);
		}
	}
	
	/**
	 * Attempts to query an underlying sesame store for all web services (matching the specified urns) and returns the results of the query as a JSON view
	 * 
	 * If no urns are specified ALL web services will be returned
	 * @return
	 */
	@RequestMapping("/getWebServices.do")
	public ModelAndView getWebServices(@RequestParam(required=false, value="urn") String[] urns) {
		try {
			List<WebService> featureTypes = sesameService.getWebServices(arrayToList(urns));
			
			return makeModelAndView(true, "", featureTypes);
		} catch (Exception ex) {
			return makeModelAndView(false, ex.getClass().toString() + " : " + ex.getMessage(), null);
		}
	}
	
	/**
	 * Attempts to query an underlying sesame store for a description of an InformationModel
	 * The information model and all related feature types and web services will be returned
	 * @return
	 */
	@RequestMapping("/describeInformationModel.do")
	public ModelAndView describeInformationModel(@RequestParam(value="urn") String infoModelUrn) {
		try {
			//Get our base information model
			List<InformationModel> infoModels = sesameService.getInformationModels(Arrays.asList(infoModelUrn));
			if (infoModels.isEmpty()) {
				return makeModelAndView(false, "No information models with that URN", null); 
			}
			InformationModel infoModel = infoModels.get(0); //We should only get a single model back
			
			//Query for our list of feature types
			List<FeatureType> featureTypes = sesameService.getFeatureTypes(infoModel.getFeatureTypeUrns());
			
			//Query for our list of web services
			List<String> webServiceUrns = new ArrayList<String>();
			for (FeatureType featureType : featureTypes) {
				webServiceUrns.addAll(featureType.getWebServiceUrns());
			}
			List<WebService> webServices = null;
			if (!webServiceUrns.isEmpty()) {
				webServices = sesameService.getWebServices(webServiceUrns);
			} else {
				webServices = new ArrayList<WebService>();
			}
			
			//Finally create our response object
			Map<String, Object> data = new HashMap<String, Object>();
			data.put("informationModel", infoModel);
			data.put("featureTypes", featureTypes);
			data.put("webServices", webServices);
			
			return makeModelAndView(true, "", data);
		} catch (Exception ex) {
			return makeModelAndView(false, ex.getClass().toString() + " : " + ex.getMessage(), null);
		}
	}
}
