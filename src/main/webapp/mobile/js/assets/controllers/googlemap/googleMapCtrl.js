allControllers.controller('googleMapCtrl', ['$scope','$rootScope','GoogleMapService', function ($scope,$rootScope,GoogleMapService) {
	
	$scope.active = {};

	GoogleMapService.initMap();

	
	

}]);
