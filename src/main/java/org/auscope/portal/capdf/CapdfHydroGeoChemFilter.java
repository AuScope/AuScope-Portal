package org.auscope.portal.capdf;


import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.service.colorcoding.CapdfHydroChemColorCoding;


/**
 * Class that represents ogc:Filter markup for capricorn distal footprint queries
 *
 * @author Victor Tey
 * @version
 */
public class CapdfHydroGeoChemFilter extends AbstractFilter {
    List<String> fragments;

    /**
     * generate the filter required for color coding filter
     *
     * @param mineName
     *            the main name
     */
    public CapdfHydroGeoChemFilter(String batchid,CapdfHydroChemColorCoding ccq,Double min, Double max) {

        fragments = new ArrayList<String>();
        if (batchid != null && !batchid.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("batch_id", batchid));
        }

        if (ccq != null && min != null) {
            fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(ccq.getPOI(), Double.toString(min)));
        }

        if (ccq != null && max != null) {
            fragments.add(this.generatePropertyIsLessThan(ccq.getPOI(), Double.toString(max)));
        }

    }


    @Override
    public String getFilterStringAllRecords() {
        return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));
    }

    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateBboxFragment(bbox, "geom"));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment.size()])));
    }


}

