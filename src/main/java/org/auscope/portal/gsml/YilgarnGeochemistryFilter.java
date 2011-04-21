package org.auscope.portal.gsml;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.server.domain.filter.AbstractFilter;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;

/**
 * @author 
 * 
 * @version $Id: YilgarnGeochemistryFilter.java 1233 2010-10-20   $
 */

public class YilgarnGeochemistryFilter extends AbstractFilter{	
    private String geologicName;
    private List<String> restrictToIDList;
    
// -------------------------------------------------------------- Constants
    
    /** Log object for this class. */
    protected final Log log = LogFactory.getLog(getClass());
    
    
    // ----------------------------------------------------------- Constructors
    
    public YilgarnGeochemistryFilter(String geologicName, List<String> restrictToIDList) {
    	this.geologicName = geologicName;
    	this.restrictToIDList = restrictToIDList;
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
                        this.generateBboxFragment(bbox, "gsml:occurrence/gsml:MappedFeature/gsml:shape"), 
                        this.generateFilterFragment()));
    }

    
    // -------------------------------------------------------- Private Methods
    private String generateFilterFragment() {
        List<String> parameterFragments = new ArrayList<String>();
        if(this.geologicName.length() > 0)
        	parameterFragments.add(this.generatePropertyIsLikeFragment("gml:name", this.geologicName));
        
        if (this.restrictToIDList != null && this.restrictToIDList.size() > 0) {
            List<String> idFragments = new ArrayList<String>();
            for (String id : restrictToIDList) {
                if (id != null && id.length() > 0) {                    
                    idFragments.add(this.generateGmlObjectIdFragment(id));
                }
            }
            parameterFragments.add(this.generateOrComparisonFragment(idFragments.toArray(new String[idFragments.size()])));
        }
        
        
        return this.generateAndComparisonFragment(
                this.generateAndComparisonFragment(parameterFragments.toArray(new String[parameterFragments.size()])));
    }


}
