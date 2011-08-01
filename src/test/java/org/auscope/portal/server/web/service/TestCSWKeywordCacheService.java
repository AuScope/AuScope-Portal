package org.auscope.portal.server.web.service;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.commons.httpclient.HttpClient;
import org.auscope.portal.HttpMethodBaseMatcher;
import org.auscope.portal.HttpMethodBaseMatcher.HttpMethodType;
import org.auscope.portal.csw.CSWGetDataRecordsFilter;
import org.auscope.portal.csw.CSWThreadExecutor;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.Sequence;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * Unit tests for CSWKeywordCache
 * @author Josh Vote
 *
 */
public class TestCSWKeywordCacheService extends CSWKeywordCacheService {
  //determines the size of the test + congestion
    static final int CONCURRENT_THREADS_TO_RUN = 3;

    //These determine the correct numbers for a single read of the test file
    static final int RECORD_COUNT_TOTAL = 15;
    static final int RECORD_MATCH_TOTAL = 30;

    public TestCSWKeywordCacheService() throws Exception {
        super(null, null, new ArrayList());
    }

    /**
     * JMock context
     */
    private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};


    private CSWKeywordCacheService cswKeywordCacheService;
    private HttpServiceCaller httpServiceCaller = context.mock(HttpServiceCaller.class);
    private CSWThreadExecutor threadExecutor;
    private CSWGetDataRecordsFilter mockFilter = context.mock(CSWGetDataRecordsFilter.class);
    private HttpClient mockHttpClient = context.mock(HttpClient.class);

    private static final String serviceUrlFormatString = "http://cswservice.%1$s.url/";

    /**
     * Initialises each of our unit tests with a new CSWFilterService
     * @throws Exception
     */
    @Before
    public void setup() throws Exception {

        this.threadExecutor = new CSWThreadExecutor();

          //Create our service list
          ArrayList<CSWServiceItem> serviceUrlList = new ArrayList<CSWServiceItem>(CONCURRENT_THREADS_TO_RUN);
          for (int i = 0; i < CONCURRENT_THREADS_TO_RUN; i++){
              serviceUrlList.add(new CSWServiceItem(String.format(serviceUrlFormatString, i + 1)));
          }

        this.cswKeywordCacheService = new CSWKeywordCacheService(threadExecutor, httpServiceCaller, serviceUrlList);
    }

    private static HttpMethodBaseMatcher aHttpMethodBase(HttpMethodType type, String url, String postBody) {
        return new HttpMethodBaseMatcher(type, url, postBody);
    }

    /**
     * Tests a regular update goes through and makes multiple requests over multiple threads
     * @throws Exception
     */
    @Test
    public void testMultiUpdate() throws Exception {
        final String moreRecordsString = org.auscope.portal.Util.loadXML("src/test/resources/cswRecordResponse.xml");
        final String noMoreRecordsString = org.auscope.portal.Util.loadXML("src/test/resources/cswRecordResponse_NoMoreRecords.xml");
        final ByteArrayInputStream t1r1 = new ByteArrayInputStream(moreRecordsString.getBytes());
        final ByteArrayInputStream t1r2 = new ByteArrayInputStream(noMoreRecordsString.getBytes());
        final ByteArrayInputStream t2r1 = new ByteArrayInputStream(noMoreRecordsString.getBytes());
        final ByteArrayInputStream t3r1 = new ByteArrayInputStream(moreRecordsString.getBytes());
        final ByteArrayInputStream t3r2 = new ByteArrayInputStream(noMoreRecordsString.getBytes());

        final Sequence t1Sequence = context.sequence("t1Sequence");
        final Sequence t2Sequence = context.sequence("t2Sequence");
        final Sequence t3Sequence = context.sequence("t3Sequence");

        final Map<String, Integer> expectedResult = new HashMap<String, Integer>();
        final int totalRequestsMade = CONCURRENT_THREADS_TO_RUN + 2;
        expectedResult.put("er:Commodity", new Integer(totalRequestsMade));
        expectedResult.put("gsml:GeologicUnit", new Integer(totalRequestsMade));
        expectedResult.put("er:MineralOccurrence", new Integer(totalRequestsMade));
        expectedResult.put("manhattan", new Integer(totalRequestsMade));
        expectedResult.put("DS_poi", new Integer(totalRequestsMade));
        expectedResult.put("GeologicUnit", new Integer(totalRequestsMade));
        expectedResult.put("poi", new Integer(totalRequestsMade));
        expectedResult.put("Manhattan", new Integer(totalRequestsMade));
        expectedResult.put("landmarks", new Integer(totalRequestsMade));
        expectedResult.put("DS_poly_landmarks", new Integer(totalRequestsMade));
        expectedResult.put("WFS", new Integer(totalRequestsMade * 2));
        expectedResult.put("gsml:MappedFeature", new Integer(totalRequestsMade * 2));
        expectedResult.put("World", new Integer(totalRequestsMade));
        expectedResult.put("points_of_interest", new Integer(totalRequestsMade));
        expectedResult.put("poly_landmarks", new Integer(totalRequestsMade));
        expectedResult.put("MappedFeature", new Integer(totalRequestsMade));

        context.checking(new Expectations() {{
            allowing(httpServiceCaller).getHttpClient();will(returnValue(mockHttpClient));

            //Thread 1 will make 2 requests
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 1), null)), with(any(HttpClient.class)));
            inSequence(t1Sequence);
            will(returnValue(t1r1));
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 1), null)), with(any(HttpClient.class)));
            inSequence(t1Sequence);
            will(returnValue(t1r2));

            //Thread 2 will make 1 requests
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 2), null)), with(any(HttpClient.class)));
            inSequence(t2Sequence);
            will(returnValue(t2r1));

            //Thread 3 will make 2 requests
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 3), null)), with(any(HttpClient.class)));
            inSequence(t3Sequence);
            will(returnValue(t3r1));
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 3), null)), with(any(HttpClient.class)));
            inSequence(t3Sequence);
            will(returnValue(t3r2));
        }});

        //Start our updating and wait for our threads to finish
        Assert.assertTrue(this.cswKeywordCacheService.updateKeywordCache());
        Thread.sleep(50);
        try {
            threadExecutor.getExecutorService().shutdown();
            threadExecutor.getExecutorService().awaitTermination(180, TimeUnit.SECONDS);
        } catch (Exception ex) {
            threadExecutor.getExecutorService().shutdownNow();
            Assert.fail("Exception whilst waiting for update to finish " + ex.getMessage());
        }

        //Check our expected responses
        Assert.assertEquals(expectedResult, this.cswKeywordCacheService.getKeywordCache());

        //Ensure that our internal state is set to NOT RUNNING AN UPDATE
        Assert.assertFalse(this.cswKeywordCacheService.updateRunning);
    }

    /**
     * Tests a regular update goes through and makes multiple requests over multiple threads
     * @throws Exception
     */
    @Test
    public void testMultiUpdateWithErrors() throws Exception {
        final String moreRecordsString = org.auscope.portal.Util.loadXML("src/test/resources/cswRecordResponse.xml");
        final String noMoreRecordsString = org.auscope.portal.Util.loadXML("src/test/resources/cswRecordResponse_NoMoreRecords.xml");
        final ByteArrayInputStream t1r1 = new ByteArrayInputStream(moreRecordsString.getBytes());
        final ByteArrayInputStream t1r2 = new ByteArrayInputStream(noMoreRecordsString.getBytes());
        final ByteArrayInputStream t2r1 = new ByteArrayInputStream(noMoreRecordsString.getBytes());
        final ByteArrayInputStream t3r1 = new ByteArrayInputStream(moreRecordsString.getBytes());
        final ByteArrayInputStream t3r2 = new ByteArrayInputStream(noMoreRecordsString.getBytes());

        final Sequence t1Sequence = context.sequence("t1Sequence");
        final Sequence t2Sequence = context.sequence("t2Sequence");
        final Sequence t3Sequence = context.sequence("t3Sequence");

        final Map<String, Integer> expectedResult = new HashMap<String, Integer>();
        final int totalRequestsMade = CONCURRENT_THREADS_TO_RUN + 1;
        expectedResult.put("er:Commodity", new Integer(totalRequestsMade));
        expectedResult.put("gsml:GeologicUnit", new Integer(totalRequestsMade));
        expectedResult.put("er:MineralOccurrence", new Integer(totalRequestsMade));
        expectedResult.put("manhattan", new Integer(totalRequestsMade));
        expectedResult.put("DS_poi", new Integer(totalRequestsMade));
        expectedResult.put("GeologicUnit", new Integer(totalRequestsMade));
        expectedResult.put("poi", new Integer(totalRequestsMade));
        expectedResult.put("Manhattan", new Integer(totalRequestsMade));
        expectedResult.put("landmarks", new Integer(totalRequestsMade));
        expectedResult.put("DS_poly_landmarks", new Integer(totalRequestsMade));
        expectedResult.put("WFS", new Integer(totalRequestsMade * 2));
        expectedResult.put("gsml:MappedFeature", new Integer(totalRequestsMade * 2));
        expectedResult.put("World", new Integer(totalRequestsMade));
        expectedResult.put("points_of_interest", new Integer(totalRequestsMade));
        expectedResult.put("poly_landmarks", new Integer(totalRequestsMade));
        expectedResult.put("MappedFeature", new Integer(totalRequestsMade));

        context.checking(new Expectations() {{
            allowing(httpServiceCaller).getHttpClient();will(returnValue(mockHttpClient));

            //Thread 1 will make 2 requests
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 1), null)), with(any(HttpClient.class)));
            inSequence(t1Sequence);
            will(returnValue(t1r1));
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 1), null)), with(any(HttpClient.class)));
            inSequence(t1Sequence);
            will(returnValue(t1r2));

            //Thread 2 will throw an exception
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 2), null)), with(any(HttpClient.class)));
            inSequence(t2Sequence);
            will(throwException(new Exception()));

            //Thread 3 will make 2 requests
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 3), null)), with(any(HttpClient.class)));
            inSequence(t3Sequence);
            will(returnValue(t3r1));
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 3), null)), with(any(HttpClient.class)));
            inSequence(t3Sequence);
            will(returnValue(t3r2));
        }});

        //Start our updating and wait for our threads to finish
        Assert.assertTrue(this.cswKeywordCacheService.updateKeywordCache());
        Thread.sleep(50);
        try {
            threadExecutor.getExecutorService().shutdown();
            threadExecutor.getExecutorService().awaitTermination(180, TimeUnit.SECONDS);
        } catch (Exception ex) {
            threadExecutor.getExecutorService().shutdownNow();
            Assert.fail("Exception whilst waiting for update to finish " + ex.getMessage());
        }

        //Check our expected responses
        Assert.assertEquals(expectedResult, this.cswKeywordCacheService.getKeywordCache());

        //Ensure that our internal state is set to NOT RUNNING AN UPDATE
        Assert.assertFalse(this.cswKeywordCacheService.updateRunning);
    }

    /**
     * Tests a regular update goes through and makes multiple requests over multiple threads
     * @throws Exception
     */
    @Test
    public void testMultiUpdateAllErrors() throws Exception {
        final Sequence t1Sequence = context.sequence("t1Sequence");
        final Sequence t2Sequence = context.sequence("t2Sequence");
        final Sequence t3Sequence = context.sequence("t3Sequence");

        final Map<String, Integer> expectedResult = new HashMap<String, Integer>();

        context.checking(new Expectations() {{
            allowing(httpServiceCaller).getHttpClient();will(returnValue(mockHttpClient));

            //Thread 1 will throw an exception
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 1), null)), with(any(HttpClient.class)));
            inSequence(t1Sequence);
            will(throwException(new Exception()));

            //Thread 2 will throw an exception
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 2), null)), with(any(HttpClient.class)));
            inSequence(t2Sequence);
            will(throwException(new Exception()));

            //Thread 3 will throw an exception
            oneOf(httpServiceCaller).getMethodResponseAsStream(with(aHttpMethodBase(HttpMethodType.POST, String.format(serviceUrlFormatString, 3), null)), with(any(HttpClient.class)));
            inSequence(t3Sequence);
            will(throwException(new Exception()));
        }});

        //Start our updating and wait for our threads to finish
        Assert.assertTrue(this.cswKeywordCacheService.updateKeywordCache());
        Thread.sleep(50);
        try {
            threadExecutor.getExecutorService().shutdown();
            threadExecutor.getExecutorService().awaitTermination(180, TimeUnit.SECONDS);
        } catch (Exception ex) {
            threadExecutor.getExecutorService().shutdownNow();
            Assert.fail("Exception whilst waiting for update to finish " + ex.getMessage());
        }

        //Check our expected responses
        Assert.assertEquals(expectedResult, this.cswKeywordCacheService.getKeywordCache());

        //Ensure that our internal state is set to NOT RUNNING AN UPDATE
        Assert.assertFalse(this.cswKeywordCacheService.updateRunning);
    }
}
