package org.auscope.portal.mineraloccurrence;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;

/**
 * Class that represents ogc:Filter markup for mt:mineralTenement queries
 *
 * @author Victor Tey
 * @version
 */
public class MineralTenementFilter extends AbstractFilter {
	List<String> fragments;

	/**
	 * 
	 * Utility constructor that takes a given tenement name, and builds a filter to wild card
	 * search for tenement names.
	 * 
	 * @param tenementName
	 *            the name of the tenement
	 */
	public MineralTenementFilter(String tenementName) {
		this(tenementName, null, null, null, null);
	}

	/**
	 * Given required parameters, this object will build a filter to wild card
	 * for these parameters
	 *
	 * @param tenementName
	 *            the name of the tenement
	 * 
	 * @param tenementType
	 *            Type of tenement
	 * 
	 * @param owner
	 *            owner of tenement
	 * @param size
	 *            size of tenement
	 * @param endDate
	 *            Expiry date of tenement
	 */
	public MineralTenementFilter(String tenementName, String tenementType, String owner, String size, String endDate) {

		fragments = new ArrayList<String>();
		if (tenementName != null && !tenementName.isEmpty()) {
			fragments.add(this.generatePropertyIsLikeFragment("mt:name", "*" + tenementName + "*"));
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

	public String getFilterStringAllRecords() {
		return this.generateFilter(this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()])));
	}

	public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

		List<String> localFragment = new ArrayList<String>(fragments);
		localFragment.add(this.generateBboxFragment(bbox, "mt:shape"));

		return this.generateFilter(
				this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment.size()])));
	}

	public String getFilterWithAdditionalStyle() {

		List<String> localFragment = new ArrayList<String>(fragments);
		localFragment.add(this.generateOrComparisonFragment(this.generatePropertyIsLikeFragment("mt:status", "Active"),
				this.generatePropertyIsLikeFragment("mt:status", "GRANTED")));

		return this.generateFilter(
				this.generateAndComparisonFragment(localFragment.toArray(new String[localFragment.size()])));
	}

}
