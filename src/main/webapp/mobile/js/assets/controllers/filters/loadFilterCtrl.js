/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout','RenderHandlerService','LayerManagerService','UtilitiesService','GetFilterParamService','Constants','GoogleMapService','FilterStateService',
                                             function ($scope,$rootScope,$timeout,RenderHandlerService,LayerManagerService,UtilitiesService,GetFilterParamService,Constants,GoogleMapService,FilterStateService) {
    
    /* Opacity slider */
    $scope.slider = {
        value: 100,
        options: {
            id: 'slider-id',
            floor: 0,
            ceil: 100,
            showSelectionBar: true,
            onEnd: function(sliderId, modelValue) {
                GoogleMapService.setLayerOpacity($scope.layer, modelValue/100.0);
                FilterStateService.registerLayerOpacity($scope.layer.id, modelValue/100.0);
            }
        }
    };
    
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
     * Moves this layer to the front if obscure
     * @method moveLayerToFront
     * @param layer layer object
     */
    $scope.moveLayerToFront = function(layer) {
        GoogleMapService.moveLayerToFront(layer);
    }
    
    /**
     * Returns true if this layer is in front of all other layers
     * @method isLayerAtFront
     * @param layer layer object
     */
    $scope.isLayerAtFront = function(layer) {
        return GoogleMapService.isLayerAtFront(layer);
    }

    /**
     * Returns true if and only if the current layer is WMS
     * @method isWMSLayer
     */
    $scope.isWMSLayer = function () {
        return (Constants.rendererLoader[$scope.layer.id]=='WMSService' || !Constants.rendererLoader[$scope.layer.id] && LayerManagerService.getWMS($scope.layer).length > 0);
    }
    
    /**
     * Returns true is the layer is active
     * @method isLayerActive
     * @param layer layer object
     */
    $scope.isLayerActive = function(layer) {
        return GoogleMapService.isLayerActive(layer);
    }
    
    
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
     * Sets the value displayed in the current mandatory dropdown selector
     * @method setMandSelectList
     * @param val value to be seen in dropdown selector
     */
    $scope.setMandSelectList = function(val) {
        var setVal = val;
        $scope.mandDropdownSelectLabel = setVal;
    }
    
    /**
     * Forces a select operation on any one of the mandatory dropdown selectors
     * @method selectMandDropdownOpt
     * @param dropdownLabel label of the mandatory dropdown selector
     * @param val the value of the selection option (not the visible label)
     */
    $scope.selectMandDropdownOpt = function(dropdownLabel, val) {
        var done=false;
        for (var i=0; i<$scope.layer.filterCollection.mandatoryFilters.length && !done; i++) {
            var mandatoryFilter = $scope.layer.filterCollection.mandatoryFilters[i];
            // Look for the correct dropdown using the dropdown label
            if (mandatoryFilter.label==dropdownLabel) {
                
                // Loop over all the options
                for (var j=0;j<mandatoryFilter.options.length && !done;j++) {
                    
                    // Look for val in the valid options
                    for (key in mandatoryFilter.options[j]) {
                        if (mandatoryFilter.options[j].hasOwnProperty(key)) {
                            if (val==mandatoryFilter.options[j][key]) {
                                $scope.setMandSelectList(key);
                                mandatoryFilter.value=val;
                                done=true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    
    
    /**
     * Forces a select operation on any one of the optional dropdown selectors
     * @method selectOptDropdownOpt
     * @param dropdownLabel label of the optional dropdown selector
     * @param val the value of the selection option (not the visible label)
     */
    $scope.selectOptDropdownOpt = function(dropdownLabel, val) {
        var done=false;
        for (var i=0; i<$scope.layer.filterCollection.optionalFilters.length && !done; i++) {
            var optionalFilter = $scope.layer.filterCollection.optionalFilters[i];
            // Look for the correct dropdown using the dropdown label
            if (optionalFilter.label==dropdownLabel) {
                // Loop over all the options
                for (var j=0;j<optionalFilter.options.length && !done; j++) {
                    // Look for val in the valid options
                    for (key in optionalFilter.options[j]) {
                        if (optionalFilter.options[j].hasOwnProperty(key)) {
                            if (val==optionalFilter.options[j][key]) {
                                optionalFilter.value=val;
                                // Force evaluation of our new optional filter value, ng-init will set visible selection to " -- choose a BLAH -- "
                                $scope.$apply();
                                // Now we can set our visible selection value
                                $scope.setOptSelectList(key);  
                                done=true;
                                break;
                            }
                        }
                    }
                }
            }
        }
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
        if (layer.hasOwnProperty('filterCollection')) {
            FilterStateService.registerFilterSettings({m: layer.filterCollection.mandatoryFilters, o: layer.filterCollection.optionalFilters},layer.id);
        } else {
            FilterStateService.registerFilterSettings({m: {}, o: {}},layer.id);
        }
    };
     
    /**
     * Adds a new filter to be displayed in the panel
     * @method addFilter
     * @param filter filter object to be added to the panel
     */
    $scope.addFilter = function(filter, addEmpty){
        if(filter==null){
            return;
        }
        if(UtilitiesService.isEmpty($scope.providers) && filter.type=="OPTIONAL.PROVIDER"){
            getProvider();
            if (addEmpty)
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
     
    /**
     * Returns the first key in options object
     * @method getKey
     * @param options options object
     */
    $scope.getKey = function(options) {
        return Object.keys(options)[0];
    };

    
    /**
     * Uses the input filter object to set the filter values 
     * @method updateFilter
     * @param filterObj filter object i.e. {mandatoryFilters: {Obj}, optionalFilters: {Obj} }   
     */
    $scope.updateFilter = function(filterObj) {        
        // Optional Filters
        for (var i=0;i<filterObj.optionalFilters.length;i++) {
            for (var j=0;j<$scope.layer.filterCollection.optionalFilters.length;j++) {
                var optionalFilter = $scope.layer.filterCollection.optionalFilters[j];
                if (optionalFilter.label===filterObj.optionalFilters[i].label) {
                    if (optionalFilter.type=="OPTIONAL.DATE") {
                        optionalFilter.value= new Date(filterObj.optionalFilters[i].value);
                    } else {
                        optionalFilter.value=filterObj.optionalFilters[i].value;
                    }
                    $scope.addFilter(optionalFilter, false);
                    // If it's a dropdown, then must make it select the correct option
                    if (optionalFilter.type == 'OPTIONAL.DROPDOWNSELECTLIST') {
                        $scope.selectOptDropdownOpt(optionalFilter.label, optionalFilter.value);
                    }                     
                }
            }
        }
        // Mandatory filters
        for (var i=0;i<filterObj.mandatoryFilters.length;i++) {
            for (var j=0;j<$scope.layer.filterCollection.mandatoryFilters.length;j++) {
                var mandatoryFilter = $scope.layer.filterCollection.mandatoryFilters[j];
                if (filterObj.mandatoryFilters[i].label===mandatoryFilter.label) {
                    mandatoryFilter.value = filterObj.mandatoryFilters[i].value;
                    
                    // If it's a dropdown, then must make it select the correct option
                    if (mandatoryFilter.type == 'MANDATORY.DROPDOWNSELECTLIST') {
                        $scope.selectMandDropdownOpt(mandatoryFilter.label, mandatoryFilter.value);
                    } 
                }
            }
        }
        
        // Set layer opacities once the layer is added
        if (filterObj.hasOwnProperty("opacity") && filterObj.opacity >= 0.0) {
            GoogleMapService.onLayerAdded($scope, function(evt,layer){
                GoogleMapService.setLayerOpacity($scope.layer, filterObj.opacity);
                $scope.slider.value = filterObj.opacity*100.0;
            });
        }
        
        // Add the layer/markers
        $scope.addLayer($scope.layer);

    };
    
    // Register this filter's 'updateFilter' routine so it can be changed by other controllers
    var isLastLayer = ($rootScope.hasOwnProperty('lastLayerId') && $rootScope.lastLayerId==$scope.layer.id);
    FilterStateService.registerFilterUpdater($scope.updateFilter, $scope.layer.id,isLastLayer);
    
}]);