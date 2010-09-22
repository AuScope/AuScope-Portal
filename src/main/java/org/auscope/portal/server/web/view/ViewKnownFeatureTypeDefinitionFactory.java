package org.auscope.portal.server.web.view;

import java.awt.Dimension;
import java.awt.Point;
import java.util.HashMap;
import java.util.Map;

import org.auscope.portal.server.web.KnownFeatureTypeDefinition;
import org.springframework.stereotype.Repository;
import org.springframework.ui.ModelMap;

/**
 * A factory class containing methods for generating view representations of the KnownFeatureTypeDefinition 
 * @author vot002
 *
 */
@Repository
public class ViewKnownFeatureTypeDefinitionFactory {
	
	private ModelMap toView(Dimension d) {
		ModelMap obj = new ModelMap();
		
		obj.put("width", d.getWidth());
		obj.put("height", d.getHeight());
		
		return obj;
	}
	
	private ModelMap toView(Point p) {
		ModelMap obj = new ModelMap();
		
		obj.put("x", p.getX());
		obj.put("y", p.getY());
		
		return obj;
	}
	
	/**
	 * Converts a KnownFeatureTypeDefinition into its view equivalent
	 * @param k
	 * @return
	 */
	public ModelMap toView(KnownFeatureTypeDefinition k) {
		ModelMap obj = new ModelMap();
		
		obj.put("featureTypeName", k.getFeatureTypeName());
		obj.put("displayName", k.getDisplayName());
		obj.put("description",k.getDescription());
		obj.put("proxyUrl", k.getProxyUrl());
		obj.put("iconUrl", k.getIconUrl());
		
		Point iconAnchor =	k.getIconAnchor(); 
		if (iconAnchor != null) {
			obj.put("iconAnchor", toView(iconAnchor));
		}
		
		Point infoWindowAnchor = k.getInfoWindowAnchor();
		if (infoWindowAnchor != null) {
			obj.put("infoWindowAnchor", toView(infoWindowAnchor));
		}
		
		Dimension iconSize = k.getIconSize();
		if (iconSize != null) {
			obj.put("iconSize", toView(iconSize));
		}
		
		return obj;
	}
}
