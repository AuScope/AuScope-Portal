/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService', function ($scope,$rootScope,$timeout,RenderHandlerService) {
    
   $scope.selectedFilters=[];
   
    /**
     * A function used to add a layer to the main map
     * @method addLayer
     * @param layer layer object
     */       
     $scope.addLayer = function(layer){
         RenderHandlerService.renderLayer(layer,$scope.selectedFilters);
     };
     

     $scope.addFilter = function(filter){
         $scope.selectedFilters.push(filter);
     };
    
}]);