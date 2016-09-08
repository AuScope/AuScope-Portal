/**
 * Service class used for managing and tracking the status of the layer rendering
 * @class RenderStatusService
 * 
 */
allModules.service('RenderStatusService',['$rootScope','Constants','UtilitiesService',function ($rootScope,Constants,UtilitiesService) {
    
    this.renderStatus={};
    
    this.getRenderStatus = function(){
        return this.renderStatus; 
    };
    
    this.setMaxValue = function(layerId,maxValue){
        if(UtilitiesService.isEmpty(this.renderStatus[layerId])){
            this.renderStatus[layerId]={};
        }
        this.renderStatus[layerId].max=maxValue;
        this.renderStatus[layerId].complete = 0;
    };
    
    this.onUpdate = function ($scope, callback) {
        $scope.$on('status.update', function (evt,renderStatus) {
            callback(renderStatus);
          });
    };
    
    this.broadcast = function (renderStatus) {
        $rootScope.$broadcast('status.update', renderStatus);
    };
    
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
    
    
    
    this.clearStatus = function(layerId){
        this.renderStatus[layerId] = {};
    };
     
   
     
     
        
    
     
}]);