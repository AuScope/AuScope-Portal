package org.auscope.portal.server.web;

import java.io.InputStream;
import java.net.ConnectException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.DelayedReturnValueAction;
import org.auscope.portal.server.web.service.HttpServiceCaller;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.api.Action;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.Test;

import junit.framework.Assert;


public class TestDistributedHTTPServiceCaller {
	
	private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};
	
	private HttpMethodBase mockMethod1 = context.mock(HttpMethodBase.class, "method1");
	private HttpMethodBase mockMethod2 = context.mock(HttpMethodBase.class, "method2");
	private HttpMethodBase mockMethod3 = context.mock(HttpMethodBase.class, "method3");
	private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private HttpClient mockHttpClient = context.mock(HttpClient.class);
    private ExecutorService threadPool = Executors.newFixedThreadPool(5);
    private InputStream mockInputStream1 = context.mock(InputStream.class, "stream1");
    private InputStream mockInputStream2 = context.mock(InputStream.class, "stream2");
    private InputStream mockInputStream3 = context.mock(InputStream.class, "stream3");
	
    private static Action delayReturnValue(long msDelay, Object returnValue) throws Exception {
        return new DelayedReturnValueAction(msDelay, returnValue);
    }
    
    private static Calendar timerCalendar;
    private static void startTimer() {
    	timerCalendar = Calendar.getInstance();
    }
    
    private static long endTimer() {
    	return (Calendar.getInstance().getTimeInMillis() - timerCalendar.getTimeInMillis());
    }
    
    /**
     * Tests that exceptions in the HTTP call will result in exceptions in the next
     * @throws Exception 
     */
	@Test
	public void testReturnException() throws Exception {
		final ConnectException expectedError = new ConnectException("fooBARbaz");
		final DistributedHTTPServiceCaller dsc = new DistributedHTTPServiceCaller(Arrays.asList(mockMethod1), mockServiceCaller);
		
		context.checking(new Expectations() {{
			allowing(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod1, mockHttpClient);will(throwException(expectedError));
        }});
		
		dsc.beginCallingServices(threadPool);
		
		Assert.assertTrue(dsc.hasNext());
		
		try {
			dsc.next(); //should throw an exception
			Assert.fail("Exception not thrown!!");
		} catch (DistributedHTTPServiceCallerException ex) {
			Assert.assertEquals(expectedError, ex.getCause());
		}
	}
	
	/**
	 * Tests that calls to next will block
	 * @throws Exception
	 */
	@Test
	public void testBlockingNext() throws Exception {
		final long delay2ms = 100;
		final long timeEpsilonMs = 10; //This should be an order of magnitude smaller than the above delays
		final ConnectException expectedError = new ConnectException("fooBARbaz");
		final DistributedHTTPServiceCaller dsc = new DistributedHTTPServiceCaller(Arrays.asList(mockMethod1, mockMethod2), mockServiceCaller);
		
		context.checking(new Expectations() {{
			allowing(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod1, mockHttpClient);will(throwException(expectedError));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2, mockHttpClient);will(delayReturnValue(delay2ms, mockInputStream2));
        }});
		
		//ensure our available and error data return immediately but our
		dsc.beginCallingServices(threadPool);
		
		//Firstly we should get the error (with little to no delay)
		startTimer();
		Assert.assertTrue(dsc.hasNext());
		Assert.assertTrue(endTimer() < timeEpsilonMs); //hasNext shouldnt block
		try {
			startTimer();
			dsc.next(); //should throw an exception
			Assert.fail("Exception not thrown!!");
		} catch (DistributedHTTPServiceCallerException ex) {
			Assert.assertTrue(endTimer() < timeEpsilonMs); //the first next() shouldnt block
			Assert.assertEquals(expectedError, ex.getCause());
		}
		
		//Then we should get stream 2 after a delay2ms wait
		startTimer();
		Assert.assertTrue(dsc.hasNext());
		Assert.assertTrue(endTimer() < timeEpsilonMs); //hasNext shouldnt block
		startTimer();
		Assert.assertEquals(mockInputStream2, dsc.next());
		long delayTime = endTimer();
		Assert.assertTrue(delayTime >= delay2ms && delayTime <= (delay2ms + timeEpsilonMs)); //this next should block for at least delay2ms
		
		//And then there should be no more data
		Assert.assertFalse(dsc.hasNext());
		Assert.assertNull(dsc.next());
	}
	
	/**
	 * Tests that calls to next will return the NEXT item to complete
	 * @throws Exception
	 */
	@Test
	public void testFastestOrdering() throws Exception {
		final long delay1ms = 400;
		final long delay2ms = 100;
		final long delay3ms = 250;
		
		final DistributedHTTPServiceCaller dsc = new DistributedHTTPServiceCaller(Arrays.asList(mockMethod1, mockMethod2, mockMethod3), mockServiceCaller);
		
		context.checking(new Expectations() {{
			allowing(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod1, mockHttpClient);will(delayReturnValue(delay1ms, mockInputStream1));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2, mockHttpClient);will(delayReturnValue(delay2ms, mockInputStream2));
            oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod3, mockHttpClient);will(delayReturnValue(delay3ms, mockInputStream3));
        }});
		
		//Do some dodgey timings to ensure we get our data in the right order (ie as the input streams become available)
		dsc.beginCallingServices(threadPool);
		
		//We should get stream 2
		Assert.assertTrue(dsc.hasNext());
		Assert.assertEquals(mockInputStream2, dsc.next());
		
		//Then stream 3
		Assert.assertTrue(dsc.hasNext());
		Assert.assertEquals(mockInputStream3, dsc.next());
		
		//Then finally stream 1
		Assert.assertTrue(dsc.hasNext());
		Assert.assertEquals(mockInputStream1, dsc.next());
		
		//And then there should be no more data
		Assert.assertFalse(dsc.hasNext());
		Assert.assertNull(dsc.next());
	}
	
}
