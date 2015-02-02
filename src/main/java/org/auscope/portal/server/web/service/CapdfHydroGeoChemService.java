package org.auscope.portal.server.web.service;

import javax.naming.OperationNotSupportedException;

import org.auscope.portal.capdf.CapdfHydroGeoChemFilter;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
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

    public String getHydroGeoChemFilter(FilterBoundingBox bbox)
            throws Exception {
        CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter();
        return generateFilterString(filter,bbox);
    }


    public String getHydroGeoChemFilterWithStyling(String type, String value)
            throws Exception {
        CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter();
        return generateAdditionalStyleFilter(filter,type,value);
    }

    /**
     * Utility for turning a filter and add additional styling to the filter.
     * @param filter The filter
     * @return
     * @throws OperationNotSupportedException
     */
    public static String generateAdditionalStyleFilter(IFilter filter,String type, String value) throws OperationNotSupportedException {
        if(filter instanceof CapdfHydroGeoChemFilter){
            CapdfHydroGeoChemFilter chgcFilter=(CapdfHydroGeoChemFilter)filter;
            return chgcFilter.getFilterWithAdditionalStyle(type,value);
        }else{
            throw new OperationNotSupportedException("Only CapdfHydroGeoChemFilter supports the use of additional style filtering");
        }

    }



}
