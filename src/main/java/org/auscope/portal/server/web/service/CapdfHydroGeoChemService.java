package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.auscope.portal.capdf.CapdfHydroGeoChemFilter;
import org.auscope.portal.capdf.CapdfMeasurementLimitFilter;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.service.colorcoding.CapdfHydroChemColorCoding;
import org.auscope.portal.service.colorcoding.ColorCodingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Manages mineral tenement queries
 *
 * @author VictorTey
 * @version
 */
@Service
public class CapdfHydroGeoChemService extends BaseWFSService {

    @Autowired
    public CapdfHydroGeoChemService(
            HttpServiceCaller httpServiceCaller,
            WFSGetFeatureMethodMaker methodMaker) {
        super(httpServiceCaller, methodMaker);
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * @param filter The filter
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public static String generateFilterString(IFilter filter, FilterBoundingBox bbox) {
        String filterString = null;
        if (bbox == null) {
            filterString = filter.getFilterStringAllRecords();
        } else {
            filterString = filter.getFilterStringBoundingBox(bbox);
        }

        return filterString;
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * @param filter The filter
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public String getHydroGeoChemFilter(String batchid,FilterBoundingBox bbox) {
        CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(batchid,null,null,null);
        return generateFilterString(filter,bbox);
    }


    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * @param filter The filter
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public String getMeasurementLimits(String group) {
        CapdfMeasurementLimitFilter filter = new CapdfMeasurementLimitFilter(group);
        return generateFilterString(filter,null);
    }


    public List<IFilter> getHydroGeoChemFilterWithColorCoding(String batchid, CapdfHydroChemColorCoding ccq)
            throws Exception {

        ArrayList<IFilter> result = new ArrayList<IFilter>();

        ColorCodingConfig  ccc= ccq.getColorCodingConfig();

        for(int iteration = 0; iteration < ccc.getIntervals(); iteration++){
            HashMap<String,Double> config = ccc.getIteration(iteration);
            CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(batchid,ccq,ccc.getIterationLowerBound(config),ccc.getIterationUpperBound(config));
            result.add(filter);
        }

        return result;
    }



}
