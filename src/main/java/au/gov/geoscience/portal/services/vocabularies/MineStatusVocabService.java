package au.gov.geoscience.portal.services.vocabularies;

import com.hp.hpl.jena.rdf.model.*;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.VocabularyService;
import org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker;
import org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker.Format;
import org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker.View;
import org.auscope.portal.core.services.namespaces.VocabNamespaceContext;

import java.util.HashMap;
import java.util.Map;

public class MineStatusVocabService extends VocabularyService {

    public MineStatusVocabService(HttpServiceCaller httpServiceCaller, VocabularyMethodMaker vocabularyMethodMaker,
            String serviceUrl) {
        super(httpServiceCaller, vocabularyMethodMaker, serviceUrl);
   
    }

    
    public Map<String, String> getAllMineStatusConcepts() throws Exception {
        Map<String, String> result = new HashMap<String, String>();

        Model model = ModelFactory.createDefaultModel();

        int pageNumber = 0;
        int pageSize = this.getPageSize();

        do {
            HttpRequestBase method = vocabularyMethodMaker.getAllConcepts(getServiceUrl(),
                    Format.Rdf, View.description, pageSize, pageNumber);
            if (requestPageOfConcepts(method, model)) {
                pageNumber++;
            } else {
                break;
            }
        } while (true);

        // Iterate over all the resources with a preferred label
        Property prefLabelProperty = model.createProperty(VocabNamespaceContext.SKOS_NAMESPACE, "prefLabel");

        ResIterator iterator = model.listResourcesWithProperty(prefLabelProperty);
        while (iterator.hasNext()) {
            // Ensure we only include the preferred labels matching 'language'
            Resource res = iterator.next();
            StmtIterator prefLabelIt = res.listProperties(prefLabelProperty);
            while (prefLabelIt.hasNext()) {
                Statement prefLabelStatement = prefLabelIt.next();
                String prefLabel = prefLabelStatement.getString();

                String urn = res.getURI();
                if (urn != null) {
                    result.put(urn, prefLabel);
                }

            }
        }

        return result;
    }
}
