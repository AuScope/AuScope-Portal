package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.auscope.portal.core.server.controllers.BaseCSWController;
import org.auscope.portal.core.services.CSWFilterService;
import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.csw.CSWGetDataRecordsFilter;
import org.auscope.portal.core.services.methodmakers.filter.csw.CSWGetDataRecordsFilter.KeywordMatchType;
import org.auscope.portal.core.services.responses.csw.CSWGetRecordResponse;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.view.ViewCSWRecordFactory;
import org.auscope.portal.core.view.ViewKnownLayerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * A controller class for marshalling access to the underling CSWFilterService
 * @author Josh Vote
 */
@Controller
public class CSWFilterController extends BaseCSWController {
    public static final int DEFAULT_MAX_RECORDS = 100;
    private CSWFilterService cswFilterService;

    /**
     * Creates a new CSWFilterController with the specified dependencies.
     * @param cswFilterService Used to make filtered CSW requests
     * @param viewCSWRecordFactory Used to transform CSWRecords for the view
     */
    @Autowired
    public CSWFilterController(CSWFilterService cswFilterService,
            ViewCSWRecordFactory viewCSWRecordFactory,
            ViewKnownLayerFactory viewKnownLayerFactory) {
        super(viewCSWRecordFactory, viewKnownLayerFactory);
        this.cswFilterService = cswFilterService;
    }

    /**
     * Attempts to parse a FilterBoundingBox from the given coords (if they exist). Returns null on failure
     * @return
     */
    private FilterBoundingBox attemptParseBBox(Double westBoundLongitude, Double eastBoundLongitude,
            Double northBoundLatitude, Double southBoundLatitude) {
        FilterBoundingBox filterBbox = null;
        if (westBoundLongitude != null && eastBoundLongitude != null &&
                northBoundLatitude != null && southBoundLatitude != null) {
            filterBbox = new FilterBoundingBox("",
                        new double[] {eastBoundLongitude, southBoundLatitude},
                        new double[] {westBoundLongitude, northBoundLatitude});
        }

        return filterBbox;
    }

    /**
     * Gets a list of CSWServiceItem objects that the portal is using for sources of CSWRecords.
     * @return
     */
    @RequestMapping("/getCSWServices.do")
    public ModelAndView getCSWServices() {
        List<ModelMap> convertedServiceItems = new ArrayList<ModelMap>();

        //Simplify our service items for the view
        for (CSWServiceItem item : this.cswFilterService.getCSWServiceItems()) {
            ModelMap map = new ModelMap();

            map.put("title", item.getTitle());
            map.put("id", item.getId());
            map.put("url", item.getServiceUrl());

            if(item.getId().toLowerCase().contains("auscope")){
                map.put("selectedByDefault", true);
            }
            convertedServiceItems.add(map);
        }

        return generateJSONResponseMAV(true, convertedServiceItems, "");
    }

//    @RequestParam(value = "cswServiceId", required = false) String cswServiceId,
//    @RequestParam(value = "anyText", required = false) String anyText,
//    @RequestParam(value = "westBoundLongitude", required = false) Double westBoundLongitude,
//    @RequestParam(value = "eastBoundLongitude", required = false) Double eastBoundLongitude,
//    @RequestParam(value = "northBoundLatitude", required = false) Double northBoundLatitude,
//    @RequestParam(value = "southBoundLatitude", required = false) Double southBoundLatitude,
//    @RequestParam(value = "keyword", required = false) String[] keywords,
//    @RequestParam(value = "keywordMatchType", required = false) KeywordMatchType keywordMatchType,
//    @RequestParam(value = "capturePlatform", required = false) String capturePlatform,
//    @RequestParam(value = "sensor", required = false) String sensor,
//    @RequestParam(value = "limit", required = false) Integer maxRecords,
//    @RequestParam(value = "start", required = false, defaultValue = "1") Integer startPosition)

    /**
     * Gets a list of CSWRecord view objects filtered by the specified values from all internal
     * CSW's
     * @param cswServiceId [Optional] The ID of a CSWService to query (if omitted ALL CSWServices will be queried)
     * @param westBoundLongitude [Optional] Spatial bbox constraint
     * @param eastBoundLongitude [Optional] Spatial bbox constraint
     * @param northBoundLatitude [Optional] Spatial bbox constraint
     * @param southBoundLatitude [Optional] Spatial bbox constraint
     * @param keywords [Optional] One or more keywords to filter by
     * @param keywordMatchType [Optional] how the keyword list will be matched against records
     * @param capturePlatform [Optional]  A capture platform filter
     * @param sensor [Optional] A sensor filter
     * @param startPosition [Optional] 0 based index indicating what index to start reading records from (only applicable if cswServiceId is specified)
     * @return
     */
    @RequestMapping("/getFilteredCSWRecords.do")
    public ModelAndView getFilteredCSWRecords(
            @RequestParam(value="key", required=false) String[] keys,
            @RequestParam(value="value", required=false) String[] values,
            @RequestParam(value = "limit", required = false) Integer maxRecords,
            @RequestParam(value = "start", required = false, defaultValue = "1") Integer startPosition){

        HashMap<String,String> parameters=this.arrayPairtoMap(keys, values);

        //csw index starts from 1
        if(startPosition!=null){
            startPosition++;
        }

        String cswServiceId = parameters.get("cswServiceId");
        String anyText = parameters.get("anyText");
        Double westBoundLongitude = null;
        Double eastBoundLongitude = null;
        Double northBoundLatitude = null;
        Double southBoundLatitude = null;

        if(parameters.get("west")!=null && parameters.get("west").length() > 0){
             westBoundLongitude = Double.parseDouble(parameters.get("west"));
        }
        if(parameters.get("east")!=null && parameters.get("east").length() > 0){
            eastBoundLongitude = Double.parseDouble(parameters.get("east"));
        }
        if(parameters.get("north")!=null && parameters.get("north").length() > 0){
            northBoundLatitude = Double.parseDouble(parameters.get("north"));
        }
        if(parameters.get("south")!=null && parameters.get("south").length() > 0){
            southBoundLatitude = Double.parseDouble(parameters.get("south"));
        }

        String [] keywords=null;
        if(parameters.get("keywords")!=null){
            keywords = parameters.get("keywords").split(",");
        }
        KeywordMatchType keywordMatchType = null;
        String capturePlatform = parameters.get("capturePlatform");
        String sensor = parameters.get("sensor");
        String abstrac=parameters.get("abstract");
        String title=parameters.get("title");


        if( parameters.get("keywordMatchType")!=null){
            if(parameters.get("keywordMatchType").toLowerCase().equals("any")){
                keywordMatchType = KeywordMatchType.Any;
            }else{
                keywordMatchType = KeywordMatchType.All;
            }
        }


        //Firstly generate our filter
        FilterBoundingBox filterBbox = attemptParseBBox(westBoundLongitude, eastBoundLongitude,
                northBoundLatitude, southBoundLatitude);
        CSWGetDataRecordsFilter filter = new CSWGetDataRecordsFilter(anyText, filterBbox, keywords, capturePlatform, sensor, keywordMatchType,abstrac,title);
        log.debug(String.format("filter '%1$s'", filter));

        //Then make our requests to all of CSW's
        List<CSWRecord> records = null;
        int matchedResults = 0;
        try {
            //We may be requesting from all CSW's or just a specific one
            if (cswServiceId == null || cswServiceId.isEmpty()) {
                records = new ArrayList<CSWRecord>();
                CSWGetRecordResponse[] responses = cswFilterService.getFilteredRecords(filter, maxRecords == null ? DEFAULT_MAX_RECORDS : maxRecords);
                for (CSWGetRecordResponse response : responses) {
                    records.addAll(response.getRecords());
                    matchedResults += response.getRecordsMatched();
                }
            } else {
                CSWGetRecordResponse response = cswFilterService.getFilteredRecords(cswServiceId, filter, maxRecords == null ? DEFAULT_MAX_RECORDS : maxRecords, startPosition);
                records = response.getRecords();
                matchedResults = response.getRecordsMatched();
            }

            return generateJSONResponseMAV(records.toArray(new CSWRecord[records.size()]), matchedResults);
        } catch (Exception ex) {
            log.warn(String.format("Error fetching filtered records for filter '%1$s'", filter), ex);
            return generateJSONResponseMAV(false, null, "Error fetching filtered records");
        }
    }


    private HashMap<String,String> arrayPairtoMap(String[]keys, String [] values){
        HashMap<String,String> results=new HashMap<String,String>();
        if(keys==null){
            return results;
        }
        for(int i=0;i<keys.length;i++){
            results.put(keys[i], values[i]);
        }
        return results;
    }

    /**
     * Gets a list of CSWRecord view objects filtered by the specified values from all internal
     * CSW's
     * @param cswServiceId [Optional] The ID of a CSWService to query (if omitted ALL CSWServices will be queried)
     * @param westBoundLongitude [Optional] Spatial bbox constraint
     * @param eastBoundLongitude [Optional] Spatial bbox constraint
     * @param northBoundLatitude [Optional] Spatial bbox constraint
     * @param southBoundLatitude [Optional] Spatial bbox constraint
     * @param keywords [Optional] One or more keywords to filter by
     * @param keywordMatchType [Optional] how the keyword list will be matched against records
     * @param capturePlatform [Optional]  A capture platform filter
     * @param sensor [Optional] A sensor filter
     * @return
     */
    @RequestMapping("/getFilteredCSWRecordsCount.do")
    public ModelAndView getFilteredCSWRecordsCount(
            @RequestParam(value = "cswServiceId", required = true) String cswServiceId,
            @RequestParam(value = "anyText", required = false) String anyText,
            @RequestParam(value = "westBoundLongitude", required = false) Double westBoundLongitude,
            @RequestParam(value = "eastBoundLongitude", required = false) Double eastBoundLongitude,
            @RequestParam(value = "northBoundLatitude", required = false) Double northBoundLatitude,
            @RequestParam(value = "southBoundLatitude", required = false) Double southBoundLatitude,
            @RequestParam(value = "keyword", required = false) String[] keywords,
            @RequestParam(value = "keywordMatchType", required = false) KeywordMatchType keywordMatchType,
            @RequestParam(value = "capturePlatform", required = false) String capturePlatform,
            @RequestParam(value = "sensor", required = false) String sensor,
            @RequestParam(value = "maxRecords", required = false) Integer maxRecords) {

        //Firstly generate our filter
        FilterBoundingBox filterBbox = attemptParseBBox(westBoundLongitude, eastBoundLongitude,
                northBoundLatitude, southBoundLatitude);
        CSWGetDataRecordsFilter filter = new CSWGetDataRecordsFilter(anyText, filterBbox, keywords, capturePlatform, sensor, keywordMatchType,null,null);
        log.debug(String.format("filter '%1$s'", filter));

        //Then make our requests to all of CSW's
        int count = 0;
        int maxRecordsInt = maxRecords == null ? 0 : maxRecords;
        try {
            if (cswServiceId == null || cswServiceId.isEmpty()) {
                count = cswFilterService.getFilteredRecordsCount(filter, maxRecordsInt);
            } else {
                count = cswFilterService.getFilteredRecordsCount(cswServiceId, filter, maxRecordsInt);
            }
        } catch (Exception ex) {
            log.warn(String.format("Error fetching filtered record count for filter '%1$s'", filter), ex);
            return generateJSONResponseMAV(false, null, "Error fetching filtered record count");
        }

        return generateJSONResponseMAV(true, count, "");
    }
}
