package org.auscope.portal.registry;

import org.auscope.portal.server.domain.xml.IterableNamespaceContext;

/**
 * The namespaces that are used when communicating with the vocabulary registry
 * 
 * @author Josh Vote
 * 
 */
public class PortalRegistryNamespace extends IterableNamespaceContext {
	public PortalRegistryNamespace() {
		super();
		
		this.namespaces.put("dc", "http://purl.org/dc/elements/1.1/");
		this.namespaces.put("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		this.namespaces.put("xlink", "http://www.w3.org/1999/xlink");
		this.namespaces.put("owl", "http://www.w3.org/2002/07/owl#");
		this.namespaces.put("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
		this.namespaces.put("skos", "http://www.w3.org/2004/02/skos/core#");
		this.namespaces.put("FeatureType-GSML", "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#FeatureType-GSML:");
		this.namespaces.put("TopologyScheme","http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#");
		this.namespaces.put("xsd", "http://www.w3.org/2001/XMLSchema#");
		this.namespaces.put("FeatureType-SA", "http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#FeatureType-SA:");

	}
}
