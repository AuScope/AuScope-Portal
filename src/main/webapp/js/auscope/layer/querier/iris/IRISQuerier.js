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
    
    /**
     * Defines a form which, once filled out, can be submitted to instigate a 
     * request for some of IRIS's timeseries data.
     * */
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
                
                var valueField = 'valueField';
                var displayField = 'displayField';
                var outputFormats = Ext.create('Ext.data.Store', {
                    fields : [valueField, displayField],
                    data : [
                        {valueField : 'miniseed', displayField : 'IRIS miniSEED'},
                        {valueField : 'ascii1', displayField : 'ASCII: value'},
                        {valueField : 'ascii2', displayField : 'ASCII: time, value'},
                        {valueField : 'audio', displayField : 'Audio (.wav)'},
                        {valueField : 'plot', displayField : 'Plot (.png)'},
                        {valueField : 'saca', displayField : 'SAC - ASCII'},
                        {valueField : 'sacbb', displayField : 'SAC - binary big-endian'},
                        {valueField : 'sacbl', displayField : 'SAC - binary little-endian'}
                    ]
                });
                
                channel_info.start_date = new Date(channel_info.start_date);
                channel_info.end_date = new Date(channel_info.end_date);
                
                var allComponents = [];
                allComponents.push(
                    Ext.create('portal.layer.querier.BaseComponent', {
                        border : false,
                        tabTitle : 'IRIS Data',
                        layout : 'fit',
                        items : [{
                            xtype : 'form',
                            items : [{
                                xtype : 'fieldset',
                                title : 'IRIS Data Query for station: ' + network + ':' + station,
                                autoScroll : true,
                                items : [{
                                    xtype : 'radiogroup',
                                    fieldLabel : 'Channel',
                                    allowBlank : false,
                                    columns : 2,
                                    vertical : true,
                                    items : channelRadioButtons
                                }, {
                                    xtype : 'datefield',
                                    fieldLabel : 'From',
                                    name : 'from_date',
                                    allowBlank : false,
                                    value : channel_info.start_date,
                                    minValue : channel_info.start_date,
                                    maxValue : channel_info.end_date,
                                    format : 'd/m/Y'
                                }, {
                                    xtype : 'datefield',
                                    fieldLabel : 'To',
                                    name : 'to_date',
                                    allowBlank : false,
                                    value : channel_info.end_date,
                                    minValue : channel_info.start_date,
                                    maxValue : channel_info.end_date,
                                    format : 'd/m/Y'
                                }, {
                                    xtype : 'combobox',
                                    fieldLabel : 'Output',
                                    name : 'output',
                                    allowBlank : false,
                                    store : outputFormats,
                                    queryMode : 'local',
                                    displayField : displayField,
                                    valueField : valueField
                                }]
                            }],
                            buttons: [{
                                text: 'Submit',
                                formBind: true, //only enabled once the form is valid
                                handler: function() {
                                    // www.iris.edu/ws/timeseries/query?net=S&sta=AUDAR&loc=--&cha=HHE&start=2012-10-04T00:00:00&duration=10000&output=saca&ref=direct
                                    var formValues = this.up('form').getForm().getValues();
                                    
                                    var addLeadingZero = function(value) {
                                        return value < 10 ? '0' + value : value; 
                                    };
                                    
                                    var convertDateToIrisFormat = function(date_dmY, time_component) {
                                        var components = date_dmY.split('/');
                                        var day = components[0];
                                        var month = components[1];
                                        var year = components[2];
                                        
                                        var date = new Date(year, month, day);
                                        return date.getFullYear() + '-' + addLeadingZero(date.getMonth()) + '-' + addLeadingZero(date.getDate()) + time_component;
                                    }
                                    
                                    // www.iris.edu/ws/timeseries/query?net=S&sta=AUDAR&loc=--&cha=HHE&start=2012-10-04T00:00:00&end=2012-10-05T00:00:00&output=saca&ref=direct                                   
                                    window.open(irisUrl + '/timeseries/query?net=' + network + 
                                            '&sta=' + station + 
                                            '&cha=' + formValues.channel +
                                            '&start=' + convertDateToIrisFormat(formValues.from_date, 'T00:00:00') +
                                            '&end=' + convertDateToIrisFormat(formValues.to_date, 'T23:59:59')  +
                                            '&loc=--&ref=direct&output=' + formValues.output,
                                            '_blank');
                                }
                            }]
                        }]                        
                    })
                );

                callback(me, allComponents, queryTarget);
            });
    }
});