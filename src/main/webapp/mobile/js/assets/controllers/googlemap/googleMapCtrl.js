allControllers.controller('googleMapCtrl', ['$scope','$rootScope','googleMapService','WMSService', function ($scope,$rootScope,googleMapService,WMSService) {
	
	$scope.active = {};

	googleMapService.initMap();
	
	WMSService.renderLayer();
	  

}]);