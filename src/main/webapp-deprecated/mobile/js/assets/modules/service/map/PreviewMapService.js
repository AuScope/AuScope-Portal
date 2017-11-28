/**
 * Service class for creating and manipulating the layer report preview map
 * @module map
 * @class PreviewMapService
 * 
 */
allControllers.factory('PreviewMapService', ['GoogleMapService', function(GoogleMapService) {
    // Keeps copies of the maps and rectangles
    var mapStore = {};
    var rectStore = {};
    
    return {
        /**
        * Retrieve knownlayer csw records async
        * @method mapInit
        * @param reportName Name of the reports displayed in the preview map
        * @param $scope The $scope variable of the controller instance which contains the map. This code assumes the 
        *        map config is stored in '$scope.map'
        * @param reCentrePt By default draws map centred in middle of Australia, but a different centre can be specified
        *        e.g. {latitude: -34.5, longitude: 138}
        *
        */
        mapInit: function (reportName, $scope, reCentrePt) {
            var centrePoint = reCentrePt.latitude != undefined && reCentrePt.longitude != undefined ? reCentrePt : {latitude: -30.5, longitude: 136};
            var mainMap = GoogleMapService.getMap();
            // Setup a small preview map. Centre on Australia by default. 
            // The map is fixed, it cannot be zoomed or panned.
            // Add a 'tiles loaded' event to add in the grey boxes that show the effective range of the layers
            var mapInitConfig = {
                center: centrePoint,
                zoom: 2,
                control: {},
                options: {
                    clickableIcons: false,
                    disableDoubleClickZoom: true,
                    draggable: false,
                    fullScreenControl: false,
                    keyboardShortcuts: false,
                    mapTypeControl: false,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    streetViewControl: false,
                    zoomControl: false 
                },
                events: {
                    /**
                    * tile loaded event, adds the grey bounding boxes to show the effective range of the layers
                    * @event tilesloaded
                    * @param map
                    */             
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            // Add the grey boxes to show the effective range of the layers
                            mapStore[reportName] = map;
                            rectStore[reportName] = {};
                            var cswRecords = $scope.$parent.infoPanelCsw.cswRecords;
                            for (i=0; i<cswRecords.length; i++) {
                                var bbox = cswRecords[i].geographicElements[0];
                                if (bbox != undefined) {
                                    var rectangle = new google.maps.Rectangle({
                                        strokeColor: '#FF0000',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: '#000000',
                                        fillOpacity: 0.35,
                                        map: map,
                                        bounds: {
                                            north: bbox.northBoundLatitude,
                                            south: bbox.southBoundLatitude,
                                            east: bbox.eastBoundLongitude,
                                            west: bbox.westBoundLongitude
                                        }
                                    });
                                    /**
                                    * If the user clicks on a bounding box in the preview map then the main map will zoom and pan to the box
                                    * @event click
                                    */
                                    rectangle.addListener('click', function() {
                                        mainMap.fitBounds(this.bounds);
                                    });
                                    mapStore[reportName][cswRecords[i].adminArea] = rectangle;
                                }
                            };
                        });
                    }
                }
            }
            $scope.map =  mapInitConfig;
        }, // End of mapInit() function
        
        /**
        * @method setBBoxOptions
        * @param reportName Name of the reports displayed in the preview map
        * @param adminArea Name of the region where the reports apply
        * @param options Options used to style the bounding box (google.maps.Rectangle)
        *        e.g. { strokeColor: '#CAFF06'}
        *
        */
        setBBoxOptions: function(reportName, adminArea, options) {
            if (mapStore[reportName]!= undefined) {
                var rectObj = mapStore[reportName][adminArea];
                if (rectObj != undefined) {
                    rectObj.setOptions(options);
                }
            }
        }
        
        
    }  
}]);


