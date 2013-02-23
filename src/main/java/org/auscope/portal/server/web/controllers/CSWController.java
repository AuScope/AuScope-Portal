package org.auscope.portal.server.web.controllers;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.server.controllers.BaseCSWController;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.CSWService;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.auscope.portal.core.services.methodmakers.CSWMethodMakerGetDataRecords;
import org.auscope.portal.core.services.methodmakers.CSWMethodMakerGetDataRecords.ResultType;
import org.auscope.portal.core.services.responses.csw.CSWGetRecordResponse;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.services.responses.ows.OWSExceptionParser;
import org.auscope.portal.core.util.DOMUtil;
import org.auscope.portal.core.view.ViewCSWRecordFactory;
import org.auscope.portal.core.view.ViewKnownLayerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;

@Controller
public class CSWController extends BaseCSWController {

    private HttpServiceCaller serviceCaller;
    private CSWCacheService cswCacheService;
    
    @Autowired
    public CSWController(
            HttpServiceCaller serviceCaller,
            ViewCSWRecordFactory viewCSWRecordFactory,
            ViewKnownLayerFactory viewKnownLayerFactory,
            CSWCacheService cswCacheService) {
        super(viewCSWRecordFactory, viewKnownLayerFactory);
        this.serviceCaller = serviceCaller;
        this.cswCacheService = cswCacheService;
    }
    
    @RequestMapping("/getCSWRecordsNoCache.do")
    public ModelAndView getCSWRecordsNoCache(
            String id,
            String cswServiceUrl,
            String cqlText,
            int startPoint,
            int maxRecords) {
        System.out.println(cswCacheService.toString());
        
        List<CSWRecord> records = null;
        
        CSWServiceItem endpoint = new CSWServiceItem(
                id,
                cswServiceUrl);
        endpoint.setCqlText(cqlText);
        
        CSWService cswService = new CSWService(
                endpoint,
                this.serviceCaller,
                false);

        try {
            CSWGetRecordResponse response = cswService.queryCSWEndpoint(1, 1);
            
            System.out.println(response.getRecordsMatched());
            
            records = response.getRecords();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
//        CSWServiceClient cswServiceClient = 
//                new CSWServiceClient(
//                        /*CSWServiceItem*/);
//        
        
//        CSWServiceItem endpoint = new CSWServiceItem(
//                /* TODO: ADAM: I DON'T KNOW WHAT ID SHOULD BE? */"",
//                cswServiceUrl);
//        
////        endpoint.setCqlText(cqlText);
//        
//        
//        CSWMethodMakerGetDataRecords methodMaker = new CSWMethodMakerGetDataRecords();
//        try {
//            HttpMethodBase method = methodMaker.makeMethod(
//                    endpoint.getServiceUrl(), 
//                    null, 
//                    ResultType.Results, 
//                    /*MAX_QUERY_LENGTH*/ 10, 
//                    1,
//                    endpoint.getCqlText());
//            
//            InputStream responseStream = serviceCaller.getMethodResponseAsStream(method);
//            Document responseDocument = DOMUtil.buildDomFromStream(responseStream);
//            OWSExceptionParser.checkForExceptionResponse(responseDocument);
//            CSWGetRecordResponse response = new CSWGetRecordResponse(endpoint, responseDocument);
//            
//            records = response.getRecords();
//        } catch (UnsupportedEncodingException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        } catch (Exception e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
        
        return generateJSONResponseMAV(records.toArray(new CSWRecord[records.size()]));
    }
}