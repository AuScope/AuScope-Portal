package org.auscope.portal.gsml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.server.domain.filter.AbstractFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;

public class YilgarnLocSpecimenFilter extends AbstractFilter{

	private String analyteNameFilter;
    
	// -------------------------------------------------------------- Constants
	    
	    /** Log object for this class. */
	    protected final Log log = LogFactory.getLog(getClass());
	    
	    
	    // ----------------------------------------------------------- Constructors
	    
	    public YilgarnLocSpecimenFilter(String analyteNameFilter) {
	    	this.analyteNameFilter = analyteNameFilter;
	    }
	    
	 // --------------------------------------------------------- Public Methods

		@Override
		public String getFilterStringAllRecords() {
			return this.generateFilter(this.generateFilterFragment());
		}


		@Override
	    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {
	        
	        return this.generateFilter(
	                this.generateAndComparisonFragment(                		
	                        this.generateBboxFragment(bbox, "sa:samplingLocation"), 
	                        this.generateFilterFragment()));
	    }
		
		 
	    // -------------------------------------------------------- Private Methods
	    private String generateFilterFragment() {
	        List<String> parameterFragments = new ArrayList<String>();
	        if(this.analyteNameFilter.length() > 0)
	        	parameterFragments.add(this.generatePropertyIsLikeFragment("sa:relatedObservation/om:Observation/om:result/swe:Quantity/gml:name", this.analyteNameFilter));
	        
	        
	        return this.generateAndComparisonFragment(
	                this.generateAndComparisonFragment(parameterFragments.toArray(new String[parameterFragments.size()])));
	    }
}
