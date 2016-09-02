/**
 * LayerManagerService handles layer manipulation and extraction of information from the layer/csw records
 * @module layer
 * @class LayerManagerService
 * 
 */
allModules.service('LayerManagerService',['$rootScope','Constants',function ($rootScope,Constants) {
   
    
    /**
     * Retrieve WMS resource if available
     * @method getWMS
     * @param layer - the layer we would like to extract wms from
     * @return resources - an array of the wms resource. empty array if none is found
     */
    this.getWMS = function(layer){
        return this.getOnlineResources(layer, Constants.resourceType['WMS']);
    };
    
    /**
     * Retrieve WFS resource if available
     * @method getWFS
     * @param layer - the layer we would like to extract wfs from
     * @return resources - an array of the wfs resource. empty array if none is found
     */
    this.getWFS = function(layer){
        return this.getOnlineResources(layer, Constants.resourceType['WFS']);
    };
    
    
    /**
     * Retrieve the arrays of csw records from the layer
     * @method getCSWRecords
     * @param layer - the layer we would like to extract cswRecords from
     * @return cswRecords - an array of the cswRecords. empty array if none is found
     */
    this.getCSWRecords = function(layer){
        return layer.cswRecords;
    };
    
    /**
     * Extract resources based on the type. If type is not defined, return all the resource
     * @method getOnlineResources
     * @param layer - the layer we would like to extract cswRecords from
     * @param resourceType - a enum of the resource type. The ENUM constant is defined on app.js
     * @return resources - an array of the resource. empty array if none is found
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