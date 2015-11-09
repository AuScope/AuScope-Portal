package org.auscope.portal.server.web.service;

import java.io.IOException;
import java.io.InputStream;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.server.domain.nvcldataservice.BinnedCSVResponse;
import org.auscope.portal.server.web.NVCL2_0_DataServiceMethodMaker;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Test;

/**
 * Unit tests for NVCLDataService
 *
 * @author Josh Vote
 *
 */
public class TestNVCL2_0_DataService extends PortalTestClass {

    private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private NVCL2_0_DataServiceMethodMaker mockMethodMaker = context.mock(NVCL2_0_DataServiceMethodMaker.class);
    private HttpRequestBase mockMethod = context.mock(HttpRequestBase.class);
    private NVCL2_0_DataService dataService = new NVCL2_0_DataService(mockServiceCaller, mockMethodMaker);


    /**
     * Tests parsing of a downloadscalars request into a BinnedCSVResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetNVCL2_0_CSVBinned() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String[] logIds = new String[] {"id1", "id2", "id3"};

        final InputStream responseStream = ResourceUtil.loadResourceAsStream("org/auscope/portal/nvcl/downloadscalar.csv");

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).getDownloadCSVMethod(with(any(String.class)), with(any(String[].class)));will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);will(returnValue(responseStream));
            }
        });

        BinnedCSVResponse response = dataService.getNVCL2_0_CSVBinned(serviceUrl, logIds);
        Assert.assertNotNull(response);
        Assert.assertEquals(3, response.getBins().length);

        Assert.assertFalse(response.getBins()[0].isNumeric());
        Assert.assertFalse(response.getBins()[1].isNumeric());
        Assert.assertTrue(response.getBins()[2].isNumeric());

        Assert.assertEquals("Grp1_uTSAV", response.getBins()[0].getName());
        Assert.assertEquals("Min1_sTSAV", response.getBins()[1].getName());
        Assert.assertEquals("Number", response.getBins()[2].getName());

        Assert.assertEquals(3, response.getBins()[0].getValues().size());
        Assert.assertEquals(2, response.getBins()[1].getValues().size()); //The final bin will be all nulls and skipped
        Assert.assertEquals(2, response.getBins()[2].getValues().size()); //The final bin will be all nulls and skipped

        Assert.assertEquals(3, response.getBins()[0].getStartDepths().size());
        Assert.assertEquals(2, response.getBins()[1].getStartDepths().size()); //The final bin will be all nulls and skipped
        Assert.assertEquals(2, response.getBins()[2].getStartDepths().size()); //The final bin will be all nulls and skipped

        Assert.assertEquals(106.936996459961, (Double)response.getBins()[0].getStartDepths().get(0), 0.0000001);
        Assert.assertEquals(108.004341125488, (Double)response.getBins()[0].getStartDepths().get(1), 0.0000001);
        Assert.assertEquals(110.090049743652, (Double)response.getBins()[0].getStartDepths().get(2), 0.0000001);
        Assert.assertEquals(106.936996459961, (Double)response.getBins()[1].getStartDepths().get(0), 0.0000001);
        Assert.assertEquals(108.004341125488, (Double)response.getBins()[1].getStartDepths().get(1), 0.0000001);

        Assert.assertEquals("SULPHATE", response.getBins()[0].getValues().get(0));
        Assert.assertEquals(2.0, (Double)response.getBins()[2].getValues().get(0), 0.001);
    }

    /**
     * Tests cleanup of a downloadscalars request
     *
     * @throws Exception
     */
    @Test(expected=IOException.class)
    public void testGetNVCL2_0_CSVBinned_closeStreamOnError() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String[] logIds = new String[] {"id1", "id2", "id3"};

        final InputStream responseStream = context.mock(InputStream.class);

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).getDownloadCSVMethod(with(any(String.class)), with(any(String[].class)));will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);will(returnValue(responseStream));

                allowing(responseStream).read(with(any(byte[].class)), with(any(Integer.class)), with(any(Integer.class)));will(throwException(new IOException()));

                atLeast(1).of(responseStream).close();
            }
        });

        dataService.getNVCL2_0_CSVBinned(serviceUrl, logIds);
    }
}
