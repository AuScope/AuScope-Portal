/**
 * Service class related to handling all things related to google map.
 * @module map
 * @class GoogleMapService
 * 
 */
allModules.service('GoogleMapService',['$rootScope','UtilitiesService',function ($rootScope,UtilitiesService) {
   
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
    
    
    this.addMarkerToActive = function(layerId, marker){
        //VT: if not initialized, init the object.
        if(!this.activeLayers[layerId]){
            this.activeLayers[layerId]={};
            this.activeLayers[layerId].markers = [];
        }
        this.activeLayers[layerId].markers.push(marker);
    };
    
    this.addLayerToActive = function(layerId,mapLayer){
        if(!this.activeLayers[layerId]){
            this.activeLayers[layerId]={};
            this.activeLayers[layerId].layers = [];
        }
        this.activeLayers[layerId].layers.push(mapLayer);
    };
    
    this.getMapActiveLayer = function(){
        return this.activeLayers;
    };
    
   
    
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