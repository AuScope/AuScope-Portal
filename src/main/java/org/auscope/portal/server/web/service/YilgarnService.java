package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.auscope.portal.gsml.YilgarnGeochemistryFilter;
import org.auscope.portal.gsml.YilgarnNamespaceContext;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.util.Util;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;

@Service
public class YilgarnService {
	
	// -------------------------------------------------------------- Constants
    
    protected final Log log = LogFactory.getLog(getClass());
    
    // ----------------------------------------------------- Instance variables
    private HttpServiceCaller httpServiceCaller;
    private IWFSGetFeatureMethodMaker methodMaker;
    private Util util = new Util();
    
    // ------------------------------------------ Attribute Setters and Getters    
    
    @Autowired
    public void setHttpServiceCaller(HttpServiceCaller httpServiceCaller) {
        this.httpServiceCaller = httpServiceCaller;
    }
    
    @Autowired
    public void setWFSGetFeatureMethodMakerPOST(IWFSGetFeatureMethodMaker iwfsGetFeatureMethodMaker) {
        this.methodMaker = iwfsGetFeatureMethodMaker;
    }
    
    
   public List<String> discoverGeologicIDs(String serviceUrl, String locSpecFilterString, int maxFeatures) throws Exception{
	   HttpMethodBase method = methodMaker.makeMethod(serviceUrl, "sa:LocatedSpecimen", locSpecFilterString, maxFeatures);
       String yilgarnLocSpecResponse = httpServiceCaller.getMethodResponseAsString(method,httpServiceCaller.getHttpClient());
	 //Parse response
	   List<String> geologicUnitIDs = new ArrayList<String>();
       Document doc = util.buildDomFromString(yilgarnLocSpecResponse);
       XPath xPath = XPathFactory.newInstance().newXPath();
       xPath.setNamespaceContext(new YilgarnNamespaceContext());
       
     //Get our ID's
       NodeList locSpecimenNodeList = (NodeList)xPath.evaluate("/wfs:FeatureCollection/gml:featureMembers/sa:LocatedSpecimen", doc, XPathConstants.NODESET);
       
       for (int i = 0; i < locSpecimenNodeList.getLength(); i++){
    	   Node locSpecimenNode = (Node)xPath.evaluate("@gml:id", locSpecimenNodeList.item(i), XPathConstants.NODE);
    	   if (locSpecimenNode != null) {
    		   String locSpecimenValue = locSpecimenNode.getTextContent();
    		   String replacedGeologicString = locSpecimenValue.replace("locatedSpecimen", "geologicUnit");
    		   geologicUnitIDs.add(replacedGeologicString);
           }
       }
	   return geologicUnitIDs;
   }

	public HttpMethodBase getGeologicUnitData(String serviceUrl,
			String geologicName, FilterBoundingBox bbox, int maxFeatures,
			List<String> geologicUnitIds) throws Exception {
		
		String filterString;
        YilgarnGeochemistryFilter yilgarnGeochemistryFilter = new YilgarnGeochemistryFilter(geologicName, geologicUnitIds);
        if (bbox == null) {
        	filterString = yilgarnGeochemistryFilter.getFilterString();
        } else {
        	filterString = yilgarnGeochemistryFilter.getFilterString(bbox);
        }
        HttpMethodBase method = methodMaker.makeMethod(serviceUrl, "gsml:GeologicUnit", filterString, maxFeatures);
        
		return method;
	}   
   

	


}
