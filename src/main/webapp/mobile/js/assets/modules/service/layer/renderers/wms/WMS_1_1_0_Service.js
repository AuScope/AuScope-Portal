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
     * @param sld - sld if defined else default server sld will be used
     * @param sldUrl - url to the sld file if the sld is too long
     * @return ImageMapType - google.maps.ImageMapType
     */
    this.generateLayer = function(onlineResource,sld,sldUrl){
        
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
               var deltaX = 0; //0.0013;
               var deltaY = 0; //0.00058;

               var leftLng = top.lng() + deltaX;
               leftLng = leftLng < 0?leftLng + 360:leftLng;
               
               var rightLng = (bot.lng()+deltaX);
               rightLng = rightLng < 0?rightLng + 360:rightLng;
               
               
               var bbox =      leftLng + "," +
                               (bot.lat() + deltaY) + "," +
                               rightLng + "," +
                               (top.lat() + deltaY);
               //VT: if the sld is too long, we will proxy the request via the server using httpPost
               if(sldUrl){
                   var url="../getWMSMapViaProxy.do?";                   
                   var parameter = {
                           url :  myOnlineResource.url + (myOnlineResource.url.indexOf("?")==-1?"?":""),
                           layer: myOnlineResource.name,
                           bbox:bbox,
                           sldUrl : "/" + sldUrl,                         
                           version : "1.1.1",                      
                   };
                  
                   return url+=$.param(parameter);
                   
                   
               }else{
                   //base WMS URL
                   var url = myOnlineResource.url + (myOnlineResource.url.indexOf("?")==-1?"?":"");
                   url += "&REQUEST=GetMap"; //WMS operation
                   url += "&SERVICE=WMS";    //WMS service
                   url += "&VERSION=1.1.1";  //WMS version  
                   if(sld){
                       url += "&SLD_BODY=" + encodeURIComponent(sld);
                   }               
                   url += "&DISPLAYOUTSIDEMAXEXTENT=true";  
                   url += "&EXCEPTIONS=BLANK";
                   url += "&LAYERS=" + myOnlineResource.name; //WMS layers
                   url += "&FORMAT=image/png" ; //WMS format
                   url += "&transparent=true" ; //WMS format                             
                   url += "&TRANSPARENT=TRUE";
                   url += "&SRS=EPSG:4326";     //set WGS84 
                   url += "&BBOX=" + bbox;      // set bounding box
                   url += "&WIDTH=256";         //tile size in google
                   url += "&HEIGHT=256";               
                   return url;                 // return URL for the tile 
               }
              
     
           },           
           tileSize: new google.maps.Size(256, 256),
           isPng: true
       });
       
       
       
        return imagelayer;
    };
    
   
     
}]);