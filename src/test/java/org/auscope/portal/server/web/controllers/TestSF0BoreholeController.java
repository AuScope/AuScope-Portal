package org.auscope.portal.server.web.controllers;

import java.net.URI;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.server.web.service.SF0BoreholeService;
import org.jmock.Expectations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.servlet.ModelAndView;

/**
 * The Class TestNVCLController.
 *
 * @version: $Id$
 */
@SuppressWarnings("rawtypes")
public class TestSF0BoreholeController extends PortalTestClass {

    /** The mock portrayal borehole view service. */
    private SF0BoreholeService mockSF0BoreholeService;

    /** The portrayal borehole view controller. */
    private SF0BoreholeController sf0BoreholeController;

    /** The mock csw service. */
    private CSWCacheService mockCSWService;

    /**
     * Setup.
     */
    @Before
    public void setUp() {
        context.mock(HttpServletResponse.class);
        this.mockSF0BoreholeService = context.mock(SF0BoreholeService.class);
        this.mockCSWService = context.mock(CSWCacheService.class);
        this.sf0BoreholeController = new SF0BoreholeController(this.mockSF0BoreholeService, this.mockCSWService);
    }

    /**
     * Tests to ensure that a non hylogger request calls the correct functions.
     *
     * @throws Exception
     *             the exception
     */
    @Test
    public void testNonHyloggerFilter() throws Exception {
        final String serviceUrl = "http://fake.com/wfs";
        final String nameFilter = "filterBob";
        final String custodianFilter = "filterCustodian";
        final String filterDateStart = "1986-10-09";
        final String filterDateEnd = "1986-10-10";
        final int maxFeatures = 10;
        final FilterBoundingBox bbox = new FilterBoundingBox("EPSG:4326", new double[] {1, 2}, new double[] {3, 4});
        final String sf0BoreholeWfsResponse = "wfsResponse";
        final HttpRequestBase mockHttpMethodBase = context.mock(HttpRequestBase.class);
        final URI httpMethodURI = new URI("http://example.com");

        context.checking(new Expectations() {
            {
                oneOf(mockSF0BoreholeService).getAllBoreholes(serviceUrl, nameFilter, custodianFilter,
                        filterDateStart, filterDateEnd, maxFeatures, null);
                will(returnValue(new WFSResponse(sf0BoreholeWfsResponse, mockHttpMethodBase)));

                allowing(mockHttpMethodBase).getURI();
                will(returnValue(httpMethodURI));

            }
        });

        ModelAndView response = this.sf0BoreholeController.doBoreholeFilter(serviceUrl, nameFilter, custodianFilter,
                filterDateStart, filterDateEnd, maxFeatures, null);
        Assert.assertTrue((Boolean) response.getModel().get("success"));

        Map data = (Map) response.getModel().get("data");
        Assert.assertNotNull(data);
        Assert.assertEquals(sf0BoreholeWfsResponse, data.get("gml"));
    }
}
