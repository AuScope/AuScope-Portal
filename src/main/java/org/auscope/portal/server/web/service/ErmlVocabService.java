package org.auscope.portal.server.web.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.SISSVoc3Service;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker.Format;
import org.auscope.portal.core.services.namespaces.VocabNamespaceContext;
import org.auscope.portal.mineraloccurrence.CommodityVocabMethodMaker;
import org.springframework.stereotype.Service;

import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.ResIterator;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;

/**
 * An specialisation of a SISSVoc3Service to better deal with
 * an Earth Resource Markup Language commodity vocabulary.
 * @author Josh Vote
 *
 */
public class ErmlVocabService extends SISSVoc3Service {

    public static final String GA_URN_PATTERN = "urn:cgi:classifier:GA:commodity:.*";
    public static final String REPOSITORY_NAME = "commodity-vocab";

    public ErmlVocabService(HttpServiceCaller httpServiceCaller,
            CommodityVocabMethodMaker commodityVocabMethodMaker, String baseUrl) {
        super(httpServiceCaller, commodityVocabMethodMaker, baseUrl, REPOSITORY_NAME);
    }

    /**
     * Gets all RDF concepts at the specified repository as a single JENA Model. The results
     * will be requested page by page until the entire repository has been traversed.
     *
     * @return
     * @throws PortalServiceException
     */
    public Model getAllCommodityConcepts() throws PortalServiceException {
        Model model = ModelFactory.createDefaultModel();
        int pageNumber = 0;
        int pageSize = this.getPageSize();

        //Request each page in turn - put the results into Model
        do {
            HttpMethodBase method = ((CommodityVocabMethodMaker)sissVocMethodMaker).getAllCommodities(getBaseUrl(), getRepository(), Format.Rdf, pageSize, pageNumber);
            if (requestPageOfConcepts(method, model)) {
                pageNumber++;
            } else {
                break;
            }
        } while (true);

        return model;
    }


    /**
     * Gets a Map of all commodity names keyed by their commodity URI's. The commodity
     * names will be restricted to a specific language.
     *
     * Only the original GA URNs will be returned
     *
     * @param language The language prefix (eg 'en') that the preferred names will be drawn from
     * @return
     */
    public Map<String, String> getGaCommodityConcepts(String language) throws PortalServiceException {
        Map<String, String> result = new HashMap<String, String>();

        Model model = ModelFactory.createDefaultModel();
        int pageNumber = 0;
        int pageSize = this.getPageSize();

        //Request each of the GA commodity names
        do {
            HttpMethodBase method = ((CommodityVocabMethodMaker)sissVocMethodMaker).getCommoditiesMatchingUrn(getBaseUrl(), getRepository(), Format.Rdf, pageSize, pageNumber, GA_URN_PATTERN);
            if (requestPageOfConcepts(method, model)) {
                pageNumber++;
            } else {
                break;
            }
        } while (true);

        //Iterate over all the resources with a preferred label
        Property prefLabelProperty = model.createProperty(VocabNamespaceContext.SKOS_NAMESPACE, "prefLabel");
        Property sameAsProperty = model.createProperty(VocabNamespaceContext.OWL_NAMESPACE, "sameAs");
        ResIterator iterator = model.listResourcesWithProperty(prefLabelProperty);
        while (iterator.hasNext()) {
            //Ensure we only include the preferred labels matching 'language'
            Resource res = iterator.next();
            StmtIterator prefLabelIt = res.listProperties(prefLabelProperty);
            while (prefLabelIt.hasNext()) {
                Statement prefLabelStatement = prefLabelIt.next();
                if (prefLabelStatement.getLanguage().equals(language)) {
                    String prefLabel = prefLabelStatement.getString();
                    Statement sameAsStatement = res.getProperty(sameAsProperty);
                    if (sameAsStatement != null) {
                        String urn = sameAsStatement.getResource().getURI();
                        if (urn != null) {
                            result.put(urn, prefLabel);
                        }
                    }
                }
            }
        }

        return result;
    }
}
