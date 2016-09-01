/**
 * All things related to making http wms request such as get style, get legend etc
 * @module http
 * @class GetWMSRelatedService
 * 
 */
allModules.service('GetWMSRelatedService',['$http','$q',function ($http,$q) {
       
    /**
     * Get the wms style if proxyStyleUrl is valid
     * @method getWMSStyle
     * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
     * @return promise - a promise containing the sld for the layer
     */
     this.getWMSStyle = function(layer){    
        if(layer.proxyStyleUrl){
             return $http.get('../' + layer.proxyStyleUrl).then(function (response) {
                 return response.data;
             });
        }else{
            var deferred = $q.defer();
            deferred.resolve(null);
            return deferred.promise;
        }
                 
     };
     
     
}]);