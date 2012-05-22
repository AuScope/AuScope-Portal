package org.auscope.portal.server;

import java.util.Arrays;

import org.auscope.portal.core.server.PortalProfileXmlWebApplicationContext;

/**
 * A Web Application Context that extends the PortalProfileXmlWebApplicationContext
 * with new config locations
 * @author Josh Vote
 *
 */
public class AuScopeWebAppContext extends PortalProfileXmlWebApplicationContext {
    @Override
    protected String[] getDefaultConfigLocations() {
        String[] locations = super.getDefaultConfigLocations();

        String[] auscopeLocations = Arrays.copyOf(locations, locations.length + 2);
        auscopeLocations[auscopeLocations.length - 1] = DEFAULT_CONFIG_LOCATION_PREFIX + "auscope-known-layers.xml";
        auscopeLocations[auscopeLocations.length - 2] = DEFAULT_CONFIG_LOCATION_PREFIX + "auscope-registries.xml";

        return auscopeLocations;
    }
}
