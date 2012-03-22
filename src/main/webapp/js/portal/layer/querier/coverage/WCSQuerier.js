/**
 * Querier for WCS instances
 */
Ext.define('portal.layer.querier.coverage.WCSQuerier', {
    extend: 'portal.layer.querier.Querier',

    constructor: function(config){
        this.callParent(arguments)
    },

    statics : {
        _parseArrayToString : function(arr, contentFunc){

            if (!arr || arr.length === 0) {
                return '';
            }

            if (!contentFunc) {
                contentFunc = function (item) {
                    return item;
                };
            }

            var description = '';
            for (var i = 0; i < arr.length; i++) {
                description += contentFunc(arr[i]);
                if (arr[i+1]) {
                    description += '<br/>';
                }
            }
            return description;
        }
    },

    query : function(queryTarget, callback) {
        Ext.Ajax.request({
            url: 'describeCoverage.do',
            timeout : 180000,
            params      : {
                serviceUrl      : queryTarget.get('onlineResource').get('url'),
                layerName       : queryTarget.get('onlineResource').get('name')
                //cswRecord       : queryTarget.get('cswRecord')
            },
            callback : function(options, success, response) {
                if(success){
                    var responseObj = Ext.JSON.decode(response.responseText);
                    var record = responseObj.data[0];
                    var spatialFunc=function(item) {
                        var s = '';
                        if (item.type === 'Envelope' || item.type === 'EnvelopeWithTimePeriod') {
                            s += '[';
                            s += 'E' + item.eastBoundLongitude + ', ';
                            s += 'W' + item.westBoundLongitude + ', ';
                            s += 'N' + item.northBoundLatitude + ', ';
                            s += 'S' + item.southBoundLatitude;
                            s   += ']';
                        } else {
                            s += item.type;
                        }

                        return s;
                    };

                    var cmp= Ext.create('portal.layer.querier.BaseComponent',{
                        layout : 'fit',
                        items : [{
                            xtype : 'fieldset',
                            border : false,
                            autoScroll:true,
                            labelWidth: 75,
                            layout:'anchor',

                            items : [{
                                xtype : 'displayfield',
                                fieldLabel : 'name',
                                value : record.name
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'Description',
                                value : record.description
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'Label',
                                value : record.label
                            },{
                                xtype : 'displayfield',
                                fieldLabel : "Supported RequestCRS's",
                                value : portal.layer.querier.coverage.WCSQuerier._parseArrayToString(record.supportedRequestCRSs)
                            },{
                                xtype : 'displayfield',
                                fieldLabel : "Supported ResponseCRS's",
                                value : portal.layer.querier.coverage.WCSQuerier._parseArrayToString(record.supportedResponseCRSs)
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'Supported Formats',
                                value : portal.layer.querier.coverage.WCSQuerier._parseArrayToString(record.supportedFormats)
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'Supported Interpolation',
                                value : portal.layer.querier.coverage.WCSQuerier._parseArrayToString(record.supportedInterpolations)
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'WMS URLs',
                                value : options.params.layerName + '-' + options.params.serviceUrl
                            },{
                                xtype : 'displayfield',
                                fieldLabel : 'Spatial Domain',
                                value : portal.layer.querier.coverage.WCSQuerier._parseArrayToString(record.spatialDomain,spatialFunc)
                            }]
                        }],
                        buttonAlign : 'right',
                        buttons : [{
                            text : 'Download WCS',
                            iconCls : 'download',
                            handler : function() {

                                var layer=queryTarget.get('layer');
                                var downloader=layer.get('downloader');
                                var renderedFilterer = layer.get('filterer').clone();
                                downloader.downloadData(layer, layer.getAllOnlineResources(), renderedFilterer, undefined);
                            }
                        }]
                    });
                    callback(this, [cmp], queryTarget);
                }
            }
        });


    }

});