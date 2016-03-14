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
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.xslt.WfsToKmlTransformer;
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

	private WfsToKmlTransformer wfsToKml;

	@Autowired
	public MineralTenementService(HttpServiceCaller httpServiceCaller, WFSGetFeatureMethodMaker methodMaker,
			WfsToKmlTransformer wfsToKml) {
		super(httpServiceCaller, methodMaker);
		this.wfsToKml = wfsToKml;
	}

	/**
	 * Utility for turning a filter and optional bounding box into a OGC filter
	 * string
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
			FilterBoundingBox bbox) throws Exception {
		MineralTenementFilter filter = new MineralTenementFilter(name, tenementType, owner, size, endDate);
		return generateFilterString(filter, bbox);
	}

	public String getMineralTenementWithStyling(String name, String tenementType, String owner, String size,
			String endDate) throws Exception {
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

	public WFSTransformedResponse getAllTenements(String serviceURL, String tenementName, int maxFeatures,
			FilterBoundingBox bbox) throws Exception {
		String filterString;
		MineralTenementFilter mineralTenementFilter = new MineralTenementFilter(tenementName);
		if (bbox == null) {
			filterString = mineralTenementFilter.getFilterStringAllRecords();
		} else {
			filterString = mineralTenementFilter.getFilterStringBoundingBox(bbox);
		}

		HttpRequestBase method = null;

		try {
			method = this.generateWFSRequest(serviceURL, "mt:MineralTenement", null, filterString, maxFeatures, null,
					ResultType.Results);
			String responseGML = this.httpServiceCaller.getMethodResponseAsString(method);
			String responseKML = this.wfsToKml.convert(responseGML, serviceURL);
			return new WFSTransformedResponse(responseGML, responseKML, method);
		} catch (Exception e) {
			throw new PortalServiceException(method, e);
		}

	}

	public WFSCountResponse getTenementCount(String serviceURL, String tenementName, int maxFeatures,
			FilterBoundingBox bbox) throws PortalServiceException, URISyntaxException {
		// TODO Auto-generated method stub
		String filterString;
		MineralTenementFilter mineralTenementFilter = new MineralTenementFilter(tenementName);
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
