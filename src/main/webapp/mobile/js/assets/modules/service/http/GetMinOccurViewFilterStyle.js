allModules.service('GetMinOccurViewFilterStyle',['$http',function ($http) {
     var promise = false;    
     this.getFilterStyle = function(){    
         if ( !promise ) {
                promise = $http.get('../doMinOccurViewFilterStyle.do').then(function (response) {
                var data = ""; 
                if (response.status==200) {
                    data = response.data;
                }
                return data;
             });
         }
         return promise;
     };
}]);