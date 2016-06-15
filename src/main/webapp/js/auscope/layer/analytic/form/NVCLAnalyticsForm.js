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
                autoScroll: true,
                items: [{
                    xtype: 'container',
                    html: '<p class="centeredlabel">National Virtual Core Library analytics are run remotely and may take some time to complete. By entering an email and a job name you can come back to this form later to collect your results.</p>'
                },{
                    xtype: 'textfield',
                    name: 'email',
                    itemId: 'email',
                    fieldLabel: 'Email',
                    allowBlank: false,
                    anchor: '100%'
                },{
                    xtype: 'textfield',
                    name: 'jobName',
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
                            valueField: 'algorithmId',
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
                            name: 'algorithmOutputId',
                            itemId: 'version',
                            store: versionsStore,
                            displayField: 'version',
                            valueField: 'algorithmOutputId',
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
                            name: 'startDepth',
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
                            name: 'endDepth',
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
                            name: 'span',
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
        var idx = combo.getStore().find('algorithmId', newValue);
        var record = combo.getStore().getAt(idx);
        if (record) {
            var versionCombo = this.down('#version');
            versionCombo.setValue(null);

            var versionStore = versionCombo.getStore();
            versionStore.removeAll();
            versionStore.loadData(record.get('versions'));

            if (versionStore.getCount()) {
                var highestVersion = versionStore.getAt(0);
                versionCombo.setValue(highestVersion.get('algorithmOutputId'));
            }
        }
    },

    _onVersionChange: function(combo, newValue, oldValue) {
        var idx = combo.getStore().find('algorithmOutputId', newValue);
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
        var formPanel = this.down('form');
        var emailField = formPanel.down('#email');

        if (!emailField.isValid()) {
            return;
        }

        var email = emailField.getValue();
        var mask = new Ext.LoadMask({
            msg: 'Checking status...',
            target: this
        });
        mask.show();
        portal.util.Ajax.request({
            url: 'checkNVCLProcessingJob.do',
            params: {
                email: email
            },
            scope: this,
            callback: function(success, data, message) {
                mask.hide();

                if (!success) {
                    Ext.Msg.alert('Error', 'Unable to check your processing jobs at this time. Please try again later.');
                    console.log(message);
                    return;
                }

                if (Ext.isEmpty(data)) {
                    Ext.Msg.alert('No Jobs', 'There are currently no jobs submitted for ' + email);
                    return;
                }

                var popup = Ext.create('Ext.window.Window', {
                    modal: true,
                    layout: 'fit',
                    title: 'Previously submitted jobs',
                    width: 400,
                    height: 200,
                    items: [{
                        xtype: 'analyticaljobstatuspanel',
                        statuses: data,
                        listeners: {
                            statusselect: Ext.bind(function(panel, rec) {
                                this._loadFilterForJob(rec.get('jobId'));
                                popup.close();
                                this.close();
                            }, this)
                        }
                    }]
                });
                popup.show();
            }
        });
    },

    _loadFilterForJob: function(jobId) {
        var mask = new Ext.LoadMask({
            msg: 'Loading results...',
            target: this
        });
        mask.show();
        portal.util.Ajax.request({
            url: 'getNVCLProcessingResults.do',
            params: {
                jobId: jobId
            },
            scope: this,
            callback: function(success, data) {
                mask.hide();
                if (!success) {
                    Ext.Msg.alert('Error', 'Unable to access your job results at this time. Please try again later.');
                    return;
                }

                if (Ext.isEmpty(data) || Ext.isEmpty(data[0].passBoreholes)) {
                    Ext.Msg.alert('No Data', 'No boreholes matched your query.');
                    return;
                }

                this.layer.get('filterer').setParameters({
                    ids: data[0].passBoreholes.join(','),
                    nvclJobName: data[0].jobDescription
                }, false);
                portal.map.openlayers.ActiveLayerManager.addLayer(this.layer);
            }
        });
    },

    _onSubmit: function() {
        var formPanel = this.down('form');
        if (!formPanel.isValid()) {
            return;
        }

        //Build up our parameters for job submission
        var params = {};
        if (this.layer) {
            console.log('filterer:', this.layer.get('filterer').getParameters());
            console.log('form:', this.layer.get('filterForm').getValues());
            params = this.layer.get('filterer').getParameters();

            var wfsUrls = [];
            if (Ext.isEmpty(params.serviceFilter)) {
                var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(this.layer.getAllOnlineResources(), portal.csw.OnlineResource.WFS);
                wfsUrls = wfsResources.map(function(or) {
                    return or.get('url');
                });
            } else {
                wfsUrls = [params.serviceFilter];
            }

            params.wfsUrl = wfsUrls;
        }
        Ext.apply(params, formPanel.getValues());

        //Submit the job
        var mask = new Ext.LoadMask({
            msg: 'Submitting job...',
            target: this
        });
        mask.show();
        portal.util.Ajax.request({
            url: 'submitSF0NVCLProcessingJob.do',
            params: params,
            scope: this,
            callback: function(success) {
                mask.hide();
                if (!success) {
                    Ext.Msg.alert('Error', 'Unable to submit your processing job at this time. Please try again later.');
                    return;
                }

                Ext.Msg.alert('Success', 'Your job has successfully submitted. You can check the status with the "Check Status" button below');
            }
        });
    }
});