/**
 * defaultFilterCtrl class used to add layers to the main map
 * @module controllers
 * @class defaultFilterCtrl
 */
allControllers.controller('defaultFilterCtrl', ['$scope','RenderHandlerService', function ($scope,RenderHandlerService) {
    
    /**
    * A function used to add a layer to the main map
    * @method addLayer
    * @param layer layer object
    */       
    $scope.addLayer = function(layer){
        RenderHandlerService.renderLayer(layer);
    };
    
}]);