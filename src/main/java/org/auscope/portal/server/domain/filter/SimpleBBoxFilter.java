package org.auscope.portal.server.domain.filter;

import java.util.List;

import org.springframework.stereotype.Component;

/**
 * Represents a simple OGC:Filter that can only make queries based upon bounding box
 * on the 'default' geometry field.
 */
@Component
public class SimpleBBoxFilter extends AbstractFilter {
    @Override
    public String getFilterString() {
        return "";
    }

    @Override
    public String getFilterString(FilterBoundingBox bbox) {
    	return getFilterString(bbox, null);
    }

	@Override
	public String getFilterString(FilterBoundingBox bbox, List<String> restrictedIDs) {
		if (bbox == null)
            return getFilterString();
        
        return this.generateFilter(this.generateBboxFragment(bbox, null));
	}
}
