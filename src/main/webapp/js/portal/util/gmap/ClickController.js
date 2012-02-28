/**
 * Static methods for converting clicks on a map into portal.layer.querier.QueryTarget
 * objects that can be tested against various layer's querier instances for more information
 */
Ext.define('portal.util.gmap.ClickController', {

    statics : {
        /**
         * Utility for turning a click on a feature into a single QueryTarget
         */
        _marker : function(marker, overlayLatLng) {
            var id = portal.util.gmap.GMapWrapper.getOverlayId(marker);
            var onlineResource = portal.util.gmap.GMapWrapper.getOverlayOnlineResource(marker);
            var layer = portal.util.gmap.GMapWrapper.getOverlayLayer(marker);

            return [Ext.create('portal.layer.querier.QueryTarget', {
                id : id,
                lat : overlayLatLng.lat(),
                lng : overlayLatLng.lng(),
                onlineResource : onlineResource,
                layer : layer,
                explicit : true
            })];
        },

        /**
         * Utility for turning a click onto a polygon into a set of overlapping QueryTargets
         */
        _polygon : function(polygon, latLng, overlayLatLng, layerStore) {
            var queryTargets = [];
            var point = overlayLatLng ? overlayLatLng : latLng;

            //Look for all polygons intesecting the clicked point
            for (var i = 0; i < layerStore.getCount(); i++) {
                var layer = layerStore.getAt(i);
                var renderer = layer.data.renderer;
                var overlayManager = renderer.overlayManager;

                //Do this by diving straight into every renderer's list of polygons
                for (var j = 0; j < overlayManager.overlayList.length; j++) {
                    var overlayToTest =  overlayManager.overlayList[j];
                    if (overlayToTest instanceof GPolygon &&
                        overlayToTest.Contains(point)) {

                        var id = portal.util.gmap.GMapWrapper.getOverlayId(overlayToTest);
                        var onlineResource = portal.util.gmap.GMapWrapper.getOverlayOnlineResource(overlayToTest);
                        var layer = portal.util.gmap.GMapWrapper.getOverlayLayer(overlayToTest);

                        queryTargets.push(Ext.create('portal.layer.querier.QueryTarget', {
                            id : id,
                            lat : point.lat(),
                            lng : point.lng(),
                            onlineResource : onlineResource,
                            layer : layer,
                            explicit : true
                        }));
                    }
                }
            }

            return queryTargets;
        },

        /**
         * Utility for turning a raw point on the map into a series of QueryTargets
         */
        _wms : function(latlng, layerStore) {
            var queryTargets = [];
            //Every WMS layer needs to be queried for WMS clicks
            //No real way around this :(
            for (var i = 0; i < layerStore.getCount(); i++) {
                var layer = layerStore.getAt(i);

                var cswRecords=layer.get('cswRecords');

                for(var z=0; z < cswRecords.length; z++){

                    var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(cswRecords[z].get('onlineResources'),
                                                                                      portal.csw.OnlineResource.WMS);
                    for (var j = 0; j < wmsResources.length; j++) {
                        queryTargets.push(Ext.create('portal.layer.querier.QueryTarget', {
                            id : '',
                            lat : latlng.lat(),
                            lng : latlng.lng(),
                            cswRecord   : cswRecords[z],
                            onlineResource : wmsResources[j],
                            layer : layer,
                            explicit : false
                        }));
                    }
                }
            }

            return queryTargets;
        },

        /**
         * Given a raw click on the map - workout exactly what layer / feature has been interacted
         * with. Return the results as an Array portal.layer.querier.QueryTarget objects
         *
         * This function will normally return a singleton QueryTarget HOWEVER certain circumstances
         * might dictate that multiple items are going to be queried (such as in the case of overlapping polygons).
         *
         * @param overlay An instance of GOverlay (gmap api) - can be null
         * @param latlng An instance of GLatLng (gmap api) - can be null - the actual location clicked
         * @param overlayLatLng An instance of GLatLng (gmap api) - can be null - the actual location of the overlay clicked
         * @param layerStore An instance of portal.layer.LayerStore containing layers to be examined.
         */
        generateQueryTargets : function(overlay, latlng, overlayLatlng, layerStore) {
            if (!overlay) {
                return portal.util.gmap.ClickController._wms(latlng, layerStore);
            } else if (overlay instanceof GMarker) {
                return portal.util.gmap.ClickController._marker(overlay, overlayLatlng);
            } else if (overlay instanceof GPolygon) {
                return portal.util.gmap.ClickController._polygon(overlay, latlng, overlayLatlng, layerStore);
            } else {
                return []; //unable to handle clicks on other geometry types
            }
        }
    }
});