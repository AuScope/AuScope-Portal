 
    
/**
 * SimpleXPathService handles xml file manipulation.
 * @module utility
 * @class SimpleXPathService
 * 
 */
allModules.service('UtilitiesService',['$rootScope',function ($rootScope) {
   
    this.isEmpty = function(obj){
        if(obj instanceof Array || (typeof obj === 'string')){
            return obj.length == 0;
        }else{
            if(obj){
                return true;
            }else{
                return false;
            }
        }
    };
    
    this.isNumber = function(obj){
        !isNaN(parseFloat(n)) && isFinite(n);
    };
    
     
}]);    