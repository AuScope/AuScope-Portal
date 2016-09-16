/**
 * WFSService handles rendering of all wfs layers onto the map
 * @module map
 * @class WFSService
 * 
 */
allModules.service('WFSService',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWFSRelatedService','GMLParserService','RenderStatusService',
                                 function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWFSRelatedService,GMLParserService,RenderStatusService) {
   
      /**
        * Render a point data to the map 
        * @method renderPoint
        * @param point - the point to render
        * @param map - The map where the point is to be rendered
        */  
       this.renderPoint = function(point,map){                     
           var marker = new google.maps.Marker({
               position:point.coords,
               map: map,
               title: point.name
            });    
           return marker;
       };
       
       /**
        * Render a LINESTRING data to the map 
        * @method renderLineString
        * @param linestring - the linestring to render
        * @param map - The map where the point is to be rendered
        */  
       this.renderLineString = function(linestring,map){
           
       };
       
       /**
        * Render a POLYGON data to the map 
        * @method renderPolygon
        * @param polygon - the polygon to render
        * @param map - The map where the point is to be rendered
        */
       this.renderPolygon = function(polygon,map){
           
       };   
 
        /**
         * Method to decide how the wms layer should be rendered and add the wms to the map 
         * @method renderLayer
         * @param layer - The layer containing the wms to be rendered
         */
        this.renderLayer = function(layer){   
            var map =  GoogleMapService.getMap();            
            var me = this;
            var onlineResources = LayerManagerService.getWFS(layer);
            RenderStatusService.setMaxValue(layer,onlineResources.length);
            for(var index in onlineResources){
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                
                GetWFSRelatedService.getFeature(layer.proxyUrl, onlineResources[index]).then(function(response){
                    var rootNode = GMLParserService.getRootNode(response.data.gml);
                    var primitives = GMLParserService.makePrimitives(rootNode);
                    
                    RenderStatusService.updateCompleteStatus(layer,response.resource,Constants.statusProgress.COMPLETED);
                    
                    for(var key in primitives){
                        switch(primitives[key].geometryType){
                            case Constants.geometryType.POINT:
                                GoogleMapService.addMarkerToActive(layer.id,me.renderPoint(primitives[key],map));
                                break;
                            case Constants.geometryType.LINESTRING:
                                me.renderLineString(primitives[key],map);
                                break;
                            case Constants.geometryType.POLYGON:
                                me.renderPolygon(primitives[key],map);
                                break;
                            default:
                                break;
                        }
                    }
                    
                   

                },function(error){
                    //VT: Some sort of error handling here
                    console.log(error);
                });
          
            }
            
        };
        
        /**
         * Method to decide how the wms resource should be rendered and add the wms to the map 
         * @method renderResource
         * @param resource - The resource containing the wms to be rendered
         */
        this.renderCSWRecord = function(layer,cswRecord){   
            var map =  GoogleMapService.getMap();            
            var me = this;
            var onlineResources = LayerManagerService.getWFSFromCSW(cswRecord);
            RenderStatusService.setMaxValue(layer,onlineResources.length);
                        
            
            for(var index in onlineResources){
                RenderStatusService.updateCompleteStatus(layer,onlineResources[index],Constants.statusProgress.RUNNING);
                GetWFSRelatedService.getFeature(layer.proxyUrl, onlineResources[index]).then(function(response){
                    var rootNode = GMLParserService.getRootNode(response.data.gml);
                    var primitives = GMLParserService.makePrimitives(rootNode);
                    
                    RenderStatusService.updateCompleteStatus(layer,response.resource,Constants.statusProgress.COMPLETED);
                    
                    for(var key in primitives){
                        switch(primitives[key].geometryType){
                            case Constants.geometryType.POINT:
                                GoogleMapService.addMarkerToActive(layer.id,me.renderPoint(primitives[key],map));
                                break;
                            case Constants.geometryType.LINESTRING:
                                me.renderLineString(primitives[key],map);
                                break;
                            case Constants.geometryType.POLYGON:
                                me.renderPolygon(primitives[key],map);
                                break;
                            default:
                                break;
                        }
                    }
                    
                },function(error){
                    //VT: Some sort of error handling here
                    console.log(error);
                });
            }
            
        };
    
     
}]);