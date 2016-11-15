package org.auscope.portal.server;

public enum MineralTenementServiceProviderType {
    GeoServer("mt:MineralTenement", "#66ff66", "mt:name", "mt:owner", "mt:shape"), 
    ArcGIS("MineralTenement", "#00ff00", "TENNAME", "TENOWNER", "SHAPE");

    private final String colour;
    private final String featureType;
    private final String tenementName;
    private final String owner;
    private String shape;

    private MineralTenementServiceProviderType(String featureType, String colour, String tenementName, String owner,
                String shape) {
        this.featureType = featureType;
        this.colour = colour;
        this.tenementName = tenementName;
        this.owner = owner;
        this.shape = shape;
    }

    public String colour() {
        return colour;
    }

    public String featureType() {
        return featureType;
    }

    public String tenementName() {
        return tenementName;
    }

    public String owner() {
        return owner;
    }

    public String shape() {
        return shape;
    }

    public static MineralTenementServiceProviderType parseUrl(String serviceUrl) {
        if (serviceUrl.toUpperCase().contains("MAPSERVER/WFSSERVER")
                || serviceUrl.toUpperCase().contains("MAPSERVER/WMSSERVER")) {
            return MineralTenementServiceProviderType.ArcGIS;
        }
        return MineralTenementServiceProviderType.GeoServer;
    }
}
