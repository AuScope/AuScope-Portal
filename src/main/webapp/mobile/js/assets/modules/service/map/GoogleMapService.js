/**
 * Service class related to handling all things related to google map.
 * @module map
 * @class GoogleMapService
 * 
 */
allModules.service('GoogleMapService',['$rootScope','UtilitiesService','RenderStatusService',function ($rootScope,UtilitiesService,RenderStatusService) {
   
    this.mainMap;
    this.activeLayers = {};
    this.heatmap = null;
    /**
     * Get an instance of the map
     * @Method getMap
     * @return map - an instance of the map. Make sure this is called after map has been initialized
     */
    this.getMap = function(){
        return this.mainMap;
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
     * @param layerId - layerId
     * @param mapLayer - the map layer to add 
     */
    this.addLayerToActive = function(layerId,mapLayer){
        if(!this.activeLayers[layerId]){
            this.activeLayers[layerId]={};
            this.activeLayers[layerId].layers = [];
        }
        this.activeLayers[layerId].layers.push(mapLayer);
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

      };
   
    
    
    
     
    
     
}]);