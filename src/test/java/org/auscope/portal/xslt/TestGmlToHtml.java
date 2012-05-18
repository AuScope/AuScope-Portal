package org.auscope.portal.xslt;

import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.Util;
import org.auscope.portal.xslt.GmlToHtml;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestGmlToHtml extends PortalTestClass {

    private GmlToHtml gmlToHtml;

    @Before
    public void setup() {
        this.gmlToHtml = new GmlToHtml();
    }

    /**
     * Ensures the transformation occurs with no errors
     */
    @Test
    public void testNoErrors() throws Exception {
        final String wfs = Util.loadXML("src/test/resources/mineGetFeatureResponse.xml");
        final String serviceUrl = "http://example.org/wfs";

        final String response = gmlToHtml.convert(wfs, serviceUrl);
        Assert.assertNotNull(response);
        Assert.assertFalse(response.isEmpty());
    }
}
