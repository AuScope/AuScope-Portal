package org.auscope.portal.server.web.controllers;

import java.util.Map;

import net.sf.json.JSONArray;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.SISSVoc2Service;
import org.auscope.portal.core.services.responses.vocab.Concept;
import org.auscope.portal.server.web.service.ErmlVocabService;
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
    private final Log log = LogFactory.getLog(getClass());


    private PortalPropertyPlaceholderConfigurer portalPropertyPlaceholderConfigurer;
    private SISSVoc2Service sissVoc2Service;
    private ErmlVocabService ermlVocabService;

    /**
     * Construct
     * @param
     */
    @Autowired
    public VocabController(PortalPropertyPlaceholderConfigurer portalPropertyPlaceholderConfigurer,
                           SISSVoc2Service sissVoc2Service, ErmlVocabService ermlVocabService) {
        super();
        this.sissVoc2Service = sissVoc2Service;
        this.ermlVocabService = ermlVocabService;
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
            Concept[] concepts = sissVoc2Service.getConceptByLabel(url, repository, label);

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
        Map<String, String> urnLabelMappings = null;

        //Attempt to request and parse our response
        try {
            urnLabelMappings = ermlVocabService.getGaCommodityConcepts("en");
        } catch (Exception ex) {
            //On error, just return failure JSON (and the response string if any)
            log.error("Error accessing commodity mappings: " + ex.getMessage());
            log.debug("Exception: ", ex);
            return generateJSONResponseMAV(false);
        }

        //Turn our map of urns -> labels into an array of arrays for the view
        for (String urn : urnLabelMappings.keySet()) {
            String label = urnLabelMappings.get(urn);

            JSONArray tableRow = new JSONArray();
            tableRow.add(urn);
            tableRow.add(label);
            dataItems.add(tableRow);
        }

        return generateJSONResponseMAV(true, dataItems, "");
    }
}
