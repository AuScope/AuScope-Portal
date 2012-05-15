package org.auscope.portal.server.domain.geodesy;

import org.auscope.portal.core.services.namespaces.IterableNamespace;

/**
 * Namespace specific to Geodesy
 * @author Josh Vote
 *
 */
public class GeodesyNamespaceContext extends IterableNamespace {
    public GeodesyNamespaceContext() {
        map.put("ogc", "http://www.opengis.net/ogc");
        map.put("xlink", "http://www.w3.org/1999/xlink");
        map.put("wfs", "http://www.opengis.net/wfs");
        map.put("gml", "http://www.opengis.net/gml");
        map.put("ngcp", "http://www.auscope.org/ngcp");
        map.put("geodesy", "http://www.auscope.org/geodesy");
    }
}
