package org.auscope.portal.server.web.service;

import java.util.List;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker.ResultType;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.xslt.WfsToKmlTransformer;
import org.auscope.portal.gsml.SF0BoreholeFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * A service class for making requests to the SF0 Borehole web service
 * 
 * @author Florence Tan
 *
 */
@Service
public class SF0BoreholeService extends BoreholeService {

    // -------------------------------------------------------------- Constants

    // ----------------------------------------------------- Instance variables
    private WfsToKmlTransformer wfsToKml;

    // ----------------------------------------------------------- Constructors

    @Autowired
    public SF0BoreholeService(HttpServiceCaller serviceCaller, WFSGetFeatureMethodMaker methodMaker,
            WfsToKmlTransformer wfsToKml) {
        super(serviceCaller, methodMaker, wfsToKml);
        this.wfsToKml = wfsToKml;
    }

    // --------------------------------------------------------- Public Methods

    /**
     * Get all SF0 Boreholes from a given service url and return the response
     * 
     * @param serviceURL
     * @param bbox
     *            Set to the bounding box in which to fetch results, otherwise set it to null
     * @param restrictToIDList
     *            [Optional] A list of gml:id values that the resulting filter should restrict its search space to
     * @return
     * @throws Exception
     */
    public WFSTransformedResponse getAllBoreholes(String serviceURL, String boreholeName, String custodian,
            String dateOfDrilling, int maxFeatures, FilterBoundingBox bbox) throws Exception {
        String filterString;
        SF0BoreholeFilter sf0BoreholeFilter = new SF0BoreholeFilter(boreholeName, custodian, dateOfDrilling, null);
        if (bbox == null) {
            filterString = sf0BoreholeFilter.getFilterStringAllRecords();
        } else {
            filterString = sf0BoreholeFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;
        try {
            // Create a GetFeature request with an empty filter - get all
            method = this.generateWFSRequest(serviceURL, getTypeName(), null, filterString, maxFeatures, null,
                    ResultType.Results);
            String responseGml = this.httpServiceCaller.getMethodResponseAsString(method);
            String responseKml = this.wfsToKml.convert(responseGml, serviceURL);

            return new WFSTransformedResponse(responseGml, responseKml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    @Override
    public String getFilter(String boreholeName, String custodian, String dateOfDrilling,
            int maxFeatures, FilterBoundingBox bbox, List<String> ids) throws Exception {
        SF0BoreholeFilter filter = new SF0BoreholeFilter(boreholeName, custodian, dateOfDrilling, ids);
        return generateFilterString(filter, bbox);
    }

    @Override
    public String getTypeName() {
        return "gsmlp:BoreholeView";
    }

    @Override
    public String getGeometryName() {
        return "gsmlp:shape";
    }

}
