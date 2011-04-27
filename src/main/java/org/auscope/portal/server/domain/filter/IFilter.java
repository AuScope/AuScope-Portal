package org.auscope.portal.server.domain.filter;

import java.util.List;


/**
 * an interface for an ogc:Filter class to implement. Implementors must support filtering
 * via a bounding box (on top of whatever filtering they provide nromally). 
 */
public interface IFilter {

    /**
     * The implementation of this method should return a valid
     * ogc:Filter xml blob - http://www.opengeospatial.org/standards/filter
     *
     * The filter should be designed to fetch all appropriate records for a given filter
     *
     * @return String
     */
    public String getFilterString();
    
    /**
     * The implementation of this method should return a valid
     * ogc:Filter xml blob - http://www.opengeospatial.org/standards/filter
     *
     * The filter should be designed to fetch all appropriate records that pass the filter AND
     * appear within the the specified bounding box
     *
     * @param bbox (Optional) The bounding box that should act as a top level constraint
     * @return String
     */
    public String getFilterString(FilterBoundingBox bbox);
    
    /**
     * The implementation of this method should return a valid
     * ogc:Filter xml blob - http://www.opengeospatial.org/standards/filter
     *
     * The filter should be designed to fetch all appropriate records that pass the filter AND
     * appear within the the specified bounding box AND match one of the specified ID's
     *
     * @param bbox (Optional) The bounding box that should act as a top level constraint
     * @param restrictedIDs (Optional) The list of gml:id values that should act as a top level constraint
     * @return String
     */
    public String getFilterString(FilterBoundingBox bbox, List<String> restrictedIDs);
}
