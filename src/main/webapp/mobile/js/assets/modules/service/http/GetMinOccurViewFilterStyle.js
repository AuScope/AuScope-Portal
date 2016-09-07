/**
 * Service class used to fetch style information for mineral occurrence reports
 * @module http
 * @class GetMinOccurViewFilterStyle
 * 
 */
allModules.service('GetMinOccurViewFilterStyle',['$http',function ($http) {
    var promise = false; 
    
    /**
    * @method getFilterStyle
    * @returns returns filter style string or an empty string upon comms error or promise
    */
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
    }
}]);