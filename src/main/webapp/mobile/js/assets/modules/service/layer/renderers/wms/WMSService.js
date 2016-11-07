/**
 * WMSService handles rendering of all wms layers onto the map
 * @module map
 * @class WMSService
 * 
 */
allModules.service('WMSService',['GoogleMapService','LayerManagerService','Constants','GetWMSRelatedService','RenderStatusService','QuerierPanelService','WMS_1_1_0_Service','WMS_1_3_0_Service','UtilitiesService','GMLParserService',
                                 function (GoogleMapService,LayerManagerService,Constants,GetWMSRelatedService,RenderStatusService,QuerierPanelService,WMS_1_1_0_Service,WMS_1_3_0_Service,UtilitiesService,GMLParserService) {
    
    var maxSldLength = 6000; //2000; 6000 worked on chrome
    
    var addLayerToGoogleMap = function(mapLayer,layer,onlineResource,style){
        
        var map =  GoogleMapService.getMap();
        
        var registerTileLoadedEvent = function(mapLayer, layer,onlineResource,status){
            google.maps.event.addListener(mapLayer, 'tilesloaded', function(evt) {
                RenderStatusService.updateCompleteStatus(layer,onlineResource,status);
              });
        };
        
        // Register map click/touch events to allow creation of the query information panel
        var registerClickEvent = function(map, onlineResource, bbox,style){
            var mapEventListener = google.maps.event.addListener(map, 'mousedown', function(evt) {
                // Send a request to the WMS service if the click is within the resource's bounding box
                if (evt.latLng.lat() < bbox.northBoundLatitude && evt.latLng.lat() > bbox.southBoundLatitude &&
                    evt.latLng.lng() < bbox.eastBoundLongitude && evt.latLng.lng() > bbox.westBoundLongitude) {
                        
                    // Send request to WMS service
                    GetWMSRelatedService.getWMSMarkerInfo(evt.latLng, evt.pixel, map, onlineResource,style).then(function(response) 
                        { 
                            // Used to check for an empty response, which occurs when user clicks/touches on empty space
                            var empty_html_body = /<body>\s*<\/body>/g;
                            var empty_html_body2 = /<body>\s*<script .+<\/script>\s*<\/body>/g;
                            var empty_gml_body = /<wfs:FeatureCollection .+\/>$/g;

                            // Open if panel if there was a valid response (NB: Only status code 200 will return a complete response)
                            if (response.status==200 && empty_gml_body.test(response.data)==false) {
                                QuerierPanelService.setPanelNode(GMLParserService.getRootNode(response.data));
                                QuerierPanelService.openPanel(false);
                            }
                        },
                        function(errorResponse) {
                            console.log("WMS Service Error: ", errorResponse);
                        }
                    );
                }
            });
            QuerierPanelService.registerLayer(onlineResource, mapEventListener);
        };
        
        /**
         * Hack to override the gettile to gain access to the underlying img for event handling
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
                    registerClickEvent(map, onlineResource, bbox,style);
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

            var onlineResources = LayerManagerService.getWMS(layer);            
            RenderStatusService.setMaxValue(layer,onlineResources.length);
            for(var index in onlineResources){ 
                if(UtilitiesService.filterProviderSkip(param.optionalFilters, onlineResources[index].url)){
                    RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.SKIPPED);
                    continue;
                }
                GetWMSRelatedService.getWMSStyle(layer,onlineResources[index],param).then(function(response){                    
                    RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.RUNNING);
                    if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){
                        var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,(response.style!=null && response.style.length<maxSldLength?response.style:null));                        
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style);                    
                    }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                        var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,(response.style!=null && response.style.length<maxSldLength?response.style:null)); 
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource,response.style); 
                        
                    } 
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
            RenderStatusService.setMaxValue(layer,onlineResources.length);
            for(var index in onlineResources){  
                GetWMSRelatedService.getWMSStyle(layer,onlineResources[index]).then(function(response){
                    
                    RenderStatusService.updateCompleteStatus(layer,response.onlineResource,Constants.statusProgress.RUNNING);
                    
                    if(response.onlineResource.version === Constants.WMSVersion['1.1.1'] || response.onlineResource.version === Constants.WMSVersion['1.1.0']){
                        var mapLayer = WMS_1_1_0_Service.generateLayer(response.onlineResource,(response.style!=null && response.style.length<maxSldLength?response.style:null));                        
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource);                  
                    }else if(response.onlineResource.version === Constants.WMSVersion['1.3.0']){
                        var mapLayer = WMS_1_3_0_Service.generateLayer(response.onlineResource,(response.style!=null && response.style.length<maxSldLength?response.style:null)); 
                        addLayerToGoogleMap(mapLayer,layer,response.onlineResource);  
                    } 
                });
            }
        
  
    };
    
     
}]);