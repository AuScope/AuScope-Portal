package org.auscope.portal.registry;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.auscope.portal.serql.PortalSerqlQueryMaker;
import org.openrdf.query.BindingSet;

import com.sun.xml.internal.bind.v2.runtime.unmarshaller.XsiNilLoader.Array;

/**
 * A POJO for representing an Information Model concept from our registry
 * @author Josh Vote
 *
 */
public class InformationModel extends BaseConcept {
	private String name;
	
	private List<String> featureTypeUrns;
	private List<String> vocabularyUrns;

	public InformationModel(String urn) {
		super(urn);
		this.featureTypeUrns = new ArrayList<String>();
		this.vocabularyUrns = new ArrayList<String>();
	}
	
	/**
	 * Gets a descriptive name for this information model
	 * @return
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Gets a readonly list of Strings representing the URN's of each feature type that is referenced by this information model
	 * @return
	 */
	public List<String> getFeatureTypeUrns() {
		return Collections.unmodifiableList(featureTypeUrns);
	}


	/**
	 * Gets a readonly list of Strings representing the URN's of each vocabulary that is referenced by this information model
	 * @return
	 */
	public List<String> getVocabularyUrns() {
		return Collections.unmodifiableList(vocabularyUrns);
	}

	@Override
	public void mergeBindingSet(BindingSet bs) {
		String name = bs.getValue(PortalSerqlQueryMaker.BINDING_INFO_MODEL_NAME).stringValue();
		String vocabUrn = bs.getValue(PortalSerqlQueryMaker.BINDING_VOCABULARY).stringValue();
		String featureTypeUrn = bs.getValue(PortalSerqlQueryMaker.BINDING_FEATURE_TYPE).stringValue();
		
		this.name = name;
		appendUniqueUrn(this.featureTypeUrns, featureTypeUrn);
		appendUniqueUrn(this.vocabularyUrns, vocabUrn);
	}
	
}
