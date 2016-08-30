allControllers.controller('googleMapCtrl', ['$scope','$rootScope','googleMapService', function ($scope,$rootScope,googleMapService) {
	
	$scope.active = {};

	googleMapService.initMap();
	
	
	  

}]);