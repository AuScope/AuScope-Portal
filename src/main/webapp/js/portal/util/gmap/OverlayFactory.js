/**
 * Static methods for creating google map API GOverlay subclasses.
 *
 * This factory methods are preferred to instantiating the classes directly
 * because they standardise naming conventions for feature ID's and the like.
 * These 'standardised' conventions are expected by the portal.util.gmap.ClickController
 */
Ext.define('portal.util.gmap.OverlayFactory', {

    statics : {
        /**
         * Given a GOverlay created by this class, return the representative gml:id of the feature (can be null/empty)
         */
        getOverlayId : function(overlay) {
            return overlay._id;
        },

        /**
         * Given a GOverlay created by this class, return the portal.layer.Layer used in it's creation
         */
        getOverlayLayer : function(overlay) {
            return overlay._layer;
        },

        /**
         * Given a GOverlay created by this class, return the portal.csw.OnlineResource used in it's creation
         */
        getOverlayOnlineResource : function(overlay) {
            return overlay._onlineResource;
        },

        /**
         * Utility function for creating an instance of the google map GMarker class
         *
         * @param id [Optional] A string based ID that will be used as the gml:id for this marker
         * @param tooltip The text to display when this marker is moused over
         * @param sourceOnlineResource portal.csw.OnlineResource representing where this marker was generated from
         * @param sourceLayer portal.layer.Layer representing the owner of sourceOnlineResource
         * @param point a GLatLng (gmap api) indicating where this marker should be shown
         * @param icon a GIcon (gmap api) containing display information about how the marker should look
         */
        makeMarker : function(id, tooltip, sourceOnlineResource, sourceLayer, point, icon) {
            var marker = new GMarker(point, {icon: icon, title: tooltip});

            //Overload marker with useful info
            marker._id = id;
            marker._layer = sourceLayer;
            marker._onlineResource = sourceOnlineResource;

            return marker;
        },

        /**
         * Utility function for creating an instance of the google map GPolygon class
         * @param id A string based ID that will be used as the gml:id for this polygon
         * @param sourceOnlineResource portal.csw.OnlineResource representing where this polygon was generated from
         * @param sourceLayer portal.layer.Layer representing the owner of sourceOnlineResource
         * @param points an array GLatLng (gmap api) objects indicating the bounds of this polygon
         * @param strokeColor [Optional] HTML Style color string '#RRGGBB' for the vertices of the polygon
         * @param strokeWeight [Optional] Width of the stroke in pixels
         * @param strokeOpacity [Optional] A number from 0-1 indicating the opacity of the vertices
         * @param fillColor [Optional] HTML Style color string '#RRGGBB' for the filling of the polygon
         * @param fillOpacity [Optional] A number from 0-1 indicating the opacity of the fill
         *
         */
        makePolygon : function(id, sourceOnlineResource, sourceLayer, points,
                strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity) {
            var polygon = new GPolygon(points,strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity);

            polygon._id = id;
            polygon._layer = sourceLayer;
            polygon._onlineResource = sourceOnlineResource;

            return polygon;
        },

        /**
         * Utility function for creating an instance of the google map GPolyLine class
         * @param id A string based ID that will be used as the gml:id for this line
         * @param sourceOnlineResource portal.csw.OnlineResource representing where this line was generated from
         * @param sourceLayer portal.layer.Layer representing the owner of sourceOnlineResource
         * @param points an array GLatLng (gmap api) objects indicating the line location
         * @param color [Optional] HTML Style color string '#RRGGBB' for the line
         * @param weight [Optional] Width of the stroke in pixels
         * @param opacity [Optional] A number from 0-1 indicating the opacity of the line
         */
        makePolyLine : function(id, sourceOnlineResource, sourceLayer, points, color, weight, opacity) {
            var line = new GPolyline(points, color, weight, opacity);

            line._id = id;
            line._layer = sourceLayer;
            line._onlineResource = sourceOnlineResource;

            return line;
        }
    }
});
