package org.auscope.portal.serql;

import java.util.List;

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
	public static final String BINDING_FEATURE_TYPE_NAME = "FeatureTypeNameURN";
	public static final String BINDING_VOCABULARY = "VocabularyURN";
	public static final String BINDING_WEB_SERVICE = "WebServiceURN";
	public static final String BINDING_WEB_SERVICE_USERS = "WebServiceUserURN";
	public static final String BINDING_WEB_SERVICE_ENDPOINT = "WebServiceEndpoint";
	public static final String BINDING_WEB_SERVICE_TYPES = "WebServiceTypes";
	public static final String BINDING_DATA_SET = "DataSetURN";
	
	
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
	
	private void appendURNRestrictions(StringBuilder sb, String urnBinding, List<String> urns) {
		if (urns == null || urns.isEmpty()) {
			return;
		}
		
		//Just create a big WHERE clause of Var = urn1 OR Var = urn2 OR ...
		sb.append(String.format("WHERE\n"));
		int count = 0;
		for (String urn : urns) {
			sb.append(String.format("    %1$s = <%2$s>", urnBinding, urn));
			if (++count < urns.size()) {
				sb.append(" OR");
			}
			sb.append("\n");
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
		return selectInformationModels(namespace, null);
	}
	
	/**
	 * Generates a SeRQL query for getting all information about an InformationModel
	 * 
	 * Binds BINDING_INFO_MODEL, BINDING_INFO_MODEL_NAME, BINDING_FEATURE_TYPE, BINDING_FEATURE_TYPE_NAME and BINDING_VOCABULARY
	 * @param type
	 * @param namespace
	 * @param informationModelURNs [Optional] list of of URN's (for Information Models) that the result set will be restricted to.
	 * @return
	 */
	public String selectInformationModels(IterableNamespaceContext namespace, List<String> informationModelURNs) throws SerqlException {
		StringBuilder sb = new StringBuilder();
		
		sb.append(String.format("SELECT\n"));
		sb.append(String.format("    %1$s, %2$s, %3$s, %4$s\n", BINDING_INFO_MODEL, BINDING_INFO_MODEL_NAME, BINDING_FEATURE_TYPE, BINDING_VOCABULARY));
		sb.append(String.format("FROM\n"));
		sb.append(String.format("    {%1$s} TopologyScheme:hasFeatureType {%2$s};\n", BINDING_INFO_MODEL, BINDING_FEATURE_TYPE));
		sb.append(String.format("           TopologyScheme:informationModelName {%1$s};\n", BINDING_INFO_MODEL_NAME));
		sb.append(String.format("           TopologyScheme:hasFeatureType {%1$s};\n", BINDING_FEATURE_TYPE));
		sb.append(String.format("           TopologyScheme:hasVocabulary {%1$s};\n", BINDING_VOCABULARY));
		sb.append(String.format("           rdf:type {TopologyScheme:InformationModel}\n"));
		
		appendURNRestrictions(sb, BINDING_INFO_MODEL, informationModelURNs);
		appendNamespaces(sb, namespace);
		
		return sb.toString();
	}
	
	/**
	 * Generates a SeRQL query for getting all information about an FeatureType
	 * 
	 * Binds BINDING_INFO_MODEL, BINDING_FEATURE_TYPE_NAME, BINDING_FEATURE_TYPE and BINDING_WEB_SERVICE
	 * @param type
	 * @param namespace
	 * @return
	 */
	public String selectFeatureTypes(IterableNamespaceContext namespace) throws SerqlException {
		return selectFeatureTypes(namespace, null);
	}
	
	/**
	 * Generates a SeRQL query for getting all information about an InformationModel
	 * 
	 * Binds BINDING_INFO_MODEL, BINDING_FEATURE_TYPE_NAME, BINDING_FEATURE_TYPE and BINDING_WEB_SERVICE
	 * @param type
	 * @param namespace
	 * @param featureTypeUrns [Optional] list of of URN's (for Feature Types) that the result set will be restricted to.
	 * @return
	 */
	public String selectFeatureTypes(IterableNamespaceContext namespace, List<String> featureTypeUrns) throws SerqlException {
		StringBuilder sb = new StringBuilder();
		
		sb.append(String.format("SELECT\n"));
		sb.append(String.format("    %1$s, %2$s, %3$s, %4$s\n", BINDING_FEATURE_TYPE, BINDING_FEATURE_TYPE_NAME, BINDING_INFO_MODEL, BINDING_WEB_SERVICE));
		sb.append(String.format("FROM\n"));
		sb.append(String.format("    {%1$s} TopologyScheme:isFeatureTypeOf {%2$s};\n", BINDING_FEATURE_TYPE, BINDING_INFO_MODEL));
		sb.append(String.format("           TopologyScheme:typeName {%1$s};\n", BINDING_FEATURE_TYPE_NAME));
		sb.append(String.format("           TopologyScheme:hasWebService {%1$s};\n", BINDING_WEB_SERVICE));
		sb.append(String.format("           rdf:type {TopologyScheme:FeatureType}\n"));
		
		appendURNRestrictions(sb, BINDING_FEATURE_TYPE, featureTypeUrns);
		appendNamespaces(sb, namespace);
		
		return sb.toString();
	}
	
	/**
	 * Generates a SeRQL query for getting all information about a WebService
	 * 
	 * Binds BINDING_WEB_SERVICE, BINDING_WEB_SERVICE_ENDPOINT, BINDING_WEB_SERVICE_TYPES, BINDING_FEATURE_TYPE and BINDING_DATA_SET
	 * @param type
	 * @param namespace
	 * @return
	 */
	public String selectWebServices(IterableNamespaceContext namespace) throws SerqlException {
		return selectWebServices(namespace, null);
	}
	
	/**
	 * Generates a SeRQL query for getting all information about a WebService
	 * 
	 * Binds BINDING_WEB_SERVICE, BINDING_WEB_SERVICE_ENDPOINT, BINDING_WEB_SERVICE_TYPES, BINDING_WEB_SERVICE_USERS
	 * @param type
	 * @param namespace
	 * @param webServiceUrns [Optional] list of of URN's (for WebService) that the result set will be restricted to.
	 * @return
	 */
	public String selectWebServices(IterableNamespaceContext namespace, List<String> webServiceUrns) throws SerqlException {
		StringBuilder sb = new StringBuilder();
		
		sb.append(String.format("SELECT\n"));
		sb.append(String.format("    %1$s, %2$s, %3$s, %4$s\n", BINDING_WEB_SERVICE, BINDING_WEB_SERVICE_ENDPOINT, BINDING_WEB_SERVICE_TYPES, BINDING_WEB_SERVICE_USERS));
		sb.append(String.format("FROM\n"));
		sb.append(String.format("    {%1$s} TopologyScheme:isWebServiceOf {%2$s};\n", BINDING_WEB_SERVICE, BINDING_WEB_SERVICE_USERS));
		sb.append(String.format("           TopologyScheme:serviceEndpoint {%1$s};\n", BINDING_WEB_SERVICE_ENDPOINT));
		sb.append(String.format("           rdf:type {%1$s};\n", BINDING_WEB_SERVICE_TYPES));
		sb.append(String.format("           rdf:type {TopologyScheme:WebService}\n"));
		
		appendURNRestrictions(sb, BINDING_WEB_SERVICE, webServiceUrns);
		appendNamespaces(sb, namespace);
		
		return sb.toString();
	}
}
