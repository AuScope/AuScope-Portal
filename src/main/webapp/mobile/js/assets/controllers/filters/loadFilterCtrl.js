/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService', function ($scope,$rootScope,$timeout,RenderHandlerService) {
    
   $scope.xPathFilters=[];
   
    /**
     * A function used to add a layer to the main map
     * @method addLayer
     * @param layer layer object
     */       
     $scope.addLayer = function(layer){
         var param  = {};
         param.xPathFilters = $scope.xPathFilters;
         
         RenderHandlerService.renderLayer(layer,param);
     };
     

     $scope.addFilter = function(filter){
         $scope.xPathFilters.push(filter);
     };
    
}]);