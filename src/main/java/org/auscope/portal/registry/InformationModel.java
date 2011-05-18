package org.auscope.portal.registry;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

	public InformationModel(String urn, String name) {
		this.urn = urn;
		this.name = name;
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
	 * Adds the specified FeatureType URN to this information model. Has no effect if URN already exists 
	 * @param urn
	 */
	public void addFeatureTypeUrn(String urn) {
		if (!this.featureTypeUrns.contains(urn)) {
			this.featureTypeUrns.add(urn);
		}
	}
	
	/**
	 * Adds the specified FeatureType URN to this information model. Has no effect if URN already exists 
	 * @param urn
	 */
	public void addVocabularyUrn(String urn) {
		if (!this.vocabularyUrns.contains(urn)) {
			this.vocabularyUrns.add(urn);
		}
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
	
}
