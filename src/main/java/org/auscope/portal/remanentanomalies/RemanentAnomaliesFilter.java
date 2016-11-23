package org.auscope.portal.remanentanomalies;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.uifilter.GenericFilter;

public class RemanentAnomaliesFilter extends GenericFilter {
    List<String> fragments;

    /**
     * Given an anomaly name, this object will build a filter to a wild card search for anomaly names
     *
     * @param anomalyName
     *            the main name
     */
    public RemanentAnomaliesFilter(String name, String optionalFilters) {
        super(optionalFilters);

        if(optionalFilters == null || optionalFilters.isEmpty()){
            fragments = new ArrayList<String>();
            if (name != null && !name.isEmpty()) {
                fragments.add(this.generatePropertyIsLikeFragment("RemAnom:AnomalyName", name));
            }
        }else{
            fragments = this.generateParameterFragments();
        }
    }

    @Override
    public String getFilterStringAllRecords() {
        return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));
    }

    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        List<String> localFragment = new ArrayList<String>(fragments);
        localFragment.add(this.generateBboxFragment(bbox, "RemAnom:CentreLocation"));

        return this.generateFilter(this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment
                                                                                                       .size()])));
    }


}
