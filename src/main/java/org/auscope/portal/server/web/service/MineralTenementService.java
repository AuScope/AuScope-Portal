package org.auscope.portal.server.web.service;

import javax.naming.OperationNotSupportedException;

import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.mineraloccurrence.MineralTenementFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Manages mineral tenement queries
 *
 * @author VictorTey
 * @version
 */
@Service
public class MineralTenementService extends BaseWFSService {

    @Autowired
    public MineralTenementService(
            HttpServiceCaller httpServiceCaller,
            WFSGetFeatureMethodMaker methodMaker) {
        super(httpServiceCaller, methodMaker);
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * 
     * @param filter
     *            The filter
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
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

    public String getMineralTenementFilter(String name, String tenementType, String owner, String size, String endDate,
            FilterBoundingBox bbox)
            throws Exception {
        MineralTenementFilter filter = new MineralTenementFilter(name, tenementType, owner, size, endDate);
        return generateFilterString(filter, bbox);
    }

    public String getMineralTenementWithStyling(String name, String tenementType, String owner, String size,
            String endDate)
            throws Exception {
        MineralTenementFilter filter = new MineralTenementFilter(name, tenementType, owner, size, endDate);
        return generateAdditionalStyleFilter(filter);
    }

    /**
     * Utility for turning a filter and add additional styling to the filter.
     * 
     * @param filter
     *            The filter
     * @return
     * @throws OperationNotSupportedException
     */
    public static String generateAdditionalStyleFilter(IFilter filter) throws OperationNotSupportedException {
        if (filter instanceof MineralTenementFilter) {
            MineralTenementFilter mtFilter = (MineralTenementFilter) filter;
            return mtFilter.getFilterWithAdditionalStyle();
        } else {
            throw new OperationNotSupportedException(
                    "Only MineralTenementFilter supports the use of additional style filtering");
        }

    }

}
