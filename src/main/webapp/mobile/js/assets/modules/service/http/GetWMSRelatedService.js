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
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.
     * @return promise - a promise containing the sld for the layer
     */
     this.getWMSStyle = function(layer,param){ 
         if(!param){
             param = {};
         }
        if(layer.proxyStyleUrl){
             return $http.get('../' + layer.proxyStyleUrl,{
                 params:param
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