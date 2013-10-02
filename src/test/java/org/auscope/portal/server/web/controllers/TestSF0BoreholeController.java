package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.csw.CSWRecordsFilterVisitor;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.test.ByteBufferedServletOutputStream;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.domain.nvcldataservice.MosaicResponse;
import org.auscope.portal.server.web.service.SF0BoreholeService;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * The Class TestNVCLController.
 * @version: $Id$
 */
@SuppressWarnings("rawtypes")
public class TestSF0BoreholeController extends PortalTestClass {


    /** The mock http response. */
    private HttpServletResponse mockHttpResponse;

    /** The mock csw service. */
    private CSWCacheService mockCSWService;

    /** The mock portrayal borehole view service. */
    private SF0BoreholeService mockSF0BoreholeService;

    /** The portrayal borehole view controller. */
    private SF0BoreholeController sf0BoreholeController;

    /**
     * Setup.
     */
    @Before
    public void setUp() {
        this.mockHttpResponse = context.mock(HttpServletResponse.class);
        this.mockSF0BoreholeService = context.mock(SF0BoreholeService.class);
        this.mockCSWService = context.mock(CSWCacheService.class);
        this.sf0BoreholeController = new SF0BoreholeController(this.mockSF0BoreholeService, this.mockCSWService);
    }

    /**
     * Tests to ensure that a non hylogger request calls the correct functions.
     *
     * @throws Exception the exception
     */
    @Test
    public void testNonHyloggerFilter() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final FilterBoundingBox bbox = new FilterBoundingBox("EPSG:4326", new double[] {1, 2}, new double[] {3,4});
        final String sf0BoreholeWfsResponse = "wfsResponse";
        final String sf0BoreholeKmlResponse = "kmlResponse";
        final boolean onlyHylogger = false;
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {{
            oneOf(mockSF0BoreholeService).getAllBoreholes(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, null);
            will(returnValue(new WFSTransformedResponse(sf0BoreholeWfsResponse, sf0BoreholeKmlResponse, mockHttpMethodBase)));

            allowing(mockHttpMethodBase).getURI();
            will(returnValue(httpMethodURI));

        }});

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, onlyHylogger);
        Assert.assertTrue((Boolean) response.getModel().get("success"));

        Map data = (Map) response.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(sf0BoreholeWfsResponse, data.get("gml"));
        Assert.assertEquals(sf0BoreholeKmlResponse, data.get("kml"));
    }

    /**
     * Tests that hylogger filter uses the correct functions.
     *
     * @throws Exception the exception
     */
    @Test
    public void testHyloggerFilter() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final FilterBoundingBox bbox = new FilterBoundingBox("EPSG:4326", new double[] {1, 2}, new double[] {3, 4});
        final boolean onlyHylogger = true;
        final List<String> restrictedIds = Arrays.asList("ID1", "ID2");
        final String sf0BoreholeWfsResponse = "wfsResponse";
        final String sf0BoreholeKmlResponse = "kmlResponse";
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {{
            oneOf(mockSF0BoreholeService).discoverHyloggerBoreholeIDs(with(equal(mockCSWService)),with(any(CSWRecordsFilterVisitor.class)));
            will(returnValue(restrictedIds));

            oneOf(mockSF0BoreholeService).getAllBoreholes(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, restrictedIds);
            will(returnValue(new WFSTransformedResponse(sf0BoreholeWfsResponse, sf0BoreholeKmlResponse, mockHttpMethodBase)));

            allowing(mockHttpMethodBase).getURI();
            will(returnValue(httpMethodURI));
        }});

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, onlyHylogger);
        Assert.assertTrue((Boolean) response.getModel().get("success"));

        Map data = (Map) response.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(sf0BoreholeWfsResponse, data.get("gml"));
        Assert.assertEquals(sf0BoreholeKmlResponse, data.get("kml"));
    }

    /**
     * Tests that hylogger filter uses the correct functions when the underlying hylogger lookup fails.
     *
     * @throws Exception the exception
     */
    @Test
    public void testHyloggerFilterError() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final FilterBoundingBox bbox = new FilterBoundingBox("EPSG:4326", new double[] {1, 2}, new double[] {3, 4});
        final boolean onlyHylogger = true;
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {{
            oneOf(mockSF0BoreholeService).discoverHyloggerBoreholeIDs(with(equal(mockCSWService)),with(any(CSWRecordsFilterVisitor.class)));
            will(throwException(new ConnectException()));

            allowing(mockHttpMethodBase).getURI();
            will(returnValue(httpMethodURI));
        }});

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, onlyHylogger);
        Assert.assertFalse((Boolean) response.getModel().get("success"));
    }

    /**
     * Tests that hylogger filter uses the correct functions when the underlying hylogger lookup returns no results.
     *
     * @throws Exception the exception
     */
    @Test
    public void testHyloggerFilterNoDatasets() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final FilterBoundingBox bbox = new FilterBoundingBox("EPSG:4326", new double[] {1., 2.}, new double[] {3., 4.});
        final boolean onlyHylogger = true;
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {{
            oneOf(mockSF0BoreholeService).discoverHyloggerBoreholeIDs(with(equal(mockCSWService)),with(any(CSWRecordsFilterVisitor.class)));
            will(returnValue(new ArrayList<String>()));

            allowing(mockHttpMethodBase).getURI();
            will(returnValue(httpMethodURI));
        }});

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures, bbox, onlyHylogger);
        Assert.assertFalse((Boolean) response.getModel().get("success"));
    }


    /**
     * Tests to ensure that a serviceFilter request returns correctly.
     *
     * @throws Exception the exception
     */
    @Test
    public void testServiceFilterReturns() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String serviceFilter="http://fake.com";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final String sf0WfsResponse = "wfsResponse";
        final String sf0KmlResponse = "kmlResponse";
        final String onlyHylogger = "off";
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {{
            oneOf(mockSF0BoreholeService).getAllBoreholes(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures,  null, null);
            will(returnValue(new WFSTransformedResponse(sf0WfsResponse, sf0KmlResponse, mockHttpMethodBase)));

            allowing(mockHttpMethodBase).getURI();
            will(returnValue(httpMethodURI));
        }});

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures,"", onlyHylogger,serviceFilter);
        Assert.assertTrue((Boolean) response.getModel().get("success"));

        Map data = (Map) response.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(sf0WfsResponse, data.get("gml"));
        Assert.assertEquals(sf0KmlResponse, data.get("kml"));
    }

    @Test
    public void testServiceFilterReturnsEmptyMAV() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String serviceFilter="http://fakeNOT.com";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDate = "1986-10-09";
        final int maxFeatures = 10;
        final String onlyHylogger = "off";

        ModelAndView response = this.sf0BoreholeController.doSF0BoreholeFilter(serviceUrl, nameFilter, custodianFilter, filterDate, maxFeatures,"", onlyHylogger,serviceFilter);
        Map data = (Map) response.getModel().get("data");
        Assert.assertNull(data);
    }

//    /**
//     * Test that SF0 filter style will return a valid wms layer
//     */
//    @Test
//    public void testSF0FilterStyle() throws Exception {
//       final String nameFilter = "filterBob";
//       final String custodianFilter = "filterCustodian";
//       final String filterDate = "1980-10-09";
//       final int maxFeatures = 10;
//       final String convertedData = "gmlToKMLResult";
//       final String featureType = "gsmlp:BoreholeView";
//       final ByteBufferedServletOutputStream outputStream = new ByteBufferedServletOutputStream(convertedData.getBytes().length);
//
//       context.checking(new Expectations() {{
//           allowing(mockHttpResponse).setContentType(with(any(String.class)));
//           oneOf(mockHttpResponse).getOutputStream();will(returnValue(outputStream));
//       }});
//
//       this.sf0BoreholeController.doSF0FilterStyle(mockHttpResponse, nameFilter, custodianFilter, filterDate,featureType,maxFeatures);
//
//       Assert.assertArrayEquals(convertedData.getBytes(), outputStream.toByteArray());
//
//    }
}
