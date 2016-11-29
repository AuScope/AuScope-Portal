package org.auscope.portal.server.web.service;

import java.net.URISyntaxException;

import javax.naming.OperationNotSupportedException;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker.ResultType;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.services.responses.wfs.WFSCountResponse;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.mineraloccurrence.MineralTenementCCFilter;
import org.auscope.portal.mineraloccurrence.MineralTenementFilter;
import org.auscope.portal.server.MineralTenementServiceProviderType;
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
            FilterBoundingBox bbox,String optionalFilters, MineralTenementServiceProviderType mineralTenementServiceProviderType)
                    throws Exception {
        MineralTenementFilter filter = new MineralTenementFilter(name, tenementType, owner, size, endDate,null,optionalFilters, mineralTenementServiceProviderType);
        return generateFilterString(filter, bbox);
    }
    public String getMineralTenementFilterCCStatus(String name, String tenementType, String owner, String size, String endDate,
            FilterBoundingBox bbox,String ccstatus)
                    throws Exception {
        MineralTenementCCFilter filter = new MineralTenementCCFilter(name, tenementType, owner, size, endDate);
        filter.addCCStatusInFilter(ccstatus);
        return generateFilterString(filter, bbox);
    }

    public String getMineralTenementFilterCCType(String name, String tenementType, String owner, String size, String endDate,
            FilterBoundingBox bbox,String cctype)
                    throws Exception {
        MineralTenementCCFilter filter = new MineralTenementCCFilter(name, tenementType, owner, size, endDate);
        filter.addCCTypeInFilter(cctype);
        return generateFilterString(filter, bbox);
    }

    public WFSResponse getAllTenements(String serviceURL, String tenementName, String owner, int maxFeatures,
            FilterBoundingBox bbox, String outputFormat, MineralTenementServiceProviderType mineralTenementServiceProviderType) throws Exception {
        String filterString;
        MineralTenementFilter mineralTenementFilter = new MineralTenementFilter(tenementName, null, owner, null, null, null, null, mineralTenementServiceProviderType);
        if (bbox == null) {
            filterString = mineralTenementFilter.getFilterStringAllRecords();
        } else {
            filterString = mineralTenementFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;

        try {
            method = this.generateWFSRequest(serviceURL, "mt:MineralTenement", null, filterString, maxFeatures, null,
                    ResultType.Results,outputFormat);
            String responseGML = this.httpServiceCaller.getMethodResponseAsString(method);
            return new WFSResponse(responseGML, method);
        } catch (Exception e) {
            throw new PortalServiceException(method, e);
        }

    }
    
    public WFSCountResponse getTenementCount(String serviceURL, String tenementName, String owner, int maxFeatures,
            FilterBoundingBox bbox, MineralTenementServiceProviderType mineralTenementServiceProviderType) throws PortalServiceException, URISyntaxException {
        // TODO Auto-generated method stub
        String filterString;
        MineralTenementFilter mineralTenementFilter = new MineralTenementFilter(tenementName,  null, owner, null, null, null, null, mineralTenementServiceProviderType);
        if (bbox == null) {
            filterString = mineralTenementFilter.getFilterStringAllRecords();
        } else {
            filterString = mineralTenementFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;

        method = generateWFSRequest(serviceURL, "mt:MineralTenement", null, filterString, maxFeatures, null,
                ResultType.Hits);
        return getWfsFeatureCount(method);

    }






}
