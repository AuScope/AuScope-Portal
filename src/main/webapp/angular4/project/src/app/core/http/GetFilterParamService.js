/**
 * Service class related to handling all things related to making http filter parameter option
 * @module http
 * @class GetFilterParamService
 * 
 */
allModules.service('GetFilterParamService',['$http','$q',function ($http,$q) {
    
    //VT Because every request can potentionally come back in different format, we need to map and
    // massage those data;
    var getCommodity = function(url){
        var promise = $http.get(url).then(function (response) {
            var data = response.data.data;
            var result = [];
            data.forEach(function(item, i, ar){    
                result.push({
                    key:item[1],
                    value:item[0]
                });                                                  
            });
            return result;
        });
        return promise;  
    }
  
     /**
      * Retrieve knownlayer csw records async
      * @method getParam
      * @return promise - a promise of the dropdown filter array options
      */
     this.getParam = function(url){
         
         switch(url){
             case "../getAllCommodities.do":
                 return getCommodity(url);
             default:
                 return null;
         }
     
     };
                 

  

} ]);