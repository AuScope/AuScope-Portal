/**
 * Service class used for handling all layer rendering related methods
 * @class RenderHandlerService
 * 
 */
allModules.service('RenderHandlerService',['$rootScope','WMSService','WFSService','LayerManagerService','GoogleMapService','RenderStatusService','LayerManagerService','Constants','$injector',
                                           function ($rootScope,WMSService,WFSService,LayerManagerService,GoogleMapService,RenderStatusService,LayerManagerService,Constants,$injector) {
    
  
     
    /**
     * Decides how to renders a layer automatically
     * 
     * @method renderLayer 
     * @param layer - the layer for rendering
     */
    this.renderLayer = function(layer,param){
                
        GoogleMapService.removeActiveLayer(layer);

        //VT: on a small screen, broadcast a request to add a layer has been established so that 
        //VT:action like closing panels can be act on. 
        var mq = window.matchMedia(Constants.smallScreenTest);
        if(mq.matches){
            $rootScope.$broadcast('layer.add', layer);
        }
        
        if(Constants.rendererLoader[layer.id]){
            var RenderService = $injector.get(Constants.rendererLoader[layer.id]);
            RenderService.renderLayer(layer,param);
        }else if(LayerManagerService.getWMS(layer).length > 0){
            WMSService.renderLayer(layer,param);          
        }else if(LayerManagerService.getWFS(layer).length > 0){
            WFSService.renderLayer(layer,param);          
        }
        
    };
     
     
     /**
      * Decides how to renders a layer automatically
      * 
      * @method renderCSWRecord 
      * @param layer - the layer for rendering
      * @param cswRecord - the cswRecord for rendering
      */
     this.renderCSWRecord = function(layer,cswRecord){   
         if(RenderStatusService.getRenderStatus()[layer.id]){
             for(var resourceUrl in RenderStatusService.getRenderStatus()[layer.id].resources){
                 if(LayerManagerService.CSWContainsResource(cswRecord,RenderStatusService.getRenderStatus()[layer.id].resources[resourceUrl])){
                     return;
                 };
             };
         }
         //VT: on a small screen, broadcast a request to add a layer has been established so that 
         //VT:action like closing panels can be act on. 
         var mq = window.matchMedia(Constants.smallScreenTest);
         if(mq.matches){
             $rootScope.$broadcast('layer.add', layer);
         }
         
         if(Constants.rendererLoader[layer.id]){
             var RenderService = $injector.get(Constants.rendererLoader[layer.id]);
             RenderService.renderCSWRecord(layer,cswRecord);
         }else if(LayerManagerService.getWMS(layer).length > 0){
             WMSService.renderCSWRecord(layer,cswRecord);          
         }else if(LayerManagerService.getWFS(layer).length > 0){
             WFSService.renderCSWRecord(layer,cswRecord);          
         }
      };
     
}]);