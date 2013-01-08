/**
 * IRIS feature source used to get information about an IRIS station
 * based on its network and station codes.
 */
Ext.define('auscope.layer.querier.iris.IRISFeatureSource', {
    getStationInfo : function(
            serviceUrl,
            networkCode,
            stationCode,
            callback) {
        
        var me = this;
        Ext.Ajax.request({
            url : 'getStationChannels.do',
            params : {
                serviceUrl : serviceUrl,
                networkCode : networkCode,
                stationCode : stationCode 
            },
            callback : function(options, success, response) {
                var jsonResponse;
                // Fail if the ajax was unsuccessful or we can't decode the JSON:
                // notice assignment side-effect.
                if (!success || !(jsonResponse = Ext.JSON.decode(response.responseText)).success) {
                    callback(false, []);
                }
                else {
                    callback(true, jsonResponse.data);
                }
            }
        });
    }
});