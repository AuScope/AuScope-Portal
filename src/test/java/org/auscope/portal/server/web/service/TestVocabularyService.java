package org.auscope.portal.server.web.service;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.server.util.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.vocabs.VocabularyServiceResponseHandler;
import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.*;


/**
 * User: Michael Stegherr
 * Date: Sep 14, 2009
 * Time: 11:28:47 AM
 */
public class TestVocabularyService {

    /**
     * JMock context
     */
    private Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};

    /**
     * Main object we are testing
     */
    private VocabularyService vocabularyService;

    /**
     * Mock httpService caller
     */
    private HttpServiceCaller httpServiceCaller = context.mock(HttpServiceCaller.class);

    /**
     * Mock property configurer
     */
    private PortalPropertyPlaceholderConfigurer propertyConfigurer = context.mock(PortalPropertyPlaceholderConfigurer.class);

    @Before
    public void setup() throws Exception {
       /* context.checking(new Expectations() {{
            //constructor gets a host property
            oneOf(propertyConfigurer).resolvePlaceholder(with(any(String.class)));

            //check that the executor was called
            oneOf(threadExecutor).execute(with(any(Runnable.class)));
        }});*/
        VocabularyServiceResponseHandler vocabularyServiceResponseHandler =
            new VocabularyServiceResponseHandler();
        
        this.vocabularyService = new VocabularyService(this.httpServiceCaller, vocabularyServiceResponseHandler, propertyConfigurer);
    }

    /**
     * Test that the function is able to actually load CSW records
     * @throws Exception
     */
    @Test
    public void testGetCommodityConcepts() throws Exception {
        final String commodityName = "test";
        final String serviceUrl = "testURL";
        final String docString = org.auscope.portal.Util.loadXML("src/test/resources/vocabularyServiceResponse.xml");

        context.checking(new Expectations() {{
            oneOf(propertyConfigurer).resolvePlaceholder(with(any(String.class)));will(returnValue(serviceUrl));
            oneOf(httpServiceCaller).getHttpClient();
            oneOf(httpServiceCaller).getMethodResponseAsString(with(any(HttpMethodBase.class)),with(any(HttpClient.class)));will(returnValue(docString));
        }});

        // in the response we loaded from the text file it contains 27 records
        Assert.assertEquals(27, this.vocabularyService.getCommodityConcepts(commodityName).size());
    }
}
