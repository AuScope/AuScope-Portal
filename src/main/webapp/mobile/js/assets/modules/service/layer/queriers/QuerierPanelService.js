/**
 * QuerierPanelService handles layer manipulation and extraction of information from the layer/csw records.
 * To use this class you must first call 'registerParentScope' which registers the parent scope of the panel object.
 * This is called from the querier panel's controller. It assumes that there is a variable named 'showQuerierPanel' 
 * in the parent scope which can be used to open and close the panel via  ' ng-show="showQuerierPanel" '.  
 * @module layer
 * @class QuerierPanelService
 * 
 */
allModules.service('QuerierPanelService', function () {
    this.pointObj = null;
    this.panelHtml = null;
    this.layerList = [];

    /**
    * Register the 
    * @method registerParentScope
    * @param parentObj
    * @param scopeObj
    */
    this.registerParentScope = function (parentObj, scopeObj) {
        this.scopeObj = scopeObj;
        this.parentObj = parentObj;
    };
    
    /**
    * Opens the query panel
    * @method openPanel
    * @param useApply boolean parameter. Set to true and 'openPanel()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    * It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
    */
    this.openPanel = function (useApply)
    {
        this.parentObj.showQuerierPanel = true;
        if (useApply)
            this.parentObj.$apply();
    };
    
    /**
    * Closes the query panel
    * @method closePanel
    * @param useApply boolean parameter. Set to true and 'openPanel()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    * It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
    */
    this.closePanel = function (useApply)
    {
        this.parentObj.showQuerierPanel = false;
        if (useApply)
            this.parentObj.$apply();
    };
    
    /**
    * Retrieves the point object for the most recent query
    * @method getQueryPoint
    * @return the point object for most recent query
    */
    this.getQueryPoint = function () 
    {
        return this.pointObj;
    };
    
    /**
    * Set the point data for the query point
    * @method setQueryPoint
    * @param point
    */
    this.setQueryPoint = function (point)
    {
        this.pointObj = point;
        if (point != null) {
            this.scopeObj.pointObj = {name: point.name, description: point.description, latitude: point.coords.lat, longitude: point.coords.lng, srsUrl: point.srsName };
        }
        this.scopeObj.panelHtml = "";
    };
    
    /**
    * Set the HTML string to be displayed on the panel
    * @method setPanelHtml
    * @param html
    */
    this.setPanelHtml = function (html)
    {
        this.pointObj = null;
        this.scopeObj.pointObj = null;
        this.scopeObj.panelHtml = html;
    };
    
    /**
    * Disable click events on the map layer to prevent opening up of the query panel
    * This should be called after the layer has been deleted from the map
    * @method deregisterLayer
    * @param filterPanelCsw CSW object of the layer that has been deleted from the map
    */
    this.deregisterLayer = function(filterPanelCsw)
    {   
        for (var i=0; i<filterPanelCsw.cswRecords[0].onlineResources.length; i++) {
            var onlineResource = filterPanelCsw.cswRecords[0].onlineResources[i];
            for (var j=0; j<this.layerList.length; j++) {
                if (this.layerList[j].resource==onlineResource) {
                    // Remove event listener from map
                    this.layerList[j].listener.remove();
                    // Delete from list
                    this.layerList.splice(j,1);
                    return;
                }
            }
        }
    };
    
    /**
    * Registers the mapEventListener object and onlineResource object
    * This should be called after the 'mousedown' event is registered with the google map.
    * @method registerLayer
    * @param onlineResource object representing the WMS resource displayed as a map layer
    * @param mapEventListener 'MapsEventListener' object created when map listener routine is registered using 'google.maps.event' namespace
    */
    this.registerLayer = function(onlineResource, mapEventListener)
    {
        // Add to list
        this.layerList.push({
            resource: onlineResource,
            listener: mapEventListener 
        });
    };
    
});