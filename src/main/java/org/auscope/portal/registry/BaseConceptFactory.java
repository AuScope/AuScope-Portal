package org.auscope.portal.registry;

/**
 * A simple factory for creating BaseConcept classes of a predetermined type
 * @author Josh Vote
 *
 */
public class BaseConceptFactory<B extends BaseConcept> {
	
	private Class<B> blueprint;
	
	public BaseConceptFactory (Class<B> blueprint) {
		this.blueprint = blueprint;
	}
	
	public B createInstance(String urn) {
		try {
			return (B) blueprint.getConstructor(String.class).newInstance(urn);
		} catch (Exception e) {
			return null;
		} 
	}
}
