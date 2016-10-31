 
    
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
        }else if(typeof obj === 'object'){
            return jQuery.isEmptyObject(obj);
        }else{
            if(obj){
                return false;
            }else{
                return true;
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
    
    /**
     * Extract the domain from any url
     * @method getUrlDomain
     * @param url to extract the domain
     */
    this.getUrlDomain = function(url){
        var    a      = document.createElement('a');
        a.href = url;
        return a.hostname;
    };
    
    
    this.filterProviderSkip =  function(params, url){
        var containProviderFilter = false;
        var urlMatch = false;
        
        for(idx in params){
            if(params[idx].type=="OPTIONAL.PROVIDER"){
                containProviderFilter = true;
                for(domain in params[idx].value ){
                    if(url.indexOf(domain) != -1){
                        urlMatch = true;
                    }
                }
            }
        }
        
        if(containProviderFilter && !urlMatch){
            return true;
        }else{
            return false;
        }
               
    };
    
     
}]);    