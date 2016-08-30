allControllers.controller('googleMapCtrl', ['$scope','$rootScope','uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope,$rootScope,uiGmapGoogleMapApi, uiGmapIsReady) {
	
	$scope.active = {};

	$scope.map = { 
		center: { 			
			latitude: -24.6993436, 
			longitude: 134.8757525
		}, 			
		zoom: 5,
		options: {            
            mapTypeControlOptions: {
                position: 7
            }
//            minZoom: 2,
//            maxZoom: 20,
//            panControlOptions: {
//                position: google.maps.ControlPosition.RIGHT_BOTTOM
//            },
//            disableDefaultUI: true,
//            styles: [{
//                featureType: "poi",
//                stylers: [{
//                    visibility: "off"
//                }]
//            },
//            {
//                elementType : 'labels',
//                stylers : [{
//                  visibility : 'off'
//                }]
//            }],
//            panControl: true,
//            zoomControl: true,
//            scaleControl: false,
//            streetViewControl: false,
//            overviewMapControl: false
        },
        enableCluster : true
	};
	
	$scope.marker = {
	      id: 0,
	      coords: {
	    	  latitude: -24.6993436, 
	    	  longitude: 134.8757525
	      },
	      events: {
	          click: function (marker, eventName,model, args) {	   
	        	$scope.active ={ id: marker.key };
	            $scope.showActivePanel = true;
	            $scope.showlayerPanel = false;
	           
	          }
	       }
	}
	
	uiGmapGoogleMapApi.then(function(maps) {
	    console.log("uiGmapGoogleMapApi big map ok");
    });
	   
	uiGmapIsReady.promise(1).then(function(instances) {
        console.log("big map is ready 2");
        instances.forEach(function(inst) {
            var map = inst.map;
            var uuid = map.uiGmap_id;
            var mapInstanceNumber = inst.instance; // Starts at 1.
            console.log("big map is ready");
        });
    });

}]);