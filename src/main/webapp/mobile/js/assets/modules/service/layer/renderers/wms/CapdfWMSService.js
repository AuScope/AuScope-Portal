/**
 * CapdfWMSService handles rendering of all capdf layers onto the map. A custom wms renderer is require because capdf
 * gets it layer name from user input parameter and not based on the default csw selection
 * @module map
 * @class CapdfWMSService
 * 
 */
allModules.service('CapdfWMSService',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService','Constants',
                                 function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService,Constants) {
    
  
    
    /**
     * Generate wms 1.1.1 google.maps.ImageMapType layer 
     * @method generateWMS_1_1_1_Layer
     * @param onlineResource - WMS online resource
     * @param style - sld if defined else default server sld will be used
     * @return ImageMapType - google.maps.ImageMapType
     */
    this.generateWMS_1_1_1_Layer = function(layername,onlineResource,style){
        
        var myOnlineResource =  onlineResource;       
        var map = GoogleMapService.getMap();
        var imagelayer = new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
             
                var proj = map.getProjection();
                var zfactor = Math.pow(2, zoom);
                
                // Get LatLng coordinates
                var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * Constants.TILE_SIZE / zfactor, coord.y * Constants.TILE_SIZE / zfactor));
                var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * Constants.TILE_SIZE / zfactor, (coord.y + 1) * Constants.TILE_SIZE / zfactor));

                // Transform [lng, lat] to map projection coordinates [x, y]
                var bot3857=proj4("EPSG:4326", "EPSG:3857", [bot.lng(), bot.lat()]);
                var top3857=proj4("EPSG:4326", "EPSG:3857", [top.lng(), top.lat()]);
               
                // BBOX in EPSG:3857
                var bbox = top3857[0] + "," + bot3857[1] + "," + bot3857[0] + "," + top3857[1];

                //base WMS URL
                var url = myOnlineResource.url + "?";
                url += "&REQUEST=GetMap"; //WMS operation
                url += "&SERVICE=WMS";    //WMS service
                url += "&VERSION=1.1.1";  //WMS version  
                if(style){
                    url += "&SLD_BODY=" + encodeURIComponent(style);
                }
                url += "&STYLES=";  
                //VT: this is the only difference with the normal wms renderer
                url += "&LAYERS=" + layername; //WMS layers
                url += "&FORMAT=image/png" ; //WMS format
                url += "&BGCOLOR=0xFFFFFF";  
                url += "&TRANSPARENT=TRUE";
                url += "&SRS=EPSG:3857";     //set EPSG:3857 map projection coordinates 
                url += "&BBOX=" + bbox;      // set bounding box
                url += "&WIDTH=" + Constants.TILE_SIZE;         //tile size in google
                url += "&HEIGHT=" + Constants.TILE_SIZE;                
                return url;                 // return URL for the tile
     
            },           
            tileSize: new google.maps.Size(Constants.TILE_SIZE, Constants.TILE_SIZE),
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
    this.generateWMS_1_3_0_Layer = function(layername,onlineResource,style){
        
        var myOnlineResource =  onlineResource;
        
        var map = GoogleMapService.getMap();
        var imagelayer = new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
              
                var proj = map.getProjection();
                var zfactor = Math.pow(2, zoom);
                
                // Get LatLng coordinates
                var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * Constants.TILE_SIZE / zfactor, coord.y * Constants.TILE_SIZE / zfactor));
                var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * Constants.TILE_SIZE / zfactor, (coord.y + 1) * Constants.TILE_SIZE / zfactor));
                
                // Transform [lng, lat] to map projection coordinates [x, y]
                var bot3857=proj4("EPSG:4326", "EPSG:3857", [bot.lng(), bot.lat()]);
                var top3857=proj4("EPSG:4326", "EPSG:3857", [top.lng(), top.lat()]);

                // BBOX in EPSG:3857
                var bbox = bot3857[1] + "," + top3857[0] + "," + top3857[1] + "," + bot3857[0];
      
                //base WMS URL
                var url = myOnlineResource.url + "?";;
                url += "&REQUEST=GetMap"; 
                url += "&SERVICE=WMS";    
                url += "&VERSION=1.3.0";
                if(style){
                    url += "&SLD_BODY=" + encodeURIComponent(style);
                }
                url += "&STYLES=";    
                //VT: this is the only difference with the normal wms renderer
                url += "&LAYERS=" + layername; 
                url += "&FORMAT=image/png" ; 
                url += "&BGCOLOR=0xFFFFFF";  
                url += "&TRANSPARENT=TRUE";
                url += "&CRS=EPSG:3857";  //set EPSG:3857 map projection coordinates
                url += "&BBOX=" + bbox;      
                url += "&WIDTH=" + Constants.TILE_SIZE;        
                url += "&HEIGHT=" + Constants.TILE_SIZE;
                return url;                 
      
            },
            tileSize: new google.maps.Size(Constants.TILE_SIZE, Constants.TILE_SIZE),
            isPng: true
        });
         return imagelayer;
    };
 
    /**
     * Method to decide how the wms should be rendered and add the wms to the map 
     * @method renderLayer
     * @param layername - Written to cater for the possible different layername in capdf
     * @param layer - The layer containing the wms to be rendered
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.
     */
    this.renderLayer = function(layername,layer,param){   
        var map =  GoogleMapService.getMap();
        var me = this;
        var maxSldLength = 2000;
        
        //VT: on a small screen, broadcast a request to add a layer has been established so that 
        //VT:action like closing panels can be act on. 
        var mq = window.matchMedia(Constants.smallScreenTest);
        if(mq.matches){
            $rootScope.$broadcast('layer.add', layer);
        }
        
        var registerTileLoadedEvent = function(mapLayer, layer,onlineResource,status){
            google.maps.event.addListener(mapLayer, 'tilesloaded', function(evt) {
                RenderStatusService.updateCompleteStatus(layer,onlineResource,status);
              });
        };
        
        GetWMSRelatedService.getWMSStyle(layer,null,param).then(function(response){           
            var onlineResources = LayerManagerService.getWMS(layer);            
            RenderStatusService.setMaxValue(layer,onlineResources.length);
            for(var index in onlineResources){  
                
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                
                if(onlineResources[index].version === Constants.WMSVersion['1.1.1'] || onlineResources[index].version === Constants.WMSVersion['1.1.0']){
                    var mapLayer = me.generateWMS_1_1_1_Layer(layername,onlineResources[index],(response.style!=null && response.style.length<maxSldLength?response.style:null));                        
                    registerTileLoadedEvent(mapLayer,layer,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer,mapLayer);                   
                }else if(onlineResources[index].version === Constants.WMSVersion['1.3.0']){
                    var mapLayer = me.generateWMS_1_3_0_Layer(layername,onlineResources[index],(response.style!=null && response.style.length<maxSldLength?response.style:null)); 
                    registerTileLoadedEvent(mapLayer,layer,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer,mapLayer);
                    
                }        
            }
        });
  
    };
    
    
    /**
     * Method to decide how the wms csw record should be rendered and add the wms to the map 
     * @method renderCSWRecord
     * @param layer - The layer containing the wms to be rendered
     * @param cswRecord - The cswRecord containing the wms to be rendered
     */
    this.renderCSWRecord = function(layer,cswRecord){   
        var map =  GoogleMapService.getMap();
        var me = this;
        var maxSldLength = 2000;
        
        var registerTileLoadedEvent = function(mapLayer, layer,onlineResource,status){
            google.maps.event.addListener(mapLayer, 'tilesloaded', function(evt) {
                RenderStatusService.updateCompleteStatus(layer,onlineResource,status);
              });
        };
        
        GetWMSRelatedService.getWMSStyle(layer).then(function(style){
            var onlineResources = LayerManagerService.getWMSFromCSW(cswRecord);            
            RenderStatusService.setMaxValue(layer,onlineResources.length);
            for(var index in onlineResources){  
                
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                
                if(onlineResources[index].version === Constants.WMSVersion['1.1.1'] || onlineResources[index].version === Constants.WMSVersion['1.1.0']){
                    var mapLayer = me.generateWMS_1_1_1_Layer(onlineResources[index],(style!=null && style.length<maxSldLength?style:null));                        
                    registerTileLoadedEvent(mapLayer,layer,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer,mapLayer);                   
                }else if(onlineResources[index].version === Constants.WMSVersion['1.3.0']){
                    var mapLayer = me.generateWMS_1_3_0_Layer(onlineResources[index],(style!=null && style.length<maxSldLength?style:null)); 
                    registerTileLoadedEvent(mapLayer,layer,onlineResources[index],Constants.statusProgress.COMPLETED);
                    map.overlayMapTypes.push(mapLayer);
                    GoogleMapService.addLayerToActive(layer,mapLayer);
                    
                }        
            }
        });
  
    };
    
     
}]);