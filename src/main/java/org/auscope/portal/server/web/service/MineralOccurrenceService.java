package org.auscope.portal.server.web.service;

import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker.ResultType;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.services.responses.wfs.WFSCountResponse;
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.xslt.WfsToKmlTransformer;
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

    private final Log log = LogFactory.getLog(getClass());
    public static final String MINE_FEATURE_TYPE = "er:MiningFeatureOccurrence";
    public static final String MINERAL_OCCURRENCE_FEATURE_TYPE = "gsml:MappedFeature";
    public static final String MINING_ACTIVITY_FEATURE_TYPE = "er:MiningFeatureOccurrence";
    public static final int DEFAULT_TIMEOUT = 7200000;
    private  final HttpClient client;

    // ----------------------------------------------------- Instance variables

    private MineralOccurrencesResponseHandler mineralOccurrencesResponseHandler;
    private WfsToKmlTransformer gmlToKml;

    // ----------------------------------------------------------- Constructors

    @Autowired
    public MineralOccurrenceService(HttpServiceCaller httpServiceCaller,
                                     MineralOccurrencesResponseHandler respHandler,
                                     WFSGetFeatureMethodMaker methodMaker,
                                     WfsToKmlTransformer gmlToKml) {
        super(httpServiceCaller, methodMaker);
        this.mineralOccurrencesResponseHandler = respHandler;
        this.gmlToKml = gmlToKml;
        client=new HttpClient();
        HttpClientParams clientParams=new HttpClientParams();
        clientParams.setSoTimeout(DEFAULT_TIMEOUT);//VT 2 hours
        clientParams.setConnectionManagerTimeout(DEFAULT_TIMEOUT);
        client.setParams(clientParams);
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * @param filter The filter
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    private String generateFilterString(IFilter filter, FilterBoundingBox bbox) {
        String filterString = null;
        if (bbox == null) {
            filterString = filter.getFilterStringAllRecords();
        } else {
            filterString = filter.getFilterStringBoundingBox(bbox);
        }

        log.trace(filterString);

        return filterString;
    }

    /**
     * Gets the GML/KML response for all mines matching the specified parameters
     * @param serviceUrl a Web Feature Service URL
     * @param mineName [Optional] The mine name to constrain the result set
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures The maximum number of features to request
     * @return
     * @throws PortalServiceException
     */
    public WFSTransformedResponse getMinesGml(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures) throws PortalServiceException {
        MineFilter filter = new MineFilter(mineName);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = null;
        try {
            method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Results);
            String responseGml = httpServiceCaller.getMethodResponseAsString(method,client);
            String responseKml = gmlToKml.convert(responseGml, serviceUrl);

            return new WFSTransformedResponse(responseGml, responseKml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, "Error when attempting to download Mines GML", ex);
        }
    }

    /**
     * Gets the parsed Mine response for all mines matching the specified parameters
     * @param serviceUrl a Web Feature Service URL
     * @param mineName [Optional] The mine name to constrain the result set
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures The maximum number of features to request
     * @return
     * @throws PortalServiceException
     */
    public List<Mine> getMines(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures) throws PortalServiceException {
        MineFilter filter = new MineFilter(mineName);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method,client);
            return mineralOccurrencesResponseHandler.getMines(response);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Gets the count of all mines matching the specified parameters
     * @param serviceUrl a Web Feature Service URL
     * @param mineName [Optional] The mine name to constrain the result set
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures The maximum number of features to request
     * @return
     * @throws PortalServiceException
     */
    public WFSCountResponse getMinesCount(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures) throws PortalServiceException {
        MineFilter filter = new MineFilter(mineName);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Hits);
        return getWfsFeatureCount(method);
    }

    /**
     * Given a list of parameters, call a service and get the Mineral Occurrence GML
     * @param serviceURL
     * @param commodityName
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param cutOffGrade
     * @param cutOffGradeUOM
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public WFSTransformedResponse getMineralOccurrenceGml(String serviceURL,
                                           String commodityName,
                                           String measureType,
                                           String minOreAmount,
                                           String minOreAmountUOM,
                                           String minCommodityAmount,
                                           String minCommodityAmountUOM,
                                           int maxFeatures,
                                           FilterBoundingBox bbox) throws PortalServiceException {

        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName,
                                           measureType,
                                           minOreAmount,
                                           minOreAmountUOM,
                                           minCommodityAmount,
                                           minCommodityAmountUOM);

        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = generateWFSRequest(serviceURL, MINERAL_OCCURRENCE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method,client);
            String kml = gmlToKml.convert(response, serviceURL);
            return new WFSTransformedResponse(response, kml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Given a list of parameters, call a service and get the count of Mineral Occurrence GML
     * @param serviceURL
     * @param commodityName
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param cutOffGrade
     * @param cutOffGradeUOM
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public WFSCountResponse getMineralOccurrenceCount(String serviceURL,
                                           String commodityName,
                                           String measureType,
                                           String minOreAmount,
                                           String minOreAmountUOM,
                                           String minCommodityAmount,
                                           String minCommodityAmountUOM,
                                           int maxFeatures,
                                           FilterBoundingBox bbox) throws PortalServiceException {

        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName,
                                           measureType,
                                           minOreAmount,
                                           minOreAmountUOM,
                                           minCommodityAmount,
                                           minCommodityAmountUOM);

        String filterString = generateFilterString(filter, bbox);
        HttpMethodBase method = generateWFSRequest(serviceURL, MINERAL_OCCURRENCE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Hits);
        return getWfsFeatureCount(method);
    }


    /**
     * Given a list of parameters, call a service and get the Mineral Activity features as GML/KML
     * @param serviceURL
     * @param mineName
     * @param startDate
     * @param endDate
     * @param oreProcessed
     * @param producedMaterial
     * @param cutOffGrade
     * @param production
     * @param maxFeatures
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws Exception
     */
    public WFSTransformedResponse getMiningActivityGml(String serviceURL,
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
        MiningActivityFilter filter = new MiningActivityFilter(mineName, startDate, endDate, oreProcessed, producedMaterial, cutOffGrade, production);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = generateWFSRequest(serviceURL, MINING_ACTIVITY_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Results);
        try {
            String response = httpServiceCaller.getMethodResponseAsString(method,client);
            String kml = gmlToKml.convert(response, serviceURL);
            return new WFSTransformedResponse(response, kml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Given a list of parameters, call a service and get the count of Mineral Activity features
     * @param serviceURL
     * @param mineName
     * @param startDate
     * @param endDate
     * @param oreProcessed
     * @param producedMaterial
     * @param cutOffGrade
     * @param production
     * @param maxFeatures
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @return
     * @throws Exception
     */
    public WFSCountResponse getMiningActivityCount(String serviceURL,
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
        MiningActivityFilter filter = new MiningActivityFilter(mineName, startDate, endDate, oreProcessed, producedMaterial, cutOffGrade, production);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = generateWFSRequest(serviceURL, MINING_ACTIVITY_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Hits);
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

    public String getMineFilter(String mineName, FilterBoundingBox bbox)
            throws Exception {
        MineFilter filter = new MineFilter(mineName);
        return generateFilterString(filter, bbox);
    }

    public String getMineralOccurrenceFilter(String commodityName, FilterBoundingBox bbox)
            throws Exception {
        MineralOccurrenceFilter filter = new MineralOccurrenceFilter(commodityName,"","","","","");
        return generateFilterString(filter, bbox);
    }
}
