allModules.service('layerManagerService',['$rootScope','Constants',function ($rootScope,Constants) {
   
    
    
    this.getWMS = function(layer){
        return this.getOnlineResources(layer, Constants.resourceType['WMS']);
    };
    
    this.getWFS = function(layer){
        return this.getOnlineResources(layer, Constants.resourceType['WFS']);
    };
    
    this.getCSWRecords = function(layer){
        return layer.cswRecords;
    };
    
    /**
     * resourceType is a enum defined in app.js
     * resourceType: if resourceType == null, return all
     */
    
    this.getOnlineResources = function(layer,resourceType){
        
        
        var cswRecords = this.getCSWRecords(layer);
        var onlineResource = [];
        
        //VT: Loop through all the csw records and online resource
        for(var i=0; i < cswRecords.length;i++){
            for(var j=0; j < cswRecords[i].onlineResources.length;j++){
                if(!resourceType){//VT: if not defined add all
                    onlineResource.push(cswRecords[i].onlineResources[j]);
                }else{
                    //VT: if defined, only add those that matched.
                    if(cswRecords[i].onlineResources[j].type==resourceType){
                        onlineResource.push(cswRecords[i].onlineResources[j]);
                    }
                }
                
            }
        }  
        
        return onlineResource;
    };
     
}]);