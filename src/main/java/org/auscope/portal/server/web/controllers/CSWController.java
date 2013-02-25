package org.auscope.portal.server.web.controllers;

import java.util.List;

import net.sf.json.JSON;
import net.sf.json.JSONObject;

import org.auscope.portal.core.server.controllers.BaseCSWController;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.CSWService;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.csw.CSWGetDataRecordsFilter;
import org.auscope.portal.core.services.responses.csw.CSWGetRecordResponse;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.view.ViewCSWRecordFactory;
import org.auscope.portal.core.view.ViewKnownLayerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CSWController extends BaseCSWController {

    private HttpServiceCaller serviceCaller;
    
    @Autowired
    public CSWController(
            HttpServiceCaller serviceCaller,
            ViewCSWRecordFactory viewCSWRecordFactory,
            ViewKnownLayerFactory viewKnownLayerFactory) {
        super(viewCSWRecordFactory, viewKnownLayerFactory);
        this.serviceCaller = serviceCaller;
    }

    /**
     * Requests CSW records from the cswServiceUrl provided.
     * The results will be filtered by the CQL Text and the filter options.
     * Records will be returned from the starting point (where 1 is the first record, not 0)
     * and the number of records retrieved will not exceed maxRecords.
     * 
     * @param cswServiceUrl
     * @param cqlText
     * // TODO: add filter options.
     * @param startPoint
     * @param maxRecords
     * @return
     * Example:
     * "data":[portal.csw.CSWRecord], // These are anonymous objects, you can use them as the config for portal.csw.CSWRecord.
     * "msg":"No errors",
     * "totalResults":18, // This is not the number of results returned, it is the number of results the query matched.
     * "success":true
     */
    @RequestMapping("/getUncachedCSWRecords.do")
    public ModelAndView getUncachedCSWRecords(
            String cswServiceUrl,
            String cqlText,
            int startPoint,
            int maxRecords,
            String bbox,
            String anyText,
            String title,
            String abstract_            
            ) {
        CSWServiceItem endpoint = new CSWServiceItem(
                "", // This ID won't actually be used so we can just leave it blank. 
                cswServiceUrl);
        endpoint.setCqlText(cqlText);

        CSWService cswService = new CSWService(
                endpoint,
                this.serviceCaller,
                false);

        try {
            FilterBoundingBox spatialBounds = FilterBoundingBox.attemptParseFromJSON(bbox);
            
            // TODO: REMOVE
            System.out.println(spatialBounds);
            System.out.println(bbox);
            
            CSWGetDataRecordsFilter filter = new CSWGetDataRecordsFilter(
                    anyText,
                    spatialBounds); 
            
            filter.setTitle(title);
            filter.setAbstract(abstract_);
            
            CSWGetRecordResponse response = cswService.queryCSWEndpoint(
                    startPoint, 
                    maxRecords,
                    filter);
            
            List<CSWRecord> records = response.getRecords();
            
            return generateJSONResponseMAV(
                    records.toArray(new CSWRecord[records.size()]),
                    response.getRecordsMatched());
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return generateJSONResponseMAV(false);
    }
}