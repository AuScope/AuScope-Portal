package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.net.ConnectException;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.SISSVoc3Service;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker.Format;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.mineraloccurrence.CommodityVocabMethodMaker;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Lists;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;

public class TestErmlVocabService extends PortalTestClass {
    private HttpMethodBase mockMethod = context.mock(HttpMethodBase.class, "mockMethod");
    private HttpMethodBase mockMethod2 = context.mock(HttpMethodBase.class, "mockMethod2");
    private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private CommodityVocabMethodMaker mockMethodMaker = context.mock(CommodityVocabMethodMaker.class);
    private String baseUrl = "http://example.org:8080/sissvoc/path";

    private ErmlVocabService service;

    @Before
    public void setup() {
        service = new ErmlVocabService(mockServiceCaller, mockMethodMaker, baseUrl);
        service.setPageSize(50);
    }

    private boolean containsResourceUri(List<Resource> list, String uri) {
        for (Resource res : list) {
            if (res.getURI().equals(uri)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests that iterating a repository works as expected - returning all english GA concepts
     * @throws Exception
     */
    @Test
    public void testGetEnglishCommodityConcepts() throws Exception {
        final InputStream rs1 = ResourceUtil.loadResourceAsStream("org/auscope/portal/erml/vocab/SISSVoc3_Concepts_MoreData.xml");
        final InputStream rs2 = ResourceUtil.loadResourceAsStream("org/auscope/portal/erml/vocab/SISSVoc3_Concepts_NoMoreData.xml");

        context.checking(new Expectations() {{
            oneOf(mockMethodMaker).getCommoditiesMatchingUrn(baseUrl, ErmlVocabService.REPOSITORY_NAME, Format.Rdf, service.getPageSize(), 0, ErmlVocabService.GA_URN_PATTERN);will(returnValue(mockMethod));
            oneOf(mockMethodMaker).getCommoditiesMatchingUrn(baseUrl, ErmlVocabService.REPOSITORY_NAME, Format.Rdf, service.getPageSize(), 1, ErmlVocabService.GA_URN_PATTERN);will(returnValue(mockMethod2));

            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);will(returnValue(rs1));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2);will(returnValue(rs2));

            oneOf(mockMethod).releaseConnection();
            oneOf(mockMethod2).releaseConnection();
        }});

        Map<String, String> result = service.getGaCommodityConcepts("en");
        Assert.assertNotNull(result);
        Assert.assertEquals(2, result.size());

        Assert.assertEquals("gold", result.get("urn:cgi:classifier:GA:commodity:Au"));
        Assert.assertEquals("uranium", result.get("urn:cgi:classifier:GA:commodity:U"));
    }

    /**
     * Tests that iterating a repository works as expected - returning only a single french term
     * @throws Exception
     */
    @Test
    public void testGetFrenchCommodityConcepts() throws Exception {
        final InputStream rs1 = ResourceUtil.loadResourceAsStream("org/auscope/portal/erml/vocab/SISSVoc3_Concepts_MoreData.xml");
        final InputStream rs2 = ResourceUtil.loadResourceAsStream("org/auscope/portal/erml/vocab/SISSVoc3_Concepts_NoMoreData.xml");

        context.checking(new Expectations() {{
            oneOf(mockMethodMaker).getCommoditiesMatchingUrn(baseUrl, ErmlVocabService.REPOSITORY_NAME, Format.Rdf, service.getPageSize(), 0, ErmlVocabService.GA_URN_PATTERN);will(returnValue(mockMethod));
            oneOf(mockMethodMaker).getCommoditiesMatchingUrn(baseUrl, ErmlVocabService.REPOSITORY_NAME, Format.Rdf, service.getPageSize(), 1, ErmlVocabService.GA_URN_PATTERN);will(returnValue(mockMethod2));

            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);will(returnValue(rs1));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2);will(returnValue(rs2));

            oneOf(mockMethod).releaseConnection();
            oneOf(mockMethod2).releaseConnection();
        }});

        Map<String, String> result = service.getGaCommodityConcepts("fr");
        Assert.assertNotNull(result);
        Assert.assertEquals(1, result.size());

        Assert.assertEquals("or", result.get("urn:cgi:classifier:GA:commodity:Au"));
    }
}
