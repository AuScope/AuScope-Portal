package org.auscope.portal.mineraloccurrence;

import java.util.List;

import org.auscope.portal.server.domain.filter.AbstractFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;

/**
 * User: Michael Stegherr
 * Date: 23/03/2009
 * Time: 1:59:02 PM
 * @version $Id$
 */
public class CommodityFilter extends AbstractFilter {

    private String filterFragment;

    public CommodityFilter(String commodityName) {
        if (commodityName.length() > 0) 
            this.filterFragment = this.generatePropertyIsEqualToFragment("er:commodityName", commodityName);
        else
            this.filterFragment = "";
    }

    
    public String getFilterString() {
        return this.generateFilter(filterFragment);
    }
    public String getFilterString(FilterBoundingBox bbox) {
    	return this.getFilterString(bbox, null);
    }
    
    public String getFilterString(FilterBoundingBox bbox, List<String> restrictToIDList) {
        return this.generateFilter(
                this.generateAndComparisonFragment(
                        this.generateBboxFragment(bbox, "er:occurrence/er:MiningFeatureOccurrence/er:location"), 
                        this.filterFragment,
                        this.generateRestrictedIDListFragment(restrictToIDList)));
    }
    
}
