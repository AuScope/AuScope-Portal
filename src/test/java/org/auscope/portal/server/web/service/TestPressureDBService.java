package org.auscope.portal.server.web.service;

import java.io.IOException;
import java.io.InputStream;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpClientInputStream;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.auscope.portal.pressuredb.AvailableOMResponse;
import org.auscope.portal.server.web.PressureDBMethodMaker;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestPressureDBService extends PortalTestClass {
    private PressureDBService service;
    private PressureDBMethodMaker mockMethodMaker = context.mock(PressureDBMethodMaker.class);
    private HttpServiceCaller mockHttpServiceCaller = context.mock(HttpServiceCaller.class);
    private HttpRequestBase mockHttpMethod = context.mock(HttpRequestBase.class);
    private InputStream mockStream = context.mock(InputStream.class);

    @Before
    public void setUp() {
        service = new PressureDBService(mockMethodMaker, mockHttpServiceCaller);
    }

    @Test
    public void testMakeOMRequest() throws Exception {
        final String wellID = "123";
        final String serviceUrl = "http://example.com/pressure-db-dataservice";
        final InputStream responseStream = ResourceUtil
                .loadResourceAsStream("org/auscope/portal/pressuredb/PressureDB-getAvailableOMResponse.xml");

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).makeGetAvailableOMMethod(serviceUrl, wellID);
                will(returnValue(mockHttpMethod));

                oneOf(mockHttpServiceCaller).getMethodResponseAsStream(mockHttpMethod);
                will(returnValue(new HttpClientInputStream(responseStream, null)));

                oneOf(mockHttpMethod).releaseConnection();
            }
        });

        //Make our response and have it parsed
        AvailableOMResponse response = service.makeGetAvailableOMRequest(wellID, serviceUrl);
        Assert.assertNotNull(response);

        Assert.assertEquals(wellID, response.getWellID());

        Assert.assertEquals("http://example.com/pressure-db", response.getOmUrl());
        Assert.assertEquals(true, response.isObsTemperature());
        Assert.assertEquals(true, response.isObsPressureData());
        Assert.assertEquals(false, response.isObsSalinity());

        Assert.assertEquals(false, response.isPressureRft());
        Assert.assertEquals(true, response.isPressureDst());
        Assert.assertEquals(false, response.isPressureFitp());

        Assert.assertEquals(true, response.isSalinityTds());
        Assert.assertEquals(true, response.isSalinityNacl());
        Assert.assertEquals(true, response.isSalinityCl());

        Assert.assertEquals(true, response.isTemperatureT());
    }

    @Test(expected = PortalServiceException.class)
    public void testMakeOMRequestParserError() throws Exception {
        final String wellID = "123";
        final String serviceUrl = "http://example.com/pressure-db-dataservice";
        final InputStream responseStream = ResourceUtil
                .loadResourceAsStream("org/auscope/portal/pressuredb/PressureDB-errorResponse.xml");

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).makeGetAvailableOMMethod(serviceUrl, wellID);
                will(returnValue(mockHttpMethod));

                oneOf(mockHttpServiceCaller).getMethodResponseAsStream(mockHttpMethod);
                will(returnValue(responseStream));

                oneOf(mockHttpMethod).releaseConnection();
            }
        });

        //Make our response and have it parsed - it should result in a parser exception
        service.makeGetAvailableOMRequest(wellID, serviceUrl);
    }

    @Test(expected = PortalServiceException.class)
    public void testMakeOMRequestIOError() throws Exception {
        final String wellID = "123";
        final String serviceUrl = "http://example.com/pressure-db-dataservice";
        final IOException exception = new IOException();

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).makeGetAvailableOMMethod(serviceUrl, wellID);
                will(returnValue(mockHttpMethod));

                oneOf(mockHttpServiceCaller).getMethodResponseAsStream(mockHttpMethod);
                will(throwException(exception));

                oneOf(mockHttpMethod).releaseConnection();
            }
        });

        //make the request - it should throw an exception
        service.makeGetAvailableOMRequest(wellID, serviceUrl);
    }

    @Test
    public void testDownload() throws Exception {
        final String wellID = "123";
        final String serviceUrl = "http://example.com/pressure-db-dataservice";
        final String[] features = new String[] {"a", "b", "c"};
        final HttpClientInputStream responseIs = new HttpClientInputStream(mockStream, null);

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).makeDownloadMethod(serviceUrl, wellID, features);
                will(returnValue(mockHttpMethod));

                oneOf(mockHttpServiceCaller).getMethodResponseAsStream(mockHttpMethod);
                will(returnValue(responseIs));
            }
        });

        //make the request - it should return a stream
        InputStream result = service.makeDownloadRequest(wellID, serviceUrl, features);
        Assert.assertSame(responseIs, result);
    }

    @Test(expected = IOException.class)
    public void testDownloadError() throws Exception {
        final String wellID = "123";
        final String serviceUrl = "http://example.com/pressure-db-dataservice";
        final String[] features = new String[] {"a", "b", "c"};
        final IOException exception = new IOException();

        context.checking(new Expectations() {
            {
                oneOf(mockMethodMaker).makeDownloadMethod(serviceUrl, wellID, features);
                will(returnValue(mockHttpMethod));

                oneOf(mockHttpServiceCaller).getMethodResponseAsStream(mockHttpMethod);
                will(throwException(exception));
            }
        });

        //make the request - it should throw an exception
        service.makeDownloadRequest(wellID, serviceUrl, features);
    }
}
