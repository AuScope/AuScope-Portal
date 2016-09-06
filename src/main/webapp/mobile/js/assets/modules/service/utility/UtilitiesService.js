 
    
/**
 * SimpleXPathService handles xml file manipulation.
 * @module utility
 * @class SimpleXPathService
 * 
 */
allModules.service('UtilitiesService',['$rootScope',function ($rootScope) {
   
    /**
     * Test if the object is empty
     * @method isEmpty
     * @param obj - the object to test for emptiness
     * @return boolean - true if object is empty.
     */
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
    
    /**
     * Test if the object is a number
     * @method isNumber
     * @param obj - the object to test for numeric value
     * @retun boolean - true if obj is a number
     */
    this.isNumber = function(obj){
        !isNaN(parseFloat(n)) && isFinite(n);
    };
    
     
}]);    