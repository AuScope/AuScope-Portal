/**
 * QuerierPanelService handles layer manipulation and extraction of information from the layer/csw records.
 * To use this class you must first call 'registerPanel'.   
 * @module layer
 * @class QuerierPanelService
 * 
 */
allModules.service('QuerierPanelService', ['LayerManagerService','GoogleMapService', 'GetWMSRelatedService', 'GMLParserService', function (LayerManagerService, GoogleMapService, GetWMSRelatedService, GMLParserService) {
    this.layerList = [];
    
    var me = this;
    
    /**
    * @method registerMap
    * @param map Google map to be registered
    */
    this.registerMap = function (map) {
        //
        var mapEventListener = google.maps.event.addListener(map, 'click', function(evt) {
            
            // Assemble a 'doneList' so that the last async web query to complete will hide the loading mask and open up the panel
            var doneList = [];
            var hasData = false;
            for (var i=0; i<me.layerList.length; i++) doneList.push(false);
            
            // When clicked on map, go through the layers and find the ones that have been clicked on
            for (var j=0; j<me.layerList.length; j++) {
                var bbox = me.layerList[j].bbox;
                
                // Send a request to the WMS service if the click is within the resource's bounding box
                if (evt.latLng.lat() < bbox.northBoundLatitude && evt.latLng.lat() > bbox.southBoundLatitude &&
                    evt.latLng.lng() < bbox.eastBoundLongitude && evt.latLng.lng() > bbox.westBoundLongitude) {
                    
                    // Show loading mask 
                    GoogleMapService.busyStart();
                    
                    // Send request to WMS service
                    GetWMSRelatedService.getWMSMarkerInfo(evt.latLng, evt.pixel, map, me.layerList[j].resource, me.layerList[j].style, j).then(function(response) 
                        {  
                            // Used to check for an empty response, which occurs when user clicks/touches on empty space
                            var empty_html_body = /<body>\s*<\/body>/g;
                            var empty_html_body2 = /<body>\s*<script .+<\/script>\s*<\/body>/g;
                            var empty_gml_body = /<wfs:FeatureCollection .+\/>$/g;

                            // Open if panel if there was a valid response (NB: Only status code 200 will return a complete response)
                            if (response.status==200 && empty_gml_body.test(response.data)==false) {
                                var displayable = me.setPanelNode(GMLParserService.getRootNode(response.data), me.layerList[response.config.slot_num].resource.name, "WMS", true);
                                if (!hasData && displayable) hasData = true;
                            }
                            doneList[response.config.slot_num] = true;
                            if (me.lastOne(doneList)) {
                                // Hide loading mask
                                GoogleMapService.busyEnd();
                                if (hasData) {
                                    me.openPanel(false);
                                }
                            }
                        },
                        function(errorResponse) {
                            doneList[errorResponse.config.slot_num] = true;
                            if (me.lastOne(doneList)) {
                                // Hide loading mask
                                GoogleMapService.busyEnd();
                                if (hasData) {
                                    me.openPanel(false);
                                }
                            }
                        }
                    );
                    
                // If click is not within this layer's bounding box
                } else {
                    doneList[j] = true;
                    if (me.lastOne(doneList)) {
                        // Hide loading mask
                        GoogleMapService.busyEnd();
                        if (hasData) {
                            me.openPanel(false);
                        }
                    }
                }                   
            }
        });         
    };
    
    // After Google Map has been initialised, register it 
    GoogleMapService.getMapWhenReady(function(map) {me.registerMap(map);});
    
    /**
    * Returns true iff all elements in array are true else false
    * @method lastOne
    * @param doneList boolean array
    */
    this.lastOne = function (doneList) {
        for (var i=0; i< doneList.length; i++) {
           if (!doneList[i]) {
               return false;
           }
        }
        return true;
    };
    
    /**
    * Register the panel by passing in some querier panel controller functions.
    * @method registerPanel
    * @param openPanelFn used to open and close the panel
    *    function openPanelFn(ctrlBool, useApply)
    *    'ctrlBool' if true panel will open, if false panel will close
    *    'useApply' boolean parameter. Set to true and 'openPanelFn()' will use the '$apply()' method to make the panel open. Set to false and '$apply()' will not be used. 
    *    It is recommended to set to false in places where you would get an '$digest already in progress' error, e.g. calling 'setPanel(true)' from within a 'then()' function
    * @param setXMLFn function used to display XML data in the panel
    *    function setXMLFn(xmlString, layerName, prependStr) return boolean
    *    'xmlString' is a string of xml to be displayed
    *    'layerName' layer display name
    *    'prependStr' string to prepend to layer display name
    *    returns true is there is data to display
    */
    this.registerPanel = function (openPanelFn, setXMLFn, setCarouselImgFn, setCarouselBusyFn) {
        // Store the controller functions for future use
        this.openPanelFn = openPanelFn;
        this.setXMLFn = setXMLFn;
        this.setCarouselImgFn = setCarouselImgFn;
        this.setCarouselBusyFn = setCarouselBusyFn;
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
    
    this.setCarouselImages = function (imageList) {
        this.setCarouselImgFn(imageList);
    };
        
    /**
    * Set the XML string to be displayed on the panel
    * @method setPanelNode
    * @param xmlString XML string to be displayed
    * @param displayName name of layer or feature, to be used if no suitable name is found within XML string
    * @param prependStr string to prepend to display name e.g. 'WMS', 'WFS'. Used for display purposes
    * @param appendFlag will append the new tree to the current tree(s) on panel or clear the panel and add a new tree 
    * @return boolean value, true if the panel should be opened because there is something to display
    */
    this.setPanelNode = function(node, displayName, prependStr, appendFlag)
    {       
        return this.setXMLFn(node, displayName, prependStr, appendFlag);
    };
    
    /**
    * Disable click events on the map layer to prevent opening up of the query panel
    * This should be called after the layer has been deleted from the map
    * @method deregisterLayer
    * @param layer CSW object of the layer that has been deleted from the map
    */
    this.deregisterLayer = function(layer)
    {           
        var onlineResources = LayerManagerService.getOnlineResources(layer)
        for (var i=0; i< onlineResources.length; i++) {
            var onlineResource = onlineResources[i];
            for (var j=0; j<this.layerList.length; j++) {
                if (this.layerList[j].resource==onlineResource) {
                    // Delete from list
                    this.layerList.splice(j,1);
                    
                }
            }
        }
    };
    
    
    /**
    * Registers the mapEventListener object and onlineResource object
    * This should be called after the 'mousedown' event is registered with the google map.
    * @method registerLayer
    * @param map Google Map that layer is attached to
    * @param onlineResource object representing the WMS resource displayed as a map layer
    * @param bbox bounding box that contains this layer
    * @param style layer's style
    */
    this.registerLayer = function(aMap, onlineResource, bBox, aStyle)
    {
        // Add to list
        this.layerList.push({
            map: aMap,
            resource: onlineResource,
            bbox: bBox,
            style: aStyle
        });
    };
    
    this.setCarouselBusy = function(busyFlag)
    {
        //Call the corresponding controller function
        this.setCarouselBusyFn(busyFlag);
    };
    
}]);