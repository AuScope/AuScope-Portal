package org.auscope.portal.server.web.controllers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.auscope.portal.core.server.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.SISSVoc2Service;
import org.auscope.portal.core.services.responses.vocab.Concept;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.server.web.service.ErmlVocabService;
import org.auscope.portal.server.web.service.NvclVocabService;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;


/**
 * User: Michael Stegherr
 * Date: Sep 14, 2009
 * Time: 11:28:47 AM.
 */
public class TestVocabController extends PortalTestClass {

    /**
     * Main object we are testing.
     */
    private VocabController vocabController;

    private NvclVocabService mockNvclVocabService = context.mock(NvclVocabService.class);
    private ErmlVocabService mockErmlVocabService = context.mock(ErmlVocabService.class);

    /**
     * Setup.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        this.vocabController = new VocabController(mockNvclVocabService, mockErmlVocabService);
    }

    @Test
    public void testGetScalarQuery() throws Exception {
        final String url = "http://example.org";
        final String repository = "repo";
        final String label = "label";
        final List<String> defns = Arrays.asList("defn");

        context.checking(new Expectations() {{
            oneOf(mockNvclVocabService).getScalarDefinitionsByLabel(label);will(returnValue(defns));
        }});

        ModelAndView mav = vocabController.getScalarQuery(repository, label);
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));
        ModelMap data = (ModelMap)mav.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(label, data.get("label"));
        Assert.assertEquals(defns.get(0), data.get("definition"));
        Assert.assertEquals(defns.get(0), data.get("scopeNote"));
    }

    @Test
    public void testGetScalarQueryError() throws Exception {
        final String url = "http://example.org";
        final String repository = "repo";
        final String label = "label";

        context.checking(new Expectations() {{
            oneOf(mockNvclVocabService).getScalarDefinitionsByLabel(label);will(throwException(new PortalServiceException("")));
        }});

        ModelAndView mav = vocabController.getScalarQuery(repository, label);
        Assert.assertNotNull(mav);
        Assert.assertFalse((Boolean) mav.getModel().get("success"));
    }

    @Test
    public void testGetErmlCommoditues() throws Exception {
        final Map<String, String> serviceResult = new HashMap<String, String>();

        serviceResult.put("urn:1", "label1");
        serviceResult.put("urn:2", "label2");


        context.checking(new Expectations() {{
            oneOf(mockErmlVocabService).getGaCommodityConcepts("en");will(returnValue(serviceResult));
        }});

        ModelAndView mav = vocabController.getAllCommodities();
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));

        JSONArray data = (JSONArray) mav.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(serviceResult.size(), data.size());

        //We want to make sure each of our map items are included in the list
        //We do this by removing items from serviceResult as they appear in the response
        //Success will be measured by an empty serviceResult
        for (Object obj : data) {
            String urn = ((JSONArray) obj).getString(0);
            String label = ((JSONArray) obj).getString(1);

            Assert.assertEquals(serviceResult.get(urn), label);
            serviceResult.remove(urn);
        }

        Assert.assertEquals("Service result contains items that were NOT included in the JSON array response", 0, serviceResult.size());
    }

    @Test
    public void testGetErmlCommodituesError() throws Exception {
        context.checking(new Expectations() {{
            oneOf(mockErmlVocabService).getGaCommodityConcepts("en");will(throwException(new PortalServiceException("")));
        }});

        ModelAndView mav = vocabController.getAllCommodities();
        Assert.assertNotNull(mav);
        Assert.assertFalse((Boolean) mav.getModel().get("success"));
    }
}
