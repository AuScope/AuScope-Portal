/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService','LayerManagerService','UtilitiesService','GetFilterParamService',
                                             function ($scope,$rootScope,$timeout,RenderHandlerService,LayerManagerService,UtilitiesService,GetFilterParamService) {
    
    /* Optional filters for display in panel */
    $scope.optionalFilters=[];
    
    /* Providers used for display in panel */
    $scope.providers=[];
    
    /* Value displayed in the optional dropdown selector */ 
    $scope.optDropdownSelectLabel = "-- choose an option --";
    
    /* Value displayed in the remote dropdown selector */
    $scope.dropdownRemoteLabel = "-- choose an option --";
    
    /* Value displayed in the mandatory dropdown selector */ 
    $scope.mandDropdownSelectLabel =  "-- choose an option --";
    
    /**
     * Sets the value displayed in the optional dropdown selector
     * @method setOptSelectList
     * @param val value to be set in dropdown selector
     */
    $scope.setOptSelectList = function(val) {
        var setVal = val;
        $scope.optDropdownSelectLabel = setVal;
    }
    
    /**
     * Sets the value displayed in the mandatory dropdown selector
     * @method setMandSelectList
     * @param val value to be set in dropdown selector
     */
    $scope.setMandSelectList = function(val) {
        var setVal = val;
        $scope.mandDropdownSelectLabel = setVal;
    }
   
    /**
     * Sets the value displayed in the remote dropdown selector
     * @method setDropdownRemote
     * @param val value to be set in dropdown selector
     */
    $scope.setDropdownRemote = function(val) {
        var setVal = val;
        $scope.dropdownRemoteLabel = setVal;
    }
   
    /**
     * Assembles a list of providers, which will be displayed in the panel
     * @method getProvider
     */
    var getProvider = function(){
        var cswRecords = $scope.layer.cswRecords;
       
        // Set up a map of admin areas + URL's that belong to each
        var adminAreasMap = {};
        for (var i = 0; i < cswRecords.length; i++) {
            var adminArea = cswRecords[i]['adminArea'];
            var allOnlineResources = LayerManagerService.getOnlineResourcesFromCSW(cswRecords[i]);        
            adminAreasMap[adminArea] = UtilitiesService.getUrlDomain(allOnlineResources[0].url);   
        }

        // Set up a list of each unique admin area      
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
     
     /**
      * Adds a new filter to be displayed in the panel
      * @method addFilter
      * @param filter filter object to be added to the panel
      */
     $scope.addFilter = function(filter){
         if(filter==null){
             return;
         }
         if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.PROVIDER"){
             getProvider();
             filter.value={};
         }
         if(UtilitiesService.isEmpty(filter.options) && filter.type=="OPTIONAL.DROPDOWNREMOTE"){
             GetFilterParamService.getParam(filter.url).then(function(response){
                 filter.options = response;
                 $scope.optionalFilters.push(filter);                
             });             
             return;
         }
         $scope.optionalFilters.push(filter);
         
     };
     
     /**
      * Removes all filters displayed in panel
      * @method clearFilter
      */
     $scope.clearFilter = function(){
         $scope.optionalFilters=[];
     };
     
     
     $scope.getKey = function(options) {
         return Object.keys(options)[0];
     };

     
    
}]);