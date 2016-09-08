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
     * @param layerId - layerId
     * @param maxValue - the max value used in progress bar
     */
    this.setMaxValue = function(layerId,maxValue){
        if(UtilitiesService.isEmpty(this.renderStatus[layerId])){
            this.renderStatus[layerId]={};
        }
        this.renderStatus[layerId].max=maxValue;
        this.renderStatus[layerId].complete = 0;
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
     * @param layerId - the id of the layer
     * @param resource - the resource
     * @param status - Constants.statusProgress
     */
    this.updateCompleteStatus = function(layerId,resource,status){  
        if(UtilitiesService.isEmpty(this.renderStatus[layerId])){
            this.renderStatus[layerId]={};
        }
        if(UtilitiesService.isEmpty(this.renderStatus[layerId].resources)){
            this.renderStatus[layerId].resources = {};
        }
        this.renderStatus[layerId].resources[resource.url] = resource;
        this.renderStatus[layerId].resources[resource.url].status = status;
        if(status == Constants.statusProgress.COMPLETED || status == Constants.statusProgress.ERROR){
            this.renderStatus[layerId].complete = this.renderStatus[layerId].complete + 1;
        };
        
        this.broadcast(this.renderStatus);
        
    };
    
    
    /**
     * Clear the status when there is not use for it anymore or removed of layer.
     * @method clearStatus
     * @param layerId - layerId
     */
    this.clearStatus = function(layerId){
        this.renderStatus[layerId] = {};
    };
     
   
     
     
        
    
     
}]);