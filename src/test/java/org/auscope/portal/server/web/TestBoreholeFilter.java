package org.auscope.portal.server.web;

import java.util.ArrayList;

import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.gsml.BoreholeFilter;
import org.auscope.portal.server.domain.ogc.AbstractFilterTestUtilities;
import org.junit.Assert;
import org.junit.Test;
import org.w3c.dom.Document;

/**
 * Unit tests for BoreholeFilter
 * 
 * @author Josh Vote
 *
 */
public class TestBoreholeFilter extends PortalTestClass {

    /**
     * Tests that null params will NOT generate exceptions and are equivelant to empty params
     */
    @Test
    public void testNullOrEmptyParams() {

        BoreholeFilter filter = new BoreholeFilter(null, null, null, null);
        String nullFilterString = filter.getFilterStringAllRecords();

        filter = new BoreholeFilter("", "", "", new ArrayList<String>());
        String emptyFilterString = filter.getFilterStringAllRecords();

        Assert.assertEquals(emptyFilterString, nullFilterString);
    }

    /**
     * Tests that the non ID string comparisons will ALWAYS use matchCase=false
     * 
     * @throws Exception
     */
    @Test
    public void testCaseInsensitiveStrings() throws Exception {
        BoreholeFilter filter = new BoreholeFilter("boreholeName", "boreholeCustodian", null, null);
        String filterString = filter.getFilterStringAllRecords();

        Document doc = AbstractFilterTestUtilities.parsefilterStringXML(filterString);
        AbstractFilterTestUtilities.runNodeSetValueCheck(doc, "/descendant::ogc:PropertyIsLike/@matchCase",
                new String[] {"false"}, 2);
    }
}
