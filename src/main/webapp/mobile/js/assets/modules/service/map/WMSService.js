allModules.service('WMSService',['$rootScope','googleMapService','layerManagerService','Constants','GetWMSRelatedService',function ($rootScope,googleMapService,layerManagerService,Constants,GetWMSRelatedService) {
   
    
    
    this.generateWMS_1_1_1_Layer = function(onlineResource,style){
        
       var myOnlineResource =  onlineResource;
       
       var map = googleMapService.getMap();
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
    
    this.generateWMS_1_3_0_Layer = function(onlineResource,style){
        
        var myOnlineResource =  onlineResource;
        
        var map = googleMapService.getMap();
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
 
    this.renderLayer = function(layer){   
        var map =  googleMapService.getMap();
        var me = this;
        GetWMSRelatedService.getWMSStyle(layer).then(function(style){
            var onlineResources = layerManagerService.getWMS(layer);
            for(var index in onlineResources){
                if(onlineResources[index].version === Constants.WMSVersion['1.1.1'] || onlineResources[index].version === Constants.WMSVersion['1.1.0']){
                    map.overlayMapTypes.push(me.generateWMS_1_1_1_Layer(onlineResources[index],style));
                }else if(onlineResources[index].version === Constants.WMSVersion['1.3.0']){
                    map.overlayMapTypes.push(me.generateWMS_1_3_0_Layer(onlineResources[index],style));
                }        
            }
        });
  
    };
    
     
}]);