allModules.service('GetWMSRelatedService',['$http','$q',function ($http,$q) {
       
     this.getWMSStyle = function(layer){    
        if(layer.proxyStyleUrl){
             return $http.get('../' + layer.proxyStyleUrl).then(function (response) {
                 return response.data;
             });
        }else{
            return null;
        }
                 
     };
     
     
}]);