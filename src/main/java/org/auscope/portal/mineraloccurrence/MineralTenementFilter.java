package org.auscope.portal.mineraloccurrence;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.uifilter.GenericFilter;

/**
 * Class that represents ogc:Filter markup for mt:mineralTenement queries
 *
 * @author Victor Tey
 * @version
 */
public class MineralTenementFilter extends GenericFilter {
    List<String> fragments;

    /**
     * Given a mine name, this object will build a filter to a wild card search for mine names
     * Extended to support mt:status as well.
     * @param mineName
     *            the main name
     */
    public MineralTenementFilter(String name, String tenementType, String owner, String size, String endDate,String status,String optionalFilters) {
        super(optionalFilters);
        fragments = new ArrayList<String>();

        if(optionalFilters == null || optionalFilters.isEmpty()){


            if (name != null && !name.isEmpty()) {
                fragments.add(this.generatePropertyIsLikeFragment("mt:name", name));
            }
            if (tenementType != null && !tenementType.isEmpty()) {
                fragments.add(this.generatePropertyIsLikeFragment("mt:tenementType", tenementType));
            }

            if (owner != null && !owner.isEmpty()) {
                fragments.add(this.generatePropertyIsLikeFragment("mt:owner", owner));
            }

            if (size != null && !size.isEmpty()) {
                fragments.add(this.generatePropertyIsGreaterThanOrEqualTo("mt:area", size));
            }

            if (endDate != null && !endDate.isEmpty()) {
                fragments.add(this.generatePropertyIsLessThanOrEqualTo("mt:expireDate", endDate));
            }

            if (status != null && !status.isEmpty()) {
                fragments.add(this.generatePropertyIsLikeFragment("mt:status", status));
            }
        }else{
            fragments = this.generateParameterFragments();

        }
    }
    /**
     * Given a mine name, this object will build a filter to a wild card search for mine names
     *
     * @param mineName
     *            the main name
     */
    public MineralTenementFilter(String name, String tenementType, String owner, String size, String endDate) {

        fragments = new ArrayList<String>();
        if (name != null && !name.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mt:name", name));
        }
        if (tenementType != null && !tenementType.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mt:tenementType", tenementType));
        }

        if (owner != null && !owner.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mt:owner", owner));
        }

        if (size != null && !size.isEmpty()) {
            fragments.add(this.generatePropertyIsGreaterThanOrEqualTo("mt:area", size));
        }

        if (endDate != null && !endDate.isEmpty()) {
            fragments.add(this.generatePropertyIsLessThanOrEqualTo("mt:expireDate", endDate));
        }

    }
    @Override
    public String getFilterStringAllRecords() {
        return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));
    }

    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateBboxFragment(bbox, "mt:shape"));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment
                                                                                                       .size()])));
    }

    public String getFilterWithAdditionalStyle() {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateOrComparisonFragment(this.generatePropertyIsLikeFragment("mt:status", "Active"),
                this.generatePropertyIsLikeFragment("mt:status", "GRANTED")));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment
                                                                                                       .size()])));
    }

}
