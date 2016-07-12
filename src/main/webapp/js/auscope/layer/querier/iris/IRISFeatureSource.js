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
        portal.util.Ajax.request({
            url : 'getStationChannels.do',
            params : {
                serviceUrl : serviceUrl,
                networkCode : networkCode,
                stationCode : stationCode
            },
            callback : function(success, data) {
                if (!success) {
                    callback(false, []);
                }
                else {
                    callback(true, data);
                }
            }
        });
    }
});