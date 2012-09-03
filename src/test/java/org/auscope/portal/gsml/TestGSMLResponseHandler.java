package org.auscope.portal.gsml;

import junit.framework.Assert;

import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.junit.Test;

public class TestGSMLResponseHandler extends PortalTestClass  {
    GSMLResponseHandler gsmlResponseHandler = new GSMLResponseHandler();


    @Test
    public void testGetNumberOfFeaturesZero() throws Exception {
        String getFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/yilgarn/YilgarnGeochemistryNoFeatureResponse.xml");
        int numberOfFeatures = gsmlResponseHandler.getNumberOfFeatures(getFeatureResponse);
        Assert.assertEquals("There are 0 features", 0, numberOfFeatures);
    }

    @Test
    public void testGetNumberOfFeaturesTwo() throws Exception {
        String geochemistryGetFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/yilgarn/YilgarnGeochemGetFeatureResponse.xml");
        int numberOfFeatures = gsmlResponseHandler.getNumberOfFeatures(geochemistryGetFeatureResponse);
        Assert.assertEquals("There are 2 features", 2, numberOfFeatures);
    }

}
