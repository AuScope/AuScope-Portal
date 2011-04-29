package org.auscope.portal.server.web.controllers;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.gsml.YilgarnGeochemistryFilter;
import org.auscope.portal.gsml.YilgarnLocSpecimenFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.domain.filter.IFilter;
import org.auscope.portal.server.util.GmlToKml;
import org.auscope.portal.server.web.DistributedHTTPServiceCaller;
import org.auscope.portal.server.web.ErrorMessages;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.auscope.portal.server.web.service.DistributedWFSIDFilterService;
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
	private DistributedWFSIDFilterService distributedWFSIDFilterService;
	private IFilter filter;
	private IWFSGetFeatureMethodMaker methodMaker;
    
    @Autowired
    public YilgarnGeologicUnitController(HttpServiceCaller httpServiceCaller,
                          GmlToKml gmlToKml,
                          YilgarnService yilgarnService,
                          DistributedWFSIDFilterService distributedWFSIDFilterService,
                          IFilter filter,
                          IWFSGetFeatureMethodMaker methodMaker
                          ) {
        this.httpServiceCaller = httpServiceCaller;
        this.gmlToKml = gmlToKml;
        this.yilgarnService = yilgarnService;
        this.distributedWFSIDFilterService = distributedWFSIDFilterService;
        this.filter = filter;
        this.methodMaker = methodMaker;
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
        List<String> locatedSpecimenIds = null;
        List<InputStream> locSpecXMLDataList = new ArrayList<InputStream>();
        DistributedHTTPServiceCaller methodIterator = null;
        List<String> finalGeologicUnitIds = null;
        
		String yilgarnGeoUnitFilterString;
		try{
			YilgarnGeochemistryFilter yilgarnGeochemistryFilter = new YilgarnGeochemistryFilter(geologicName);
            if (bbox == null) {
            	yilgarnGeoUnitFilterString = yilgarnGeochemistryFilter.getFilterString();
            } else {
            	yilgarnGeoUnitFilterString = yilgarnGeochemistryFilter.getFilterString(bbox);
            }
            
            //locatedSpecimen IDs to query for analytes now
			locatedSpecimenIds = this.yilgarnService.discoverLocSpecimenIDs(serviceUrl,yilgarnGeoUnitFilterString,maxFeatures);
        }catch (Exception e){
			log.warn("Error requesting list of Located Specimen ID's", e);
            return makeModelAndViewFailure("Failure when identifying which geologic units have requested data.", null);
		}
	    if(analyteNameFilter != null && analyteNameFilter!= ""){
			if (locatedSpecimenIds.size() == 0) {
	            log.warn("No data for the selected Geologic Unit Name exists (or the services are missing)");
	            return makeModelAndViewFailure("Unable to identify any data with selected geologic units.", null);
	        }
			try{
				YilgarnLocSpecimenFilter yilgarnLocSpecFilter = new YilgarnLocSpecimenFilter(analyteNameFilter);		
				methodIterator = (DistributedHTTPServiceCaller) distributedWFSIDFilterService.makeIDFilterRequest(serviceUrl, "sa:LocatedSpecimen", yilgarnLocSpecFilter, maxFeatures, null, locatedSpecimenIds);
				while (methodIterator.hasNext()){
					locSpecXMLDataList.add(methodIterator.next());					
					// we will go for markers equal to maxFeatures to increase the speed as finally we need 200 records only.
					if(maxFeatures > 0){
						List<String> geologicUnitIds = this.yilgarnService.discoverGeologicUnitIDs(locSpecXMLDataList, maxFeatures);
						if(geologicUnitIds.size() >= maxFeatures){
							methodIterator.dispose();
							break;
						}
					}
					
				}
				finalGeologicUnitIds = this.yilgarnService.discoverGeologicUnitIDs(locSpecXMLDataList, maxFeatures);
			}catch (Exception e){
				log.warn("Error requesting locatedSpecimen Data", e);
	            return makeModelAndViewFailure("Failure when getting data related to analytes filter.", null);
			}
			if (finalGeologicUnitIds.size() == 0) {
	            log.warn("No data for the selected Analyte Name exists (or the services are missing)");
	            return makeModelAndViewFailure("Unable to identify any data with selected analytes.", null);
	        }
	        log.info("locatedSpecimenIds : " + locatedSpecimenIds.size());
	        log.info("finalGeologicUnitIds : " + finalGeologicUnitIds.size());
	        log.info("locSpecXMLDataList : " + locSpecXMLDataList.size());
	        //finally get the IDs list equal to maxFeatures and use it to put markers on the portal with Geologic Unit
			HttpMethodBase method = null;
	        try{
	        	String filterString = filter.getFilterString(bbox, finalGeologicUnitIds);
	        	method = methodMaker.makeMethod(serviceUrl, "gsml:GeologicUnit", filterString, maxFeatures);
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
        }else{
        	HttpMethodBase method = null;
        	try{
        		method = methodMaker.makeMethod(serviceUrl, "gsml:GeologicUnit", yilgarnGeoUnitFilterString, maxFeatures);
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
	

}
