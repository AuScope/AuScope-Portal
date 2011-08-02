package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.auscope.portal.server.web.service.CSWKeywordCacheService;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * A controller class for handling access to the CSWKeywordCacheService
 * @author Josh Vote
 *
 */
@Controller
public class CSWKeywordCacheController extends BaseCSWController {
    private CSWKeywordCacheService keywordCacheService;

    /**
     * Constructor for the spring autowiring
     * @param viewCSWRecordFactory Used for converting CSWRecords for the view
     * @param keywordCacheService Does all work relating to caching CSW record keywords
     */
    @Autowired
    public CSWKeywordCacheController(ViewCSWRecordFactory viewCSWRecordFactory,
            CSWKeywordCacheService keywordCacheService) {
        super(viewCSWRecordFactory);
        this.keywordCacheService = keywordCacheService;
        this.keywordCacheService.updateKeywordCache();
    }

    /**
     * Requests every keyword as cached by
     * @return
     */
    @RequestMapping("getCSWKeywords.do")
    public ModelAndView getCSWKeywords() {
        Map<String, Integer> keywords = this.keywordCacheService.getKeywordCache();

        List<ModelMap> response = new ArrayList<ModelMap>();
        for (String keyword : keywords.keySet()) {
            ModelMap modelMap = new ModelMap();
            modelMap.put("keyword", keyword);
            modelMap.put("count", keywords.get(keyword));
            response.add(modelMap);
        }

        return generateJSONResponseMAV(true, response, "");
    }
}
