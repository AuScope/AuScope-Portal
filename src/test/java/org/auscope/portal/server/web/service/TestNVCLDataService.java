package org.auscope.portal.server.web.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.ConnectException;
import java.net.URI;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpClientInputStream;
import org.auscope.portal.core.server.http.HttpClientResponse;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.server.domain.nvcldataservice.CSVDownloadResponse;
import org.auscope.portal.server.domain.nvcldataservice.GetDatasetCollectionResponse;
import org.auscope.portal.server.domain.nvcldataservice.GetLogCollectionResponse;
import org.auscope.portal.server.domain.nvcldataservice.MosaicResponse;
import org.auscope.portal.server.domain.nvcldataservice.PlotScalarResponse;
import org.auscope.portal.server.domain.nvcldataservice.TSGDownloadResponse;
import org.auscope.portal.server.domain.nvcldataservice.TSGStatusResponse;
import org.auscope.portal.server.domain.nvcldataservice.WFSDownloadResponse;
import org.auscope.portal.server.domain.nvcldataservice.WFSStatusResponse;
import org.auscope.portal.server.web.NVCLDataServiceMethodMaker;
import org.auscope.portal.server.web.NVCLDataServiceMethodMaker.PlotScalarGraphType;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Test;

/**
 * Unit tests for NVCLDataService
 *
 * @author Josh Vote
 *
 */
public class TestNVCLDataService extends PortalTestClass {

    private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private NVCLDataServiceMethodMaker mockMethodMaker = context.mock(NVCLDataServiceMethodMaker.class);
    private HttpRequestBase mockMethod = context.mock(HttpRequestBase.class);
    private WFSGetFeatureMethodMaker mockWFSMethodMaker = context.mock(WFSGetFeatureMethodMaker.class);
    private NVCLDataService dataService = new NVCLDataService(mockServiceCaller, mockMethodMaker, mockWFSMethodMaker);

    /**
     * Tests parsing of a getDatasetCollectionResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetDatasetCollection() throws Exception {
        final String serviceUrl = "http://example/url";
        final String holeIdentifier = "holeIdentifier";
        final String responseString = ResourceUtil
                .loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetDatasetCollectionResponse.xml");
        final ByteArrayInputStream responseStream = new ByteArrayInputStream(responseString.getBytes());

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).getDatasetCollectionMethod(serviceUrl, holeIdentifier);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(returnValue(new HttpClientInputStream(responseStream, null)));
            }
        });

        List<GetDatasetCollectionResponse> response = dataService.getDatasetCollection(serviceUrl, holeIdentifier);
        Assert.assertNotNull(response);
        Assert.assertEquals(2, response.size());
        Assert.assertEquals("6dd70215-fe38-457c-be42-3b165fd98c7", response.get(0).getDatasetId());
        Assert.assertEquals("WTB5", response.get(0).getDatasetName());
        Assert.assertEquals("http://example1/geoserverBH/", response.get(0).getOmUrl());

        Assert.assertEquals("7de74515-ae48-4aac-cd43-3bb45dd78cc", response.get(1).getDatasetId());
        Assert.assertEquals("Name#2", response.get(1).getDatasetName());
        Assert.assertEquals("http://example2/geoserverBH/", response.get(1).getOmUrl());
    }

    /**
     * Tests parsing of a getDatasetCollectionResponse fails when we fail to connect to the service
     *
     * @throws Exception
     */
    @Test(expected = ConnectException.class)
    public void testGetDatasetCollectionConnectError() throws Exception {
        final String serviceUrl = "http://example/url";
        final String holeIdentifier = "holeIdentifier";

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getDatasetCollectionMethod(serviceUrl, holeIdentifier);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(throwException(new ConnectException()));
            }
        });

        dataService.getDatasetCollection(serviceUrl, holeIdentifier);
    }

    /**
     * Tests parsing of a getLogCollectionResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetLogCollection() throws Exception {
        final String serviceUrl = "http://example/url";
        final String datasetId = "datasetId";
        final boolean forMosaicService = true;
        final String responseString = ResourceUtil
                .loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetLogCollectionResponse.xml");
        final ByteArrayInputStream responseStream = new ByteArrayInputStream(responseString.getBytes());

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getLogCollectionMethod(serviceUrl, datasetId, forMosaicService);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(returnValue(new HttpClientInputStream(responseStream, null)));
            }
        });

        List<GetLogCollectionResponse> response = dataService.getLogCollection(serviceUrl, datasetId, forMosaicService);
        Assert.assertNotNull(response);
        Assert.assertEquals(2, response.size());
        Assert.assertEquals("logid-1", response.get(0).getLogId());
        Assert.assertEquals("logname-1", response.get(0).getLogName());
        Assert.assertEquals(45, response.get(0).getSampleCount());
        Assert.assertEquals("logid-2", response.get(1).getLogId());
        Assert.assertEquals("", response.get(1).getLogName());
        Assert.assertEquals(0, response.get(1).getSampleCount());
    }

    /**
     * Unit test to ensure the NVCLDataService class correctly compensates for the service return 'logName' when mosaicsvc is omitted or false and 'LogName'
     * otherwise
     *
     * @throws Exception
     */
    @Test
    public void testGetLogCollection_LogNameCase() throws Exception {
        final String serviceUrl = "http://example/url";
        final String datasetId = "datasetId";
        final String responseString = ResourceUtil
                .loadResourceAsString("org/auscope/portal/nvcl/NVCL_GetLogCollectionResponse.xml");
        final ByteArrayInputStream is1 = new ByteArrayInputStream(responseString.getBytes());
        final ByteArrayInputStream is2 = new ByteArrayInputStream(responseString.getBytes());

        context.checking(new Expectations() {
            {

                allowing(mockMethodMaker).getLogCollectionMethod(with(any(String.class)), with(any(String.class)),
                        with(any(Boolean.class)));
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(returnValue(new HttpClientInputStream(is1, null)));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(returnValue(new HttpClientInputStream(is2, null)));
            }
        });

        List<GetLogCollectionResponse> response = dataService.getLogCollection(serviceUrl, datasetId, true);
        Assert.assertNotNull(response);
        Assert.assertEquals(2, response.size());
        Assert.assertEquals("logname-1", response.get(0).getLogName());
        Assert.assertEquals("", response.get(1).getLogName());

        response = dataService.getLogCollection(serviceUrl, datasetId, false);
        Assert.assertNotNull(response);
        Assert.assertEquals(2, response.size());
        Assert.assertEquals("", response.get(0).getLogName());
        Assert.assertEquals("logname-2", response.get(1).getLogName());
    }

    /**
     * Tests parsing of a getDatasetCollectionResponse fails when we fail to connect to the service
     *
     * @throws Exception
     */
    @Test(expected = ConnectException.class)
    public void testGetLogCollectionConnectError() throws Exception {
        final String serviceUrl = "http://example/url";
        final String datasetIdentifier = "datasetIdentifier";
        final boolean forMosaicService = false;

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getLogCollectionMethod(serviceUrl, datasetIdentifier, forMosaicService);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod);
                will(throwException(new ConnectException()));
            }
        });

        dataService.getLogCollection(serviceUrl, datasetIdentifier, forMosaicService);
    }

    /**
     * Tests parsing of a GetMosaicResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetMosaic() throws Exception {
        final String serviceUrl = "http://example/url";
        final String logId = "logId";
        final Integer width = 10;
        final Integer startSampleNo = 11;
        final Integer endSampleNo = 12;
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).getMosaicMethod(serviceUrl, logId, width, startSampleNo, endSampleNo);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        MosaicResponse response = dataService.getMosaic(serviceUrl, logId, width, startSampleNo, endSampleNo);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a GetMosaicResponse fails when we fail to connect to the service
     *
     * @throws Exception
     */
    @Test(expected = ConnectException.class)
    public void testGetMosaicConnectError() throws Exception {
        final String serviceUrl = "http://example/url";
        final String logId = "logId";
        final Integer width = 10;
        final Integer startSampleNo = 11;
        final Integer endSampleNo = 12;

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getMosaicMethod(serviceUrl, logId, width, startSampleNo, endSampleNo);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(throwException(new ConnectException()));

            }
        });

        dataService.getMosaic(serviceUrl, logId, width, startSampleNo, endSampleNo);
    }

    /**
     * Tests parsing of a PlotScalarResponse
     *
     * @throws Exception
     */
    @Test
    public void testGetPlotScalar() throws Exception {
        final String serviceUrl = "http://example/url";
        final String logId = "logId";
        final Integer width = 10;
        final Integer height = 9;
        final Integer startDepth = 11;
        final Integer endDepth = 12;
        final Double samplingInterval = 1.5;
        final PlotScalarGraphType graphType = PlotScalarGraphType.ScatteredChart;
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getPlotScalarMethod(serviceUrl, logId, startDepth, endDepth, width, height,
                        samplingInterval, graphType, 0);
                will(returnValue(mockMethod));

                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        PlotScalarResponse response = dataService.getPlotScalar(serviceUrl, logId, startDepth, endDepth, width, height,
                samplingInterval, graphType, 0);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a GetMosaicResponse fails when we fail to connect to the service
     *
     * @throws Exception
     */
    @Test(expected = ConnectException.class)
    public void testGetPlotScalarError() throws Exception {
        final String serviceUrl = "http://example/url";
        final String logId = "logId";
        final Integer width = 10;
        final Integer height = 9;
        final Integer startDepth = 11;
        final Integer endDepth = 12;
        final Double samplingInterval = 1.5;
        final PlotScalarGraphType graphType = PlotScalarGraphType.ScatteredChart;

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getPlotScalarMethod(serviceUrl, logId, startDepth, endDepth, width, height,
                        samplingInterval, graphType, 0);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(throwException(new ConnectException()));
            }
        });

        dataService.getPlotScalar(serviceUrl, logId, startDepth, endDepth, width, height, samplingInterval, graphType,
                0);
    }

    /**
     * Tests parsing of a CSVDownloadResponse
     *
     * @throws Exception
     */
    @Test
    public void testCSVDownload() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String datasetId = "id";

        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/csv";
        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockWFSMethodMaker).makeGetMethod(serviceUrl, "om:GETPUBLISHEDSYSTEMTSA", (Integer) null, null);
                will(returnValue(mockMethod));

                //We aren't testing the query string additions
                allowing(mockMethod).getURI();
                will(returnValue(new URI("")));
                allowing(mockMethod).setURI(with(any(URI.class)));

                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        CSVDownloadResponse response = dataService.getCSVDownload(serviceUrl, datasetId);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests a workaround for the dataservice to overcome omUrl pointing to a geoserver instance RATHER than a WFS endpoint
     *
     * @throws Exception
     */
    @Test
    public void testCSVDownload_NonWFSEndpoint() throws Exception {
        final String gsUrl1 = "http://example/url";
        final String gsUrl2 = "http://example/url/";
        final String actualWFSEndpoint = "http://example/url/wfs";
        final String datasetId = "id";

        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/csv";
        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                allowing(mockWFSMethodMaker).makeGetMethod(actualWFSEndpoint, "om:GETPUBLISHEDSYSTEMTSA",
                        (Integer) null, null);
                will(returnValue(mockMethod));

                //We aren't testing the query string additions
                allowing(mockMethod).getURI();
                will(returnValue(new URI("")));
                allowing(mockMethod).setURI(with(any(URI.class)));

                atLeast(1).of(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                exactly(2).of(httpEntity).getContent();
                will(returnValue(responseStream));
                exactly(2).of(httpEntity).getContentType();
                will(returnValue(mockHeader));
                allowing(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        CSVDownloadResponse response = dataService.getCSVDownload(gsUrl1, datasetId);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());

        response = dataService.getCSVDownload(gsUrl2, datasetId);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a CSVDownloadResponse fails when underlying service fails
     *
     * @throws Exception
     */
    @Test(expected = ConnectException.class)
    public void testCSVDownloadError() throws Exception {
        final String serviceUrl = "http://example/url/wfs";
        final String datasetId = "id";

        context.checking(new Expectations() {
            {

                oneOf(mockWFSMethodMaker).makeGetMethod(serviceUrl, "om:GETPUBLISHEDSYSTEMTSA", (Integer) null, null);
                will(returnValue(mockMethod));

                //We aren't testing the query string additions
                allowing(mockMethod).getURI();
                will(returnValue(new URI("")));
                allowing(mockMethod).setURI(with(any(URI.class)));

                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(throwException(new ConnectException()));
            }
        });

        dataService.getCSVDownload(serviceUrl, datasetId);
    }

    /**
     * Tests parsing of a TSGDownloadResponse
     *
     * @throws Exception
     */
    @Test
    public void testTSGDownload() throws Exception {
        final String serviceUrl = "http://example/url";
        final String email = "email@test";
        final String datasetId = "id";
        final String matchString = null;
        final Boolean lineScan = true;
        final Boolean spectra = false;
        final Boolean profilometer = null;
        final Boolean trayPics = true;
        final Boolean mosaicPics = false;
        final Boolean mapPics = null;
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getDownloadTSGMethod(serviceUrl, email, datasetId, matchString, lineScan,
                        spectra, profilometer, trayPics, mosaicPics, mapPics);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        TSGDownloadResponse response = dataService.getTSGDownload(serviceUrl, email, datasetId, matchString, lineScan,
                spectra, profilometer, trayPics, mosaicPics, mapPics);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a TSGStatusResponse
     *
     * @throws Exception
     */
    @Test
    public void testTSGStatus() throws Exception {
        final String serviceUrl = "http://example/url";
        final String email = "email@test";
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getCheckTSGStatusMethod(serviceUrl, email);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        TSGStatusResponse response = dataService.checkTSGStatus(serviceUrl, email);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a WFSDownloadResponse
     *
     * @throws Exception
     */
    @Test
    public void testDownloadWFS() throws Exception {
        final String serviceUrl = "http://example/url";
        final String email = "email@test";
        final String boreholeId = "bid";
        final String omUrl = "http://omUrl/wfs";
        final String typeName = "type:Name";
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getDownloadWFSMethod(serviceUrl, email, boreholeId, omUrl, typeName);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        WFSDownloadResponse response = dataService.getWFSDownload(serviceUrl, email, boreholeId, omUrl, typeName);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }

    /**
     * Tests parsing of a WFSStatusResponse
     *
     * @throws Exception
     */
    @Test
    public void testWFSStatus() throws Exception {
        final String serviceUrl = "http://example/url";
        final String email = "email@test";
        final InputStream responseStream = context.mock(InputStream.class);
        final HttpResponse httpResponse = context.mock(HttpResponse.class);
        final HttpEntity httpEntity = context.mock(HttpEntity.class);
        final String contentType = "text/html";

        final Header mockHeader = context.mock(Header.class);

        context.checking(new Expectations() {
            {

                oneOf(mockMethodMaker).getCheckWFSStatusMethod(serviceUrl, email);
                will(returnValue(mockMethod));
                oneOf(mockServiceCaller).getMethodResponseAsHttpResponse(mockMethod);
                will(returnValue(new HttpClientResponse(httpResponse, null)));
                atLeast(1).of(httpResponse).getEntity();
                will(returnValue(httpEntity));
                oneOf(httpEntity).getContent();
                will(returnValue(responseStream));
                oneOf(httpEntity).getContentType();
                will(returnValue(mockHeader));
                oneOf(mockHeader).getValue();
                will(returnValue(contentType));
            }
        });

        WFSStatusResponse response = dataService.checkWFSStatus(serviceUrl, email);
        Assert.assertNotNull(response);
        Assert.assertSame(responseStream, response.getResponse());
        Assert.assertEquals(contentType, response.getContentType());
    }
}
