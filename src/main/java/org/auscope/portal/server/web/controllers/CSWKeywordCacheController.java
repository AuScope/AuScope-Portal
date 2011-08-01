package org.auscope.portal.server.web.controllers;

import java.util.Map;

import org.auscope.portal.server.web.service.CSWKeywordCacheService;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
        return generateJSONResponseMAV(true, keywords, "");
    }
}
