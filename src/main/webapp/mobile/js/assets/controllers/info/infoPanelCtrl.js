allControllers.controller('infoPanelCtrl', ['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
	
	var mapInitConfig = {
	        center: {lat: -30.5, lng: 136},
	        zoom: 2
	      };
	
	var  map = new google.maps.Map(document.getElementById('map'), mapInitConfig);
	
	$timeout(function() {
		google.maps.event.trigger(map, 'resize');
		var center = new google.maps.LatLng(mapInitConfig.center.lat, mapInitConfig.center.lng);
		map.panTo(center);
    }, 1000);
	
	 var outerCoords = [
	                    {lat: -25.364, lng: 145.207}, // north west
	                    {lat: -35.364, lng: 145.207}, // south west
	                    {lat: -35.364, lng: 158.207}, // south east
	                    {lat: -25.364, lng: 158.207}  // north east
	                  ];
	 map.data.add({
		 geometry: new google.maps.Data.Polygon([
		                                         outerCoords
		                                         ])
	 })

}]);