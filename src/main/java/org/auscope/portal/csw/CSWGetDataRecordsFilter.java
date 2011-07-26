package org.auscope.portal.csw;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.NotImplementedException;
import org.auscope.portal.server.domain.filter.AbstractFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;

/**
 * Represents a OGC:Filter that will fetch matching records from a CS/W.
 *
 * @author Josh Vote
 *
 */
public class CSWGetDataRecordsFilter extends AbstractFilter {

    private FilterBoundingBox spatialBounds;
    private String[] keywords;
    private String capturePlatform;
    private String sensor;

    /**
     * Generates a new filter generator for the specified fields.
     *
     * @param spatialBounds
     *            [Optional] The spatial bounds to filter by
     * @param keywords
     *            [Optional] A list of keywords which must ALL be satisfied for
     *            a record to be included
     * @param capturePlatform
     *            [Optional] A capture platform filter that must be specified
     *            for a record to be included
     * @param sensor
     *            [Optional] A sensor filter that must be specified for a record
     *            to be included
     */
    public CSWGetDataRecordsFilter(FilterBoundingBox spatialBounds,
            String[] keywords, String capturePlatform, String sensor) {
        this.spatialBounds = spatialBounds;
        this.keywords = keywords;
        this.capturePlatform = capturePlatform;
        this.sensor = sensor;
    }

    /**
     * Utility method for generating the body of a filter fragment
     * @return
     */
    private String generateFilterFragment() {
        List<String> fragments = new ArrayList<String>();

        if (spatialBounds != null) {
            fragments.add(this.generateBboxFragment(spatialBounds, "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement"));
        }

        if (keywords != null && keywords.length > 0) {
            List<String> keywordFragments = new ArrayList<String>();
            for (String keyword : keywords) {
                keywordFragments.add(this.generatePropertyIsEqualToFragment("gmd:identificationInfo/gmd:MD_DataIdentification/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword/gco:CharacterString", keyword));
            }
            fragments.add(this.generateAndComparisonFragment(keywordFragments.toArray(new String[keywordFragments.size()])));
        }

        if (capturePlatform != null && !capturePlatform.isEmpty()) {
            throw new NotImplementedException();
        }

        if (sensor != null && !sensor.isEmpty()) {
            throw new NotImplementedException();
        }

        return this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()]));
    }

    /**
     * Returns an ogc:filter fragment that will fetch all WFS, WMS and WCS
     * records from a CSW
     */
    @Override
    public String getFilterStringAllRecords() {

        // This is a bit of a hack - unfortunately the NamespaceContext class is
        // unsuitable here
        // as it contains no methods to iterate the contained list of
        // Namespaces
        HashMap<String, String> namespaces = new HashMap<String, String>();
        namespaces.put("xmlns:ogc", "http://www.opengis.net/ogc");
        return this.generateFilter(this.generateFilterFragment(), namespaces);
    }

    /**
     * Not implemented
     */
    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {
        throw new NotImplementedException();
    }

}
