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
    this.generateLayer = function(onlineResource,sld,sldUrl) {
        
        var myOnlineResource =  onlineResource;       
        var map = GoogleMapService.getMap();
        var imagelayer = new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
             
                var proj = map.getProjection();
                var zfactor = Math.pow(2, zoom);
                
                // Get LatLng coordinates
                var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * Constants.TILE_SIZE / zfactor, coord.y * Constants.TILE_SIZE / zfactor));
                var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * Constants.TILE_SIZE / zfactor, (coord.y + 1) * Constants.TILE_SIZE / zfactor));

                // Correct negative longitudes
                var leftLng = top.lng() < 0?top.lng() + 360:top.lng();
                var rightLng = bot.lng() < 0?bot.lng() + 360:bot.lng();
               
                // Transform [lng, lat] to map projection coordinates [x, y]
                var bot3857=proj4("EPSG:4326", "EPSG:3857", [rightLng, bot.lat()]);
                var top3857=proj4("EPSG:4326", "EPSG:3857", [leftLng, top.lat()]);

                // TODO: Add SRS/CRS parameter "getWMSMapViaProxy.do" to allow use of EPSG:3857
                // BBOX in EPSG:4326
                var bbox_4326 = leftLng + "," + bot.lat() + "," + rightLng + "," + top.lat();
                
                // BBOX in EPSG:3857
                var bbox_3857 = top3857[0] + "," + bot3857[1] + "," + bot3857[0] + "," + top3857[1];

                //VT: if the sld is too long, we will proxy the request via the server using httpPost
                if (sldUrl) {
                    var url="../getWMSMapViaProxy.do?";                   
                    var parameter = {
                           url :  myOnlineResource.url + (myOnlineResource.url.indexOf("?")==-1?"?":""),
                           layer: myOnlineResource.name,
                           bbox:bbox_4326,
                           sldUrl : "/" + sldUrl,                         
                           version : "1.1.1",                      
                    };
                    return url+$.param(parameter);
                   
                   
                } else {
                    //base WMS URL
                    var url = myOnlineResource.url + (myOnlineResource.url.indexOf("?")==-1?"?":""); 
                    url += "&REQUEST=GetMap"; //WMS operation
                    url += "&SERVICE=WMS";    //WMS service
                    url += "&VERSION=1.1.1";  //WMS version  
                    if (sld){
                       url += "&SLD_BODY=" + encodeURIComponent(sld);
                    }
                    url += "&STYLES=";
                    url += "&DISPLAYOUTSIDEMAXEXTENT=true";  
                    url += "&EXCEPTIONS=BLANK";
                    url += "&LAYERS=" + myOnlineResource.name; //WMS layers
                    url += "&FORMAT=image/png" ; //WMS format
                    url += "&transparent=true" ; //WMS format                             
                    url += "&TRANSPARENT=TRUE";
                    url += "&SRS=EPSG:3857";
                    url += "&BBOX=" + bbox_3857;      // set bounding box
                    url += "&WIDTH=" + Constants.TILE_SIZE;         //tile size in google
                    url += "&HEIGHT=" + Constants.TILE_SIZE;                    
                    return url;                 // return URL for the tile 
                }
            },
            tileSize: new google.maps.Size(Constants.TILE_SIZE, Constants.TILE_SIZE),
            isPng: true
        });
        return imagelayer;
    };
    
   
     
}]);