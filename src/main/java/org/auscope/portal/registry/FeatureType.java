package org.auscope.portal.registry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.auscope.portal.serql.PortalSerqlQueryMaker;
import org.openrdf.query.BindingSet;

/**
 * A POJO representing a FeatureType from our registry
 * @author Josh Vote
 *
 */
public class FeatureType extends BaseConcept {

	private String typeName;
	private List<String> webServiceUrns;
	private List<String> informationModelUrns;
	
	
	public FeatureType(String urn) {
		super(urn);
		this.webServiceUrns = new ArrayList<String>();
		this.informationModelUrns = new ArrayList<String>();
	}
	
	/**
	 * Gets the type name of this feature type
	 * @return
	 */
	public String getTypeName() {
		return typeName;
	}
	
	/**
	 * Gets a readonly list of Strings representing the URN's of each Web service that is referenced by this feature type
	 * @return
	 */
	public List<String> getWebServiceUrns() {
		return Collections.unmodifiableList(webServiceUrns);
	}


	/**
	 * Gets a readonly list of Strings representing the URN's of each Information Model that is referenced by this feature type
	 * @return
	 */
	public List<String> getInformationModelUrns() {
		return Collections.unmodifiableList(informationModelUrns);
	}
	
	@Override
	public void mergeBindingSet(BindingSet bs) {
		String typeName = bs.getValue(PortalSerqlQueryMaker.BINDING_FEATURE_TYPE_NAME).stringValue();
		String infoModelUrn = bs.getValue(PortalSerqlQueryMaker.BINDING_INFO_MODEL).stringValue();
		String webServiceUrn = bs.getValue(PortalSerqlQueryMaker.BINDING_WEB_SERVICE).stringValue();
		
		this.typeName = typeName;
		appendUniqueUrn(this.webServiceUrns, webServiceUrn);
		appendUniqueUrn(this.informationModelUrns, infoModelUrn);

	}

}
