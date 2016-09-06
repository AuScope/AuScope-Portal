/**
 * Service class related to handling all things related to google map.
 * @module map
 * @class GoogleMapService
 * 
 */
allModules.service('GoogleMapService',['$rootScope',function ($rootScope) {
   
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
    
    this.getMapActiveLayer = function(){
        return this.activeLayers;
    };
    
    this.setMapActiveLayer = function(name,mapLayer){
        this.activeLayers[name] = mapLayer;
    };
    
    this.removeActiveLayer = function(name){
        
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