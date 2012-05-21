package org.auscope.portal.gsml;

import java.lang.reflect.Field;

import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;

import junit.framework.Assert;

import org.auscope.portal.core.test.PortalTestClass;
import org.junit.Test;


/**
 * The Class TestYilgarnNamespaceContext.
 */
public class TestYilgarnNamespaceContext extends PortalTestClass  {

    /** The TEST prefix. */
    private static final String TESTPREFIX = "ogc";

    /** The TEST_FAKE_PREFIX . */
    private static final String TESTFAKEPREFIX = "uHaHa";

    /** The namespace uri. */
    private static final String TESTNAMESPACEURI = "http://www.opengis.net/ogc";


    /**
     * Test context.
     */
    @Test
    public void testContext() {

        NamespaceContext context = new YilgarnNamespaceContext();

        Assert.assertEquals(TESTNAMESPACEURI, context.getNamespaceURI(TESTPREFIX));
        Assert.assertEquals(XMLConstants.NULL_NS_URI, context.getNamespaceURI(TESTFAKEPREFIX));
    }

}
