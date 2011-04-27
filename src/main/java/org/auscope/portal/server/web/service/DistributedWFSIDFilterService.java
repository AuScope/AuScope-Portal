package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.domain.filter.IFilter;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * A service class for making a normal WFS request that is constrained
 * by an additional list of gml:id's. 
 * 
 * The service will contain a number of optimisations to minimise load/query
 * times at the WFS (It will generate a series of requests
 * 
 * TODO - internal requests are fired sequentially - they could probably be fired in batches simultaneously.
 * TODO - the return type for these functions give very little information about HTTP errors
 * TODO - instead of returning a list - return a blocking iterator so that processing can occur whilst requests return.
 * 
 * @author Josh Vote
 *
 */
@Service
public class DistributedWFSIDFilterService {
	
	/**
	 * The maximum number of ID's that will be filtered in a single WFS request (anything larger than this will be broken down)
	 */
	public static final int MAXIMUM_IDS_PER_REQUEST = 50;
	
	private HttpServiceCaller httpServiceCaller;
    private IWFSGetFeatureMethodMaker methodMaker;
    
    @Autowired
    public DistributedWFSIDFilterService(HttpServiceCaller httpServiceCaller, IWFSGetFeatureMethodMaker methodMaker) {
    	this.httpServiceCaller = httpServiceCaller;
    	this.methodMaker = methodMaker;
    }
    
    /**
     * Creates a series of WFS requests using the specified parameters. The response from each WFS request will be returned
     * as a list of Strings
     * 
     * @param serviceURL The remote URL of the WFS
     * @param featureType The name of the WFS feature type to query 
     * @param maxFeatures Set to non zero to specify a cap on the number of features to fetch
     * @return
     * @throws Exception
     */
    public List<InputStream> makeIDFilterRequest(String serviceURL, String featureType, int maxFeatures) throws Exception {
        return makeIDFilterRequest(serviceURL, featureType, null, maxFeatures, null, null, null);
    }
    
    /**
     * Creates a series of WFS requests using the specified parameters. The response from each WFS request will be returned
     * as a list of Strings
     * 
     * @param serviceURL The remote URL of the WFS
     * @param featureType The name of the WFS feature type to query
     * @param filter (Optional) The filter that will be used to constrain the WFS request
     * @param bbox (Optional) The bounding box used to constrain this WFS request 
     * @param maxFeatures Set to non zero to specify a cap on the number of features to fetch
     * @param restrictedIDList (Optional) Set to the list of ID's that will constrain any filtering  
     * @return
     * @throws Exception
     */
    public List<InputStream> makeIDFilterRequest(String serviceURL, String featureType, IFilter filter, int maxFeatures, FilterBoundingBox bbox, List<String> restrictedIDList) throws Exception {
        return makeIDFilterRequest(serviceURL, featureType, filter, maxFeatures, bbox, restrictedIDList, null);
    }
    
    /**
     * Creates a series of WFS requests using the specified parameters. The response from each WFS request will be returned
     * as a list of Strings
     * 
     * @param serviceURL The remote URL of the WFS
     * @param featureType The name of the WFS feature type to query
     * @param filter (Optional) The filter that will be used to constrain the WFS request
     * @param bbox (Optional) The bounding box used to constrain this WFS request 
     * @param maxFeatures Set to non zero to specify a cap on the number of features to fetch
     * @param restrictedIDList (Optional) Set to the list of ID's that will constrain any filtering  
     * @param srsName (Optional) The spatial reference system to request data in
     * @return
     * @throws Exception if service URL or featureType is not provided
     */
    public List<InputStream> makeIDFilterRequest(String serviceURL, String featureType, IFilter filter, int maxFeatures, FilterBoundingBox bbox, List<String> restrictedIDList, String srsName) throws Exception {
    	List<InputStream> resultingData = new ArrayList<InputStream>();
    	
    	//We may need to split our WFS request into multiple requests
    	if (filter != null && restrictedIDList != null && restrictedIDList.size() > 0) {
    		int numRequests = (restrictedIDList.size() / MAXIMUM_IDS_PER_REQUEST) + 1;
    		
    		for (int i = 0; i < numRequests; i++) {
    			int subsetStart = i * MAXIMUM_IDS_PER_REQUEST;
    			int subsetEnd = subsetStart + MAXIMUM_IDS_PER_REQUEST;
    			if (subsetEnd > restrictedIDList.size()) {
    				subsetEnd = restrictedIDList.size();
    			}
    			
    			//Generate our filter for this set of ID's
    			String filterString = filter.getFilterString(bbox, restrictedIDList.subList(subsetStart, subsetEnd));
    			
    			//Generate our HTTP method and make the request
    			HttpMethodBase method = methodMaker.makeMethod(serviceURL, featureType, filterString, maxFeatures, srsName);
    			resultingData.add(httpServiceCaller.getMethodResponseAsStream(method, httpServiceCaller.getHttpClient()));
    		}
    	} else {
    		//Otherwise we can just make a plain old single WFS request
    		String filterString = null;
    		if (filter != null) {
    			filterString = filter.getFilterString(bbox, restrictedIDList);
    		}
			
			//Generate our HTTP method and make the request
			HttpMethodBase method = methodMaker.makeMethod(serviceURL, featureType, filterString, maxFeatures, srsName);
			resultingData.add(httpServiceCaller.getMethodResponseAsStream(method, httpServiceCaller.getHttpClient()));
    	}
    	
    	return resultingData;
    }
}
