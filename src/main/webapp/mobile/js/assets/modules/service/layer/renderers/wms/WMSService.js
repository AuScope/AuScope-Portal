/**
 * WMSService handles rendering of all wms layers onto the map
 * @module map
 * @class WMSService
 * 
 */
allModules.service('WMSService',['$interval','GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService','QuerierPanelService','WMS_1_1_0_Service','WMS_1_3_0_Service','UtilitiesService',
                                 function ($interval,GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService,QuerierPanelService,WMS_1_1_0_Service,WMS_1_3_0_Service,UtilitiesService) {
    
    var maxSldLength = 1900;
    var LAYERCHK_INT = 1000; // Check layer loading progress this often (millisecond)
    var LAYERCHK_NUM = 45; // Check layer loading progress this many times
    
    this.tiles = {};
    this.timers = {};
    var me = this;
    

   
    
    /**
     * Look for img elements and add event handlers to them or timeout
     * @method evaluateTiles
     * @param layer layer object
     * @param onlineResource online resource object
     * @param tilesLoaded is this being called after a 'tilesloaded' event?
     * @return true if the timer should be cancelled
     */
    this.evaluateTiles = function(layer, onlineResource, tilesLoaded) {
        
        // Is Internet Explorer?
        var msie = document.documentMode;
        var cancelTimer = false;
        
        var reportError = function(e) {
            RenderStatusService.updateCompleteStatus(layer,onlineResource,Constants.statusProgress.ERROR);
        };
    
        var reportCompleted = function(e) {
            RenderStatusService.updateCompleteStatus(layer,onlineResource,Constants.statusProgress.COMPLETED);
        };
        
        // Look for one good tile in the mapLayer
        for (var t=0; t<me.tiles[layer.id][onlineResource.url].length; t++) {
            var imgNode = $("img", me.tiles[layer.id][onlineResource.url][t].node).get(0);
            // *IF* there is an image element then decide as best we can or put some event handlers on it 
            if (imgNode) {         
                // BEWARE! This does not always indicate that the image is visible.
                // The image will be visible once the <div> is added to the map.
                // On IE and Chrome this means that the layers may not appear until the last layer has loaded.
                if (imgNode.complete && (msie || (imgNode.currentSrc && imgNode.currentSrc==imgNode.src)) && imgNode.naturalWidth==Constants.TILE_SIZE && imgNode.naturalHeight==Constants.TILE_SIZE) {
                    reportCompleted();
                    cancelTimer = true;
                    break;
                }
                // If service returns a text error message instead of an image
                if (imgNode.complete && (imgNode.naturalWidth==0 || imgNode.naturalHeight==0)) {
                    reportError();
                    cancelTimer = true;
                    break;
                }
                // These will only work for slower connections and slower browsers (Firefox) where <img> has been created, but image data has not been received
                if (!me.tiles[layer.id][onlineResource.url][t].hasEvents && $("img", me.tiles[layer.id][onlineResource.url][t].node).length>0) {                    
                    $("img", me.tiles[layer.id][onlineResource.url][t].node).one("error", reportError);
                    $("img", me.tiles[layer.id][onlineResource.url][t].node).one("load", reportCompleted);
                    me.tiles[layer.id][onlineResource.url][t].hasEvents = true;
                }
            }
        }
        return cancelTimer;
    };
    
    /**
     * Add layer to Google Map
     * @method addLayerToGoogleMap
     * @param mapLayer Google mapLayer object
     * @param layer layer object
     * @param onlineResource online resource object
     * @param style map style
     */
    var addLayerToGoogleMap = function(mapLayer,layer,onlineResource,style){
        
        var map = GoogleMapService.getMap();
        
        // NB: Google Maps 'tilesloaded' event is not reliable. 
        // Often it is triggered when the layer is loaded but image is not yet rendered or even when the browser is still waiting for image data
        var registerTileLoadedEvent = function(mapLayer, layer, onlineResource) {

            // Set up storage for tile nodes
            if (!(layer.id in me.tiles)) me.tiles[layer.id] = {};
            me.tiles[layer.id][onlineResource.url] = [];
            
            // Remove old interval timer and set up a new one
            if (!(layer.id in me.timers)) me.timers[layer.id] = {};
            if (onlineResource.url in me.timers[layer.id] && me.timers[layer.id][onlineResource.url]) {
                $interval.cancel(me.timers[layer.id][onlineResource.url].promise);
            }
            // Setup a timer function to monitor the loading process
            me.timers[layer.id][onlineResource.url] = { 
                cnt: 0, // Number of timer function iterations
                promise: $interval( // Timer function
            
                function(mapLayer, layer,onlineResource) {
                    me.timers[layer.id][onlineResource.url].cnt++;
                    // If still RUNNING ...
                    if (RenderStatusService.checkStatus(layer,onlineResource,Constants.statusProgress.RUNNING)) {
                        // And tiles still loading and not last timer iteration then exit
                        if (!me.evaluateTiles(layer, onlineResource) && (me.timers[layer.id][onlineResource.url].cnt < LAYERCHK_NUM)) {
                            return;
                        }
                        // If this is the final iteration then signal a timeout with an error
                        if (me.timers[layer.id][onlineResource.url].cnt >= LAYERCHK_NUM) {
                            RenderStatusService.updateCompleteStatus(layer,onlineResource,Constants.statusProgress.ERROR);
                        }
                    }
                    
                    // Cancel timer
                    if (me.timers[layer.id][onlineResource.url].promise)
                        $interval.cancel(me.timers[layer.id][onlineResource.url].promise);
                    me.timers[layer.id][onlineResource.url] = null;
                    
                    // Reset tiles
                    me.tiles[layer.id][onlineResource.url] = [];

                }, LAYERCHK_INT, LAYERCHK_NUM, true, mapLayer, layer, onlineResource)
            };
        };
        
        /**
         * Hack to override the getTile function to gain access to the underlying tile <div>s to monitor progress of layer loading
         * Note that 'getTile' is also called every time the map pans, resizes etc.
         */
        var overrideToRegisterFailureEvent = function(mapLayer){
            
            mapLayer.imagelayerGetTile = mapLayer.getTile;
            mapLayer.getTile = function(tileCoord, zoom, ownerDocument){
                // Call Google Map's 'getTile'
                var node = mapLayer.imagelayerGetTile(tileCoord, zoom, ownerDocument);
                
                // Save tile nodes in order to check if the layer is loading correctly
                // Only sample the first 10 tiles
                if (me.tiles[layer.id][onlineResource.url].length < 10) {
                    me.tiles[layer.id][onlineResource.url].push({node: node, hasEvents: false});
                }
                return node;
            };
            return mapLayer;
        };
        
        // Setup interval timer to monitor layer loading process
        registerTileLoadedEvent(mapLayer,layer,onlineResource);
        
        // Get the bounding box for the 'onlineResource', then register for click events within that bounding box
        var cswRecords = LayerManagerService.getCSWRecords(layer);
        var done = false;
        for (var i=0; i<cswRecords.length && !done; i++) {
            var onlineResources = cswRecords[i].onlineResources;
            for (var j=0; j<onlineResources.length; j++) {
                if (onlineResource==onlineResources[j]) {
                    var bbox = cswRecords[i].geographicElements[0];
                    // ArcGIS servers do not accept styles
                    if (onlineResources[j].applicationProfile && onlineResources[j].applicationProfile.indexOf("Esri:ArcGIS Server") > -1) {
                        QuerierPanelService.registerLayer(map, onlineResource, bbox, "");
                    } else {
                        QuerierPanelService.registerLayer(map, onlineResource, bbox, style);
                    }
                    done = true;
                    break;
                }
            }
        }
        
        // Overrides Google Map API to register event handler
        mapLayer = overrideToRegisterFailureEvent(mapLayer, layer.id);

        // This adds the layer to Google Map
        map.overlayMapTypes.push(mapLayer);
        
        // This keeps track of our layers
        GoogleMapService.addLayerToActive(layer,mapLayer);       
       
    };
   
 
    /**
     * Method to decide how the wms should be rendered and add the wms to the map 
     * @method renderLayer
     * @param layer - The layer containing the wms to be rendered
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD. 
     * 
     */
    this.renderLayer = function(layer,param){   

        var me = this;
        if(!param){
            param = {};
        }
        var onlineResources = LayerManagerService.getWMS(layer);            
        RenderStatusService.setMaxValue(layer,UtilitiesService.uniqueCountOfResourceByUrl(onlineResources));
        for(var index in onlineResources){ 
            if(UtilitiesService.filterProviderSkip(param.optionalFilters, onlineResources[index].url)){
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.SKIPPED);
                continue;
            }
            RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
            GetWMSRelatedService.getWMSStyle(layer,onlineResources[index],param).then(function(response){
                try{
                    var useSldUrl = false;
                    if(response.style!=null && encodeURIComponent(response.style).length>maxSldLength){
                        useSldUrl = true;
                    }  
                    
                    if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){                                                                        
                        var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,param):null);                                                
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style);                    
                    }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                        var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,param):null); 
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style); 
                        
                    } 
                }catch(err){
                    RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.ERROR);
                }
            },function(error){
                RenderStatusService.updateCompleteStatus(layer,error.onlineResource,Constants.statusProgress.ERROR);
            });
        }
       
  
    };
    
    
    
    
    
    /**
     * Method to decide how the wms csw record should be rendered and add the wms to the map 
     * @method renderCSWRecord
     * @param layer - The layer containing the wms to be rendered
     * @param cswRecord - The cswRecord containing the wms to be rendered
     */
    this.renderCSWRecord = function(layer,cswRecord){         
        var me = this;
        
            var onlineResources = LayerManagerService.getWMSFromCSW(cswRecord);            
            RenderStatusService.setMaxValue(layer,UtilitiesService.uniqueCountOfResourceByUrl(onlineResources));
            for(var index in onlineResources){  
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                GetWMSRelatedService.getWMSStyle(layer,onlineResources[index]).then(function(response){
                    try{
                        var useSldUrl = false;
                        if(response.style!=null && response.style.length>maxSldLength){
                            useSldUrl = true;
                        } 
                        if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){
                            var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,null):null);                        
                            addLayerToGoogleMap(mapLayer,layer,response.onlineResource);                  
                        }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                            var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,null):null); 
                            addLayerToGoogleMap(mapLayer,layer,response.onlineResource);  
                        } 
                    }catch(err){
                        RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.ERROR);
                    }
                },function(error){
                    RenderStatusService.updateCompleteStatus(layer,error.onlineResource,Constants.statusProgress.ERROR);
                });
            }
        
  
    };
    
     
}]);