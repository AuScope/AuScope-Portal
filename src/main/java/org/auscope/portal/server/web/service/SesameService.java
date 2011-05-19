package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.auscope.portal.registry.BaseConcept;
import org.auscope.portal.registry.BaseConceptFactory;
import org.auscope.portal.registry.FeatureType;
import org.auscope.portal.registry.InformationModel;
import org.auscope.portal.registry.PortalRegistryNamespace;
import org.auscope.portal.registry.WebService;
import org.auscope.portal.serql.PortalSerqlQueryMaker;
import org.auscope.portal.serql.SerqlException;
import org.openrdf.model.Statement;
import org.openrdf.model.Value;
import org.openrdf.query.BindingSet;
import org.openrdf.query.GraphQuery;
import org.openrdf.query.GraphQueryResult;
import org.openrdf.query.MalformedQueryException;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.query.QueryLanguage;
import org.openrdf.query.TupleQuery;
import org.openrdf.query.TupleQueryResult;
import org.openrdf.repository.Repository;
import org.openrdf.repository.RepositoryConnection;
import org.openrdf.repository.RepositoryException;
import org.openrdf.repository.http.HTTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * A service for making queries to a sesame server and then parsing the responses into meaningful objects (that are specific to portal)
 * @author Josh Vote
 *
 */
@Service
public class SesameService {
	
	private Repository repository;
	private PortalSerqlQueryMaker serqlQueryMaker;
	private PortalRegistryNamespace portalRegistryNamespace;
	
	@Autowired
	public SesameService(Repository repository, PortalSerqlQueryMaker serqlQueryMaker) throws RepositoryException {
		this.repository = repository;
		this.serqlQueryMaker = serqlQueryMaker;
		this.portalRegistryNamespace = new PortalRegistryNamespace();
		
		//This must occur
		this.repository.initialize();
	}
	
	/**
	 * Internal generic method for parsing a TupleQueryResult into a Map of parsed results
	 * @param <B>
	 * @param clazz
	 * @param result
	 * @return
	 * @throws QueryEvaluationException
	 */
	private <B extends BaseConcept> Map<String, B> parseTupleQueryResult(Class<B> clazz, String urnBinding, TupleQueryResult result) throws QueryEvaluationException {
		Map<String, B> parsedConcepts = new HashMap<String, B>(); 
		BaseConceptFactory<B> factory = new BaseConceptFactory<B>(clazz);
		
		
		while (result.hasNext()) {
			boolean newInstance = false;
			BindingSet bindingSet = result.next();
			
			
			//Extract our bound variables and put them into an information model
			String urn = bindingSet.getValue(urnBinding).stringValue();
			B concept = parsedConcepts.get(urn);
			if (concept == null) {
				concept = factory.createInstance(urn);
				newInstance = true;
			}
			concept.mergeBindingSet(bindingSet);
			
			if (newInstance) {
				parsedConcepts.put(urn, concept);
			}
		}
		
		return parsedConcepts;
	}
	
	/**
	 * Utility method for making a tuple query and parsing (and merging) the results into a single list of results
	 * @param <B>
	 * @param expectedResultType What class to you want to parse the results into
	 * @param urnBinding The binding name that the query string is using to uniquely identify the URN's of the returned types
	 * @param tupleQueryString The SeRQL query to make
	 * @return
	 */
	private <B extends BaseConcept> List<B> makeTupleQuery(Class<B> expectedResultType, String urnBinding, String tupleQueryString) throws RepositoryException, SerqlException, QueryEvaluationException, MalformedQueryException {
		RepositoryConnection conn = repository.getConnection();
		Map<String, B> parsedConcepts = null;
		
		try {
			//Generate our SeRQL query and evaluate it
			TupleQuery tupleQuery = conn.prepareTupleQuery(QueryLanguage.SERQL, tupleQueryString);
			TupleQueryResult result = tupleQuery.evaluate();
			
			//Get a response and parse it
			try {
				parsedConcepts = this.parseTupleQueryResult(expectedResultType, urnBinding, result);
			} finally {
				result.close();
			}
			
		} finally {
			conn.close();
		}
		
		//Turn our map into a list
		List<B> conceptList = new ArrayList<B>();
		for (B concept : parsedConcepts.values()) {
			conceptList.add(concept);
		}
		return conceptList;
	}
	
	/**
	 * Attempts to parse a list of information models from the Sesame service
	 * @param infoModelIDs [Optional] list of ID's to restrict the result set. If omitted ALL information models will be requested
	 */
	public List<InformationModel> getInformationModels(List<String> infoModelIDs) throws RepositoryException, SerqlException, QueryEvaluationException, MalformedQueryException {		
		String queryString = serqlQueryMaker.selectInformationModels(portalRegistryNamespace, infoModelIDs);
		return makeTupleQuery(InformationModel.class, PortalSerqlQueryMaker.BINDING_INFO_MODEL, queryString);
	}
	
	/**
	 * Attempts to parse a list of feature types from the Sesame service
	 * @param featureTypeIDs [Optional] list of ID's to restrict the result set. If omitted ALL feature types will be requested
	 */
	public List<FeatureType> getFeatureTypes(List<String> featureTypeIDs) throws RepositoryException, SerqlException, QueryEvaluationException, MalformedQueryException {
		String queryString = serqlQueryMaker.selectFeatureTypes(portalRegistryNamespace, featureTypeIDs);
		return makeTupleQuery(FeatureType.class, PortalSerqlQueryMaker.BINDING_FEATURE_TYPE, queryString);
	}
	
	/**
	 * Attempts to parse a list of web services from the Sesame service
	 * @param webServiceIDs [Optional] list of ID's to restrict the result set. If omitted ALL web services will be requested
	 */
	public List<WebService> getWebServices(List<String> webServiceIDs) throws RepositoryException, SerqlException, QueryEvaluationException, MalformedQueryException {
		String queryString = serqlQueryMaker.selectWebServices(portalRegistryNamespace, webServiceIDs);
		return makeTupleQuery(WebService.class, PortalSerqlQueryMaker.BINDING_WEB_SERVICE, queryString);
	}
}
