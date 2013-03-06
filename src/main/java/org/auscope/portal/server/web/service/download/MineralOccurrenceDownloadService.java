package org.auscope.portal.server.web.service.download;

import java.io.InputStream;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.server.http.download.ServiceDownloadManager;
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
import org.auscope.portal.mineraloccurrence.MiningActivityFilter;
import org.auscope.portal.server.web.service.MineralOccurrenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Manages mineral occurrence download queries. As the size of the data can be big, we
 * handle all responses as stream to avoid oom issues.
 *
 * @version $Id$
 */
@Service
public class MineralOccurrenceDownloadService extends BaseWFSService {

    // -------------------------------------------------------------- Constants

    private final Log log = LogFactory.getLog(getClass());
    public static final String MINE_FEATURE_TYPE = "er:MiningFeatureOccurrence";
    public static final String MINERAL_OCCURRENCE_FEATURE_TYPE = "gsml:MappedFeature";
    public static final String MINING_ACTIVITY_FEATURE_TYPE = "er:MiningFeatureOccurrence";
    public static final int DEFAULT_TIMEOUT = ServiceDownloadManager.MAX_WAIT_TIME_MINUTE * 60 * 1000;
    private  final HttpClient client;






    // ----------------------------------------------------------- Constructors

    @Autowired
    public MineralOccurrenceDownloadService(HttpServiceCaller httpServiceCaller,
                                     WFSGetFeatureMethodMaker methodMaker) {
        super(httpServiceCaller, methodMaker);

        client=new HttpClient();
        HttpClientParams clientParams=new HttpClientParams();
        clientParams.setSoTimeout(DEFAULT_TIMEOUT);//VT 2 hours

        client.setParams(clientParams);
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
     * Gets the GML response for all mines matching the specified parameters
     * @param serviceUrl a Web Feature Service URL
     * @param mineName [Optional] The mine name to constrain the result set
     * @param bbox [Optional] the spatial bounds to constrain the result set
     * @param maxFeatures The maximum number of features to request
     * @return
     * @throws PortalServiceException
     */
    public InputStream downloadMinesGml(String serviceUrl, String mineName, FilterBoundingBox bbox, int maxFeatures) throws PortalServiceException {
        MineFilter filter = new MineFilter(mineName);
        String filterString = generateFilterString(filter, bbox);

        HttpMethodBase method = null;
        try {
            method = generateWFSRequest(serviceUrl, MINE_FEATURE_TYPE, null, filterString, maxFeatures, null, ResultType.Results);
            return httpServiceCaller.getMethodResponseAsStream(method,client);

        } catch (Exception ex) {
            throw new PortalServiceException(method, "Error when attempting to download Mines GML", ex);
        }
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
    public InputStream downloadMineralOccurrenceGml(String serviceURL,
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
            return httpServiceCaller.getMethodResponseAsStream(method,client);


        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
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
    public InputStream downloadMiningActivityGml(String serviceURL,
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
            return httpServiceCaller.getMethodResponseAsStream(method,client);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

}
