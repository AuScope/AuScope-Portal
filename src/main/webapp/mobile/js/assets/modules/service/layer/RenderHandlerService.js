/**
 * Service class used for handling all layer rendering related methods
 * @class RenderHandlerService
 * 
 */
allModules.service('RenderHandlerService',['$rootScope','WMSService','WFSService','LayerManagerService',function ($rootScope,WMSService,WFSService,LayerManagerService) {
     
    /**
     * Decides how to renders a layer automatically
     * 
     * @method renderLayer 
     * @param layer - the layer for rendering
     */
     this.renderLayer = function(layer){    
       if(layer.id="nvcl-borehole"){
           WFSService.renderLayer(layer);
       }else if(LayerManagerService.getWMS(layer).length > 0){
         WMSService.renderLayer(layer);          
       }else if(LayerManagerService.getWFS(layer).length > 0){
           WFSService.renderLayer(layer);          
       }
     };
     
     
        
    
     
}]);