package org.auscope.portal.server.web.controllers;

import net.sf.json.JSONArray;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.SISSVocService;
import org.auscope.portal.core.services.responses.vocab.Concept;
import org.auscope.portal.core.view.JSONModelAndView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller that enables access to vocabulary services.
 */
@Controller
public class VocabController extends BasePortalController {
    /** The name of the SISSVoc repository for ERML commodities */
    public static final String COMMODITY_REPOSITORY = "commodity_vocab";
    /** repository name for the Geoscience Australia darwin theme vocabulary*/
    public static final String DARWIN_REPOSITORY = "ga-darwin";

    private final Log log = LogFactory.getLog(getClass());


    private PortalPropertyPlaceholderConfigurer portalPropertyPlaceholderConfigurer;
    private SISSVocService service;

    /**
     * Construct
     * @param
     */
    @Autowired
    public VocabController(PortalPropertyPlaceholderConfigurer portalPropertyPlaceholderConfigurer,
                           SISSVocService service) {
        super();
        this.service = service;
        this.portalPropertyPlaceholderConfigurer = portalPropertyPlaceholderConfigurer;
    }

    /**
     * Performs a query to the vocabulary service on behalf of the client and returns a JSON Map
     * success: Set to either true or false
     * data: The raw XML response
     * scopeNote: The scope note element from the response
     * label: The label element from the response
     * @param repository
     * @param label
     * @return
     */
    @RequestMapping("/getScalar.do")
    public ModelAndView getScalarQuery(@RequestParam("repository") final String repository,
                                        @RequestParam("label") final String label) throws Exception {



        //Attempt to request and parse our response
        try {
            //Do the request
            String url = portalPropertyPlaceholderConfigurer.resolvePlaceholder("HOST.vocabService.url");
            Concept[] concepts = service.getConceptByLabel(url, repository, label);

            //Extract our strings
            String labelString = "";
            String scopeNoteString = "";
            String definitionString = "";
            if (concepts != null && concepts.length > 0) {
                labelString = concepts[0].getPreferredLabel();
                scopeNoteString = concepts[0].getDefinition();  //this is for legacy support
                definitionString = concepts[0].getDefinition();
            }

            return generateJSONResponseMAV(true, createScalarQueryModel(scopeNoteString, labelString, definitionString), "");
        } catch (Exception ex) {
            //On error, just return failure JSON (and the response string if any)
            log.error("getVocabQuery ERROR: " + ex.getMessage());

            return generateJSONResponseMAV(false, null, "");
        }
    }

    private ModelMap createScalarQueryModel(final String scopeNote, final String label, final String definition) {
        ModelMap map = new ModelMap();
        map.put("scopeNote", scopeNote);
        map.put("definition", definition);
        map.put("label", label);

        return map;
    }

    /**
     * Get all GA commodity URNs with prefLabels
     *
     * @param
     */
    @RequestMapping("getAllCommodities.do")
    public ModelAndView getAllCommodities() throws Exception {
        JSONArray dataItems = new JSONArray();

        //Attempt to request and parse our response
        try {
            //Do the request
            String url = portalPropertyPlaceholderConfigurer.resolvePlaceholder("HOST.vocabService.url");

            Concept[] concepts = service.getCommodityConcepts(url, COMMODITY_REPOSITORY, "urn:cgi:classifierScheme:GA:commodity");

            for(Concept concept : concepts) {
                JSONArray tableRow = new JSONArray();

                tableRow.add(concept.getUrn());
                tableRow.add(concept.getLabel());
            }

            return new JSONModelAndView(dataItems);

        } catch (Exception ex) {
            //On error, just return failure JSON (and the response string if any)
            log.error("getAllCommodities Exception: " + ex.getMessage());

            return new JSONModelAndView(dataItems);
        }
    }
}
