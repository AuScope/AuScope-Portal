 
    
/**
 * SimpleXPathService handles xml file manipulation.
 * @module utility
 * @class SimpleXPathService
 * 
 */
allModules.service('UtilitiesService',['$rootScope',function ($rootScope) {
    
    /**
     * Test if string s contains c
     * @method stringContains
     * @param s - the string to check
     * @param c - the string to match
     */
    this.stringContains = function(s,c){
        return s.indexOf(c) != -1;
    };
    
    /**
     * Returns the parameter in a get url request
     * @method getUrlParameters
     * @param url - the get url string to break
     * @param options - splitArgs - {Boolean} Split comma delimited params into arrays? Default is true
     */
    this.getUrlParameters = function(url, options) {
        var localStringContain  = function(s,c){
            return s.indexOf(c) != -1;
        };
        options = options || {};
        // if no url specified, take it from the location bar
        url = (url === null || url === undefined) ? window.location.href : url;

        //parse out parameters portion of url string
        var paramsString = "";
        if (localStringContain(url,"?")) {
            var start = url.indexOf('?') + 1;
            var end = localStringContain(url, "#") ?
                        url.indexOf('#') : url.length;
            paramsString = url.substring(start, end);
        }

        var parameters = {};
        var pairs = paramsString.split(/[&;]/);
        for(var i=0, len=pairs.length; i<len; ++i) {
            var keyValue = pairs[i].split('=');
            if (keyValue[0]) {

                var key = keyValue[0];
                try {
                    key = decodeURIComponent(key);
                } catch (err) {
                    key = unescape(key);
                }
                
                // being liberal by replacing "+" with " "
                var value = (keyValue[1] || '').replace(/\+/g, " ");

                try {
                    value = decodeURIComponent(value);
                } catch (err) {
                    value = unescape(value);
                }
                
                // follow OGC convention of comma delimited values
                if (options.splitArgs !== false) {
                    value = value.split(",");
                }

                //if there's only one value, do not return as array                    
                if (value.length == 1) {
                    value = value[0];
                }                
                
                parameters[key] = value;
             }
         }
        return parameters;
    };
    
   
   
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
                    if(params[idx].value[domain] && url.indexOf(domain) != -1){
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