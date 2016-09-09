/**
 * googleMapCtrl class initialises the Google map used to display the main map
 * @module controllers
 * @class googleMapCtrl
 */
allControllers.controller('googleMapCtrl', ['$scope','$rootScope','GoogleMapService','RenderStatusService','$timeout', 
                                            function ($scope,$rootScope,GoogleMapService,RenderStatusService,$timeout) {
    
    $scope.active = {};

    GoogleMapService.initMap();

    $scope.floatingGroupStatus = RenderStatusService.getRenderStatus().group;
    
    RenderStatusService.onUpdate($scope, function (newRenderStatus) {
        //VT: Inconsistent API (Sync/Async): https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest
        $timeout(function() {
            $scope.floatingGroupStatus = newRenderStatus.group;
        },0);
    });
    

}]);
