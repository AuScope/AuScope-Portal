package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.auscope.portal.server.domain.xml.XMLStreamAttributeExtractor;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;

@Service
public class YilgarnService {
	
	// -------------------------------------------------------------- Constants
    
    protected final Log log = LogFactory.getLog(getClass());
    
    // ----------------------------------------------------- Instance variables
    private HttpServiceCaller httpServiceCaller;
    private IWFSGetFeatureMethodMaker methodMaker;
    
    // ------------------------------------------ Attribute Setters and Getters    
    
    @Autowired
    public void setHttpServiceCaller(HttpServiceCaller httpServiceCaller) {
        this.httpServiceCaller = httpServiceCaller;
    }
    
    @Autowired
    public void setWFSGetFeatureMethodMakerPOST(IWFSGetFeatureMethodMaker iwfsGetFeatureMethodMaker) {
        this.methodMaker = iwfsGetFeatureMethodMaker;
    }
    
    
   public List<String> discoverLocSpecimenIDs(String serviceUrl, String yilgarnGeoUnitFilterString, int maxFeatures) throws Exception{
	   HttpMethodBase method = methodMaker.makeMethod(serviceUrl, "gsml:GeologicUnit", yilgarnGeoUnitFilterString, 0);
       InputStream yilgarnGeologicUnitResponse = httpServiceCaller.getMethodResponseAsStream(method,httpServiceCaller.getHttpClient());
       List<String> locSpecIDs = new ArrayList<String>();
       
     //Get our ID's       
       XMLStreamAttributeExtractor xmlStreamAttributeExtractor = new XMLStreamAttributeExtractor("gsml:GeologicUnit","gml:id",yilgarnGeologicUnitResponse);
       while(xmlStreamAttributeExtractor.hasNext()){
    	   String geologicUnitValue = xmlStreamAttributeExtractor.next();
    	   String replacedLocSpecString = geologicUnitValue.replace("geologicUnit", "locatedSpecimen");
    	   locSpecIDs.add(replacedLocSpecString);
       }      
	   return locSpecIDs;
   }


	public List<String> discoverGeologicUnitIDs(
			List<InputStream> locSpecXMLDataList, int maxFeatures) {
		List<String> geologicUnitIDs = new ArrayList<String>();
		for(int i =0; i < locSpecXMLDataList.size(); i++){
			InputStream locSpecData = locSpecXMLDataList.get(i);
			XMLStreamAttributeExtractor xmlStreamAttributeExtractor = new XMLStreamAttributeExtractor("sa:LocatedSpecimen","gml:id",locSpecData);
			while(xmlStreamAttributeExtractor.hasNext()){
		    	   String locatedSpecimenValue = xmlStreamAttributeExtractor.next();
		    	   String replacedGeoUnitString = locatedSpecimenValue.replace("locatedSpecimen", "geologicUnit");
		    	   geologicUnitIDs.add(replacedGeoUnitString);
		       }  
		}	
		
		   return geologicUnitIDs;
	}   
   

	


}
