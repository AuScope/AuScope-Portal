package org.auscope.portal.registry;

import java.io.Serializable;

/**
 * The base concept for all Vocab Registry concepts 
 * @author Josh Vote
 *
 */
public abstract class BaseConcept implements Serializable {
	protected String urn;
	
	/**
	 * Gets the unique ID identifying this information model
	 * @return
	 */
	public String getUrn() {
		return urn;
	}
}
