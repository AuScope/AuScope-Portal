/**
 * All things related to making http wfs request such as get feature
 * @module http
 * @class GetWFSRelatedService
 * 
 */
allModules.service('GetWFSRelatedService',['$http','$q',function ($http,$q) {
       
    /**
     * Make a get wfs request
     * @method getFeature
     * @param proxyUrl - The URL of the feature service
     * @param onlineResource - onlineResource of the wfs
     * @return promise - a promise containing the features for the layer
     */
     this.getFeature = function(layer, onlineResource,selectedFilters){ 
         
        var proxyUrl = layer.proxyUrl;
        
        var parameters={
                serviceUrl:onlineResource.url,
                typeName : onlineResource.name,
                selectedFilters : selectedFilters
         };
        
        //VT: this is to append any fix parameter mainly for legacy reason in NVCL layer to set onlyHylogger to true 
        var fixedAttributes = [];
        if(layer.filterCollection.fixedAttributes){
            fixedAttributes = layer.filterCollection.fixedAttributes;   
        }
        for(var idx in fixedAttributes){
            parameters[fixedAttributes[idx].parameter] = fixedAttributes[idx].value;
        }
        
         
        if(proxyUrl){
             return $http.get('../' + proxyUrl,{
                 params:parameters
             }).then(function (response) {
                 //VT: include the corresponding resource used to retrieve this result.
                 response.data.resource = onlineResource;
                 return response.data;
             });
        }else{
            var deferred = $q.defer();
            deferred.resolve(null);
            return deferred.promise;
        }
                 
     };
     
     
}]);