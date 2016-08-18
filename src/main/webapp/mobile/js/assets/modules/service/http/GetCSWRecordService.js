allModules.service('GetCSWRecordService',['$http','$q',function ($http,$q) {
     var promise;    
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
     
     
        
     this.getCSWKnownLayersGroup = function(){
         var defer = $q.defer();
         this.getCSWKnownLayers().then(function(data){
             defer.resolve(data);
         });
         return defer.promise;
     }
     
}]);