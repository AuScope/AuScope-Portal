package org.auscope.portal;

import java.util.Properties;
import java.util.regex.Pattern;

import org.auscope.portal.HttpMethodBaseMatcher.HttpMethodType;
import org.jmock.Mockery;
import org.jmock.api.Action;
import org.jmock.integration.junit4.JMock;
import org.jmock.lib.legacy.ClassImposteriser;
import org.junit.runner.RunWith;

/**
 * Base class for all unit test classes to inherit from
 *
 * Contains references to the appropriate JMock Mockery instance to utilise
 *
 * @author Josh Vote
 *
 */
@RunWith(JMock.class)
public abstract class PortalTestClass {

    /**
     * used for generating/testing mock objects and their expectations
     */
    protected Mockery context = new Mockery() {{
        setImposteriser(ClassImposteriser.INSTANCE);
    }};

    /**
     * A JMock action similar to returnValue but that only returns AFTER a specified delay
     *
     * It can provide a neat workaround for testing multiple competing threads
     * @param msDelay The delay in milli seconds to wait
     * @param returnValue The value to actually return
     * @return
     * @throws Exception
     */
    protected Action delayReturnValue(long msDelay, Object returnValue) throws Exception {
        return new DelayedReturnValueAction(msDelay, returnValue);
    }

    /**
     * A JMock Matcher for testing for a HttpMethodBase matching a few simplified terms
     * @param type If not null, the type of method to match for
     * @param url If not null the URL to match for (exact match required)
     * @param postBody If not null (and a PostMethod) the body of the post to match for (exact match required)
     * @return
     */
    protected HttpMethodBaseMatcher aHttpMethodBase(HttpMethodType type, String url, String postBody) {
        return new HttpMethodBaseMatcher(type, url, postBody);
    }

    /**
     * A JMock Matcher for testing for a HttpMethodBase matching a few simplified terms
     * @param type If not null, the type of method to match for
     * @param urlPattern If not null the URL pattern to match for
     * @param postBodyPattern If not null (and a PostMethod) the pattern to match against the body of the post.
     * @return
     */
    protected HttpMethodBaseMatcher aHttpMethodBase(HttpMethodType type, Pattern urlPattern, Pattern postBodyPattern) {
        return new HttpMethodBaseMatcher(type, urlPattern, postBodyPattern);
    }

    /**
     * A JMock Matcher for testing for a java.util.Properties object with a single matching property
     * @param property The property name
     * @param value The property value
     * @return
     */
    protected PropertiesMatcher aProperty(String property, String value) {
        Properties prop = new Properties();
        prop.setProperty(property, value);
        return new PropertiesMatcher(prop);
    }
}
