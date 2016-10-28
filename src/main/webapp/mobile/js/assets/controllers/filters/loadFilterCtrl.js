/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService','LayerManagerService','UtilitiesService',
                                             function ($scope,$rootScope,$timeout,RenderHandlerService,LayerManagerService,UtilitiesService) {
    
   $scope.optionalFilters=[];
   $scope.providers=[];
   
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
         param.optionalFilters = $scope.optionalFilters;
         
         RenderHandlerService.renderLayer(layer,param);
     };
     

     $scope.addFilter = function(filter){
         if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.PROVIDER"){
             getProvider();
             filter.value={};
         }
         if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.DROPDOWNREMOTE"){
             //VT: get commodity
             //then after its done populate filter.options
             //VT: may require some massaging of data to return array of object as option.value as option.key
             filter.option = getCommodity;
             $scope.optionalFilters.push(filter);
             return;
         }
         $scope.optionalFilters.push(filter);
     };
    
}]);