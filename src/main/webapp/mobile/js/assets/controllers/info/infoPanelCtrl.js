/**
 * infoPanelCtrl class handles rendering of left hand side information panels
 * @module controllers
 * @class infoPanelCtrl
 */
allControllers.controller('infoPanelCtrl', ['$scope','$rootScope','$timeout', '$element', 'GetMinOccurViewFilterStyle', function ($scope,$rootScope,$timeout, $element, GetMinOccurViewFilterStyle) {

    // Setup a small preview map. Centre on Australia by default. 
    // The map is fixed, it cannot be zoomed or panned.
    // Add a 'tiles loaded' event to add in the grey boxes that show the effective range of the layers
    var mapInitConfig = {
        center: {latitude: -30.5, longitude: 136},
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
            scaleConrol: false,
            scrollwheel: false,
            streetViewControl: false,
            zoomControl: false 
        },
        events: {
            /**
             * tile loaded event, adds the grey bounding boxes to show the effective range of the layers
             * @function tilesloaded
             * @param map
             */             
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    // Add the grey boxes to show the effective range of the layers
                    //console.log("$scope.map.control=", $scope.map.control); // control works
                    var cswRecords = $scope.$parent.infoPanelCsw.cswRecords;
                    for (i=0; i<cswRecords.length; i++) {
                        var bbox = cswRecords[i].geographicElements[0];
                        if (bbox != undefined) {
                            var outerCoords = [
                                { lat: bbox.northBoundLatitude, lng: bbox.westBoundLongitude },
                                { lat: bbox.southBoundLatitude, lng: bbox.westBoundLongitude },
                                { lat: bbox.southBoundLatitude, lng: bbox.eastBoundLongitude },
                                { lat: bbox.northBoundLatitude, lng: bbox.eastBoundLongitude }
                            ];
                            map.data.add({
                                geometry: new google.maps.Data.Polygon([outerCoords])
                            })
                        }
                    };
                });
            }
        }
    };
    
    // Gather up BBOX coordinates to calculate the centre and envelope
    var cswRecords = $scope.$parent.infoPanelCsw.cswRecords;
    //console.log("$scope.$parent.infoPanelCsw=", $scope.$parent.infoPanelCsw);
    //console.log("cswRecords=", cswRecords);
    var featureArr = [];
    var i,j;
    $scope.wmsUrls = {};
    $scope.wmsLegends = {};
    for (i=0; i<cswRecords.length; i++) {
        var bbox = cswRecords[i].geographicElements[0];
        if (bbox != undefined && (bbox.westBoundLongitude!=0 || bbox.northBoundLatitude!=0 || bbox.eastBoundLongitude!=0 || bbox.southBoundLatitude!=0) 
            && (bbox.eastBoundLongitude!=180 || bbox.westBoundLongitude!=180 || bbox.northBoundLatitude!=90 || bbox.southBoundLatitude!=-90)) {
            featureArr.push(turf.point([bbox.westBoundLongitude, bbox.northBoundLatitude]));
            featureArr.push(turf.point([bbox.westBoundLongitude, bbox.southBoundLatitude]));
            featureArr.push(turf.point([bbox.eastBoundLongitude, bbox.southBoundLatitude]));
            featureArr.push(turf.point([bbox.eastBoundLongitude, bbox.northBoundLatitude]));
        }

        // Gather up lists of information URLs and legend URLs

        var hasMinOccView = false;
        var onlineResources=cswRecords[i].onlineResources;
        for (j=0; j<onlineResources.length; j++) {
            if (onlineResources[j].type=='WMS') {
                var url = onlineResources[j].url + "?" + "SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYERS="
                        + escape(onlineResources[j].name) + "&SRS=EPSG:4326&BBOX="+bbox.westBoundLongitude+","+bbox.southBoundLatitude+","+bbox.eastBoundLongitude+","+bbox.northBoundLatitude
                        + "&WIDTH=400&HEIGHT=400";
                $scope.wmsUrls[cswRecords[i].adminArea]=url;
                // Mineral Occurrences report has its own style for the legend, set a flag and fetch it later
                if (onlineResources[j].name=='mo:MinOccView') {
                    hasMinOccView = true;
                } else {
                    // Apply generic URL to get the icon for the legend
                    var url = onlineResources[j].url + 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                                +'&LAYER='+onlineResources[j].name+'&LAYERS='+onlineResources[j].name+
                                '&WIDTH=188';
                    $scope.wmsLegends[cswRecords[i].adminArea]=url;
                    //http://remanentanomalies.csiro.au/thredds/wms/Emag2/EMAG2.nc?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF&LAYER=z&LAYERS=z&WIDTH=188
                }
            }
        }
    }

    // Mineral Occurrences report has its own style for the legend, it is time to fetch it.
    if (hasMinOccView==true) {
        GetMinOccurViewFilterStyle.getFilterStyle().then(function(data) {
            if (data!="" && data.length < 2000) {
                for (i=0; i<cswRecords.length; i++) {
                    var onlineResources=cswRecords[i].onlineResources;
                    for (j=0; j<onlineResources.length; j++) {
                        if (onlineResources[j].type=='WMS') {
                            if (onlineResources[j].name=='mo:MinOccView') {
                                var url = onlineResources[j].url + 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                                 +'&LAYER=mo:MinOccView&LAYERS=mo:MinOccView&SLD_BODY='+escape(data)
                                 +'&LEGEND_OPTIONS=forceLabels:on;minSymbolSize:16';
                                $scope.wmsLegends[cswRecords[i].adminArea]=url;
                            }
                        }
                    }
                }
            }
        });
    }

    // Use 'turf' to calculate the centre point of the BBOXES, use this to re-centre the map
    // Only calculate centre if the coords are not dispersed over the globe
    if (featureArr.length>0) {
        // Calculate the envelope, if not too big then re-centred map can be calculated
        var fc = turf.featureCollection(featureArr);
        var envelopePoly = turf.envelope(fc);
        if (envelopePoly.geometry.coordinates[0][1][0] - envelopePoly.geometry.coordinates[0][0][0] < 30 && envelopePoly.geometry.coordinates[0][2][1] - envelopePoly.geometry.coordinates[0][0][1] < 30) {
            var featureColl = turf.featureCollection(featureArr);
            // Calculate centre and re-centre the map
            var centerPt = turf.center(featureColl);
            if (centerPt.geometry.coordinates != undefined && centerPt.geometry.coordinates.length==2 
                && !isNaN(centerPt.geometry.coordinates[0]) && !isNaN(centerPt.geometry.coordinates[1])) {            
                mapInitConfig.center = { latitude: centerPt.geometry.coordinates[1], longitude: centerPt.geometry.coordinates[0] };
            }
        }
    }
    
    // Set initial configuration of the map
    $scope.map = mapInitConfig;
    
}]);

/**
 * CollapseDemoCtrl class holds state variables used to control collapsible information panels
 * @module controllers
 * @class CollapseDemoCtrl
 * 
 */ 
allControllers.controller('CollapseDemoCtrl', function ($scope) {
  $scope.isCollapsed = true;
  $scope.isCollapsedHorizontal = false;
});




    
    
    
    
    
