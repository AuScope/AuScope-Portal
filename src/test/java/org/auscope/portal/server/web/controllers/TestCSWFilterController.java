package org.auscope.portal.server.web.controllers;

import java.util.Collection;

import org.auscope.portal.CSWGetDataRecordsFilterMatcher;
import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.web.service.CSWFilterService;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

/**
 * Unit tests for CSWFilterController
 * @author Josh Vote
 *
 */
public class TestCSWFilterController {
    private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};

    private ViewCSWRecordFactory mockViewRecordFactory;
    private CSWFilterService mockService;
    private CSWFilterController controller;

    /**
     * Initialise our unit tests
     */
    @Before
    public void init() {
        mockViewRecordFactory = context.mock(ViewCSWRecordFactory.class);
        mockService = context.mock(CSWFilterService.class);
        controller = new CSWFilterController(mockService, mockViewRecordFactory);
    }

    private static CSWGetDataRecordsFilterMatcher aCSWFilter(FilterBoundingBox spatialBounds,
            String[] keywords, String capturePlatform, String sensor) {
        return new CSWGetDataRecordsFilterMatcher(spatialBounds,keywords, capturePlatform, sensor);
    }

    /**
     * Tests that requesting filtered records relies correctly on all dependencies
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecords() throws Exception {
        final double east = 0.1;
        final double west = 5.5;
        final double north = 4.8;
        final double south = 8.6;
        final String[] keywords = new String[] {"kw1", "kw2"};
        final String capturePlatform = "capturePlatform";
        final String sensor = "sensor";
        final FilterBoundingBox expectedBBox = new FilterBoundingBox("",
                new double[] {east, south},
                new double[] {west, north});
        final CSWRecord[] filteredRecs = new CSWRecord[] {
                context.mock(CSWRecord.class, "cswRecord1"),
                context.mock(CSWRecord.class, "cswRecord2"),
        };
        final ModelMap mockViewRec1 = context.mock(ModelMap.class, "mockViewRec1");
        final ModelMap mockViewRec2 = context.mock(ModelMap.class, "mockViewRec2");


        context.checking(new Expectations() {{
            oneOf(mockService).getFilteredRecords(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(returnValue(filteredRecs));

            oneOf(mockViewRecordFactory).toView(filteredRecs[0]);will(returnValue(mockViewRec1));
            oneOf(mockViewRecordFactory).toView(filteredRecs[1]);will(returnValue(mockViewRec2));
        }});

        ModelAndView mav = controller.getFilteredCSWRecords(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));
        Collection<ModelMap> dataRecs = (Collection<ModelMap>) mav.getModel().get("data");
        Assert.assertNotNull(dataRecs);
        Assert.assertTrue(dataRecs.contains(mockViewRec1));
        Assert.assertTrue(dataRecs.contains(mockViewRec2));
        Assert.assertEquals(2, dataRecs.size());
    }

    /**
     * Tests that requesting filtered records fails gracefully
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecordsError() throws Exception {
        final double east = 0.1;
        final double west = 5.5;
        final double north = 4.8;
        final double south = 8.6;
        final String[] keywords = new String[] {"kw1", "kw2"};
        final String capturePlatform = "capturePlatform";
        final String sensor = "sensor";
        final FilterBoundingBox expectedBBox = new FilterBoundingBox("",
                new double[] {east, south},
                new double[] {west, north});

        context.checking(new Expectations() {{
            //Throw an error
            oneOf(mockService).getFilteredRecords(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(throwException(new Exception()));
        }});

        ModelAndView mav = controller.getFilteredCSWRecords(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertFalse((Boolean) mav.getModel().get("success"));
    }

    /**
     * Tests that requesting filtered records relies correctly on all dependencies when all optional
     * parameters are omitted
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecordsOptionalParams() throws Exception {
        final Double east = null;
        final Double west = null;
        final Double north = null;
        final Double south = null;
        final String[] keywords = null;
        final String capturePlatform = null;
        final String sensor = null;
        final FilterBoundingBox expectedBBox = null;
        final CSWRecord[] filteredRecs = new CSWRecord[] {
                context.mock(CSWRecord.class, "cswRecord1"),
                context.mock(CSWRecord.class, "cswRecord2"),
        };
        final ModelMap mockViewRec1 = context.mock(ModelMap.class, "mockViewRec1");
        final ModelMap mockViewRec2 = context.mock(ModelMap.class, "mockViewRec2");

        context.checking(new Expectations() {{
            //Throw an error
            oneOf(mockService).getFilteredRecords(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(returnValue(filteredRecs));

            oneOf(mockViewRecordFactory).toView(filteredRecs[0]);will(returnValue(mockViewRec1));
            oneOf(mockViewRecordFactory).toView(filteredRecs[1]);will(returnValue(mockViewRec2));
        }});

        ModelAndView mav = controller.getFilteredCSWRecords(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));
        Collection<ModelMap> dataRecs = (Collection<ModelMap>) mav.getModel().get("data");
        Assert.assertNotNull(dataRecs);
        Assert.assertTrue(dataRecs.contains(mockViewRec1));
        Assert.assertTrue(dataRecs.contains(mockViewRec2));
        Assert.assertEquals(2, dataRecs.size());
    }

    /**
     * Tests that requesting filtered count relies correctly on all dependencies
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecordsCount() throws Exception {
        final double east = 0.1;
        final double west = 5.5;
        final double north = 4.8;
        final double south = 8.6;
        final String[] keywords = new String[] {"kw1", "kw2"};
        final String capturePlatform = "capturePlatform";
        final String sensor = "sensor";
        final FilterBoundingBox expectedBBox = new FilterBoundingBox("",
                new double[] {east, south},
                new double[] {west, north});
        final Integer expectedCount = 15;


        context.checking(new Expectations() {{
            oneOf(mockService).getFilteredRecordsCount(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(returnValue(expectedCount));
        }});

        ModelAndView mav = controller.getFilteredCSWRecordsCount(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));
        Assert.assertEquals(expectedCount, (Integer) mav.getModel().get("data"));
    }

    /**
     * Tests that requesting filtered count relies correctly on all dependencies
     * when all optional parameters are omitted
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecordsCountOptionalParams() throws Exception {
        final Double east = null;
        final Double west = null;
        final Double north = null;
        final Double south = null;
        final String[] keywords = null;
        final String capturePlatform = null;
        final String sensor = null;
        final FilterBoundingBox expectedBBox = null;
        final Integer expectedCount = 15;


        context.checking(new Expectations() {{
            oneOf(mockService).getFilteredRecordsCount(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(returnValue(expectedCount));
        }});

        ModelAndView mav = controller.getFilteredCSWRecordsCount(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertTrue((Boolean) mav.getModel().get("success"));
        Assert.assertEquals(expectedCount, (Integer) mav.getModel().get("data"));
    }

    /**
     * Tests that requesting filtered count relies correctly on all dependencies
     * when all optional parameters are omitted
     * @throws Exception
     */
    @Test
    public void testGetFilteredRecordsCountError() throws Exception {
        final double east = 0.1;
        final double west = 5.5;
        final double north = 4.8;
        final double south = 8.6;
        final String[] keywords = new String[] {"kw1", "kw2"};
        final String capturePlatform = "capturePlatform";
        final String sensor = "sensor";
        final FilterBoundingBox expectedBBox = new FilterBoundingBox("",
                new double[] {east, south},
                new double[] {west, north});


        context.checking(new Expectations() {{
            oneOf(mockService).getFilteredRecordsCount(with(aCSWFilter(expectedBBox, keywords, capturePlatform, sensor)), with(any(Integer.class)));will(throwException(new Exception()));
        }});

        ModelAndView mav = controller.getFilteredCSWRecordsCount(west, east, north, south, keywords, capturePlatform, sensor);
        Assert.assertNotNull(mav);
        Assert.assertFalse((Boolean) mav.getModel().get("success"));
    }
}
