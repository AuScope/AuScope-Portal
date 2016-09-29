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
allModules.service('GoogleMapService',['$rootScope','UtilitiesService','RenderStatusService','$timeout','$filter',
                                       function ($rootScope,UtilitiesService,RenderStatusService,$timeout,$filter) {
   
    this.mainMap;
    this.activeLayers = {};
    this.heatmap = null;
    this.drawingManager = null;
    this.dataSelectDrawingManager = null;
    
    
    /**
     * Get an instance of the map
     * @Method getMap
     * @return map - an instance of the map. Make sure this is called after map has been initialized
     */
    this.getMap = function(){
        return this.mainMap;
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
     * Check if the layer is still active. This reuse RenderStatusService.isLayerActive. Alternatively you can check
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
    * Remove the layer if it is rendered on the map
    * @method removeActiveLayer
    * @param layer - the csw layer to remove from map 
    */ 
    this.removeActiveLayer = function(layer){
        if(this.activeLayers[layer.id]){
            if(!UtilitiesService.isEmpty(this.activeLayers[layer.id].markers)){
                for (var i = 0; i < this.activeLayers[layer.id].markers.length; i++) {
                    this.activeLayers[layer.id].markers[i].setMap(null);                    
                 };
                 this.activeLayers[layer.id].markers=[];
            };
            
            if(!UtilitiesService.isEmpty(this.activeLayers[layer.id].layers)){
                for (var i = 0; i < this.activeLayers[layer.id].layers.length; i++) {
                    var layerIndex = this.mainMap.overlayMapTypes.indexOf(this.activeLayers[layer.id].layers[i]);
                    this.mainMap.overlayMapTypes.removeAt(layerIndex);
                 };
                 this.activeLayers[layer.id].layers=[];
            };
            RenderStatusService.clearStatus(layer);
            this.broadcast('layer.removed',layer);
        };
    };
     
    /**
     * Initialize the map
     * @Method initMap
     * 
     */
     this.initMap = function() {
         var mq = window.matchMedia( "(max-width: 658px)" );
         this.mainMap = new google.maps.Map(document.getElementById('google-map-main'), {
           center: {lat: -28.397, lng: 132.644},
           zoom: (mq.matches? 3 : 5),
           mapTypeControlOptions: {
               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU ,
               position: google.maps.ControlPosition.TOP_LEFT
           },
         });
         
         this.mainMap.addListener('mousemove', function(evt) {
             $("#mouse-move-display-lat").text("Lat: " + $filter('number')(evt.latLng.lat(),2));
             $("#mouse-move-display-lng").text("Lng: " + $filter('number')(evt.latLng.lng(),2));
          });
         
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
                      position : google.maps.ControlPosition.TOP_CENTER,
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
      
      
      this.broadcast = function (event,result) {
          $rootScope.$broadcast(event,result);
      };
     
    
     
}]);