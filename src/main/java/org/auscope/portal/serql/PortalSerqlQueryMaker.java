package org.auscope.portal.serql;

import org.auscope.portal.server.domain.xml.IterableNamespaceContext;
import org.springframework.stereotype.Repository;

/**
 * A class for generating SERQL queries that are specific to the AuScope Portal usecases
 * @author Josh Vote
 *
 */
@Repository
public class PortalSerqlQueryMaker {
	
	public static final String BINDING_INFO_MODEL = "InfoModelURN";
	public static final String BINDING_INFO_MODEL_NAME = "InfoModelName";
	public static final String BINDING_FEATURE_TYPE = "FeatureTypeURN";
	public static final String BINDING_VOCABULARY = "VocabularyURN";
	
	private void appendNamespaces(StringBuilder sb, IterableNamespaceContext namespace) {
		int namespacesAdded = 0;
		sb.append(String.format("USING NAMESPACE\n"));
		
		for (String prefix : namespace) {
			sb.append(String.format("    %1$s = <%2$s>,\n", prefix, namespace.getNamespaceURI(prefix)));
			namespacesAdded++;
		}
		
		//Delete the trailing comma from the last namespace 
		if (namespacesAdded > 0) {
			sb.deleteCharAt(sb.length() - 2);
		}
	}
	
	/**
	 * Generates a SeRQL query for getting all information about an InformationModel
	 * 
	 * Binds BINDING_INFO_MODEL, BINDING_INFO_MODEL_NAME, BINDING_FEATURE_TYPE and BINDING_VOCABULARY
	 * @param type
	 * @param namespace
	 * @return
	 */
	public String selectInformationModels(IterableNamespaceContext namespace) throws SerqlException {
		StringBuilder sb = new StringBuilder();
		
		sb.append(String.format("SELECT\n"));
		sb.append(String.format("    %1$s, %2$s, %3$s, %4$s\n", BINDING_INFO_MODEL, BINDING_INFO_MODEL_NAME, BINDING_FEATURE_TYPE, BINDING_VOCABULARY));
		sb.append(String.format("FROM\n"));
		sb.append(String.format("    {%1$s} TopologyScheme:hasFeatureType {%2$s};\n", BINDING_INFO_MODEL, BINDING_FEATURE_TYPE));
		sb.append(String.format("           TopologyScheme:informationModelName {%1$s};\n", BINDING_INFO_MODEL_NAME));
		sb.append(String.format("           TopologyScheme:hasFeatureType {%1$s};\n", BINDING_FEATURE_TYPE));
		sb.append(String.format("           TopologyScheme:hasVocabulary {%1$s}\n", BINDING_VOCABULARY));
		
		appendNamespaces(sb, namespace);
		
		return sb.toString();
	}
}
