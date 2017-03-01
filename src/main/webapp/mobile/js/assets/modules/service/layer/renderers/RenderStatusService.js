/**
 * Service class used for managing and tracking the status of the layer rendering
 * @class RenderStatusService
 * 
 */
allModules.service('RenderStatusService',['$rootScope','Constants','UtilitiesService',function ($rootScope,Constants,UtilitiesService) {
    
    this.renderStatus={};
    
    /**
     * @method getRenderStatus
     * @return renderStatus - a object that contains the status of the rendering
     */
    this.getRenderStatus = function(){
        return this.renderStatus; 
    };
    
    /**
     * Set the total number of request, used in progress bar
     * @method setMaxValue
     * @param layer - layer
     * @param maxValue - the max value used in progress bar
     */
    this.setMaxValue = function(layer,maxValue){
        if(UtilitiesService.isEmpty(this.renderStatus[layer.id])){
            this.renderStatus[layer.id]={};
        }
        this.renderStatus[layer.id].max=maxValue;
        this.renderStatus[layer.id].completed = 0;

    };
    
    /**
     * capture and action on the status.update event.
     * @method onUpdate
     * @param $scope of the caller
     * @param callback - callback function
     */
    this.onUpdate = function ($scope, callback) {
        $scope.$on('status.update', function (evt,renderStatus) {
            callback(renderStatus);
          });
    };
    
    this.broadcast = function (renderStatus) {
        $rootScope.$broadcast('status.update', renderStatus);
    };
    
    /**
     * update the status of the rendering request
     * @method updateCompleteStatus
     * @param layer - the layer
     * @param resource - the resource
     * @param status - Constants.statusProgress
     */
    this.updateCompleteStatus = function(layer,resource,status){  
        if(UtilitiesService.isEmpty(this.renderStatus[layer.id])){
            this.renderStatus[layer.id]={};
        }
        if(UtilitiesService.isEmpty(this.renderStatus[layer.id].resources)){
            this.renderStatus[layer.id].resources = {};
        }
        
        //VT: The status has already been set and completed. This may get spammed because of the onerror catch at the img tile level
        if(this.renderStatus[layer.id].resources[resource.url] && (this.renderStatus[layer.id].resources[resource.url].status == Constants.statusProgress.ERROR || 
                this.renderStatus[layer.id].resources[resource.url].status == Constants.statusProgress.COMPLETED || 
                this.renderStatus[layer.id].resources[resource.url].status == Constants.statusProgress.SKIPPED)){
            return;
        }
            
        this.renderStatus[layer.id].resources[resource.url] = resource;
        this.renderStatus[layer.id].resources[resource.url].status = status;
        if(status == Constants.statusProgress.COMPLETED || status == Constants.statusProgress.ERROR || status == Constants.statusProgress.SKIPPED){
            this.renderStatus[layer.id].completed +=  1;
           
            if(status==Constants.statusProgress.ERROR){
                this.renderStatus[layer.id].errorFound =  true;
            }
        };
        
        this.broadcast(this.renderStatus);
        
    };


    /**
     * Returns true if the status of the resource and layer matches the input status
     * @method checkStatus
     * @param layer layer whose status will be checked
     * @param resource resource whose status will be checked
     * @param status boolean value of status to be checked
     */
    this.checkStatus = function(layer,resource, status) {
        if (UtilitiesService.isEmpty(this.renderStatus[layer.id])){
            return null;
        }
        if (UtilitiesService.isEmpty(this.renderStatus[layer.id].resources)){
            return null;
        }
        if (this.renderStatus[layer.id].resources[resource.url]) {
            if (this.renderStatus[layer.id].resources[resource.url].status == status) {
                return true;
            }
            return false;
        }
    };
    
    
    /**
     * Clear the status when there is not use for it anymore or removed of layer.
     * @method clearStatus
     * @param layerId - layerId
     */
    this.clearStatus = function(layer){
        this.renderStatus[layer.id] = {};  
        this.broadcast(this.renderStatus);
    };
     
    /**
     * Check if the layer is still active
     * @method isLayerActive
     * @param layerId - layerId
     */
    this.isLayerActive = function(layer){
       return !(UtilitiesService.isEmpty(this.renderStatus[layer.id]));
       
    };
     
     
        
    
     
}]);