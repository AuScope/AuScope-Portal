allControllers.controller('defaultFilterCtrl', ['$scope','WMSService', function ($scope,WMSService) {
    
    
    
    $scope.addLayer = function(layer){
        WMSService.renderLayer(layer);
    };
    
}]);