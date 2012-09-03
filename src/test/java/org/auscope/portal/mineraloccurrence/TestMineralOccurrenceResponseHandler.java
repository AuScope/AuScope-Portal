package org.auscope.portal.mineraloccurrence;

import java.util.Collection;

import junit.framework.Assert;

import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.core.test.ResourceUtil;
import org.junit.Test;

/**
 * User: Mathew Wyatt
 * Date: 24/03/2009
 * Time: 10:24:29 AM
 */
public class TestMineralOccurrenceResponseHandler extends PortalTestClass {
    MineralOccurrencesResponseHandler mineralOccurrencesResponseHandler = new MineralOccurrencesResponseHandler();

    @Test
    public void testHandleMineResponse() throws Exception {
        String mineGetFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/erml/mine/mineGetFeatureResponse.xml");
        Collection<Mine> mines = mineralOccurrencesResponseHandler.getMines(mineGetFeatureResponse);

        Assert.assertEquals("There are 2 mines", 2, mines.size());
        Assert.assertEquals("The first mine is WOOLDRIDGE CREEK WORKINGS", "WOOLDRIDGE CREEK WORKINGS", ((Mine) mines.toArray()[0]).getMineNamePreffered());
        Assert.assertEquals("The second mine is HALL MAGNESITE MINE", "HALL MAGNESITE MINE", ((Mine) mines.toArray()[1]).getMineNamePreffered());
    }

    @Test
    public void testHandleCommodityResponse() throws Exception {
        String commodityGetFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/erml/commodity/commodityGetFeatureResponse.xml");

        Collection<Commodity> commodities = mineralOccurrencesResponseHandler.getCommodities(commodityGetFeatureResponse);

        Assert.assertEquals("There are 2 commodities", 2, commodities.size());
        Assert.assertEquals("The first one's name is Gold", "Gold", ((Commodity) commodities.toArray()[0]).getCommodityName());
        Assert.assertEquals("The second one's MineralOccurrence source is urn:cgi:feature:GSV:MineralOccurrence:361170", "urn:cgi:feature:GSV:MineralOccurrence:361170", ((Commodity) commodities.toArray()[1]).getSource());
    }

    @Test
    public void testGetNumberOfFeaturesTwo() throws Exception {
        String commodityGetFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/erml/commodity/commodityGetFeatureResponse.xml");
        int numberOfFeatures = mineralOccurrencesResponseHandler.getNumberOfFeatures(commodityGetFeatureResponse);

        Assert.assertEquals("There are 2 features", 2, numberOfFeatures);
    }

    @Test
    public void testGetNumberOfFeaturesZero() throws Exception {
        String getFeatureResponse = ResourceUtil.loadResourceAsString("org/auscope/portal/erml/minocc/mineralOccurrenceNoFeaturesResponse.xml");

        int numberOfFeatures =
            mineralOccurrencesResponseHandler.getNumberOfFeatures(getFeatureResponse);

        Assert.assertEquals("There are 0 features", 0, numberOfFeatures);
    }
}
