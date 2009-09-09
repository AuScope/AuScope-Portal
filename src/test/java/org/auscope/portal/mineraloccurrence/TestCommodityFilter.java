package org.auscope.portal.mineraloccurrence;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import junit.framework.Assert;

import org.auscope.portal.Util;
import org.junit.Test;


/**
 * User: Michael Stegherr
 * Date: 30/03/2009
 * Time: 3:14:31 PM
 */
public class TestCommodityFilter {

    /**
     * Test without commodity name and group. If there is nothing specified then all of the commodities should be queried.
     */
    /*@Test
    public void testWithNoCommodityName() throws IOException {
        CommodityFilter commodityFilter = new CommodityFilter("", "");
        Assert.assertEquals(
                Util.loadXML("src/test/resources/GetAllCommodities.xml").replace("\n", "").replace(" ", ""),
                commodityFilter.getFilterString().replace("\n", "").replace(" ", ""));
    }*/

    /**
     *  Test with a commodity group. A filter query should be generated searching for commodities with the given group.
     */
    @Test
    public void testWithACommodityGroup() throws IOException {
        CommodityFilter commodityFilter = new CommodityFilter("Industrial Minerals", null);
        Assert.assertEquals(
                Util.loadXML("src/test/resources/GetCommoditiesWithSpecifiedGroup.xml").replace("\n", "").replace(" ", ""),
                commodityFilter.getFilterString().replace("\n", "").replace(" ", ""));
    }

    /**
     *  Test with a commodity name. A filter query should be generated searching for commodities with the given name.
     */
    @Test
    public void testWithACommodityName() throws IOException {
        ArrayList<String> commodityNames = new ArrayList<String>();
        commodityNames.add("Gold");
        
        CommodityFilter commodityFilter = new CommodityFilter("", commodityNames);
        Assert.assertEquals(
                Util.loadXML("src/test/resources/GetCommoditiesWithSpecifiedName.xml").replace("\n", "").replace(" ", ""),
                commodityFilter.getFilterString().replace("\n", "").replace(" ", ""));
    }

    /**
     *  Test with three commodity names. A filter query should be generated searching for commodities with the given name.
     */
    @Test
    public void testWithThreeCommodityNames() throws IOException {
        ArrayList<String> commodityNames = new ArrayList<String>();
        commodityNames.add("Gneiss - filling");
        commodityNames.add("Gneiss - road seal aggregate");
        commodityNames.add("Gneiss - crusher dust");
        
        CommodityFilter commodityFilter = new CommodityFilter("", commodityNames);
        Assert.assertEquals(
                Util.loadXML("src/test/resources/GetCommoditiesWithThreeNames.xml").replaceAll("\n", "").replaceAll("\\s+", ""),
                commodityFilter.getFilterString().replaceAll("\n", "").replaceAll("\\s+", ""));
    }
}
