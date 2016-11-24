/**
 * WMSService handles rendering of all wms layers onto the map
 * @module map
 * @class WMS_1_1_0_Service
 * 
 */
allModules.service('WMS_1_1_0_Service',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService',
                                 function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService) {
    
  
    
    
    /**
     * Generate wms 1.1.1 google.maps.ImageMapType layer 
     * @method generateLayer
     * @param onlineResource - WMS online resource
     * @param style - sld if defined else default server sld will be used
     * @return ImageMapType - google.maps.ImageMapType
     */
    this.generateLayer = function(onlineResource,style){
        
       var myOnlineResource =  onlineResource;       
       var map = GoogleMapService.getMap();
       var imagelayer = new google.maps.ImageMapType({
           getTileUrl: function (coord, zoom) {
             
               var proj = map.getProjection();
               var zfactor = Math.pow(2, zoom);
               // get Long Lat coordinates
               var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
               var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

               //corrections for the slight shift of the SLP (mapserver)
               var deltaX = 0;//0.0013;
               var deltaY = 0;//0.00058;

               
               var bbox =      (top.lng() + deltaX) + "," +
                               (bot.lat() + deltaY) + "," +
                               (bot.lng() + deltaX) + "," +
                               (top.lat() + deltaY);
     
               //base WMS URL
               var url = myOnlineResource.url + (myOnlineResource.url.indexOf("?")==-1?"?":"");
               url += "&REQUEST=GetMap"; //WMS operation
               url += "&SERVICE=WMS";    //WMS service
               url += "&VERSION=1.1.1";  //WMS version  
               if(style){
                   url += "&SLD_BODY=" + encodeURIComponent(style);
               }
               url += "&TILED=TRUE";
               url += "&DISPLAYOUTSIDEMAXEXTENT=true";  
               url += "&EXCEPTIONS=BLANK";
               url += "&LAYERS=" + myOnlineResource.name; //WMS layers
               url += "&FORMAT=image/png" ; //WMS format
               url += "&transparent=true" ; //WMS format               
               //url += "&BGCOLOR=0xFF00FF";  
               url += "&TRANSPARENT=TRUE";
               url += "&SRS=EPSG:4326";     //set WGS84 
               url += "&BBOX=" + bbox;      // set bounding box
               url += "&WIDTH=256";         //tile size in google
               url += "&HEIGHT=256";               
               return url;                 // return URL for the tile
     
           },           
           tileSize: new google.maps.Size(256, 256),
           isPng: true
       });
       
       
       
        return imagelayer;
    };
    
   
     
}]);