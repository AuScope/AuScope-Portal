package org.auscope.portal.capdf;


import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.server.web.entity.CapdfHydroChemColorCoding;


/**
 * Class that represents ogc:Filter markup for mt:mineralTenement queries
 *
 * @author Victor Tey
 * @version
 */
public class CapdfHydroGeoChemFilter extends AbstractFilter {
    List<String> fragments;

    /**
     * Given a mine name, this object will build a filter to a wild card search
     * for mine names
     *
     * @param mineName
     *            the main name
     */
    public CapdfHydroGeoChemFilter(String projectName,CapdfHydroChemColorCoding ccq,int min, int max) {

        fragments = new ArrayList<String>();
        if (projectName != null && !projectName.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("public:project", projectName));
        }

        if (ccq != null && min != -1) {
            fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(ccq.getField(), Integer.toString(min)));
        }

        if (ccq != null && max != -1) {
            fragments.add(this.generatePropertyIsLessThan(ccq.getField(), Integer.toString(max)));
        }

    }


    @Override
    public String getFilterStringAllRecords() {
        return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));
    }

    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateBboxFragment(bbox, "public:geom"));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment.size()])));
    }


}

