package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.auscope.portal.server.web.service.CSWKeywordCacheService;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

/**
 * Unit tests for CSWKeywordCacheController
 * @author Josh Vote
 *
 */
public class TestCSWKeywordCacheController {
    private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};

    private ViewCSWRecordFactory mockViewRecordFactory;
    private CSWKeywordCacheService mockCSWKeywordCacheService;

    private CSWKeywordCacheController controller;


    /**
     * Initialise our unit tests and mock objects
     */
    @Before
    public void init() {
        mockViewRecordFactory = context.mock(ViewCSWRecordFactory.class);
        mockCSWKeywordCacheService = context.mock(CSWKeywordCacheService.class);

        //There should always be a call to mockCSWKeywordCacheService when we create a new CSWKeywordCacheController
        context.checking(new Expectations() {{
            oneOf(mockCSWKeywordCacheService).updateKeywordCache();
        }});

        controller = new CSWKeywordCacheController(mockViewRecordFactory, mockCSWKeywordCacheService);
    }

    /**
     * Tests that the underlying services are called correctly and the response
     * is transformed into an appropriate format
     */
    @Test
    public void testGetKeywords() {
        final Map<String, Integer> expectedKeywords = new HashMap<String, Integer>();
        expectedKeywords.put("keyword1", 5);
        expectedKeywords.put("keyword2", 17);

        ModelMap kw1 = new ModelMap();
        kw1.put("keyword", "keyword1");
        kw1.put("count", 5);
        ModelMap kw2 = new ModelMap();
        kw2.put("keyword", "keyword2");
        kw2.put("count", 17);
        final List<ModelMap> expectedDataObj = Arrays.asList(kw1, kw2);

        context.checking(new Expectations() {{
            oneOf(mockCSWKeywordCacheService).getKeywordCache();will(returnValue(expectedKeywords));
        }});

        ModelAndView mav = controller.getCSWKeywords();
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean)mav.getModel().get("success"));
        Assert.assertEquals(expectedDataObj, mav.getModel().get("data"));
    }
}
