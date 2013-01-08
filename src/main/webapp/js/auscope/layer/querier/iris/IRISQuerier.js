/**
 * Class for making and then parsing an IRIS request/response using a GenericParser.Parser class
 */
Ext.define('auscope.layer.querier.iris.IRISQuerier', {
    extend: 'portal.layer.querier.Querier',

    irisFeatureSource : null,

    constructor: function(config){
        this.irisFeatureSource = config.irisFeatureSource || Ext.create('auscope.layer.querier.iris.IRISFeatureSource', {});
//        this.parser = config.parser || Ext.create('portal.layer.querier.wfs.Parser', {});
//        this.knownLayerParser = config.knownLayerParser || Ext.create('portal.layer.querier.wfs.KnownLayerParser', {});

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
       
//        /* TODO What's this stuff for? */
//        var layer = queryTarget.get('layer');
//        var knownLayer = null;
//        if (layer.get('sourceType') === portal.layer.Layer.KNOWN_LAYER) {
//            knownLayer = layer.get('source');
//        }
//        /* —————————————————————— */

        var me = this;
        this.irisFeatureSource.getStationInfo(
            irisUrl, 
            network, 
            station, 
            function (success, channels) {
                channels = [].concat(channels);
                
                var channelRadioButtons = [];
                for(var i = 0; i < channels.length; i++) {
                    channelRadioButtons.push({
                        boxLabel : channels[i],
                        name : 'channel',
                        inputValue : channels[i] 
                    });
                }
                
                var allComponents = [];
                allComponents.push(
                    Ext.create('portal.layer.querier.BaseComponent', {
                        border : false,
                        tabTitle : 'IRIS Data',
                        layout : 'fit',
                        items : [{
                            xtype : 'fieldset',
                            title : 'IRIS Data Query for station: ' + network + ':' + station,
//                            labelWidth : 75,
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
                                value : new Date()
                            }, {
                                xtype : 'datefield',
                                fieldLabel : 'To',
                                name : 'to_date',
                                value : new Date()
                            }]
                        }]                        
                    })
                );

                callback(me, allComponents, queryTarget);
            });
    }
});