/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService','LayerManagerService','UtilitiesService','GetFilterParamService',
                                             function ($scope,$rootScope,$timeout,RenderHandlerService,LayerManagerService,UtilitiesService,GetFilterParamService) {
    
   $scope.optionalFilters=[];
   $scope.providers=[];
   $scope.select={
           filter:{}
   };
  
  
   
   var getProvider = function(){
       var cswRecords = $scope.layer.cswRecords;
       
     //Set up a map of admin areas + URL's that belong to each
       var adminAreasMap = {};
       for (var i = 0; i < cswRecords.length; i++) {
           var adminArea = cswRecords[i]['adminArea'];
           var allOnlineResources = LayerManagerService.getOnlineResourcesFromCSW(cswRecords[i]);        
           adminAreasMap[adminArea] = UtilitiesService.getUrlDomain(allOnlineResources[0].url);
               
           
       }

       //Set up a list of each unique admin area      
       for(key in adminAreasMap){
           $scope.providers.push({
               label : key,
               value : adminAreasMap[key]
           });
       }
       
   };
   
   
   
    /**
     * A function used to add a layer to the main map
     * @method addLayer
     * @param layer layer object
     */       
     $scope.addLayer = function(layer){
         var param  = {};
         param.optionalFilters = angular.copy($scope.optionalFilters);
         
         //VT: remove options to save bandwidth
         for(var idx in param.optionalFilters){
             if(param.optionalFilters[idx].options){
                 param.optionalFilters[idx].options = [];
             }
         }
         
         RenderHandlerService.renderLayer(layer,param);
     };
     

     $scope.addFilter = function(filter){
         if(filter==null){
             return;
         }
         if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.PROVIDER"){
             getProvider();
             filter.value={};
         }
         if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.DROPDOWNREMOTE"){
             GetFilterParamService.getParam(filter.url).then(function(response){
                 filter.options = response;
                 $scope.optionalFilters.push(filter);                
             });             
             return;
         }
         $scope.optionalFilters.push(filter);
         
     };
     
     $scope.clearFilter = function(){
         $scope.optionalFilters=[];
         $scope.select.filter={};
     };
    
}]);