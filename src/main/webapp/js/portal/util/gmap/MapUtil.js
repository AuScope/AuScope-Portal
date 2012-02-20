/**
 * Utility class containing static methods for interacting with
 * an enclosed GMap2 object
 */
Ext.define('portal.util.gmap.MapUtil', {

    statics : {
        map : null,//an instance of a GMap2 (google map api).

        /**
         * Returns the currently visible map bounds as a BBox object.
         */
        getVisibleMapBounds : function() {
            var mapBounds = portal.util.gmap.MapUtil.map.getBounds();
            var sw = mapBounds.getSouthWest();
            var ne = mapBounds.getNorthEast();

            return Ext.create('portal.util.BBox', {
                eastBoundLongitude : ne.lng(),
                westBoundLongitude : sw.lng(),
                southBoundLatitude : sw.lat(),
                northBoundLatitude : ne.lat()
            });
        },

        /**
         * Registers event handlers for specific GMap events. See GMap API for more info
         * on the available events and handler signatures
         *
         * @param eventName String based event name
         * @param handler a function
         */
        registerMapEvent : function(eventName, handler) {
            GEvent.addListener(portal.util.gmap.MapUtil.map, eventName, handler);
        },


        /**
         * Generates a new GMap2 object to be rendered into the specified Ext JS container
         *
         * If the user's browser is incompatible then null will be returned, otherwise
         * the GMap2 object will be returned
         *
         * @param container an Ext.Container object
         */
        generateMap : function(container) {
            // Is user's browser suppported by Google Maps?
            if (!GBrowserIsCompatible()) {
                alert('Your browser isn\'t compatible with the Google Map API V2. This portal will not be functional as a result.');
                return; //what can we really do in this situation?
            }

            var map = new GMap2(container.body.dom);

            /* AUS-1526 search bar. */
            map.enableGoogleBar();
            /*
            // Problems, find out how to
            1. turn out advertising
            2. Narrow down location seraches to the current map view
                            (or Australia). Search for Albany retruns Albany, US
            */
            map.setUIToDefault();

            //add google earth
            map.addMapType(G_SATELLITE_3D_MAP);

            // Toggle between Map, Satellite, and Hybrid types
            map.addControl(new GMapTypeControl());

            var startZoom = 4;
            map.setCenter(new google.maps.LatLng(-26, 133.3), startZoom);
            map.setMapType(G_SATELLITE_MAP);

            //Thumbnail map
            var Tsize = new GSize(150, 150);
            map.addControl(new GOverviewMapControl(Tsize));

            map.addControl(new DragZoomControl(), new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(345, 7)));

            // Fix for IE/Firefox resize problem (See issue AUS-1364 and AUS-1565 for more info)
            map.checkResize();
            container.on('resize', function() {
                map.checkResize();
            });

            GEvent.addListener(map, "mousemove", function(latlng){
                var latStr = "<b>Long:</b> " + latlng.lng().toFixed(6) +
                           "&nbsp&nbsp&nbsp&nbsp" +
                           "<b>Lat:</b> " + latlng.lat().toFixed(6);
                document.getElementById("latlng").innerHTML = latStr;
            });

            GEvent.addListener(map, "mouseout", function(latlng){
                document.getElementById("latlng").innerHTML = "";
            });

            portal.util.gmap.MapUtil.map = map;
        }
    }
});