package org.auscope.portal.server.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.server.domain.nvcldataservice.AlgorithmOutputClassification;
import org.auscope.portal.server.domain.nvcldataservice.AlgorithmOutputResponse;
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
        Assert.assertEquals(3, response.getBinnedValues().length);

        Assert.assertFalse(response.getBinnedValues()[0].isNumeric());
        Assert.assertFalse(response.getBinnedValues()[1].isNumeric());
        Assert.assertTrue(response.getBinnedValues()[2].isNumeric());

        Assert.assertEquals("Grp1_uTSAV", response.getBinnedValues()[0].getName());
        Assert.assertEquals("Min1_sTSAV", response.getBinnedValues()[1].getName());
        Assert.assertEquals("Number", response.getBinnedValues()[2].getName());

        Assert.assertEquals(3, response.getBinnedValues()[0].getStringValues().size());
        Assert.assertEquals(2, response.getBinnedValues()[1].getStringValues().size()); //The final bin will be all nulls and skipped
        Assert.assertEquals(2, response.getBinnedValues()[2].getNumericValues().size()); //The final bin will be all nulls and skipped

        Assert.assertEquals(3, response.getBinnedValues()[0].getStartDepths().size());
        Assert.assertEquals(2, response.getBinnedValues()[1].getStartDepths().size()); //The final bin will be all nulls and skipped
        Assert.assertEquals(2, response.getBinnedValues()[2].getStartDepths().size()); //The final bin will be all nulls and skipped

        Assert.assertEquals(106.936996459961, (Double)response.getBinnedValues()[0].getStartDepths().get(0), 0.0000001);
        Assert.assertEquals(108.004341125488, (Double)response.getBinnedValues()[0].getStartDepths().get(1), 0.0000001);
        Assert.assertEquals(110.090049743652, (Double)response.getBinnedValues()[0].getStartDepths().get(2), 0.0000001);
        Assert.assertEquals(106.936996459961, (Double)response.getBinnedValues()[1].getStartDepths().get(0), 0.0000001);
        Assert.assertEquals(108.004341125488, (Double)response.getBinnedValues()[1].getStartDepths().get(1), 0.0000001);

        Assert.assertEquals("SULPHATE", response.getBinnedValues()[0].getHighStringValues().get(0));
        Assert.assertEquals(3, (int) response.getBinnedValues()[0].getStringValues().get(0).get("SULPHATE"));
        Assert.assertEquals(1, (int) response.getBinnedValues()[0].getStringValues().get(0).get("INVALID"));
        Assert.assertEquals(2.0, (Double)response.getBinnedValues()[2].getNumericValues().get(0), 0.001);
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

    /**
     * Tests parsing of a downloadscalars request into a BinnedCSVResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetNVCL2_0_CSVBinned_EmptyCSV() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String[] logIds = new String[] {"id1", "id2", "id3"};

        final InputStream responseStream = ResourceUtil.loadResourceAsStream("org/auscope/portal/nvcl/downloadscalar-empty.csv");

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).getDownloadCSVMethod(with(any(String.class)), with(any(String[].class)));will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);will(returnValue(responseStream));
            }
        });

        BinnedCSVResponse response = dataService.getNVCL2_0_CSVBinned(serviceUrl, logIds);
        Assert.assertNotNull(response);
        Assert.assertEquals(3, response.getBinnedValues().length);

        Assert.assertEquals("Grp1_uTSAV", response.getBinnedValues()[0].getName());
        Assert.assertEquals("Min1_sTSAV", response.getBinnedValues()[1].getName());
        Assert.assertEquals("Number", response.getBinnedValues()[2].getName());

        Assert.assertEquals(0, response.getBinnedValues()[0].getNumericValues().size());
        Assert.assertEquals(0, response.getBinnedValues()[1].getNumericValues().size());
        Assert.assertEquals(0, response.getBinnedValues()[2].getNumericValues().size());
    }

    /**
     * Tests parsing an example getAlgorithms response
     * @throws Exception
     */
    @Test
    public void testGetAlgorithms() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String responseString = ResourceUtil.loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetAlgorithmsResponse.xml");

        context.checking(new Expectations() {{
                oneOf(mockMethodMaker).getAlgorithms(serviceUrl);will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsString(mockMethod);will(returnValue(responseString));
        }});

        List<AlgorithmOutputResponse> responses = dataService.getAlgorithms(serviceUrl);

        Assert.assertNotNull(responses);
        Assert.assertEquals(31, responses.size());
        Assert.assertEquals("The Spectral Assistant VNIR", responses.get(0).getAlgorithmName());
        Assert.assertEquals("VNIR Mineral", responses.get(0).getOutputName());
        Assert.assertEquals(1, responses.get(0).getAlgorithmId());
        Assert.assertEquals(5, responses.get(0).getVersions().size());
        Assert.assertEquals(703, responses.get(0).getVersions().get(0).getVersion());
        Assert.assertEquals(82, responses.get(0).getVersions().get(0).getAlgorithmOutputId());
        Assert.assertEquals(601, responses.get(0).getVersions().get(4).getVersion());
        Assert.assertEquals(26, responses.get(0).getVersions().get(4).getAlgorithmOutputId());


        Assert.assertEquals("The Spectral Assistant TIR", responses.get(30).getAlgorithmName());
        Assert.assertEquals("TIR Nil Stat", responses.get(30).getOutputName());
        Assert.assertEquals(3, responses.get(30).getAlgorithmId());
        Assert.assertEquals(4, responses.get(30).getVersions().size());
        Assert.assertEquals(703, responses.get(30).getVersions().get(0).getVersion());
        Assert.assertEquals(73, responses.get(30).getVersions().get(0).getAlgorithmOutputId());
        Assert.assertEquals(701, responses.get(30).getVersions().get(3).getVersion());
        Assert.assertEquals(61, responses.get(30).getVersions().get(3).getAlgorithmOutputId());
    }

    /**
     * Tests parsing an example getClassifications response
     * @throws Exception
     */
    @Test
    public void testGetClassifications() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final int algorithmOutputId = 123;
        final String responseString = ResourceUtil.loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetClassificationsResponse.xml");

        context.checking(new Expectations() {{
                oneOf(mockMethodMaker).getClassifications(serviceUrl, algorithmOutputId);will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsString(mockMethod);will(returnValue(responseString));
        }});

        List<AlgorithmOutputClassification> responses = dataService.getClassifications(serviceUrl, algorithmOutputId);

        Assert.assertNotNull(responses);
        Assert.assertEquals(22, responses.size());
        Assert.assertEquals("NULL", responses.get(0).getClassText());
        Assert.assertEquals(8421504, responses.get(0).getColor());
        Assert.assertEquals(-1, responses.get(0).getIndex());
        Assert.assertEquals("MaskedOff", responses.get(21).getClassText());
        Assert.assertEquals(8947848, responses.get(21).getColor());
        Assert.assertEquals(20, responses.get(21).getIndex());
    }

    /**
     * Tests parsing an example getClassifications error
     * @throws Exception
     */
    @Test
    public void testGetClassifications_Error() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final int algorithmOutputId = 123;
        final String responseString = ResourceUtil.loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetClassificationsResponse_Error.xml");

        context.checking(new Expectations() {{
                oneOf(mockMethodMaker).getClassifications(serviceUrl, algorithmOutputId);will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsString(mockMethod);will(returnValue(responseString));
        }});

        List<AlgorithmOutputClassification> responses = dataService.getClassifications(serviceUrl, algorithmOutputId);
        Assert.assertEquals(0, responses.size());
    }
}
