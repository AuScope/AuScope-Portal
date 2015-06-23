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
public class CapdfMeasurementLimitFilter extends AbstractFilter {
    List<String> fragments;

    /**
     * Given a mine name, this object will build a filter to a wild card search
     * for mine names
     *
     * @param mineName
     *            the main name
     */
    public CapdfMeasurementLimitFilter(String group) {

        fragments = new ArrayList<String>();
        if (group != null && !group.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("group", group));
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

