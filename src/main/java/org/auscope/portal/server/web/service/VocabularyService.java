package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.httpclient.methods.GetMethod;
import org.auscope.portal.mineraloccurrence.Mine;
import org.auscope.portal.mineraloccurrence.MineralOccurrencesResponseHandler;
import org.auscope.portal.server.util.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.auscope.portal.server.web.WFSGetFeatureMethodMakerPOST;
import org.auscope.portal.vocabs.Concept;
import org.auscope.portal.vocabs.VocabularyServiceResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * A utility class which provides methods for querying a vocabulary service
 *
 * User: Michael Stegherr
 * Date: Sep 10, 2009
 * Time: 1:41:47 PM
 */
@Service
public class VocabularyService {
    private HttpServiceCaller httpServiceCaller;
    private VocabularyServiceResponseHandler vocabularyServiceResponseHandler;
    
    @Autowired
    @Qualifier(value = "propertyConfigurer")
    private PortalPropertyPlaceholderConfigurer portalPropertyPlaceholderConfigurer;

    /**
     * Initialise
     */
    public VocabularyService() {
        this.httpServiceCaller = new HttpServiceCaller();
        this.vocabularyServiceResponseHandler = new VocabularyServiceResponseHandler();
        new WFSGetFeatureMethodMakerPOST();
    }

    public VocabularyService(HttpServiceCaller httpServiceCaller, VocabularyServiceResponseHandler vocabularyServiceResponseHandler, IWFSGetFeatureMethodMaker methodMaker) {
        this.httpServiceCaller = httpServiceCaller;
        this.vocabularyServiceResponseHandler = vocabularyServiceResponseHandler;
    }

    /**
     * Get all the mines from a given service url and return them as Mine objects
     *
     * @param serviceURL - the service to get all of the mines from
     * @return
     * @throws Exception
     */
    public Collection<Concept> getCommodityConcepts(String commodityName) throws Exception {
        String vocabServiceUrl =
            portalPropertyPlaceholderConfigurer.resolvePlaceholder("HOST.vocabService.url");
        
        String vocabServiceQuery =
            "?repository=commodity_vocab&conceptLabel=" + commodityName;
        
        GetMethod vocabMethod =
            new GetMethod(vocabServiceUrl + vocabServiceQuery);
        
        String vocabResponse =
            httpServiceCaller.getMethodResponseAsString(
                    vocabMethod, httpServiceCaller.getHttpClient());
        
        Collection<Concept> concepts =
            this.vocabularyServiceResponseHandler.getConcepts(vocabResponse);
        
        return concepts;
    }        
}