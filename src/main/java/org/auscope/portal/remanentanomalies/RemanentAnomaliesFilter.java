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
    public RemanentAnomaliesFilter(String name, Float ARRAMin, Float ARRAMax, Float decMin, Float decMax, Float incMin, Float incMax, Integer modelCountMin, Integer modelCountMax, String optionalFilters) {
        super(optionalFilters);

        if(optionalFilters == null || optionalFilters.isEmpty()){
            fragments = new ArrayList<String>();
        }else{
            fragments = this.generateParameterFragments();
        }
        
        if (name != null && !name.isEmpty()) {
            fragments.add(this.generateOrComparisonFragment(this.generatePropertyIsLikeFragment("RemAnom:AnomalyName", name),this.generateFeatureIdFragment("anomaly."+name)));
        }
        
		if (ARRAMin != null) {
			fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:Apparent_resultant_rotation_angle",
					ARRAMin.toString()));
		}

		if (ARRAMax != null) {
			fragments.add(this.generatePropertyIsLessThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:Apparent_resultant_rotation_angle",
					ARRAMax.toString()));
		}
        
		if (decMin != null) {
			fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:resultant_declination",
					decMin.toString()));

		}

		if (decMax != null) {
			fragments.add(this.generatePropertyIsLessThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:resultant_declination",
					decMax.toString()));
		}
        
		if (incMin != null) {
			fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:resultant_inclination",
					incMin.toString()));
		}

		if (incMax != null) {
			fragments.add(this.generatePropertyIsLessThanOrEqualTo(
					"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model/RemAnom:resultant_inclination",
					incMax.toString()));
		}
        
		if (modelCountMin != null) {
			fragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
					this.generateFunctionAttributeCount(
							"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model"),
					modelCountMin.toString()));
		}

		if (modelCountMax != null) {
			fragments.add(this.generatePropertyIsLessThanOrEqualTo(
					this.generateFunctionAttributeCount(
							"RemAnom:modelCollection/RemAnom:ModelCollection/RemAnom:member[1]/RemAnom:Model"),
					modelCountMax.toString()));
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
