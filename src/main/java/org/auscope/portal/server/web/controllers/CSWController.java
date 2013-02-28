package org.auscope.portal.server.web.controllers;

import java.util.List;

import org.auscope.portal.core.server.controllers.BaseCSWController;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.CSWService;
import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.auscope.portal.core.services.methodmakers.filter.csw.CSWGetDataRecordsFilter;
import org.auscope.portal.core.services.responses.csw.CSWGetRecordResponse;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.view.ViewCSWRecordFactory;
import org.auscope.portal.core.view.ViewKnownLayerFactory;
import org.joda.time.DateTime;
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
     * 
     * @param dateString in format: 28/02/2013
     * @return
     */
    private DateTime stringToDateTime(String dateString) {
        String[] date = dateString.split("/");
        
        return new DateTime(
                Integer.parseInt(date[2]),
                Integer.parseInt(date[1]),
                Integer.parseInt(date[0]),
                0,0,0,0);
    }
    
    /**
     * Requests CSW records from the cswServiceUrl provided.
     * The results will be filtered by the CQL Text and the filter options.
     * Records will be returned from the starting point (where 1 is the first record, not 0)
     * and the number of records retrieved will not exceed maxRecords.
     * 
     * @param cswServiceUrl
     * @param recordInfoUrl
     * @param cqlText
     * @param startPoint
     * @param maxRecords
     * @param anyText
     * @param title
     * @param abstract_
     * @param metadataDateFrom
     * @param metadataDateTo
     * @param temporalExtentFrom
     * @param temporalExtentTo
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
            String recordInfoUrl,
            String cqlText,
            int startPoint,
            int maxRecords,
            //String bbox,
            String anyText,
            String title,
            String abstract_,
            String metadataDateFrom,
            String metadataDateTo,
            String temporalExtentFrom,
            String temporalExtentTo) {
        CSWServiceItem endpoint = new CSWServiceItem(
                "", // This ID won't actually be used so we can just leave it blank. 
                cswServiceUrl, 
                recordInfoUrl);
        endpoint.setCqlText(cqlText);

        CSWService cswService = new CSWService(
                endpoint,
                this.serviceCaller,
                false);

        try {
            //FilterBoundingBox spatialBounds = FilterBoundingBox.attemptParseFromJSON(bbox);
              
            CSWGetDataRecordsFilter filter = new CSWGetDataRecordsFilter(
                    anyText,
                    null//spatialBounds
                    ); 
            
            filter.setTitle(title);
            filter.setAbstract(abstract_);
            
            if (!metadataDateFrom.isEmpty() && !metadataDateTo.isEmpty()) {
                filter.setMetadataChangeDate(
                        stringToDateTime(metadataDateFrom), 
                        stringToDateTime(metadataDateTo));
            }
            
            if (!temporalExtentFrom.isEmpty() && !temporalExtentTo.isEmpty()) {
                filter.setTemporalExtent(
                        stringToDateTime(temporalExtentFrom), 
                        stringToDateTime(temporalExtentTo));
            }
            
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