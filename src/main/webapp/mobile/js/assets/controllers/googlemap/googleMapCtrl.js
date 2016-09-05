/**
 * googleMapCtrl class initialises the Google map used to display the main map
 * @module controllers
 * @class googleMapCtrl
 */
allControllers.controller('googleMapCtrl', ['$scope','$rootScope','GoogleMapService', function ($scope,$rootScope,GoogleMapService) {
    
    $scope.active = {};

    GoogleMapService.initMap();

    
    

}]);
