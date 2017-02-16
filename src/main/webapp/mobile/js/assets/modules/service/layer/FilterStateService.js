/**
 * FilterStateService user to store and extract the state of the filters and change the state of the filters
 * @module layer
 * @class FilterStateService
 * 
 */
allModules.service('FilterStateService',[function () {
    
    // Registered filter settings for layers/markers that have been added to map
    this.filterSettings = {};
    
    // Registered opacities for layers/markers that have been added to map
    this.opacities = {};
    
    // Registry of functions used to update filters 
    this.updateFns = {};
    
    
    // A function to be called when this class is ready
    this.lastFilterDoneFn = null;
    
    // Last filter to be registered
    this.lastOne = false;
    
    /**
     * Registers filter settings for a layer/markers that has just been added to map 
     * @method registerFilterSettings
     * @param filter filter object
     * @param layerId layer id string
     */
    this.registerFilterSettings = function(filter, layerId) {
        this.filterSettings[layerId] = filter;
    };
    
    /**
     * Deregisters filter (and opacity) settings for a layer/markers that has been deleted from map
     * @method deregisterFilterSettings
     * @param layerId layer id string
     */
    this.deregisterFilterSettings = function(layerId) {
        delete this.filterSettings[layerId];
        delete this.opacities[layerId];
    };
    
    /**
     * Returns an object that contains the current states of all the filters
     * @method getFilterState
     * @return An object, key: layer id string, value: filter state object {optionalFilters: {Obj}, mandatoryFilters:{Obj}, opacity:0.0 .. 1.0|-1.0}
     */
    this.getFilterState = function() {
        var filters = {};
        for (layerId in this.filterSettings) {
            var opacityVal = this.opacities.hasOwnProperty(layerId)?this.opacities[layerId]:-1.0;
            filters[layerId] = {optionalFilters:[], mandatoryFilters:[], opacity:opacityVal};
            for (var i=0; i<this.filterSettings[layerId].o.length;i++) {
                if (this.filterSettings[layerId].o[i].value)
                    filters[layerId].optionalFilters.push({value: this.filterSettings[layerId].o[i].value, label: this.filterSettings[layerId].o[i].label, type: this.filterSettings[layerId].o[i].type})
            }
            if (this.filterSettings[layerId].hasOwnProperty('m') && this.filterSettings[layerId].m)
                for (var i=0;i<this.filterSettings[layerId].m.length;i++) {
                    if (this.filterSettings[layerId].m[i].value)
                        filters[layerId].mandatoryFilters.push({value: this.filterSettings[layerId].m[i].value, label: this.filterSettings[layerId].m[i].label, type: this.filterSettings[layerId].m[i].type});
                }
        }
        return filters;
    };
    
    /**
     * Registers the opacity value for a layer
     * This is called from the filter controller
     * @method registerLayerOpacity
     * @param layerId layer id string
     * @param opValue opacity value
     */
    this.registerLayerOpacity = function(layerId, opValue) {
        this.opacities[layerId] = opValue;
    };
    
    /**
     * FIXME: ??is this used??
     */
    this.getLayerOpacities = function() {
        return this.opacities;
    };
    
    /**
     * This function is used to register a function that will update the filter
     * @method registerFilterUpdater
     * @param updateFn a function that will update the visible filter
     * @param layerId layer id string
     * @param lastOne is true if and only if this is the last filter to be registered
     */
    this.registerFilterUpdater = function(updateFn, layerId, lastOne) {
        this.updateFns[layerId] = updateFn;
        this.lastOne = lastOne;
        // call the function if this is the last 
        if (lastOne && this.lastFilterDoneFn) {
            this.lastFilterDoneFn();
            this.lastOne = false;
        }
    };
    
    /**
     * Used by a controller to register a callback function that will be called when the last filter has been registered
     * @method registerIsReadyCB
     * @param lastFilterDoneFn function to be called when the last filter has been registered
     */
    this.registerIsReadyCB = function(isReadyFn) {
        this.lastFilterDoneFn = isReadyFn;
        if (this.lastOne) {
            this.lastFilterDoneFn();
            this.lastOne = false;
        }
    };
    
    /**
     * This calls the update function for a layer to update the visible part of the filter
     * This is called from the map service to setup the filters
     * @method setFiltersState
     * @param filterState object that contains the state and layer id of the filter
     */
    this.setFiltersState = function(filterState) {
        for (layerId in filterState) {
            this.updateFns[layerId](filterState[layerId]);
        }
    };
    
}]);