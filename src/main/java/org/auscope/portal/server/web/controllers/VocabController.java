package org.auscope.portal.server.web.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.VocabularyCacheService;
import org.auscope.portal.server.web.service.NvclVocabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import au.gov.geoscience.portal.services.vocabularies.VocabularyLookup;

/**
 * Controller that enables access to vocabulary services.
 */
@Controller
public class VocabController extends BasePortalController {
	
	public static final String TIMESCALE_VOCABULARY_ID = "vocabularyGeologicTimescales";
	public static final String COMMODITY_VOCABULARY_ID = "vocabularyCommodities";
	public static final String MINE_STATUS_VOCABULARY_ID = "vocabularyMineStatuses";
	public static final String RESOURCE_VOCABULARY_ID = "vocabularyResourceCategories";
	public static final String RESERVE_VOCABULARY_ID = "vocabularyReserveCategories";
	
	
    private final Log log = LogFactory.getLog(getClass());

    private NvclVocabService nvclVocabService;
    private VocabularyCacheService vocabularyCacheService;

    /**
     * Construct
     * 
     * @param
     */
    @Autowired
    public VocabController(NvclVocabService nvclVocabService, VocabularyCacheService vocabularyCacheService) {
        super();
        this.nvclVocabService = nvclVocabService;
        this.vocabularyCacheService = vocabularyCacheService;
    }

    /**
     * Performs a query to the vocabulary service on behalf of the client and returns a JSON Map success: Set to either true or false data: The raw XML response
     * scopeNote: The scope note element from the response label: The label element from the response
     * 
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
            List<String> definitions = nvclVocabService.getScalarDefinitionsByLabel(label);

            String labelString = null;
            String scopeNoteString = null;
            String definitionString = null;
            if (definitions != null && definitions.size() > 0) {
                labelString = label;
                scopeNoteString = definitions.get(0); //this is for legacy support
                definitionString = definitions.get(0);
            }

            return generateJSONResponseMAV(true,
                    createScalarQueryModel(scopeNoteString, labelString, definitionString), "");
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
        	urnLabelMappings = vocabularyCacheService.getVocabularyCacheById(COMMODITY_VOCABULARY_ID);
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
    
	@RequestMapping("getAllMineStatuses.do")
	public ModelAndView getAllMineStatuses() throws Exception {
		JSONArray dataItems = new JSONArray();
		Map<String, String> urnLabelMappings = null;

		// Attempt to request and parse our response
		try {
			urnLabelMappings = vocabularyCacheService.getVocabularyCacheById(MINE_STATUS_VOCABULARY_ID);
		} catch (Exception ex) {
			// On error, just return failure JSON (and the response string if
			// any)
			log.error("Error accessing commodity mappings: " + ex.getMessage());
			log.debug("Exception: ", ex);
			return generateJSONResponseMAV(false);
		}

		// Turn our map of urns -> labels into an array of arrays for the view
		for (String urn : urnLabelMappings.keySet()) {
			String label = urnLabelMappings.get(urn);

			JSONArray tableRow = new JSONArray();
			tableRow.add(urn);
			tableRow.add(label);
			dataItems.add(tableRow);
		}

		return generateJSONResponseMAV(true, dataItems, "");
	}

	@RequestMapping("getAllJorcCategories.do")
	public ModelAndView getAllJorcCategories() throws Exception {
		JSONArray dataItems = new JSONArray();
		Map<String, String> reserveCategoryMappings = null;
		Map<String, String> resourceCategoryMappings = null;
		Map<String, String> jorcCategoryMappings = new HashMap<String, String>();

		// Attempt to request and parse our response
		try {
			resourceCategoryMappings = vocabularyCacheService.getVocabularyCacheById(RESOURCE_VOCABULARY_ID);

			reserveCategoryMappings = vocabularyCacheService.getVocabularyCacheById(RESERVE_VOCABULARY_ID);

			jorcCategoryMappings.putAll(resourceCategoryMappings);
			jorcCategoryMappings.putAll(reserveCategoryMappings);

			jorcCategoryMappings.put(VocabularyLookup.RESERVE_CATEGORY.uri(), "any reserves");
			jorcCategoryMappings.put(VocabularyLookup.RESOURCE_CATEGORY.uri(), "any resources");
		} catch (Exception ex) {
			// On error, just return failure JSON (and the response string if
			// any)
			log.error("Error accessing JORC mappings: " + ex.getMessage());
			log.debug("Exception: ", ex);
			return generateJSONResponseMAV(false);
		}

		// Turn our map of urns -> labels into an array of arrays for the view
		for (String urn : jorcCategoryMappings.keySet()) {
			String label = jorcCategoryMappings.get(urn);

			JSONArray tableRow = new JSONArray();
			tableRow.add(urn);
			tableRow.add(label);
			dataItems.add(tableRow);
		}

		return generateJSONResponseMAV(true, dataItems, "");

	}

	@RequestMapping("getAllTimescales.do")
	public ModelAndView getAllTimescales() throws Exception {
		JSONArray dataItems = new JSONArray();

		Map<String, String> timescaleMappings = new HashMap<String, String>();

		// Attempt to request and parse our response
		try {
			timescaleMappings = vocabularyCacheService.getVocabularyCacheById(TIMESCALE_VOCABULARY_ID);

		} catch (Exception ex) {
			// On error, just return failure JSON (and the response string if
			// any)
			log.error("Error accessing geologic timescale mappings: " + ex.getMessage());
			log.debug("Exception: ", ex);
			return generateJSONResponseMAV(false);
		}

		// Turn our map of urns -> labels into an array of arrays for the view
		for (String urn : timescaleMappings.keySet()) {
			String label = timescaleMappings.get(urn);

			JSONArray tableRow = new JSONArray();
			tableRow.add(urn);
			tableRow.add(label);
			dataItems.add(tableRow);
		}

		return generateJSONResponseMAV(true, dataItems, "");

	}
}
