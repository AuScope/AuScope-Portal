package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.List;

import javax.naming.OperationNotSupportedException;

import org.auscope.portal.capdf.CapdfHydroGeoChemFilter;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.server.web.entity.CapdfHydroChemColorCoding;
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
    public String getHydroGeoChemFilter(String project,FilterBoundingBox bbox) {
        CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(project,null,-1,-1);
        return generateFilterString(filter,bbox);
    }


    public List<IFilter> getHydroGeoChemFilterWithColorCoding(String project, CapdfHydroChemColorCoding ccq)
            throws Exception {

        ArrayList<IFilter> result = new ArrayList<IFilter>();

        for(int iteration = 0; iteration < ccq.getShades().length; iteration++){
            CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(project,ccq,ccq.getMin(iteration),ccq.getMax(iteration));
            result.add(filter);
        }

        return result;
    }



}
