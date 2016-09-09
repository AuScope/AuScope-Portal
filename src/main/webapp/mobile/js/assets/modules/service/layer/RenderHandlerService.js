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
       
        //VT: on a small screen, broadcast a request to add a layer has been established so that 
        //VT:action like closing panels can be act on. 
        var mq = window.matchMedia( "(max-width: 658px)" );
        if(mq.matches){
            $rootScope.$broadcast('layer.add', layer);
        }
        
        if(layer.id=="nvcl-borehole"){
            WFSService.renderLayer(layer);
        }else if(layer.id=="mineral-tenements"){
            WMSService.renderLayer(layer);
        }else if(LayerManagerService.getWMS(layer).length > 0){
            WMSService.renderLayer(layer);          
        }else if(LayerManagerService.getWFS(layer).length > 0){
            WFSService.renderLayer(layer);          
        }
     };
     
     
        
    
     
}]);