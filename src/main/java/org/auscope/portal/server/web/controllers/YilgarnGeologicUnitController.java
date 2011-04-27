package org.auscope.portal.server.web.controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.gsml.GSMLResponseHandler;
import org.auscope.portal.gsml.YilgarnGeochemistryFilter;
import org.auscope.portal.gsml.YilgarnLocSpecimenFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.domain.filter.IFilter;
import org.auscope.portal.server.util.GmlToKml;
import org.auscope.portal.server.web.ErrorMessages;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.auscope.portal.server.web.service.HttpServiceCaller;
import org.auscope.portal.server.web.service.YilgarnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class YilgarnGeologicUnitController extends BaseWFSToKMLController {
	
	private YilgarnService yilgarnService;
    
    @Autowired
    public YilgarnGeologicUnitController(HttpServiceCaller httpServiceCaller,
                          GmlToKml gmlToKml,
                          YilgarnService yilgarnService
                          ) {
        this.httpServiceCaller = httpServiceCaller;
        this.gmlToKml = gmlToKml;
        this.yilgarnService = yilgarnService;
    }
    
    /**
     * It queries for located Specimen filter first and then on that data it queries for Geologic Unit
     *
      * @param serviceUrl the url of the service to query
     * @param geologicName   the name of the geologic Units to query for
     * @param analyteNameFilter the name of analyte in located specimen
     * @param request    the HTTP client request
     * @return a WFS response converted into KML
     * @throws Exception
     */    
    @RequestMapping("/doYilgarnGeochemistry.do")
    public ModelAndView doYilgarnGeochemistryFilter(
    		@RequestParam(required=false,	value="serviceUrl") String serviceUrl,
    		@RequestParam(required=false,	value="geologicName") String geologicName,
    		@RequestParam(required=false,	value="analyteNameFilter") String analyteNameFilter,
    		@RequestParam(required=false, value="bbox") String bboxJson,
            @RequestParam(required=false, value="maxFeatures", defaultValue="0") int maxFeatures,
            HttpServletRequest request) throws Exception  {

        
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        List<String> geologicUnitIds = null;
		
		if(analyteNameFilter != null && analyteNameFilter!= ""){
			String locSpecFilterString;
			try{
				YilgarnLocSpecimenFilter yilgarnLocSpecFilter = new YilgarnLocSpecimenFilter(analyteNameFilter);				
				locSpecFilterString = yilgarnLocSpecFilter.getFilterString();
				geologicUnitIds = this.yilgarnService.discoverGeologicIDs(serviceUrl,locSpecFilterString,maxFeatures);
			}catch (Exception e){
				log.warn("Error requesting list of geologic Unit ID's", e);
                return makeModelAndViewFailure("Failure when identifying which geologic units have requested analytes.", null);
			}
			if (geologicUnitIds.size() == 0) {
                log.warn("No data for the selected analyte exists (or the services are missing)");
                return makeModelAndViewFailure("Unable to identify any data with selected analyte.", null);
            }
			
		}
		
		HttpMethodBase method = null;
        try{
	        method = this.yilgarnService.getGeologicUnitData(serviceUrl, geologicName, bbox, maxFeatures, geologicUnitIds);
	        String yilgarnGeochemResponse = httpServiceCaller.getMethodResponseAsString(method,httpServiceCaller.getHttpClient());
	        
	        String kmlBlob =  convertToKml(yilgarnGeochemResponse, request, serviceUrl);
	        
	        if (kmlBlob == null || kmlBlob.length() == 0) {
	        	log.error(String.format("Transform failed serviceUrl='%1$s' gmlBlob='%2$s'",serviceUrl, yilgarnGeochemResponse));
            	return makeModelAndViewFailure(ErrorMessages.OPERATION_FAILED ,method);
            } else {
            	return makeModelAndViewKML(kmlBlob, yilgarnGeochemResponse, method);
            }
	        
        } catch (Exception e) {
            return this.handleExceptionResponse(e, serviceUrl, method);
        }
		
     
    }	
	

}
