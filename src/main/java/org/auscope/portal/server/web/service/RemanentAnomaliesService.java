package org.auscope.portal.server.web.service;

import javax.naming.OperationNotSupportedException;

import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.remanentanomalies.RemanentAnomaliesFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Manages Remanent Anomaly queries
 *
 * @author Peter Warren
 * @version
 */
@Service
public class RemanentAnomaliesService extends BaseWFSService {

    @Autowired
    public RemanentAnomaliesService(
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

    public String getRemanentAnomaliesFilter(String name, FilterBoundingBox bbox)
            throws Exception {
        RemanentAnomaliesFilter filter = new RemanentAnomaliesFilter(name);
        return generateFilterString(filter, bbox);
    }

    public String getRemanentAnomaliesWithStyling(String name)
            throws Exception {
        RemanentAnomaliesFilter filter = new RemanentAnomaliesFilter(name);
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
        if (filter instanceof RemanentAnomaliesFilter) {
            RemanentAnomaliesFilter remanomFilter = (RemanentAnomaliesFilter) filter;
            return remanomFilter.getFilterWithAdditionalStyle();
        } else {
            throw new OperationNotSupportedException(
                    "Only MineralTenementFilter supports the use of additional style filtering");
        }

    }
}
