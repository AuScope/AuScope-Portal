package org.auscope.portal.registry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.auscope.portal.serql.PortalSerqlQueryMaker;
import org.openrdf.query.BindingSet;

/**
 * A POJO representing a WebService in our registry
 * @author Josh Vote

 */
public class WebService extends BaseConcept {
	
	public static final String WEB_SERVICE_TYPE_WFS = "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#WebFeatureService";
	public static final String WEB_SERVICE_TYPE_WMS = "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#WebMapService";
	public static final String WEB_SERVICE_TYPE_WCS = "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#WebCoverageService";
	public static final String WEB_SERVICE_TYPE_SISSVOC = "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#SISSVoc";
	
	private String serviceEndPoint;
	private List<String> serviceUserUrns;
	private List<String> serviceTypes;
	
	public WebService(String urn) {
		super(urn);
		this.serviceUserUrns = new ArrayList<String>();
		this.serviceTypes = new ArrayList<String>();
	}

	/**
	 * Gets the service endpoint that this web service utilises
	 * @return
	 */
	public String getServiceEndPoint() {
		return serviceEndPoint;
	}

	/**
	 * Gets an unmodifiable list of URN's representing the feature types and datasets that utilise this webservice
	 * @return
	 */
	public List<String> getServiceUserUrns() {
		return Collections.unmodifiableList(serviceUserUrns);
	}

	/**
	 * Gets an unmodifiable list of service types
	 * (Will contain items from ['WFS', 'WMS', 'WCS', 'SISSVoc'])
	 * @return
	 */
	public List<String> getServiceTypes() {
		return Collections.unmodifiableList(serviceTypes);
	}

	@Override
	public void mergeBindingSet(BindingSet bs) {
		String endPoint = bs.getValue(PortalSerqlQueryMaker.BINDING_WEB_SERVICE_ENDPOINT).stringValue();
		String userUrn = bs.getValue(PortalSerqlQueryMaker.BINDING_WEB_SERVICE_USERS).stringValue();
		String type = bs.getValue(PortalSerqlQueryMaker.BINDING_WEB_SERVICE_TYPES).stringValue();
		
		this.serviceEndPoint = endPoint;
		
		String parsedTypeName = null;
		if (type.equals(WEB_SERVICE_TYPE_WFS)) {
			parsedTypeName = "WFS";
		} else if (type.equals(WEB_SERVICE_TYPE_WCS)) {
			parsedTypeName = "WCS";
		} else if (type.equals(WEB_SERVICE_TYPE_WMS)) {
			parsedTypeName = "WMS";
		} else if (type.equals(WEB_SERVICE_TYPE_SISSVOC)) {
			parsedTypeName = "SISSVoc";
		}
		
		appendUniqueUrn(this.serviceUserUrns, userUrn);
		appendUniqueUrn(this.serviceTypes, parsedTypeName);
	}
	
	
}
