 
    
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
    
    /**
     * Based on the filter parameter, this is a utility to decide if we should skip this provider
     * @method filterProviderSkip
     * @param params - filter parameter
     * @param url - the url of the resource we are matching
     */
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
    
    /**
     * count the number of unique urls in onlineResources
     * @method uniqueCountOfResourceByUrl
     * @param onlineResources
     * @return unique count by url
     */
    this.uniqueCountOfResourceByUrl = function(onlineResources){
        var unique={};
        
        for(var key in onlineResources){
           unique[onlineResources[key].url]=true;           
        }
        
        return Object.keys(unique).length;
    };
    
    
    
    /**
     *  
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *  
     **/

    // private property
    this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode_base64 = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        
        input = this._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    };

    // public method for decoding
    this.decode_base64 = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = this._utf8_decode(output);

        return output;

    };

    // private method for UTF-8 encoding
    this._utf8_encode = function (in_string) {
        
        in_string = in_string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < in_string.length; n++) {

            var c = in_string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    this._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    };
    
}]);    