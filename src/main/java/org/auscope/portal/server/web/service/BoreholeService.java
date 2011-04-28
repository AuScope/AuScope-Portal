package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.csw.CSWOnlineResource;
import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.csw.CSWOnlineResource.OnlineResourceType;
import org.auscope.portal.mineraloccurrence.BoreholeFilter;
import org.auscope.portal.nvcl.NVCLNamespaceContext;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.domain.xml.XMLStreamAttributeExtractor;
import org.auscope.portal.server.util.Util;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 * A utility class which provides methods for querying borehole service
 * 
 * @author Jarek Sanders
 * @version $Id$
 *
 */
@Service
public class BoreholeService {

    // -------------------------------------------------------------- Constants
    
    protected final Log log = LogFactory.getLog(getClass());
    
    // ----------------------------------------------------- Instance variables
    private HttpServiceCaller httpServiceCaller;
    private IWFSGetFeatureMethodMaker methodMaker;
    private Util util = new Util();

    // ----------------------------------------------------------- Constructors
    
    // ------------------------------------------ Attribute Setters and Getters    
    
    @Autowired
    public void setHttpServiceCaller(HttpServiceCaller httpServiceCaller) {
        this.httpServiceCaller = httpServiceCaller;
    }
    
    @Autowired
    public void setWFSGetFeatureMethodMakerPOST(IWFSGetFeatureMethodMaker iwfsGetFeatureMethodMaker) {
        this.methodMaker = iwfsGetFeatureMethodMaker;
    }

    
    // --------------------------------------------------------- Public Methods    
    
    
    
    /**
     * Get all boreholes from a given service url and return the response
     * @param serviceURL
     * @param bbox Set to the bounding box in which to fetch results, otherwise set it to null
     * @param restrictToIDList [Optional] A list of gml:id values that the resulting filter should restrict its search space to
     * @return
     * @throws Exception
     */
    public HttpMethodBase getAllBoreholes(String serviceURL, String boreholeName, String custodian, String dateOfDrilling, int maxFeatures, FilterBoundingBox bbox, List<String> restrictToIDList) throws Exception {
        String filterString;
        BoreholeFilter nvclFilter = new BoreholeFilter(boreholeName, custodian, dateOfDrilling);
        if (bbox == null) {
            filterString = nvclFilter.getFilterString();
        } else {
            filterString = nvclFilter.getFilterString(bbox, restrictToIDList);
        }
        
        // Create a GetFeature request with an empty filter - get all
        HttpMethodBase method = methodMaker.makeMethod(serviceURL, "gsml:Borehole", filterString, maxFeatures);
        // Call the service, and get all the boreholes
        //return httpServiceCaller.getMethodResponseAsString(method, httpServiceCaller.getHttpClient());
        return method;
    }
    
    
    private void appendHyloggerBoreholeIDs(String url, String typeName, List<String> idList) throws Exception {
        //Make request
        HttpMethodBase method = methodMaker.makeMethod(url, typeName, "", 0);
        InputStream wfsResponse = httpServiceCaller.getMethodResponseAsStream(method, httpServiceCaller.getHttpClient());
        
        //Parse using a simplistic attribute extractor to avoid loading the entire response as a DOM object
        XMLStreamAttributeExtractor attrExtractor = new XMLStreamAttributeExtractor("nvcl:scannedBorehole", "xlink:href", wfsResponse);
        while (attrExtractor.hasNext()) {
        	idList.add(attrExtractor.next());
        }
    }
    
    /**
     * Goes to the CSWService to get all services that support the PUBLISHED_DATASETS_TYPENAME and queries them
     * to generate a list of borehole ID's that represent every borehole with Hylogger data.
     * 
     * @param cswService Will be used to find the appropriate service to query
     */
    public List<String> discoverHyloggerBoreholeIDs(CSWService cswService) throws Exception {
        List<String> ids = new ArrayList<String>();
        
        for (CSWRecord record : cswService.getWFSRecords()) {
            for (CSWOnlineResource resource : record.getOnlineResourcesByType(OnlineResourceType.WFS)) {
                if (resource.getName().equals(NVCLNamespaceContext.PUBLISHED_DATASETS_TYPENAME)) {
                    appendHyloggerBoreholeIDs(resource.getLinkage().toString(), resource.getName(), ids);
                }
            }
        }
        
        return ids;
    }
}
