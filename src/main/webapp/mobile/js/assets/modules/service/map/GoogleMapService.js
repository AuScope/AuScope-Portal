/**
 * Service class related to handling all things related to google map.
 * @module map
 * @class GoogleMapService
 * @event draw.zoom.start - start of the drawing for the zoom event
 * @event draw.zoom.end - end of the drawing for the zoom event
 * @event data.select.start - start of the drawing for the data selection event
 * @event data.select.end - end of the drawing for the data selection event
 * @event layer.removed - removing of a layer from map event
 */
allModules.service('GoogleMapService',['$rootScope','UtilitiesService','RenderStatusService','$timeout','$filter','Constants','FilterStateService',
                                       function ($rootScope,UtilitiesService,RenderStatusService,$timeout,$filter,Constants,FilterStateService) {
   
    this.mainMap = null;
    this.init_cb = [];
    this.activeLayers = {};
    this.layerOrder = {};
    this.useLayerReordering = true;
    this.heatmap = null;
    this.drawingManager = null;
    this.dataSelectDrawingManager = null;
    this.onBusyStartFn = null;
    this.onBusyEndFn = null;
    this.isBusy = false;
    this.controlUI = null;
    
    var me = this;
    
    /**
     * Get an instance of the map
     * @method getMap
     * @return map - an instance of the map. Make sure this is called after map has been initialized
     */
    this.getMap = function() {
        return this.mainMap;
    };
    
    /**
     * Register a function to call once the Google Map has been initialised
     * If the map has already been initialised, then the function is called 
     * immediately
     * @method getMapWhenReady
     * @param cb_fn callback function to be called
     */
    this.getMapWhenReady = function(cb_fn) {
        if (!this.mainMap) {
            this.init_cb.push(cb_fn);
            return;
        }
        cb_fn(this.mainMap);
    };
    
    /**
     * Return the current bounds of the map
     * @Method getCurrentViewPort
     * @return Bounds - the bounds of the view port.
     */
    this.getCurrentViewPort = function(){
        return this.mainMap.getBounds();
    };
    
    /**
     * Holds a array reference to the active markers on the map referenced by the layerId
     * @method addMarkerToActive
     * @param layerId - layerId
     * @param marker - the marker to add 
     */
    this.addMarkerToActive = function(layerId, marker){
        //VT: if not initialized, init the object.
        if(!this.activeLayers[layerId]){
            this.activeLayers[layerId]={};
            this.activeLayers[layerId].markers = [];
        }
        this.activeLayers[layerId].markers.push(marker);
    };
    
    /**
     * Check if the layer is still active. This reuses RenderStatusService.isLayerActive. Alternatively you can check
     * this.activeLayers[layerId]
     * @method isLayerActive
     * @param layer - layer
     */
    this.isLayerActive = function(layer){
       return RenderStatusService.isLayerActive(layer);
    };
    
    /**
     * Overlay a heat map to the data set
     * @method addHeatMapOverlay
     */
    this.addHeatMapOverlay = function(){
        var heatmapData = [];        
        for(var i in this.activeLayers){
            for(var j in this.activeLayers[i].markers){
                heatmapData.push(new google.maps.LatLng(this.activeLayers[i].markers[j].position.lat(),this.activeLayers[i].markers[j].position.lng()));
            }
        }
        if(!UtilitiesService.isEmpty(heatmapData)){
            this.heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData
            });
            this.heatmap.set('radius', 20);
            this.heatmap.setMap(this.mainMap);
            return true;
        }
        return false;
    };
    
    /**
     * remove the heatmap overlay
     * @method removeHeatMapOverlay
     */
    this.removeHeatMapOverlay = function(){  
        
        this.heatmap.setMap(null);        
        this.heatmap=null;
    };
    
    
    
    /**
     * Holds a array reference to the active layers on the map referenced by the layerId
     * @method addLayerToActive
     * @param layer - layer
     * @param mapLayer - the map layer to add 
     */
    this.addLayerToActive = function(layer,mapLayer){
        var layerId = layer.id;
        if(!this.activeLayers[layerId]){
            this.activeLayers[layerId]={};
            this.activeLayers[layerId].layers = [];
        }
        this.activeLayers[layerId].layers.push(mapLayer);
        this.broadcast('layer.added',layer);
        
        // Update the overlay map data structures
        this.syncOverlayMapDS();
    };
   
    /**
     * Synchronises data structures used to keep track of Google 'overlayMapType' layers
     * @method syncOverlayMapDS
     * @return true if could synchronise
     */
    this.syncOverlayMapDS = function() {

        // Loop over all layers
        for (var layerId in this.activeLayers) {
            
            // Select map layers only - not markers
            if (this.activeLayers[layerId].hasOwnProperty('layers')) {
                this.activeLayers[layerId].overlayMapIdx = [];
                for (var activeIdx=0; activeIdx<this.activeLayers[layerId].layers.length; activeIdx++) {

                    // Update the overlay map index
                    var overlayMap = this.activeLayers[layerId].layers[activeIdx];
                    var overlayMapIdx=this.findOverlayMap(overlayMap);
                    if (overlayMapIdx>=0) {
                        this.activeLayers[layerId].overlayMapIdx.push(overlayMapIdx);
                    } else {
                        console.error("Cannot find overlay map");
                        return false;
                    }
                }
            }
        }
        
        // Update the layer ordering
        this.layerOrder = {};
        var orderIdx = 0;
        var overlayArr = me.mainMap.overlayMapTypes.getArray();
        for (var i=0; i<overlayArr.length; i++) {
            var layerId=this.findLayerId(overlayArr[i]);
            if (layerId!="" && !this.layerOrder.hasOwnProperty(layerId)) {
                this.layerOrder[layerId] = orderIdx;
                orderIdx += 1;
            }
        }
        return true;
    }
    
    
    /**
     * Searches for an 'overlayMap' within the current main map
     * @method findOverlayMap
     * @param overlayMap Google 'overlayMap' to search for
     * @return index to map, or -1 if not found
     */
    this.findOverlayMap = function(overlayMap) {
        var overlayArr = me.mainMap.overlayMapTypes.getArray();
        for (var i=0; i<overlayArr.length; i++) {
            if (overlayArr[i]===overlayMap) {
                return i;
            }
        }
        return -1;
    };
    
    /**
     * Searches for a Google 'overlayMap' within the active layers returning its layer id
     * @method findLayerId
     * @param activeMap Google 'overlayMap' to search for
     * @returns layer id, string or "" if could not be found
     */
    this.findLayerId = function(activeMap) {
        for (var layerId in this.activeLayers) {
            if (this.activeLayers[layerId].hasOwnProperty('layers')) {
                for (var i=0; i<this.activeLayers[layerId].layers.length; i++) {
                    if (this.activeLayers[layerId].layers[i] === activeMap) return layerId;
                }
            }
        }
        return "";
    };
    
    /**
     * Return the list of active layers
     * @method getMapActiveLayer
     * @return activeLayers - the list of active layers
     */
    this.getMapActiveLayer = function(){
        return this.activeLayers;
    };
    
    /**
     * Given a layer and an opacity, set the opacity of the layer
     * @method setLayerOpacity
     * @param layer - the layer whose opacity will be set
     * @param opacity - opacity value 
     */ 
    this.setLayerOpacity = function(layer, opacity) {
        if (this.activeLayers[layer.id]) {
            if (this.activeLayers[layer.id].hasOwnProperty('layers')) {
                for (var i = 0; i < this.activeLayers[layer.id].layers.length; i++) {
                    this.activeLayers[layer.id].layers[i].setOpacity(opacity);
                }
            }
        }
    };
    
   
   /**
    * Remove the layer if it is rendered on the map
    * @method removeActiveLayer
    * @param layer - the csw layer to remove from map 
    */ 
    this.removeActiveLayer = function(layer){
        if (this.activeLayers[layer.id]) {
            if (this.activeLayers[layer.id].hasOwnProperty('markers')) {
                for (var i = 0; i < this.activeLayers[layer.id].markers.length; i++) {
                    this.activeLayers[layer.id].markers[i].setMap(null);                    
                };
                this.activeLayers[layer.id].markers=[];
            };
            
            if (this.activeLayers[layer.id].hasOwnProperty('layers')) {
                for (var i = 0; i < this.activeLayers[layer.id].layers.length; i++) {
                    var layerIndex = this.mainMap.overlayMapTypes.indexOf(this.activeLayers[layer.id].layers[i]);
                    this.mainMap.overlayMapTypes.removeAt(layerIndex);
                };
                this.activeLayers[layer.id].layers=[];
            };
            
            // Remove indexes from overlayMap
            if (this.activeLayers[layer.id].hasOwnProperty('overlayMapIdx')) {
                this.activeLayers[layer.id].overlayMapIdx=[];
            };
           
            this.broadcast('layer.removed',layer);
        };

        RenderStatusService.clearStatus(layer);
        
        // Update the overlay map data structures
        this.syncOverlayMapDS();
        
        // Remove this filter from registry
        FilterStateService.deregisterFilterSettings(layer.id);
    };
     
    /**
     * Initialize the map
     * @method initMap
     * @param mapDivId HTML id attribute of the <div> element where the map will be placed 
     * 
     */
    this.initMap = function(mapDivId) {
        var mq = window.matchMedia(Constants.smallScreenTest);
        this.mainMap = new google.maps.Map(document.getElementById(mapDivId), {
            center: {lat: -28.397, lng: 132.644},
            minZoom:(mq.matches? 3 : 4),
            zoom: (mq.matches? 3 : 5),
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU ,
                // Move the control to the top right corner for small screens so it won't obscure Victoria & Tasmania
                position: (mq.matches? google.maps.ControlPosition.TOP_RIGHT : google.maps.ControlPosition.RIGHT_BOTTOM)
            },
        });
        
        // Call any functions that have been waiting for this to initialise
        if (this.init_cb.length>0) {
            for (i=0; i<this.init_cb.length; i++) {
                this.init_cb[i](this.mainMap);
            }
        }
        
        this.mainMap.addListener('mousemove', function(evt) {
            $("#mouse-move-display-lat").text("Lat: " + $filter('number')(evt.latLng.lat(),2));
            $("#mouse-move-display-lng").text("Lng: " + $filter('number')(evt.latLng.lng(),2));
        });
        
    };
    
    /**
     * Fetches the state of the map in the form of a JSON string
     * @method getMapState
     * @return JSON string of map state
     */
    this.getMapState = function() {
        var retVal = { t: this.mainMap.getCenter().lat(), g: this.mainMap.getCenter().lng(), z: this.mainMap.getZoom() };
        return retVal;  
    };
    
    /**
     * Sets the state of the map according to a JSON string
     * @method setMapState
     * @param state JSON object of map state
     */
    this.setMapState = function(state) {
        if (state.hasOwnProperty('t') && state.hasOwnProperty('g')) {
            this.mainMap.setCenter({lat: state.t, lng: state.g});
        }
        if (state.hasOwnProperty('z')) {
            this.mainMap.setZoom(state.z);
        }
    };
      
    /**
     * Enable the drawing of rectangle and zooming to the area drawn
     * @method zoomDraw
     */
    this.zoomDraw = function(){
        this.broadcast('draw.zoom.start');
        if(!this.drawingManager){
            this.drawingManager = new google.maps.drawing.DrawingManager();
            this.drawingManager.setOptions({
                drawingMode : google.maps.drawing.OverlayType.RECTANGLE,
                drawingControl : true,
                drawingControlOptions : {
                    position : google.maps.ControlPosition.TOP_CENTER,
                    drawingModes : [ google.maps.drawing.OverlayType.RECTANGLE ]
                },
                rectangleOptions : {
                    strokeColor : '#6c6c6c',
                    strokeWeight : 3.5,
                    fillColor : '#926239',
                    fillOpacity : 0.6,
                    editable: false,
                    draggable: false
                }   
            });
        }          
         
        var me = this;
        var afterZoomHandler = google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', function(rect) {
            me.mainMap.fitBounds(rect.bounds);
            me.broadcast('draw.zoom.end');
            google.maps.event.removeListener(afterZoomHandler);                
            $timeout(function() {
                rect.setMap(null);
            }, 1500);
            me.drawingManager.setMap(null);
        });
          
        // Loading the drawing Tool in the Map.
        this.drawingManager.setMap(this.mainMap);
    };
                 
      
    /**
     * event for cancellation of the drawing of rectangle and zooming to the area drawn
     * @method zoomDrawCancel
     */
    this.zoomDrawCancel = function(){
        this.broadcast('draw.zoom.end');
        if (this.drawingManager)        
            this.drawingManager.setMap(null);
    };
   
    
    
    /**
     * event to capture the start of the draw zoom event
     * @method onDrawZoomStart
     * @param $scope of the caller
     * @param callback - callback function
     */            
    this.onDrawZoomStart = function ($scope, callback) {
        $scope.$on('draw.zoom.start', function (evt) {
            callback(evt);
        });
    };
      
    /**
     * event to capture the end of the draw zoom event
     * @method onDrawZoomEnd
     * @param $scope of the caller
     * @param callback - callback function
     */  
    this.onDrawZoomEnd = function ($scope, callback) {
        $scope.$on('draw.zoom.end', function (evt) {
            callback(evt);
        });
    };
      
      
    /**
     * Enable the drawing of bounding box for selecting data
     * @method selectMapData
     */
    this.selectMapData = function(){
        this.broadcast('data.select.start');
        if(!this.dataSelectDrawingManager){
            this.dataSelectDrawingManager = new google.maps.drawing.DrawingManager();
            this.dataSelectDrawingManager.setOptions({
                drawingMode : google.maps.drawing.OverlayType.RECTANGLE,
                drawingControl : true,
                drawingControlOptions : {
                    position : google.maps.ControlPosition.RIGHT_BOTTOM,
                    drawingModes : [ google.maps.drawing.OverlayType.RECTANGLE ]
                },
                rectangleOptions : {
                    strokeColor : '#00cc00',
                    strokeWeight : 3.5,
                    fillColor : '#b3ffb3',
                    fillOpacity : 0.6,
                    editable: false,
                    draggable: false
                }   
            });
        }          
         
        var me = this;
        var afterSelectionHandler = google.maps.event.addListener(this.dataSelectDrawingManager, 'rectanglecomplete', function(rect) {              
            me.broadcast('data.select.end',rect.bounds);
            google.maps.event.removeListener(afterSelectionHandler);                
            $timeout(function() {
                rect.setMap(null);
            }, 200);
            me.dataSelectDrawingManager.setMap(null);
        });
          
        // Loading the drawing Tool in the Map.
        this.dataSelectDrawingManager.setMap(this.mainMap);
    };
      
    /**
     * cancel the drawing of rectangle and data selection
     * @method selectDataDrawCancel
     */
    this.selectDataDrawCancel = function(){
        this.broadcast('data.select.end');              
        this.drawingManager.setMap(null);
    };
   
    
    
    /**
     * event to capture the start of the data selection event
     * @method onSelectDataStart
     * @param $scope of the caller
     * @param callback - callback function
     */            
    this.onSelectDataStart = function ($scope, callback) {
        $scope.$on('data.select.start', function (evt) {
            callback(evt);
        });
    };
      
    /**
     * event to capture the end of the data selection event
     * @method onSelectDataEnd
     * @param $scope of the caller
     * @param callback - callback function
     */  
    this.onSelectDataEnd = function ($scope, callback) {
        $scope.$on('data.select.end', function (evt,bound) {
            callback(evt,bound);
        });
    };
      
      
    /**
     * event to capture the removal of a layer
     * @method onLayerRemoved
     * @param $scope of the caller
     * @param callback - callback function
     */  
    this.onLayerRemoved = function($scope,callback){
        return $scope.$on('layer.removed',function(evt,layer){
            callback(evt,layer);
        }); 
    };
      
    /**
     * event to capture the adding of a layer
     * @method onLayerAdded
     * @param $scope of the caller
     * @param callback - callback function
     */ 
    this.onLayerAdded = function($scope,callback){
        return $scope.$on('layer.added',function(evt,layer){
            callback(evt,layer);
        }); 
    };
      
    /**
     * Broadcasts an event to all listeners via $rootScope
     * @method broadcast
     * @param event name of event (string)
     * @param result arguments to be passed
     */
    this.broadcast = function (event,result) {
        $rootScope.$broadcast(event,result);
    };
     
    /**
     * Register a callback function belonging to the map controller that this service will call when told a busy period has started
     * @method onBusyStart
     * @param callback - callback function
     */
    this.onBusyStart = function(callback) {
        this.onBusyStartFn  = callback;
    };
      
    /**
     * Register a callback function belonging to the map controller that this service will call when told that the busy period is over
     * @method onBusyEnd
     * @param callback - callback function
     */
    this.onBusyEnd = function(callback) {
        this.onBusyEndFn = callback;
    };
      
    /**
     * Function to set the map to busy, i.e. show a loading image
     * @method busyStart
     */
    this.busyStart = function() {
        if (!this.isBusy && this.onBusyStartFn) {
            this.onBusyStartFn();
            this.isBusy = true;
        }
    };
      
    /**
     * Function to stop the map being busy, i.e. stop showing a loading image
     * @method busyEnd
     */
    this.busyEnd = function() {
        if (this.isBusy && this.onBusyEndFn) {
            this.onBusyEndFn();
            this.isBusy = false;
        }
    };

    
    /**
     * Moves layer to the front of the map layers
     * @method moveLayerToFront
     * @param layer layer object
     */
    this.moveLayerToFront = function(layer) {
        var layerId = layer.id;
        if (this.activeLayers.hasOwnProperty(layerId)) {
            for (var idx=0; idx<this.activeLayers[layerId].overlayMapIdx.length; idx++) {
                var overlayMapIdx = this.activeLayers[layerId].overlayMapIdx[idx];
                if (overlayMapIdx>=0) {
                    // Shuffle, then update datastructures
                    var overlay0=this.mainMap.overlayMapTypes.removeAt(overlayMapIdx);
                    this.mainMap.overlayMapTypes.push(overlay0);
                    this.syncOverlayMapDS();
                } else {
                    console.error("overlayMapIdx out of range");
                }
            }
        }
    };
    
    
    /**
     * Returns true if a layer is at the front of the map layers
     * @method isLayerAtFront
     * @param layer layer object
     * @return true if the layer is at the front, or not an active layer
     */
    this.isLayerAtFront = function(layer) {
        var targetlayerId = layer.id;
        if (this.layerOrder.hasOwnProperty(targetlayerId)) {
            var targetOrder = this.layerOrder[targetlayerId];
            for (layerId in this.layerOrder) {
                if (this.layerOrder[layerId] > targetOrder) return false;
            }
        }
        return true;
    };
     
}]);