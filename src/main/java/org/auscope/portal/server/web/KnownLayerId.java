package org.auscope.portal.server.web;

import java.awt.Dimension;
import java.awt.Point;

public class KnownLayerId extends AbstractKnownLayer {
    private static final long serialVersionUID = 1L;
    protected String recordId;
    protected String iconUrl;
    protected Point iconAnchor;
    protected Dimension iconSize;

    /**
     * @param title a descriptive title of this layer
     * @param description an extended description of this layer
     * @param descriptiveKeyword the descriptive keyword used to identify CSW records
     */
    public KnownLayerId(String recordId) {
        this.id = "KnownLayerKeywords-" + recordId;
        this.recordId = recordId;
    }

    /**
     *
     * @return
     */
    public String getIconUrl() {
        return iconUrl;
    }

    /**
     * Gets the pixel coordinates relative to the top left corner of the icon
     * image at which this icon is anchored to the map.
     * Can be null.
     *
     * @return pixel coordinates at which this icon is anchored to the map.
     */
    public Point getIconAnchor() {
        if (iconAnchor == null) {
            return null;
        } else {
            return new Point(iconAnchor);
        }
    }

    /**
     * Gets the size in pixels of the icon.
     * Can be null.
     *
     * @return size in pixels of the icon.
     */
    public Dimension getIconSize() {
        if (iconSize == null) {
            return null;
        } else {
            return iconSize;
        }
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }



}
