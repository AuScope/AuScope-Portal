/**
 * Service class used to fetch style information for layer (and legend) styling
 * @module http
 * @class StyleService
 * 
 */
allModules.service('StyleService',['$http', function ($http) {
    
    /**
    * @method getLegendStyle
    * @returns returns a promise object which can be processed using a .then() function
    */
    this.getLegendStyle = function(styleUrl){
        return $http.get('../'+styleUrl);
    }
}]);