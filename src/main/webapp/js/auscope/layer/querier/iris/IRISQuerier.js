/**
 * Class for making and then parsing an IRIS request/response using a GenericParser.Parser class
 */
Ext.define('auscope.layer.querier.iris.IRISQuerier', {
    extend: 'portal.layer.querier.Querier',

    irisFeatureSource : null,

    constructor: function(config){
        this.irisFeatureSource = config.irisFeatureSource || Ext.create('auscope.layer.querier.iris.IRISFeatureSource', {});

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
    },

    _generateErrorComponent : function(message) {
        return Ext.create('portal.layer.querier.BaseComponent', {
            html: Ext.util.Format.format('<p class="centeredlabel">{0}</p>', message)
        });
    },

    query : function(queryTarget, callback) {
        // This should make a request to get the available channels on the particular station, e.g.:
        // http://www.iris.edu/ws/station/query?net=S&station=AUDAR&level=chan
        var onlineResource = queryTarget.get('onlineResource');
        var irisUrl = onlineResource.get('url');
        var network = onlineResource.get('name'); // TODO: I'm using 'name' to store the network code... is that bad?
        var station = queryTarget.get('id');
       
        var me = this;
        this.irisFeatureSource.getStationInfo(
            irisUrl, 
            network, 
            station, 
            function (success, channel_info) {
                // Make sure this is an array:
                channel_info.channel_codes = [].concat(channel_info.channel_codes);
                
                var channelRadioButtons = [];
                for(var i = 0; i < channel_info.channel_codes.length; i++) {
                    channelRadioButtons.push({
                        boxLabel : channel_info.channel_codes[i],
                        name : 'channel',
                        inputValue : channel_info.channel_codes[i], 
                    });
                }
                
                channel_info.start_date = new Date(channel_info.start_date);
                channel_info.end_date = new Date(channel_info.end_date);
                
                var allComponents = [];
                allComponents.push(
                    Ext.create('portal.layer.querier.BaseComponent', {
                        border : false,
                        tabTitle : 'IRIS Data',
                        layout : 'fit',
                        items : [{
                            xtype : 'fieldset',
                            title : 'IRIS Data Query for station: ' + network + ':' + station,
                            autoScroll : true,
                            items : [{
                                xtype : 'radiogroup',
                                fieldLabel : 'Channel',
                                columns : 1,
                                vertical : true,
                                items : channelRadioButtons
                            }, {
                                xtype : 'datefield',
                                fieldLabel : 'From',
                                name : 'from_date',
                                value : channel_info.start_date,
                                minValue : channel_info.start_date,
                                maxValue : channel_info.end_date
                            }, {
                                xtype : 'datefield',
                                fieldLabel : 'To',
                                name : 'to_date',
                                value : channel_info.end_date,
                                minValue : channel_info.start_date,
                                maxValue : channel_info.end_date
                            }]
                        }]                        
                    })
                );

                callback(me, allComponents, queryTarget);
            });
    }
});