package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.server.domain.filter.IFilter;
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
    
    @Before
    public void setup() {
    	service = new DistributedWFSIDFilterService(mockServiceCaller, mockMethodMaker);
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
    	
    	List<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, maxFeatures);
    	Assert.assertArrayEquals(expectedResult.toArray(), results.toArray());
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
    	
    	List<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, mockFilter,maxFeatures, null, ids);
    	Assert.assertArrayEquals(expectedResult.toArray(), results.toArray());
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
    	
    	//ensure we make 3 requests
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
    		oneOf(mockMethodMaker).makeMethod(url, featureTypeName, filterString3, maxFeatures, null);will(returnValue(mockMethod3));
    		
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod1, mockHttpClient);will(returnValue(expectedResult.get(0)));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod2, mockHttpClient);will(returnValue(expectedResult.get(0)));
    		oneOf(mockServiceCaller).getMethodResponseAsStream(mockMethod3, mockHttpClient);will(returnValue(expectedResult.get(0)));
        }});
    	
    	List<InputStream> results = service.makeIDFilterRequest(url, featureTypeName, mockFilter,maxFeatures, null, ids);
    	Assert.assertArrayEquals(expectedResult.toArray(), results.toArray());
    }
}
