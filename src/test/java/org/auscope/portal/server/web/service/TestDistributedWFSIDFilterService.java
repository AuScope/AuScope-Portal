package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.server.domain.filter.IFilter;
import org.auscope.portal.server.web.DistributedHTTPServiceCallerException;
import org.auscope.portal.server.web.IWFSGetFeatureMethodMaker;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestDistributedWFSIDFilterService {

	/**
     * JMock context
     */
    private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};
    
    protected final Log log = LogFactory.getLog(getClass());
    
    private DistributedWFSIDFilterService service;
    private IWFSGetFeatureMethodMaker mockMethodMaker = context.mock(IWFSGetFeatureMethodMaker.class);
    private HttpServiceCaller mockServiceCaller = context.mock(HttpServiceCaller.class);
    private HttpClient mockHttpClient = context.mock(HttpClient.class);
    private InputStream mockInputStream = context.mock(InputStream.class);
    private HttpMethodBase mockMethod = context.mock(HttpMethodBase.class, "mockmethod-0");
    private HttpMethodBase mockMethod1 = context.mock(HttpMethodBase.class, "mockmethod-1");
    private HttpMethodBase mockMethod2 = context.mock(HttpMethodBase.class, "mockmethod-2");
    private HttpMethodBase mockMethod3 = context.mock(HttpMethodBase.class, "mockmethod-3");
    private IFilter mockFilter = context.mock(IFilter.class);
    private Executor executor = Executors.newSingleThreadExecutor();
    
    @Before
    public void setup() {
    	service = new DistributedWFSIDFilterService(mockServiceCaller, mockMethodMaker, executor);
    }
    
    /**
     * ensure our HTTP services are called the correct number of times
     * @throws Exception 
     */
    @Test
    public void testSingleServiceCallCount() throws Exception {
    	final String url = "http://foo.bar";
    	final String featureTypeName = "gsml:doesntMatter";
    	final int maxFeatures = 20;
    	
    	final List<InputStream> expectedResult = Arrays.asList(mockInputStream);
    	
		context.checking(new Expectations() {{
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, null, maxFeatures, null);will(returnValue(mockMethod));
    		oneOf(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod, mockHttpClient);will(returnValue(expectedResult.get(0)));
        }});
		
    	Iterator<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, maxFeatures);
    	assertIteratorMatchesList(results, expectedResult);
    	
    }
    
    /**
     * ensure our HTTP services are called the correct number of times
     * @throws Exception 
     */
    @Test
    public void testSingleServiceCallCount2() throws Exception {
    	final String url = "http://foo.bar";
    	final String featureTypeName = "gsml:doesntMatter";
    	final int maxFeatures = 20;
    	final List<InputStream> expectedResult = Arrays.asList(mockInputStream);
    	final String filterString = "<foo/>";
    	
    	//ensure we still make a single call
    	final List<String> ids = new ArrayList<String>();
    	for (int i = 0 ; i < DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST - 1; i++) {
    		ids.add("id:" + i);
    	}
    	
    	context.checking(new Expectations() {{
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, filterString, maxFeatures, null);will(returnValue(mockMethod));
    		oneOf(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod, mockHttpClient);will(returnValue(expectedResult.get(0)));
    		oneOf(mockFilter).getFilterString(null, ids);will(returnValue(filterString));
        }});
    	
    	Iterator<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, mockFilter,maxFeatures, null, ids);
    	assertIteratorMatchesList(results, expectedResult);
    }
    
    /**
     * ensure our HTTP services are called the correct number of times
     * @throws Exception 
     */
    @Test
    public void testMultiServiceCallCount() throws Exception {
    	final String url = "http://foo.bar";
    	final String featureTypeName = "gsml:doesntMatter";
    	final int maxFeatures = 20;
    	final List<InputStream> expectedResult = Arrays.asList(mockInputStream, mockInputStream, mockInputStream);
    	final String filterString1 = "<foo/>";
    	final String filterString2 = "<bar/>";
    	final String filterString3 = "<baz/>";
    	
    	//ensure we make 3 requests (the last being for a single ID)
    	final List<String> ids = new ArrayList<String>();
    	final int idsSize = ((DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST * 2) + 1);
    	final int expectedRequests = 3;
    	for (int i = 0 ; i < idsSize; i++) {
    		ids.add("id:" + i);
    	}
    	
    	final List<String> idSet1 = ids.subList(0, DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST);
    	final List<String> idSet2 = ids.subList(DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST, DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST * 2);
    	final List<String> idSet3 = ids.subList(DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST * 2, 1 + DistributedWFSIDFilterService.MAXIMUM_IDS_PER_REQUEST * 2);
    	
    	context.checking(new Expectations() {{
    		allowing(mockServiceCaller).getHttpClient();will(returnValue(mockHttpClient));
    		
    		oneOf(mockFilter).getFilterString(null, idSet1);will(returnValue(filterString1));
    		oneOf(mockFilter).getFilterString(null, idSet2);will(returnValue(filterString2));
    		oneOf(mockFilter).getFilterString(null, idSet3);will(returnValue(filterString3));
    		
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, filterString1, maxFeatures, null);will(returnValue(mockMethod1));
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, filterString2, maxFeatures, null);will(returnValue(mockMethod2));
    		//Just remember that our final request will have a single ID so maxFeatures will be set to 1
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, filterString3, 1, null);will(returnValue(mockMethod3)); 
    		
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod1, mockHttpClient);will(returnValue(expectedResult.get(0)));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2, mockHttpClient);will(returnValue(expectedResult.get(1)));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod3, mockHttpClient);will(returnValue(expectedResult.get(2)));
        }});
    	
    	Iterator<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, mockFilter,maxFeatures, null, ids);
    	assertIteratorMatchesList(results, expectedResult);
    }
    
    private void assertIteratorMatchesList(Iterator o, List l) {
    	while (o.hasNext()) {
    		Object obj = null;
    		try {
    			obj = o.next();
    		} catch (DistributedHTTPServiceCallerException ex) {
    			log.warn(ex, ex.getCause());
    		}
    		
    		if (!l.contains(obj)) {
    			Assert.fail(String.format("%1$s does not contain %2$s",l,obj));
    		}
    		
    	}
    }
}
