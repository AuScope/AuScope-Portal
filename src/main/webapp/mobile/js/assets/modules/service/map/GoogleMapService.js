/**
 * Service class related to handling all things related to google map.
 * @module map
 * @class GoogleMapService
 * 
 */
allModules.service('GoogleMapService',['$rootScope','UtilitiesService','RenderStatusService',function ($rootScope,UtilitiesService,RenderStatusService) {
   
    this.mainMap;
    this.activeLayers = {};
    
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
    * @param layerId - the layerId to remove 
    */ 
    this.removeActiveLayer = function(layerId){
        if(this.activeLayers[layerId]){
            if(!UtilitiesService.isEmpty(this.activeLayers[layerId].markers)){
                for (var i = 0; i < this.activeLayers[layerId].markers.length; i++) {
                    this.activeLayers[layerId].markers[i].setMap(null);
                 };
            };
            
            if(!UtilitiesService.isEmpty(this.activeLayers[layerId].layers)){
                for (var i = 0; i < this.activeLayers[layerId].layers.length; i++) {
                    var layerIndex = this.mainMap.overlayMapTypes.indexOf(this.activeLayers[layerId].layers[i]);
                    this.mainMap.overlayMapTypes.removeAt(layerIndex);
                 };
                 this.activeLayers[layerId].layers=[];
            };
            RenderStatusService.clearStatus(layerId);
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
               position: google.maps.ControlPosition.TOP_RIGHT
           },
         });

      };
   
    
    
    
     
    
     
}]);