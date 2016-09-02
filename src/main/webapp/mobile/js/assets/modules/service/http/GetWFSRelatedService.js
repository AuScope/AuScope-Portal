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
     this.getFeature = function(proxyUrl, onlineResource){ 
         
        if(proxyUrl){
             return $http.get('../' + proxyUrl,{
                 params:{
                     serviceUrl:onlineResource.url,
                     typeName : onlineResource.name
                 }
             }).then(function (response) {
                 return response.data;
             });
        }else{
            var deferred = $q.defer();
            deferred.resolve(null);
            return deferred.promise;
        }
                 
     };
     
     
}]);