package org.auscope.portal.registry;

import java.io.Serializable;
import java.util.List;

import org.openrdf.query.BindingSet;

/**
 * The base concept for all Vocab Registry concepts 
 * @author Josh Vote
 *
 */
public abstract class BaseConcept implements Serializable {
	private String urn;
	
	protected BaseConcept(String urn) {
		this.urn = urn;
	}
	
	/**
	 * Gets the unique ID identifying this information model
	 * @return
	 */
	public String getUrn() {
		return urn;
	}
	
	/**
	 * Subclasses must take the contents of a BindingSet (schema to be fixed in advance) and attempt to merge
	 * all contents of the BindingSet into this instance (whether that means appending to lists or overwriting variables depends on the instance)
	 * @param bs
	 */
	public abstract void mergeBindingSet(BindingSet bs);
	
	/**
	 * Adds the specified URN to to a list of URN's. Has no effect if URN already exists in list 
	 * @param urn If null it will not be added to the list
	 */
	protected static void appendUniqueUrn(List<String> list, String urn) {
		if (urn != null && !list.contains(urn)) {
			list.add(urn);
		}
	}
}
