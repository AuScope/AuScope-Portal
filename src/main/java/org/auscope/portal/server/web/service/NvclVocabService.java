package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.SISSVoc3Service;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker.Format;
import org.auscope.portal.core.services.namespaces.VocabNamespaceContext;
import org.auscope.portal.nvcl.NvclVocabMethodMaker;

import com.google.common.collect.Lists;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.ResIterator;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;

/**
 * A specialisation of the SISSVoc3Service to add additional
 * NVCL vocab specific functions
 *
 * @author Josh Vote
 */
public class NvclVocabService extends SISSVoc3Service {

    public static final String NVCL_VOCAB_REPOSITORY = "nvcl-scalars";

    public NvclVocabService(HttpServiceCaller httpServiceCaller,
            NvclVocabMethodMaker nvclVocabMethodMaker, String baseUrl) {
        super(httpServiceCaller, nvclVocabMethodMaker, baseUrl, NVCL_VOCAB_REPOSITORY);
    }

    /**
     * Gets all RDF concepts at the specified repository as a single JENA Model. The results
     * will be requested page by page until the entire repository has been traversed.
     *
     * @return
     * @throws PortalServiceException
     */
    public Model getAllScalarConcepts() throws PortalServiceException {
        Model model = ModelFactory.createDefaultModel();
        int pageNumber = 0;
        int pageSize = this.getPageSize();

        //Request each page in turn - put the results into Model
        do {
            HttpMethodBase method = ((NvclVocabMethodMaker)sissVocMethodMaker).getAllScalars(getBaseUrl(), getRepository(), Format.Rdf, pageSize, pageNumber);
            if (requestPageOfConcepts(method, model)) {
                pageNumber++;
            } else {
                break;
            }
        } while (true);

        return model;
    }

    /**
     * Gets every Jena resource that references the specified label
     * @param label The label to lookup
     * @return
     * @throws PortalServiceException
     */
    public List<Resource> getScalarsByLabel(String label) throws PortalServiceException {
        Model model = ModelFactory.createDefaultModel();
        int pageNumber = 0;
        int pageSize = this.getPageSize();

        //Request each page in turn - put the results into Model
        do {
            HttpMethodBase method = ((NvclVocabMethodMaker)sissVocMethodMaker).getScalarsByLabel(getBaseUrl(), getRepository(), label, Format.Rdf, pageSize, pageNumber);
            if (requestPageOfConcepts(method, model)) {
                pageNumber++;
            } else {
                break;
            }
        } while (true);

        Property prefLabelProperty = model.createProperty(VocabNamespaceContext.SKOS_NAMESPACE, "prefLabel");
        ResIterator it = model.listResourcesWithProperty(prefLabelProperty);

        return Lists.newArrayList(it);
    }

    /**
     * Gets every Jena resource that references the specified label. Then the underlying
     * resources will be queried for their skos:definition. The resulting array of strings will be returned
     *
     * @param label The label to lookup
     * @return
     * @throws PortalServiceException
     */
    public List<String> getScalarDefinitionsByLabel(String label) throws PortalServiceException {
        List<Resource> resources = getScalarsByLabel(label);
        List<String> defns = new ArrayList<String>();

        for (Resource res : resources) {
            Property defnProperty = res.getModel().createProperty(VocabNamespaceContext.SKOS_NAMESPACE, "definition");
            StmtIterator it = res.listProperties(defnProperty);
            while (it.hasNext()) {
                Statement defnStatement = it.next();
                defns.add(defnStatement.getString());
            }
        }

        return defns;
    }
}
