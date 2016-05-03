/**
 * Produce a form for making NVCL Analytical jobs
 */
Ext.define('auscope.layer.analytic.form.NVCLAnalyticsForm', {
    extend : 'Ext.window.Window',

    statics: {
        NVCL_DATA_SERVICE : 'http://nvclwebservices.vm.csiro.au/NVCLDataServices'
    },

    layer : null,
    map : null,
    bboxButton : null,
    serviceUrl : null,

    constructor : function(cfg) {
        this.layer=cfg.layer;
        this.map=cfg.map;

        var width = Math.min(window.screen.width - 100, 700);
        var defaults = {
            labelWidth: 150,
            padding: 0
        };

        var algorithmOutputStore = Ext.create('Ext.data.Store', {
            fields: [{name: 'algorithmId', type: 'int'},
                     {name: 'algorithmName', type: 'string'},
                     {name: 'outputName', type: 'string'},
                     {name: 'versions', type: 'auto'}],
            proxy: {
                type: 'ajax',
                url: 'getNVCLAlgorithms.do',
                extraParams: {
                    serviceUrl:  auscope.layer.analytic.form.NVCLAnalyticsForm.NVCL_DATA_SERVICE
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            autoLoad: true
        });

        var versionsStore = Ext.create('Ext.data.Store', {
            fields: [{name: 'version', type: 'int'},
                     {name: 'algorithmOutputId', type: 'int'}],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            sorters: {
                direction: 'DESC',
                property: 'version'
            },
            autoLoad: false
        });

        var classificationStore = Ext.create('Ext.data.Store', {
            fields: [{name: 'classText', type: 'string'},
                     {name: 'color', type: 'int'},
                     {name: 'index', type: 'int'}],
            proxy: {
                type: 'ajax',
                url: 'getNVCLClassifications.do',
                extraParams: {
                    serviceUrl:  auscope.layer.analytic.form.NVCLAnalyticsForm.NVCL_DATA_SERVICE
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            autoLoad: false
        });

        var operatorStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{name: '<', value: 'lt'},{name: '>', value: 'gt'}, {name: '=', value: 'eq'}]
        });

        var uomStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: [{name: 'count', value: 'count'},{name: '%', value: 'pct'}]
        });

        Ext.apply(cfg, {
            title: 'National Virtual Core Library Analytics',
            height: 700,
            width: width,
            layout: 'fit',
            padding: '10',
            border: false,
            modal: true,
            items: [{
                xtype: 'form',
                border: false,
                items: [{
                    xtype: 'container',
                    html: '<p class="centeredlabel">National Virtual Core Library analytics are run remotely and may take some time to complete. By entering an email and a job name you can come back to this form later to collect your results.</p>'
                },{
                    xtype: 'textfield',
                    name: 'email',
                    fieldLabel: 'Email',
                    allowBlank: false,
                    anchor: '100%'
                },{
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: 'Job Name',
                    allowBlank: false,
                    anchor: '100%'
                },{
                    xtype: 'container',
                    html: '<p class="centeredlabel">Please select a classification algorithm to filter boreholes against.</p>'
                },{
                    xtype: 'fieldset',
                    title: 'Algorithm',
                    defaults: defaults,
                    items: [{
                        xtype: 'fieldset',
                        layout: 'hbox',
                        border: false,
                        defaults: defaults,
                        items: [{
                            xtype: 'combo',
                            name: 'algorithm',
                            itemId: 'algorithm',
                            fieldLabel: 'Algorithm Output',
                            store: algorithmOutputStore,
                            displayField: 'outputName',
                            valueField: 'id',
                            forceSelection: true,
                            queryMode: 'local',
                            typeAhead: true,
                            allowBlank: false,
                            listeners: {
                                change: Ext.bind(this._onAlgorithmOutputChange, this)
                            }
                        },{
                            xtype: 'label',
                            text: 'version',
                            margin: '3 5 0 5'
                        },{
                            xtype: 'combo',
                            name: 'version',
                            itemId: 'version',
                            store: versionsStore,
                            displayField: 'version',
                            valueField: 'version',
                            forceSelection: true,
                            queryMode: 'local',
                            allowBlank: false,
                            typeAhead: true,
                            listeners: {
                                change: Ext.bind(this._onVersionChange, this)
                            }
                        }]
                    },{
                        xtype: 'combo',
                        name: 'classification',
                        fieldLabel: 'Classification',
                        itemId: 'classification',
                        store: classificationStore,
                        displayField: 'classText',
                        valueField: 'classText',
                        forceSelection: true,
                        queryMode: 'local',
                        allowBlank: false,
                        typeAhead: true
                    }]
                },{
                    xtype: 'container',
                    html: '<p class="centeredlabel">Please select a borehole depth range and value (compared against the above algorithm) to filter NVCL boreholes.</p>'
                },{
                    xtype: 'fieldset',
                    title: 'Filter Parameters',
                    defaults: defaults,
                    items: [{
                        xtype: 'fieldset',
                        layout: 'hbox',
                        border: false,
                        defaults: defaults,
                        items: [{
                            xtype: 'numberfield',
                            name: 'from',
                            fieldLabel: 'Region of interest',
                            decimalPrecision: 0,
                            allowBlank: false,
                            value: 0
                        },{
                            xtype: 'label',
                            text: ' metres to ',
                            margin: '3 5 0 5'
                        },{
                            xtype: 'numberfield',
                            name: 'to',
                            decimalPrecision: 0,
                            allowBlank: false,
                            value: 9999
                        },{
                            xtype: 'label',
                            text: ' metres',
                            margin: '3 0 0 5'
                        }]
                    },{
                        xtype: 'combo',
                        name: 'operator',
                        fieldLabel: 'Operator',
                        store: operatorStore,
                        displayField: 'name',
                        valueField: 'value',
                        forceSelection: true,
                        allowBlank: false,
                        queryMode: 'local'
                    },{
                        xtype: 'fieldset',
                        layout: 'hbox',
                        border: false,
                        defaults: defaults,
                        items: [{
                            xtype: 'numberfield',
                            name: 'value',
                            fieldLabel: 'Value',
                            allowBlank: false,
                            decimalPrecision: 5
                        },{
                            xtype: 'label',
                            text: ' ',
                            margin: '3 5 0 5'
                        },{
                            xtype: 'combo',
                            name: 'units',
                            store: uomStore,
                            displayField: 'name',
                            valueField: 'value',
                            forceSelection: true,
                            queryMode: 'local',
                            allowBlank: false,
                            value: 'count'
                        }]
                    },{
                        xtype: 'fieldset',
                        layout: 'hbox',
                        border: false,
                        defaults: defaults,
                        items: [{
                            xtype: 'numberfield',
                            name: 'value',
                            fieldLabel: 'Evaluated over a span of',
                            decimalPrecision: 0,
                            allowBlank: false,
                            value: 1
                        },{
                            xtype: 'label',
                            text: 'metres',
                            margin: '3 5 0 5'
                        }]
                    }]
                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'tbfill'
                },{
                    xtype: 'button',
                    text: 'Check Status',
                    iconCls : 'info',
                    handler: Ext.bind(this._onStatus, this)
                },{
                    xtype: 'button',
                    text: 'Begin Processing',
                    iconCls : 'download',
                    handler: Ext.bind(this._onSubmit, this)
                }]
            }]
        });

        this.callParent(arguments);
    },

    _onAlgorithmOutputChange: function(combo, newValue, oldValue) {
        var record = combo.getStore().getById(newValue);
        if (record) {
            var versionCombo = this.down('#version');
            versionCombo.setValue(null);

            var versionStore = versionCombo.getStore();
            versionStore.removeAll();
            versionStore.loadData(record.get('versions'));

            if (versionStore.getCount()) {
                var highestVersion = versionStore.getAt(0);
                versionCombo.setValue(highestVersion.get('version'));
            }
        }
    },

    _onVersionChange: function(combo, newValue, oldValue) {
        var idx = combo.getStore().find('version', newValue);
        var record = combo.getStore().getAt(idx);
        if (record) {
            var classCombo = this.down('#classification');
            classCombo.setValue(null);

            var classStore = classCombo.getStore();
            classStore.removeAll();
            classStore.getProxy().setExtraParams({
                serviceUrl: auscope.layer.analytic.form.NVCLAnalyticsForm.NVCL_DATA_SERVICE,
                algorithmOutputId: record.get('algorithmOutputId')
            });
            classStore.load();
        }
    },

    _onStatus: function() {
        console.log('TODO');
    },

    _onSubmit: function() {
        var formPanel = this.down('form');
        if (!formPanel.isValid()) {
            return;
        }


        console.log('TODO');
    }
});