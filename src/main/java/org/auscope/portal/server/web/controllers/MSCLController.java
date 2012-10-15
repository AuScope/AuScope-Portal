package org.auscope.portal.server.web.controllers;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.mscl.MSCLWFSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * This class handles requests for MSCL observation data; it does so without
 * requiring the same to have defined SRSs. This is important as the GML Point,
 * into which the observation depths are encoded, doesn't have an SRS set.
 * @author bro879
 *
 */
@Controller
public class MSCLController extends BasePortalController {
	
	/**
	 * The MSCL WFS Service. It is used to interact with the WFS endpoint. 
	 */
	private MSCLWFSService msclWfsService;
	
	/**
	 * Initialises a new instance of MSCLController class. 
	 * @param msclWfsService
	 * 		The MSCL WFS Service that can be used by this class.
	 */
	@Autowired
	public MSCLController(MSCLWFSService msclWfsService) {
	    this.msclWfsService = msclWfsService;
	}
	
	/**
	 * 
	 * @param serviceUrl
	 * 		The URL of the WFS's endpoint. It should be of the form: http://{domain}:{port}/{path}/wfs
	 * @param featureType
	 * 		The name of the feature type you wish to request (including its prefix if necessary).
	 * @param featureId
	 * 		The ID of the feature you want to return.
	 * @return
	 * 		A ModelAndView object encapsulating the WFS response along with an indicator of success or
	 * 		failure. 
	 * @throws Exception
	 */
	@RequestMapping("/getMsclObservations.do")
	public ModelAndView getMsclObservations(
		@RequestParam("serviceUrl") final String serviceUrl,
		@RequestParam("typeName") final String featureType,
		@RequestParam("featureId") final String featureId) {

		try {
			String wfsResponse = msclWfsService.getWFSReponse(
					serviceUrl,
					featureType,
					featureId);

			// I have to wrap this response in a 'gml' JSON tag in order to keep the 
			// "Download Feature" part happy.
			ModelMap data = new ModelMap();
		    data.put("gml", wfsResponse);
		    return generateJSONResponseMAV(true, data, null);
		}
		catch (Exception e) {
			return generateJSONResponseMAV(false, null, e.getMessage());
		}        
	}
}