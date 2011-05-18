package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.auscope.portal.registry.InformationModel;
import org.auscope.portal.registry.PortalRegistryNamespace;
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
	 * Attempts to parse a list of information models from the Sesame service
	 */
	public List<InformationModel> getAllInformationModels() throws RepositoryException, SerqlException, QueryEvaluationException, MalformedQueryException {
		RepositoryConnection conn = repository.getConnection();
		Map<String, InformationModel> parsedInformationModels = new HashMap<String, InformationModel>();
		
		try {
			//Generate our SeRQL query and evaluate it
			String queryString = serqlQueryMaker.selectInformationModels(portalRegistryNamespace);
			TupleQuery tupleQuery = conn.prepareTupleQuery(QueryLanguage.SERQL, queryString);
			TupleQueryResult result = tupleQuery.evaluate();
			
			//Get a response and parse it
			try {
				while (result.hasNext()) {
					BindingSet bindingSet = result.next();
					
					//Extract our bound variables and put them into an information model
					String urn = bindingSet.getValue(PortalSerqlQueryMaker.BINDING_INFO_MODEL).stringValue();
					InformationModel infoModel = parsedInformationModels.get(urn);
					if (infoModel == null) {
						String name = bindingSet.getValue(PortalSerqlQueryMaker.BINDING_INFO_MODEL_NAME).stringValue();
						infoModel = new InformationModel(urn, name);
					}
					
					String vocabUrn = bindingSet.getValue(PortalSerqlQueryMaker.BINDING_VOCABULARY).stringValue();
					infoModel.addVocabularyUrn(vocabUrn);
					
					String featureTypeUrn = bindingSet.getValue(PortalSerqlQueryMaker.BINDING_FEATURE_TYPE).stringValue();
					infoModel.addFeatureTypeUrn(featureTypeUrn);
					
					parsedInformationModels.put(vocabUrn, infoModel);
				}
			} finally {
				result.close();
			}
			
		} finally {
			conn.close();
		}
		
		List<InformationModel> infoModelList = new ArrayList<InformationModel>();
		for (InformationModel infoModel : parsedInformationModels.values()) {
			infoModelList.add(infoModel);
		}
		return infoModelList;
	}
}
