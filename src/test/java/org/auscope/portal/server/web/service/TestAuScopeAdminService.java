package org.auscope.portal.server.web.service;

import java.net.ConnectException;

import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.admin.AdminDiagnosticResponse;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc2MethodMaker;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.server.web.controllers.VocabController;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Test;

/**
 * Unit tests for Admin Service
 * @author Josh Vote
 *
 */
public class TestAuScopeAdminService extends PortalTestClass {
    private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private AuScopeAdminService adminService = new AuScopeAdminService(mockServiceCaller);

    /**
     * Tests that the vocab diagnostics correctly handle responses
     * @throws Exception
     */
    @Test
    public void testVocab() throws Exception {
        final String vocabUrl = "http://fake.vocab/url";
        final String vocabResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/core/test/responses/sissvoc/SISSVocResponse.xml");
        final String repoInfoResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/core/test/responses/sissvoc/SISSVocRepositoryInfoResponse.xml");
        final SISSVoc2MethodMaker methodMaker = new SISSVoc2MethodMaker();


        //Our vocab test fires off 2 requests
        context.checking(new Expectations() {{

            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getRepositoryInfoMethod(vocabUrl).getURI().toString(), null)));
            will(returnValue(repoInfoResponse));

            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getConceptByLabelMethod(vocabUrl, "commodity_vocab", "*").getURI().toString(), null)));
            will(returnValue(vocabResponse));
        }});

        //Our only restriction is asserting no errors
        AdminDiagnosticResponse response = adminService.sissVoc2Connectivity(vocabUrl);
        Assert.assertNotNull(response);
        Assert.assertEquals(0, response.getWarnings().size());
        Assert.assertEquals(0, response.getErrors().size());
    }

    /**
     * Tests that the vocab diagnostics correctly handle responses with malformed XML
     * @throws Exception
     */
    @Test
    public void testVocabMalformedXML() throws Exception {
        final String vocabUrl = "http://fake.vocab/url";
        final String vocabResponse = "<invalid></xml>";
        final String repoInfoResponse = "<invalid></xml>";
        final SISSVoc2MethodMaker methodMaker = new SISSVoc2MethodMaker();


        //Our vocab test fires off 2 requests
        context.checking(new Expectations() {{
            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getRepositoryInfoMethod(vocabUrl).getURI().toString(), null)));
            will(returnValue(repoInfoResponse));

            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getConceptByLabelMethod(vocabUrl, "commodity_vocab", "*").getURI().toString(), null)));
            will(returnValue(vocabResponse));
        }});

        //Our only restriction is asserting errors
        AdminDiagnosticResponse response = adminService.sissVoc2Connectivity(vocabUrl);
        Assert.assertNotNull(response);
        Assert.assertEquals(0, response.getWarnings().size());
        Assert.assertEquals(2, response.getErrors().size());
    }

    /**
     * Tests that the vocab diagnostics correctly handle responses with bad XML
     * @throws Exception
     */
    @Test
    public void testVocabBadXML() throws Exception {
        final String vocabUrl = "http://fake.vocab/url";
        final String vocabResponse = "<validButUnknownXml/>";
        final String repoInfoResponse = "<validButUnknownXml/>";
        final SISSVoc2MethodMaker methodMaker = new SISSVoc2MethodMaker();


        //Our vocab test fires off 2 requests
        context.checking(new Expectations() {{
            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getRepositoryInfoMethod(vocabUrl).getURI().toString(), null)));
            will(returnValue(repoInfoResponse));

            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getConceptByLabelMethod(vocabUrl, "commodity_vocab", "*").getURI().toString(), null)));
            will(returnValue(vocabResponse));
        }});

        //Our only restriction is asserting errors (the first test will succeed because we don't test its validity)
        AdminDiagnosticResponse response = adminService.sissVoc2Connectivity(vocabUrl);
        Assert.assertNotNull(response);
        Assert.assertEquals(0, response.getWarnings().size());
        Assert.assertEquals(1, response.getErrors().size());
    }

    /**
     * Tests that the vocab diagnostics correctly handle connection errors
     * @throws Exception
     */
    @Test
    public void testVocabConnectionErrors() throws Exception {
        final String vocabUrl = "http://fake.vocab/url";
        final SISSVoc2MethodMaker methodMaker = new SISSVoc2MethodMaker();


        //Our vocab test fires off 2 requests
        context.checking(new Expectations() {{
            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getRepositoryInfoMethod(vocabUrl).getURI().toString(), null)));
            will(throwException(new ConnectException()));

            oneOf(mockServiceCaller).getMethodResponseAsString(with(aHttpMethodBase(null, methodMaker.getConceptByLabelMethod(vocabUrl, "commodity_vocab", "*").getURI().toString(), null)));
            will(throwException(new ConnectException()));
        }});

        //Our only restriction is asserting errors
        AdminDiagnosticResponse response = adminService.sissVoc2Connectivity(vocabUrl);
        Assert.assertNotNull(response);
        Assert.assertEquals(0, response.getWarnings().size());
        Assert.assertEquals(2, response.getErrors().size());
    }
}
