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
            if(onlineResources[index].url=="http://www.mrt.tas.gov.au:80/web-services/wfs"){
                GetWFSRelatedService.getFeature(layer.proxyUrl, onlineResources[index]).then(function(gml){
                    console.log(gml);
                },function(error){
                    //VT: Some sort of error handling here
                    console.log(error);
                });
            }
        }
        
        
        
  
    };
    
     
}]);