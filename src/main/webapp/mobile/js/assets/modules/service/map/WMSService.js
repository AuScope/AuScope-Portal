/**
 * WMSService handles rendering of all wms layers onto the map
 * @module map
 * @class WMSService
 * 
 */
allModules.service('WMSService',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService',
                                 function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService) {
    
  
    
    /**
     * Generate wms 1.1.1 google.maps.ImageMapType layer 
     * @method generateWMS_1_1_1_Layer
     * @param onlineResource - WMS online resource
     * @param style - sld if defined else default server sld will be used
     * @return ImageMapType - google.maps.ImageMapType
     */
    this.generateWMS_1_1_1_Layer = function(onlineResource,style){
        
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
               var url = myOnlineResource.url + "?";
               url += "&REQUEST=GetMap"; //WMS operation
               url += "&SERVICE=WMS";    //WMS service
               url += "&VERSION=1.1.1";  //WMS version  
               if(style){
                   url += "&SLD_BODY=" + encodeURIComponent(style);
               }
               url += "&STYLES=";  
               url += "&LAYERS=" + myOnlineResource.name; //WMS layers
               url += "&FORMAT=image/png" ; //WMS format
               url += "&BGCOLOR=0xFFFFFF";  
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
    
    /**
     * Generate wms 1.3 google.maps.ImageMapType layer 
     * @method generateWMS_1_3_0_Layer
     * @param onlineResource - WMS online resource
     * @param style - sld if defined else default server sld will be used
     * @return ImageMapType - google.maps.ImageMapType
     */
    this.generateWMS_1_3_0_Layer = function(onlineResource,style){
        
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
                var url = myOnlineResource.url + "?";;
                url += "&REQUEST=GetMap"; 
                url += "&SERVICE=WMS";    
                url += "&VERSION=1.3.0";
                if(style){
                    url += "&SLD_BODY=" + encodeURIComponent(style);
                }
                url += "&STYLES=";                
                url += "&LAYERS=" + myOnlineResource.name; 
                url += "&FORMAT=image/png" ; 
                url += "&BGCOLOR=0xFFFFFF";  
                url += "&TRANSPARENT=TRUE";
                url += "&CRS=CRS:84";     //might need to set to CRS:84 for 1.3.0
                url += "&BBOX=" + bbox;      
                url += "&WIDTH=256";        
                url += "&HEIGHT=256";
                return url;                 
      
            },
            tileSize: new google.maps.Size(256, 256),
            isPng: true
        });
         return imagelayer;
    };
 
    /**
     * Method to decide how the wms should be rendered and add the wms to the map 
     * @method renderLayer
     * @param layer - The layer containing the wms to be rendered
     */
    this.renderLayer = function(layer){   
        var map =  GoogleMapService.getMap();
        var me = this;
        
        var registerTileLoadedEvent = function(mapLayer, layerId,onlineResource,status){
            google.maps.event.addListener(mapLayer, 'tilesloaded', function(evt) {
                RenderStatusService.updateCompleteStatus(layerId,onlineResource,status);
              });
        };
        
        GetWMSRelatedService.getWMSStyle(layer).then(function(style){
            var onlineResources = LayerManagerService.getWMS(layer);            
            RenderStatusService.setMaxValue(layer.id,onlineResources.length);
            for(var index in onlineResources){  
                
                RenderStatusService.updateCompleteStatus(layer.id,onlineResources[index],Constants.statusProgress.RUNNING);
                
                if(onlineResources[index].version === Constants.WMSVersion['1.1.1'] || onlineResources[index].version === Constants.WMSVersion['1.1.0']){
                    var mapLayer = me.generateWMS_1_1_1_Layer(onlineResources[index],style);                        
                    registerTileLoadedEvent(mapLayer,layer.id,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer.id,mapLayer);                   
                }else if(onlineResources[index].version === Constants.WMSVersion['1.3.0']){
                    var mapLayer = me.generateWMS_1_3_0_Layer(onlineResources[index],style); 
                    registerTileLoadedEvent(layer.id,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer.id,mapLayer);
                    
                }        
            }
        });
  
    };
    
     
}]);