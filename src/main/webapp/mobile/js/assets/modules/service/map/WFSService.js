/**
 * WFSService handles rendering of all wfs layers onto the map
 * @module map
 * @class WFSService
 * 
 */
allModules.service('WFSService',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWFSRelatedService','GMLParserService',
                                 function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWFSRelatedService,GMLParserService) {
   
       this.renderPoint = function(point,map){                     
           var marker = new google.maps.Marker({
               position:point.coords,
               map: map,
               title: point.name
            });          
       };
       
       this.renderLineString = function(linestring,map){
           
       };
       
       this.renderPolygon = function(polygon,map){
           
       };   
 
        /**
         * Method to decide how the wms should be rendered and add the wms to the map 
         * @method renderLayer
         * @param layer - The layer containing the wms to be rendered
         */
        this.renderLayer = function(layer){   
            var map =  GoogleMapService.getMap();
            var me = this;
            var onlineResources = LayerManagerService.getWFS(layer);
            for(var index in onlineResources){
             
                GetWFSRelatedService.getFeature(layer.proxyUrl, onlineResources[index]).then(function(response){
                    var rootNode = GMLParserService.getRootNode(response.data.gml);
                    var primitives = GMLParserService.makePrimitives(rootNode);
                    
                    for(var key in primitives){
                        switch(primitives[key].geometryType){
                            case Constants.geometryType.POINT:
                                me.renderPoint(primitives[key],map);
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