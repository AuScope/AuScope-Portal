/**
 * infoPanelCtrl class handles rendering of left hand side information panels
 * @module controllers
 * @class infoPanelCtrl
 *
 */
allControllers.controller('infoPanelCtrl', ['$scope','$rootScope', '$element', 'GetMinOccurViewFilterStyle', 'PreviewMapService', function ($scope,$rootScope, $element, GetMinOccurViewFilterStyle, PreviewMapService) {

    // Gather up BBOX coordinates to calculate the centre and envelope
    var cswRecords = $scope.$parent.infoPanelCsw.cswRecords;
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
    var reCentrePt = {};
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
                reCentrePt = { latitude: centerPt.geometry.coordinates[1], longitude: centerPt.geometry.coordinates[0] };
            }
        }
    }
    
    // Set initial configuration of the map
    PreviewMapService.mapInit($scope.$parent.infoPanelCsw.name, $scope, reCentrePt);
    
}]);

/**
 * CollapseDemoCtrl class holds state variables used to control collapsible information panels
 * @module controllers
 * @class CollapseDemoCtrl
 * 
 */ 
allControllers.controller('CollapseDemoCtrl', ['$scope', '$element', 'PreviewMapService', function ($scope, $element, PreviewMapService) {
  $scope.isCollapsed = true;
  $scope.isCollapsedHorizontal = false;
  
  /**
  * Changes a rectangle in the preview map to a special highlighted colour
  * @method highlightOnPreviewMap
  * @param reportName Name of the reports displayed in the preview map
  * @param adminArea Name of the region where the reports apply
  *
  */
  $scope.highlightOnPreviewMap = function(reportName, adminArea) {
      PreviewMapService.setBBoxOptions(reportName, adminArea, { strokeColor: '#00FF00'});
  };
  
  /**
  * Returns a rectangle on the preview map to the default non-highlighted colour
  * @method lowlightOnPreviewMap 
  * @param reportName Name of the reports displayed in the preview map
  * @param adminArea Name of the region where the reports apply
  *
  */
  $scope.lowlightOnPreviewMap = function(reportName, adminArea) {
      PreviewMapService.setBBoxOptions(reportName, adminArea, { strokeColor: '#FF0000'});
  }
}]);




    
    
    
    
    
