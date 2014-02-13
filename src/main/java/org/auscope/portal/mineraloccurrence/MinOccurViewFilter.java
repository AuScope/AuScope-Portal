package org.auscope.portal.mineraloccurrence;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;


/**
 * Class that represents ogc:Filter markup for mineral occurrence sf0 queries
 *
 * @author Victor Tey
 * @version
 */
public class MinOccurViewFilter extends AbstractFilter {
    List<String> fragments;

    /**
     * Given a mine name, this object will build a filter to a wild card search
     * for mine names
     *
     * @param mineName
     *            the main name
     */
    public MinOccurViewFilter(String commodity) {

        fragments = new ArrayList<String>();
        if (commodity != null && !commodity.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mo:commodity", commodity));
        }

    }




    public String getFilterStringAllRecords() {

        return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));

    }

    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateBboxFragment(bbox, "mo:shape"));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment.size()])));
    }



}

