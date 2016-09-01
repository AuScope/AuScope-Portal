/**
 * Service class related to handling all things related to making http cswrecords
 * @module http
 * @class GetCSWRecordService
 * 
 */
allModules.service('GetCSWRecordService',['$http','$q',function ($http,$q) {
     var promise; 
     
     /**
      * Retrieve knownlayer csw records async
      * @method getCSWKnownLayers
      * @return promise - a promise of the csw records when it has complete
      */
     this.getCSWKnownLayers = function(){    
         if ( !promise ) {
                promise = $http.get('../getKnownLayers.do').then(function (response) {
                    var data = response.data.data;
                    var cswRecords = {};
                    
                    data.forEach(function(item, i, ar){ 
                        if(cswRecords[item.group]===undefined){
                            cswRecords[item.group] = [];
                        }
                        cswRecords[item.group].push(item);                                                  
                    });
               
                return cswRecords; 
             });
         }
         return promise;
                 
     };
     
     
        
    
     
}]);