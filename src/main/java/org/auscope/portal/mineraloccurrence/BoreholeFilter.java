package org.auscope.portal.mineraloccurrence;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.server.domain.filter.AbstractFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;

/**
 * @author Tannu Gupta
 * 
 * @version $Id: YilgarnGeochemistryFilter.java 1233 2010-10-20   $
 */

public class BoreholeFilter extends AbstractFilter{	

	
		private String boreholeName;
	    private String custodian;
	    private String dateOfDrilling;
	    
	// -------------------------------------------------------------- Constants
	    
	    /** Log object for this class. */
	    protected final Log log = LogFactory.getLog(getClass());
	    
	    
	    // ----------------------------------------------------------- Constructors
	    
	    public BoreholeFilter(String boreholeName, String custodian,
	                          String dateOfDrilling) {
	    	this.boreholeName = boreholeName;
	        this.custodian = custodian;
	        this.dateOfDrilling = dateOfDrilling;
	    }

	    // --------------------------------------------------------- Public Methods
	    
	    @Override
	    public String getFilterString() {
	        return this.generateFilter(this.generateFilterFragment(null));
	    }
	    
	    @Override
	    public String getFilterString(FilterBoundingBox bbox) {
	        return this.getFilterString(bbox, null);
	    }
	    
	    @Override
	    public String getFilterString(FilterBoundingBox bbox, List<String> restrictToIDList) {
	        
	        return this.generateFilter(
	                this.generateAndComparisonFragment(                		
	                        this.generateBboxFragment(bbox, "gsml:collarLocation/gsml:BoreholeCollar/gsml:location"), 
	                        this.generateFilterFragment(restrictToIDList)));
	    }

	    
	    // -------------------------------------------------------- Private Methods
	    
	    private String generateFilterFragment(List<String> restrictToIDList) {
	        List<String> parameterFragments = new ArrayList<String>();
	        if(this.boreholeName.length() > 0)
	        	parameterFragments.add(this.generatePropertyIsLikeFragment("gml:name", this.boreholeName));
	        	
	        if(this.custodian.length() > 0)
	            parameterFragments.add(this.generatePropertyIsLikeFragment("gsml:indexData/gsml:BoreholeDetails/gsml:coreCustodian/@xlink:title", this.custodian));
	        
	        if(this.dateOfDrilling.length() > 0)
	            parameterFragments.add(this.generatePropertyIsLikeFragment("gsml:indexData/gsml:BoreholeDetails/gsml:dateOfDrilling", this.dateOfDrilling));
	        
	        // TODO - Uncomment this when http://jira.codehaus.org/browse/GEOT-3522 is fixed
	        //parameterFragments.add(this.generateRestrictedIDListFragment("gml:name[@codeSpace='http://www.ietf.org/rfc/rfc2616']", restrictToIDList));
            parameterFragments.add(this.generateRestrictedIDListFragment("gml:name[1]", restrictToIDList));
            
	        return this.generateAndComparisonFragment(
	                this.generateAndComparisonFragment(parameterFragments.toArray(new String[parameterFragments.size()])));
	    }


	


}
