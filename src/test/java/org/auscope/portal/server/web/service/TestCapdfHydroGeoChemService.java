package org.auscope.portal.server.web.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.auscope.portal.capdf.CapdfHydroGeoChemFilter;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.service.colorcoding.CapdfHydroChemColorCoding;
import org.auscope.portal.service.colorcoding.ColorCodingConfig;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestCapdfHydroGeoChemService extends PortalTestClass {
    private CapdfHydroGeoChemService service;
    private HttpServiceCaller mockHttpServiceCaller = context.mock(HttpServiceCaller.class);
    private WFSGetFeatureMethodMaker mockWFSGetFeatureMethodMaker = context.mock(WFSGetFeatureMethodMaker.class);

    @Before
    public void setUp() {
        service = new CapdfHydroGeoChemService(mockHttpServiceCaller, mockWFSGetFeatureMethodMaker);
    }

    @Test
    public void testGetHydroGeoChemFilter() throws Exception {
        String batchid = "1234";
        FilterBoundingBox bbox = null;

        String result = service.getHydroGeoChemFilter(batchid, bbox);
        Assert.assertEquals(204, result.length());
        String expected = "<ogc:Filter><ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" ><ogc:PropertyName>batch_id</ogc:PropertyName><ogc:Literal>1234</ogc:Literal></ogc:PropertyIsLike></ogc:Filter>";
        Assert.assertTrue(xmlStringEquals(expected, result, false));
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     *
     * @param filter
     *            The filter
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     */
    @Test
    public void testGetMeasurementLimits() throws Exception {
        String group = "1234";
        String result = service.getMeasurementLimits(group);
        Assert.assertEquals(201, result.length());
        String expected = "<ogc:Filter><ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" ><ogc:PropertyName>group</ogc:PropertyName><ogc:Literal>1234</ogc:Literal></ogc:PropertyIsLike></ogc:Filter>";
        Assert.assertTrue(xmlStringEquals(expected, result, false));
    }

    @Test
    public void testGetHydroGeoChemFilterWithColorCoding()
            throws Exception {

        String batchid = "1234";
        String poi = "NaCl";
        CapdfHydroChemColorCoding ccq = new CapdfHydroChemColorCoding(poi, 1, 20);

        ArrayList<IFilter> result = new ArrayList<IFilter>();

        ColorCodingConfig ccc = ccq.getColorCodingConfig();

        for (int iteration = 0; iteration < ccc.getIntervals(); iteration++) {
            HashMap<String, Double> config = ccc.getIteration(iteration);
            CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(batchid, ccq, config.get("lowerBound"),
                    config.get("upperBound"));
            result.add(filter);
        }

        Assert.assertEquals(12, result.size());
    }

    @Test
    public void testCapdfHydroChemColorCoding()
            throws Exception {

        String batchid = "1234";
        String poi = "NaCl";
        CapdfHydroChemColorCoding ccq = new CapdfHydroChemColorCoding(poi, 1, 20);
        Assert.assertEquals(poi, ccq.getPOI());
        ColorCodingConfig ccc = ccq.getColorCodingConfig();
        Assert.assertEquals(12, ccc.getIntervals());

        HashMap<String, Double> config = ccc.getIteration(0);
        CapdfHydroGeoChemFilter filter = new CapdfHydroGeoChemFilter(batchid, ccq, ccc.getIterationLowerBound(config),
                ccc.getIterationUpperBound(config));
        String result = filter.getFilterStringAllRecords();
        String expected = "<ogc:Filter><ogc:And><ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"
                + "<ogc:PropertyName>batch_id</ogc:PropertyName><ogc:Literal>1234</ogc:Literal></ogc:PropertyIsLike><ogc:PropertyIsLessThan matchCase=\"false\" >"
                + "<ogc:PropertyName>NaCl</ogc:PropertyName><ogc:Literal>1.0</ogc:Literal></ogc:PropertyIsLessThan></ogc:And></ogc:Filter>";
        Assert.assertTrue(xmlStringEquals(expected, result, false));

        config = ccc.getIteration(5);
        filter = new CapdfHydroGeoChemFilter(batchid, ccq, ccc.getIterationLowerBound(config),
                ccc.getIterationUpperBound(config));
        result = filter.getFilterStringAllRecords();
        expected = "<ogc:Filter><ogc:And><ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"
                + "<ogc:PropertyName>batch_id</ogc:PropertyName><ogc:Literal>1234</ogc:Literal></ogc:PropertyIsLike><ogc:PropertyIsGreaterThanOrEqualTo matchCase=\"false\" >"
                + "<ogc:PropertyName>NaCl</ogc:PropertyName><ogc:Literal>8.6</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyIsLessThan matchCase=\"false\" >"
                + "<ogc:PropertyName>NaCl</ogc:PropertyName><ogc:Literal>10.5</ogc:Literal></ogc:PropertyIsLessThan></ogc:And></ogc:Filter>";
        Assert.assertTrue(xmlStringEquals(expected, result, false));

    }
}
