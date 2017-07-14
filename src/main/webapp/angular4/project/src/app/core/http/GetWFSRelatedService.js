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
     * @param param - addtional parameter
     * @return promise - a promise containing the features for the layer
     */
     this.getFeature = function(layer, onlineResource,param){ 
         
        var proxyUrl = layer.proxyUrl;
        
        if(!param){
            param = {};
        }
        
        param.serviceUrl = onlineResource.url;
        param.typeName  = onlineResource.name;
        
      //VT: hiddenParams- this is to append any fix parameter mainly for legacy reason in NVCL layer to set onlyHylogger to true 
        if(layer.filterCollection){
            var hiddenParams = [];
            if(layer.filterCollection.hiddenParams){
                hiddenParams = layer.filterCollection.hiddenParams;   
            }
            for(var idx in hiddenParams){
                if(hiddenParams[idx].type=="UIHiddenResourceAttribute"){
                    param[hiddenParams[idx].parameter] = onlineResource[hiddenParams[idx].attribute];
                }else{
                    param[hiddenParams[idx].parameter] = hiddenParams[idx].value;
                }
            }
            
            //VT: mandatoryFilters
            var mandatoryFilters = [];
            if(layer.filterCollection.mandatoryFilters){
                mandatoryFilters = layer.filterCollection.mandatoryFilters;   
            }
            for(var idx in mandatoryFilters){            
                param[mandatoryFilters[idx].parameter] = mandatoryFilters[idx].value;             
            }
        }
         
        if(proxyUrl){
             return $http.get('../' + proxyUrl,{
                 params:angular.copy(param)
             }).then(function (response) {
                 //VT: include the corresponding resource used to retrieve this result.
                 response.data.resource = onlineResource;
                 return response.data;
             },function(err){
                 var deferred = $q.defer();
                 err.onlineResource = onlineResource;
                 return $q.reject(err);
             });
        }else{
            var deferred = $q.defer();
            deferred.resolve(null);
            return deferred.promise;
        }
                 
     };
     
     
}]);