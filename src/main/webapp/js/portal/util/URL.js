/**
 * Utility functions for manipulating URLs
 */
Ext.define('portal.util.URL', {
    singleton: true
}, function() {
    /**
     * The base URL for this page (with trailing '/') as a String variable
     *
     * eg - http://your.website/context/
     */
    portal.util.URL.base = window.location.protocol + "//" + window.location.host + WEB_CONTEXT + "/";

    /**
     * Joins a URL with a query string to form a new URL. An appropriate seperator will
     * be inserted
     */
    portal.util.URL.join = function(url, queryString) {
        var seperator = '';
        var urlLastChar = url.charAt(url.length - 1);
        var containsQuery = url.indexOf('?') >= 0;

        //Strip any leading seperators from the queryString
        var queryFirstChar = queryString.length > 0 ? queryString.charAt(0) : '';
        if (queryFirstChar === '&' || queryFirstChar === '?') {
            queryString = queryString.substring(1); //assume we won't get a query string in the form '&?foo=bar'
        }

        switch(urlLastChar) {
        case '&':
            //No seperator needed
            break;
        case '?':
            //No seperator needed
            break;
        default:
            if (containsQuery) {
                seperator = '&';
            } else {
                seperator = '?';
            }
            break;
        }

        return url + seperator + queryString;
    }
});