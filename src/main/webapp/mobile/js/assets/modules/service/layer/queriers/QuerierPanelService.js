/**
 * QuerierPanelService handles layer manipulation and extraction of information from the layer/csw records.
 * To use this class you must first call 'registerPanel'.   
 * @module layer
 * @class QuerierPanelService
 * 
 */
allModules.service('QuerierPanelService', ['$compile', function ($compile) {
    this.layerList = [];
	
    /**
    * Register the panel by passing in some querier panel controller functions.
    * @method registerPanel
	* @param openPanelFn used to open and close the panel
    *    function openPanelFn(ctrlBool, useApply)
	*    'ctrlBool' if true panel will open, if false panel will close
	*    'useApply' boolean parameter. Set to true and 'openPanelFn()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    *    It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
	* @param setPointFn function used to display point information in panel. It has the format:
	*    function setPointFn(pointObj) { ... }
	*    'pointObj' is the point to be displayed. Format: {name: <name>, description: <description>, latitude: <latitude>, longitude: <longitude>, srsUrl: <srsUrl> }
	* @param setXMLFn function used to display XML data in the panel
	*    function setXMLFn(xmlString) { ... }
	*    'xmlString' is a string of xml to be displayed
    */
    this.registerPanel = function (openPanelFn, setPointFn, setXMLFn) {
		// Store the controller functions for future use
        this.openPanelFn = openPanelFn;
		this.setPointFn = setPointFn;
		this.setXMLFn = setXMLFn;
    };
    
    /**
    * Opens the query panel
    * @method openPanel
    * @param useApply boolean parameter. Set to true and 'openPanel()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    * It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
    */
    this.openPanel = function (useApply)
    {
		// Call the corresponding controller function
		this.openPanelFn(true, useApply);
    };
    
    /**
    * Closes the query panel
    * @method closePanel
    * @param useApply boolean parameter. Set to true and 'closePanel()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    * It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
    */
    this.closePanel = function (useApply)
    {
		// Call the corresponding controller function
        this.openPanelFn(false, useApply);
    };
    
    /**
    * Set the point data for the query point
    * @method setQueryPoint
    * @param point
    */
    this.setQueryPoint = function (point)
    {
        if (point != null) {
			// Set the point datum, unset the XML string
			this.setPointFn({name: point.name, description: point.description, latitude: point.coords.lat, longitude: point.coords.lng, srsUrl: point.srsName });
			this.setXMLFn(""); 
        }
    };
    	
	/**
    * Set the HTML string to be displayed on the panel
    * @method setPanelXml
    * @param xmlString
    */
    this.setPanelXml = function(xmlString)
    {
        if (xmlString.length > 0) {
			// Set the XML string, unset the point datum
			this.setXMLFn(xmlString);
			this.setPointFn(null);
        }
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
    
}]);