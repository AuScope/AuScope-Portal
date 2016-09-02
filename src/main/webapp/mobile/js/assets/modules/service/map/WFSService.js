/**
 * WFSService handles rendering of all wfs layers onto the map
 * @module map
 * @class WFSService
 * 
 */
allModules.service('WFSService',['$rootScope','GoogleMapService','LayerManagerService','Constants','GetWFSRelatedService',function ($rootScope,GoogleMapService,LayerManagerService,Constants,GetWFSRelatedService) {
   
    var getCoordinates = function(){
        
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
            if(true){//onlineResources[index].url=="http://nvclwebservices.vm.csiro.au:80/geoserverBH/wfs"){
                GetWFSRelatedService.getFeature(layer.proxyUrl, onlineResources[index]).then(function(gml){
                    console.log(gml);
                },function(error){
                    console.log(error);
                });
            }
        }
        
        
        
  
    };
    
     
}]);