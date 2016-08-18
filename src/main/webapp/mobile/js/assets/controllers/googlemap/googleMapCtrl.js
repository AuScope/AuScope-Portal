allControllers.controller('googleMapCtrl', ['$scope','$rootScope','uiGmapGoogleMapApi', function ($scope,$rootScope,uiGmapGoogleMapApi) {
	
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
	
//	uiGmapGoogleMapApi.then(function(maps) {
//		maps
//    });
	   
	  

}]);