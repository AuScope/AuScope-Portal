package org.auscope.portal.server.web.service;

import java.net.URISyntaxException;
import java.util.List;

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
import org.auscope.portal.mineraloccurrence.MinOccurViewFilter;
import org.auscope.portal.mineraloccurrence.Mine;
import org.auscope.portal.mineraloccurrence.MineFilter;
import org.auscope.portal.mineraloccurrence.MineralOccurrenceFilter;
import org.auscope.portal.mineraloccurrence.MineralOccurrencesResponseHandler;
import org.auscope.portal.mineraloccurrence.MiningActivityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Manages mineral occurrence queries
 *
 * @version $Id$
 */
@Service
public class MineralOccurrenceService extends BaseWFSService {

    // -------------------------------------------------------------- Constants

    public static final String MINE_FEATURE_TYPE = "er:MiningFeatureOccurrence";
    public static final String MINERAL_OCCURRENCE_FEATURE_TYPE = "gsml:MappedFeature";
    public static final String MINING_ACTIVITY_FEATURE_TYPE = "er:MiningFeatureOccurrence";

    // ----------------------------------------------------- Instance variables

    private MineralOccurrencesResponseHandler mineralOccurrencesResponseHandler;

    // ----------------------------------------------------------- Constructors

    @Autowired
    public MineralOccurrenceService(HttpServiceCaller httpServiceCaller,
            MineralOccurrencesResponseHandler respHandler,
            WFSGetFeatureMethodMaker methodMaker) {
        super(httpServiceCaller, methodMaker);
        this.mineralOccurrencesResponseHandler = respHandler;

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

    /**
     * Gets the GML/KML response for all mines matching the specified parameters
     *
     * @param serviceUrl
     *            a Web Feature Service URL
     * @param mineName
     *            [Optional] The mine name to constrain the result set
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures
     *            The maximum number of features to request
     * @return
     * @throws PortalServiceException
     */
    public WFSResponse getMinesGml(String serviceUrl, String mineName, FilterBoundingBox bbox,
            int maxFeatures) throws PortalServiceException {
        MineFilter filter = new MineFilter(mineName,null);
        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = null;
        try {
            method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures, null,
                    ResultType.Results);
            String responseGml = httpServiceCaller.getMethodResponseAsString(method);

            return new WFSResponse(responseGml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, "Error when attempting to download Mines GML", ex);
        }
    }

    /**
     * Gets the parsed Mine response for all mines matching the specified parameters
     *
     * @param serviceUrl
     *            a Web Feature Service URL
     * @param mineName
     *            [Optional] The mine name to constrain the result set
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures
     *            The maximum number of features to request
     * @return
     * @throws PortalServiceException
     * @throws URISyntaxException
     */
    public List<Mine> getMines(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures)
            throws PortalServiceException, URISyntaxException {
        MineFilter filter = new MineFilter(mineName,null);
        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures,
                null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method);
            return mineralOccurrencesResponseHandler.getMines(response);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Gets the count of all mines matching the specified parameters
     *
     * @param serviceUrl
     *            a Web Feature Service URL
     * @param mineName
     *            [Optional] The mine name to constrain the result set
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures
     *            The maximum number of features to request
     * @return
     * @throws PortalServiceException
     * @throws URISyntaxException
     */
    public WFSCountResponse getMinesCount(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures)
            throws PortalServiceException, URISyntaxException {
        MineFilter filter = new MineFilter(mineName,null);
        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures,
                null, ResultType.Hits);
        return getWfsFeatureCount(method);
    }

    /**
     * Given a list of parameters, call a service and get the Mineral Occurrence GML
     *
     * @param serviceUrl
     * @param commodityName
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param cutOffGrade
     * @param cutOffGradeUOM
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws URISyntaxException
     */
    public WFSResponse getMineralOccurrenceGml(String serviceUrl,
            String commodityName,
            String measureType,
            String minOreAmount,
            String minOreAmountUOM,
            String minCommodityAmount,
            String minCommodityAmountUOM,
            int maxFeatures,
            FilterBoundingBox bbox) throws PortalServiceException, URISyntaxException {

        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName,
                measureType,
                minOreAmount,
                minOreAmountUOM,
                minCommodityAmount,
                minCommodityAmountUOM,"");

        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = generateWFSRequest(serviceUrl, MINERAL_OCCURRENCE_FEATURE_TYPE, null, filterString,
                maxFeatures, null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method);
            return new WFSResponse(response, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Given a list of parameters, call a service and get the count of Mineral Occurrence GML
     *
     * @param serviceUrl
     * @param commodityName
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param cutOffGrade
     * @param cutOffGradeUOM
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws URISyntaxException
     */
    public WFSCountResponse getMineralOccurrenceCount(String serviceUrl,
            String commodityName,
            String measureType,
            String minOreAmount,
            String minOreAmountUOM,
            String minCommodityAmount,
            String minCommodityAmountUOM,
            int maxFeatures,
            FilterBoundingBox bbox) throws PortalServiceException, URISyntaxException {

        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName,
                measureType,
                minOreAmount,
                minOreAmountUOM,
                minCommodityAmount,
                minCommodityAmountUOM,"");

        String filterString = generateFilterString(filter, bbox);
        HttpRequestBase method = generateWFSRequest(serviceUrl, MINERAL_OCCURRENCE_FEATURE_TYPE, null, filterString,
                maxFeatures, null, ResultType.Hits);
        return getWfsFeatureCount(method);
    }

    /**
     * Given a list of parameters, call a service and get the Mineral Activity features as GML/KML
     *
     * @param serviceUrl
     * @param mineName
     * @param startDate
     * @param endDate
     * @param oreProcessed
     * @param producedMaterial
     * @param cutOffGrade
     * @param production
     * @param maxFeatures
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws Exception
     */
    public WFSResponse getMiningActivityGml(String serviceUrl,
            String mineName,
            String startDate,
            String endDate,
            String oreProcessed,
            String producedMaterial,
            String cutOffGrade,
            String production,
            int maxFeatures,
            FilterBoundingBox bbox
            ) throws Exception {

        //create the filter
        MiningActivityFilter filter = new MiningActivityFilter(mineName, startDate, endDate, oreProcessed,
                producedMaterial, cutOffGrade, production);
        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = generateWFSRequest(serviceUrl, MINING_ACTIVITY_FEATURE_TYPE, null, filterString,
                maxFeatures, null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method);
            return new WFSResponse(response, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Given a list of parameters, call a service and get the count of Mineral Activity features
     *
     * @param serviceUrl
     * @param mineName
     * @param startDate
     * @param endDate
     * @param oreProcessed
     * @param producedMaterial
     * @param cutOffGrade
     * @param production
     * @param maxFeatures
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws Exception
     */
    public WFSCountResponse getMiningActivityCount(String serviceUrl,
            String mineName,
            String startDate,
            String endDate,
            String oreProcessed,
            String producedMaterial,
            String cutOffGrade,
            String production,
            int maxFeatures,
            FilterBoundingBox bbox
            ) throws Exception {

        //create the filter
        MiningActivityFilter filter = new MiningActivityFilter(mineName, startDate, endDate, oreProcessed,
                producedMaterial, cutOffGrade, production);
        String filterString = generateFilterString(filter, bbox);

        HttpRequestBase method = generateWFSRequest(serviceUrl, MINING_ACTIVITY_FEATURE_TYPE, null, filterString,
                maxFeatures, null, ResultType.Hits);
        return getWfsFeatureCount(method);
    }

    public String getMiningActivityFilter(String mineName, String startDate,
            String endDate, String oreProcessed, String producedMaterial,
            String cutOffGrade, String production, int maxFeatures,
            FilterBoundingBox bbox) throws Exception {
        MiningActivityFilter filter = new MiningActivityFilter(mineName,
                startDate, endDate, oreProcessed, producedMaterial,
                cutOffGrade, production);
        return generateFilterString(filter, bbox);
    }

    public String getMineFilter(String mineName, FilterBoundingBox bbox, String optionalFilters)
            throws Exception {
        MineFilter filter = new MineFilter(mineName, optionalFilters);
        return generateFilterString(filter, bbox);
    }
    
    
    

    public String getMineralOccurrenceFilter(String commodityName, FilterBoundingBox bbox,String optionalFilters)
            throws Exception {
        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName, "", "", "", "", "",optionalFilters);
        return generateFilterString(filter, bbox);
    }

    public String getMinOccurViewFilter(String commodityName, String minOreAmount, String minReserves,
            String minResources, FilterBoundingBox bbox)
                    throws Exception {
        MinOccurViewFilter filter = new MinOccurViewFilter(commodityName, minOreAmount, minReserves, minResources);
        return generateFilterString(filter, bbox);
    }

}
