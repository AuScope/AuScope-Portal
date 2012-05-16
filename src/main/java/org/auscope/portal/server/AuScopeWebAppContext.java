package org.auscope.portal.server;

import java.util.Arrays;

import org.auscope.portal.core.server.PortalProfileXmlWebApplicationContext;

/**
 * A Web Application Context that extends the PortalProfileXmlWebApplicationContext
 * with a new config location "auscope-services.xml"
 * @author Josh Vote
 *
 */
public class AuScopeWebAppContext extends PortalProfileXmlWebApplicationContext {
    @Override
    protected String[] getDefaultConfigLocations() {
        String[] locations = super.getDefaultConfigLocations();

        String[] auscopeLocations = Arrays.copyOf(locations, locations.length + 1);
        auscopeLocations[auscopeLocations.length - 1] = DEFAULT_CONFIG_LOCATION_PREFIX + "auscope-core-services.xml";

        return auscopeLocations;
    }
}
