/**
 * Builds a form panel for RemanentAnomalies filters
 */
Ext.define('auscope.layer.filterer.forms.RemanentAnomaliesFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {

        var cswRecords = config.layer.get('cswRecords');

        //Set up a map of admin areas + URL's that belong to each
        var adminAreasMap = {};
        var bbox = null;
        for (var i = 0; i < cswRecords.length; i++) {
            var adminArea = cswRecords[i].get('adminArea');
            var allOnlineResources = cswRecords[i].get('onlineResources');
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'RemAnom:Anomaly');

            for (var j = 0; j < bhOnlineResources.length; j++) {
                if (adminAreasMap[adminArea]) {
                    adminAreasMap[adminArea].push(bhOnlineResources[j].get('url'));
                } else {
                    adminAreasMap[adminArea] = [bhOnlineResources[j].get('url')];
                }
            }
            var geoEl = cswRecords[i].get('geographicElements')[0];

            if (geoEl) {
                if (bbox) {
                    bbox = bbox.combine(geoEl);
                } else {
                    bbox = geoEl;
                }
            }
        }
        var fieldWidth = 80;
        var defaults = {
            labelWidth: 80,
            padding: 0
        };
        var styleStore = Ext.create('Ext.data.Store', {
            fields: ['displayText', 'valueText'],
            data : [
                {displayText: 'ARRA', valueText: 'ARRA'},
                {displayText: 'Dec', valueText: 'dec'},
                {displayText: 'Inc', valueText: 'inc'},
                {displayText: 'Models', valueText: 'models'}
            ]
        });
        Ext.apply(config, {
            delayedFormLoading: false,
            border: false,
            autoScroll: true,
            hideMode:'offsets',
            width:'100%',
            buttonAlign:'right',
            labelAlign:'right',
            labelWidth: 70,
            timeout: 180, //should not time out before the server does
            bodyStyle:'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Show Results\'">' +
                           'Remanent Anomalies Filter Properties' +
                       '</span>',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'Name or ID' +
                                '</span>',
                    name: 'name'
                },{
                    xtype: 'fieldset',
                    layout: 'hbox',
                    border: false,
                    anchor: '100%',
                    defaults: defaults,
                    items: [{
                        xtype: 'label',
                        text: ' ARRA: ',
                        margin: '3 5 0 5',
                        width: '30%'
                    },{
                        xtype: 'numberfield',
                        name: 'ARRAMin',
                        decimalPrecision: 1,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 180,                         
                        width: '30%'
                    },{
                        xtype: 'label',
                        text: ' to ',
                        margin: '3 5 0 5',
                        width: '10%'
                    },{
                        xtype: 'numberfield',
                        name: 'ARRAMax',
                        decimalPrecision: 01,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 180, 
                        width: '30%'
                    
                    }]
                },{
                    xtype: 'fieldset',
                    layout: 'hbox',
                    border: false,
                    anchor: '100%',
                    defaults: defaults,
                    items: [{
                        xtype: 'label',
                        text: ' Declination: ',
                        margin: '3 5 0 5',
                        width: '30%'
                    },{
                        xtype: 'numberfield',
                        name: 'decMin',
                        decimalPrecision: 1,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 360,                         
                        width: '30%'
                    },{
                        xtype: 'label',
                        text: ' to ',
                        margin: '3 5 0 5',
                        width: '10%'
                    },{
                        xtype: 'numberfield',
                        name: 'decMax',
                        decimalPrecision: 1,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 360,                         
                        width: '30%'
                    
                    }]
                },{
                    xtype: 'fieldset',
                    layout: 'hbox',
                    border: false,
                    anchor: '100%',
                    defaults: defaults,
                    items: [{
                        xtype: 'label',
                        text: ' Inclination: ',
                        margin: '3 5 0 5',
                        width: '30%'
                    },{
                        xtype: 'numberfield',
                        name: 'incMin',
                        decimalPrecision: 1,
                        allowBlank: true,
                        minValue: -90,
                        maxValue: 90,                         
                        width: '30%'
                    },{
                        xtype: 'label',
                        text: ' to ',
                        margin: '3 5 0 5',
                        width: '10%'
                    },{
                        xtype: 'numberfield',
                        name: 'incMax',
                        decimalPrecision: 1,
                        allowBlank: true,
                        minValue: -90,
                        maxValue: 90,                         
                        width: '30%'
                    
                    }]
                },{
                    xtype: 'fieldset',
                    layout: 'hbox',
                    border: false,
                    anchor: '100%',
                    defaults: defaults,
                    items: [{
                        xtype: 'label',
                        text: ' Models: ',
                        margin: '3 5 0 5',
                        width: '30%'
                    },{
                        xtype: 'numberfield',
                        name: 'modelCountMin',
                        decimalPrecision: 0,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 10000,                         
                        width: '30%'
                    },{
                        xtype: 'label',
                        text: ' to ',
                        margin: '3 5 0 5',
                        width: '10%'
                    },{
                        xtype: 'numberfield',
                        name: 'modelCountMax',
                        decimalPrecision: 0,
                        allowBlank: true,
                        minValue: 0,
                        maxValue: 10000,                         
                        width: '30%'
                    
                    }]
                },{
                    xtype: 'combo',
                    anchor: '100%',
                    fieldLabel: 'Style',
                    name: 'styleSwitch',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: styleStore,
                    valueField: 'valueText',
                    displayField: 'displayText',
                    hiddenName: 'styleSwitch'
                },{
                    xtype: 'hidden',
                    name: 'cswBbox',
                    value: Ext.JSON.encode(bbox)
                }]
            }]
        });

        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    }
});

