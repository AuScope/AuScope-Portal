allControllers.controller('defaultFilterCtrl', ['$scope','RenderHandlerService', function ($scope,RenderHandlerService) {
    
    
    
    $scope.addLayer = function(layer){
        RenderHandlerService.renderLayer(layer);
    };
    
}]);