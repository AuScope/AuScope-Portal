allModules.service('WMSService',['$q','googleMapService',function ($q,googleMapService) {
   
    
    
    this.generateWMS_1_1_1_Layer = function(cswRecords){
        
       var map = googleMapService.getMap();
       var layer = new google.maps.ImageMapType({
           getTileUrl: function (coord, zoom) {
               var proj = map.getProjection();
               var zfactor = Math.pow(2, zoom);
               // get Long Lat coordinates
               var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
               var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
     
               //corrections for the slight shift of the SLP (mapserver)
               var deltaX = 0.0013;
               var deltaY = 0.00058;
     
               //create the Bounding box string
               var bbox =     (top.lng() + deltaX) + "," +
                              (bot.lat() + deltaY) + "," +
                              (bot.lng() + deltaX) + "," +
                              (top.lat() + deltaY);
     
               //base WMS URL
               var url = "http://mapserver-slp.mendelu.cz/cgi-bin/mapserv?map=/var/local/slp/krtinyWMS.map&";
               url += "&REQUEST=GetMap"; //WMS operation
               url += "&SERVICE=WMS";    //WMS service
               url += "&VERSION=1.1.1";  //WMS version  
               url += "&LAYERS=" + "typologie,hm2003"; //WMS layers
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
        return layer;
    };
    
    this.generateWMS_1_3_0_Layer = function(cswRecords){
        
       //VT: TODO;
    };
 
    this.renderLayer = function(layer){   
        var map =  googleMapService.getMap();
        map.overlayMapTypes.push(this.generateWMS_1_1_1_Layer());               
    };
    
     
}]);