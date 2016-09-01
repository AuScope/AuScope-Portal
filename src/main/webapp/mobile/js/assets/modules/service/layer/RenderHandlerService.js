/**
 * Service class used for handling all layer rendering related methods
 * @class RenderHandlerService
 * 
 */
allModules.service('RenderHandlerService',['$rootScope','WMSService','LayerManagerService',function ($rootScope,WMSService,LayerManagerService) {
     
    /**
     * Decides how to renders a layer automatically
     * 
     * @method renderLayer 
     * @param layer - the layer for rendering
     */
     this.renderLayer = function(layer){    
       if(LayerManagerService.getWMS().length() > 0){
         WMSService.renderLayer(layer);          
       }
     };
     
     
        
    
     
}]);