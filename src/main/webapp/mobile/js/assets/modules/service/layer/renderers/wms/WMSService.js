/**
 * WMSService handles rendering of all wms layers onto the map
 * @module map
 * @class WMSService
 * 
 */
allModules.service('WMSService',['GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService','QuerierPanelService','WMS_1_1_0_Service','WMS_1_3_0_Service','UtilitiesService',
                                 function (GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService,QuerierPanelService,WMS_1_1_0_Service,WMS_1_3_0_Service,UtilitiesService) {
    
    var maxSldLength = 1900; 
    
    var addLayerToGoogleMap = function(mapLayer,layer,onlineResource,style){
        
        var map =  GoogleMapService.getMap();
        
        var registerTileLoadedEvent = function(mapLayer, layer,onlineResource,status){
            google.maps.event.addListener(mapLayer, 'tilesloaded', function(evt) {
                RenderStatusService.updateCompleteStatus(layer,onlineResource,status);
              });
        };
        
        /**
         * Hack to override the getTile function to gain access to the underlying img for event handling
         */
        var overrideToRegisterFailureEvent = function(mapLayer,failureHandlerCB){
            
            mapLayer.imagelayerGetTile = mapLayer.getTile;

            mapLayer.getTile = function(tileCoord, zoom, ownerDocument){           
                var node = mapLayer.imagelayerGetTile(tileCoord, zoom, ownerDocument);
                
                node.innerHTML = '<img src="'+mapLayer.j(tileCoord,zoom)+'"/>';
                $("img", node).one("error", function() {               
                    node.innerHTML = "";
                    failureHandlerCB();
                });
                        
                return node;
            };
            return mapLayer;
        };
        
        registerTileLoadedEvent(mapLayer,layer,onlineResource,Constants.statusProgress.COMPLETED);
        
        // Get the bounding box for the 'onlineResource', then register for click events within that bounding box
        var cswRecords = LayerManagerService.getCSWRecords(layer);
        var done = false;
        for (var i=0; i<cswRecords.length && !done; i++) {
            var onlineResources = cswRecords[i].onlineResources;
            for (var j=0; j<onlineResources.length; j++) {
                if (onlineResource==onlineResources[j]) {
                    var bbox = cswRecords[i].geographicElements[0];
                    // ArcGIS servers do not accept styles
                    if (onlineResources[j].applicationProfile && onlineResources[j].applicationProfile.indexOf("Esri:ArcGIS Server") > -1) {
                        QuerierPanelService.registerLayer(map, onlineResource, bbox, "");
                    } else {
                        QuerierPanelService.registerLayer(map, onlineResource, bbox, style);
                    }
                    done = true;
                    break;
                }
            }
        }
        
        mapLayer = overrideToRegisterFailureEvent(mapLayer,function(){
            RenderStatusService.updateCompleteStatus(layer,onlineResource,Constants.statusProgress.ERROR);
        });
        map.overlayMapTypes.push(mapLayer);
        GoogleMapService.addLayerToActive(layer,mapLayer);       
       
    };
   
 
    /**
     * Method to decide how the wms should be rendered and add the wms to the map 
     * @method renderLayer
     * @param layer - The layer containing the wms to be rendered
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD. 
     * 
     */
    this.renderLayer = function(layer,param){   

        var me = this;
        if(!param){
            param = {};
        }
        var onlineResources = LayerManagerService.getWMS(layer);            
        RenderStatusService.setMaxValue(layer,UtilitiesService.uniqueCountOfResourceByUrl(onlineResources));
        for(var index in onlineResources){ 
            if(UtilitiesService.filterProviderSkip(param.optionalFilters, onlineResources[index].url)){
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.SKIPPED);
                continue;
            }
            RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
            GetWMSRelatedService.getWMSStyle(layer,onlineResources[index],param).then(function(response){
                try{
                    var useSldUrl = false;
                    if(response.style!=null && encodeURIComponent(response.style).length>maxSldLength){
                        useSldUrl = true;
                    }  
                    
                    if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){                                                                        
                        var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,param):null);                                                
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style);                    
                    }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                        var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,param):null); 
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style); 
                        
                    } 
                }catch(err){
                    RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.ERROR);
                }
            },function(error){
                RenderStatusService.updateCompleteStatus(layer,error.onlineResource,Constants.statusProgress.ERROR);
            });
        }
       
  
    };
    
    
    
    
    
    /**
     * Method to decide how the wms csw record should be rendered and add the wms to the map 
     * @method renderCSWRecord
     * @param layer - The layer containing the wms to be rendered
     * @param cswRecord - The cswRecord containing the wms to be rendered
     */
    this.renderCSWRecord = function(layer,cswRecord){         
        var me = this;
        
            var onlineResources = LayerManagerService.getWMSFromCSW(cswRecord);            
            RenderStatusService.setMaxValue(layer,UtilitiesService.uniqueCountOfResourceByUrl(onlineResources));
            for(var index in onlineResources){  
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                GetWMSRelatedService.getWMSStyle(layer,onlineResources[index]).then(function(response){
                    try{
                        var useSldUrl = false;
                        if(response.style!=null && response.style.length>maxSldLength){
                            useSldUrl = true;
                        } 
                        if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){
                            var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,null):null);                        
                            addLayerToGoogleMap(mapLayer,layer,response.onlineResource);                  
                        }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                            var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,response.style,useSldUrl?GetWMSRelatedService.getWMSStyleUrl(layer,response.onlineResource,null):null); 
                            addLayerToGoogleMap(mapLayer,layer,response.onlineResource);  
                        } 
                    }catch(err){
                        RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.ERROR);
                    }
                },function(error){
                    RenderStatusService.updateCompleteStatus(layer,error.onlineResource,Constants.statusProgress.ERROR);
                });
            }
        
  
    };
    
     
}]);