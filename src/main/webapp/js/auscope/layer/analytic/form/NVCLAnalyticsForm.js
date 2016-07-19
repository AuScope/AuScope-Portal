/**
 * Produce a form for making NVCL Analytical jobs
 */
Ext.define('auscope.layer.analytic.form.NVCLAnalyticsForm', {
    extend : 'Ext.window.Window',

    statics: {
        NVCL_DATA_SERVICE : 'http://nvclwebservices.vm.csiro.au/NVCLDataServices',
        NON_STANDARD_ALGORITHM_ID : -9999
    },

    layer : null,
    map : null,
    bboxButton : null,
    serviceUrl : null,

    constructor : function(cfg) {
        this.layer=cfg.layer;
        this.map=cfg.map;

        var fieldWidth = 335;
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
            autoLoad: true,
            sorters: ["algorithmId"],
            listeners: {
                load: function(algorithmOutputStore, records, success) {
                    algorithmOutputStore.add({
                        algorithmId: auscope.layer.analytic.form.NVCLAnalyticsForm.NON_STANDARD_ALGORITHM_ID,
                        algorithmName: 'Non Standard Algorithm',
                        outputName: 'Non Standard Algorithm',
                        versions: []
                    });
                }
            }
        });

        var versionsStore = Ext.create('Ext.data.Store', {
            fields: [{name: 'version'},
                     {name: 'algorithmOutputId'}],
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
            autoLoad: false,
            listeners: {
                scope: this,
                load: function(algorithmOutputStore, records, success) {
                    //If there are no classifications for a given algorithmOutputId set
                    //then we need to disable our classification box
                    if (success && Ext.isEmpty(records)) {
                        this._setupAlgorithm(true);
                    } else {
                        this._setupAlgorithm();
                    }
                }
            }
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
            height: 750,
            width: 700,
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
                    value: this._recoverUserEmail(),
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
                            width: fieldWidth,
                            listeners: {
                                select: Ext.bind(this._onAlgorithmOutputSelect, this)
                            }
                        },{
                            xtype: 'label',
                            itemId: 'versionlabel',
                            text: 'version',
                            margin: '3 5 0 5'
                        },{
                            xtype: 'tagfield',
                            name: 'algorithmOutputId',
                            itemId: 'version',
                            store: versionsStore,
                            displayField: 'version',
                            valueField: 'algorithmOutputId',
                            forceSelection: true,
                            queryMode: 'local',
                            allowBlank: false,
                            typeAhead: true,
                            width: 250,
                            listeners: {
                                change: Ext.bind(this._onVersionChange, this)
                            },
                            triggers: {
                                all: {
                                    cls: 'nvcl-all-trigger',
                                    handler: Ext.bind(function() {
                                        var values = [];
                                        versionsStore.each(function(version) {
                                            values.push(version.get('algorithmOutputId'));
                                        });
                                        this.down('#version').setValue(values);
                                    }, this),
                                    weight: -998
                                },
                                clear: {
                                    cls: 'x-form-clear-trigger',
                                    handler: Ext.bind(function() {
                                        this.down('#version').setValue([]);
                                    }, this),
                                    weight: -999
                                }
                            }
                        }]
                    },{
                        xtype: 'combo',
                        name: 'classification',
                        fieldLabel: 'Classification',
                        itemId: 'classification-combo',
                        store: classificationStore,
                        displayField: 'classText',
                        valueField: 'classText',
                        forceSelection: true,
                        queryMode: 'local',
                        allowBlank: false,
                        typeAhead: true,
                        width: fieldWidth
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Log Name',
                        itemId: 'logname',
                        name: 'logName',
                        allowBlank: false,
                        width: fieldWidth,
                        hidden: true,
                        disabled: true
                    },{
                        xtype: 'textfield',
                        name: 'classification',
                        itemId: 'classification-text',
                        fieldLabel: 'Classification',
                        allowBlank: false,
                        width: fieldWidth,
                        hidden: true,
                        disabled: true
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
                            value: 0,
                            width: fieldWidth
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
                        queryMode: 'local',
                        width: fieldWidth
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
                            decimalPrecision: 5,
                            width: fieldWidth
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
                            value: 1,
                            width: fieldWidth
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
                    handler: Ext.bind(this._onStatus, this, [null, null], false)
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

    _setupNonStandardAlgorithm: function(record, disableClassifications) {
        this.down('#logname').setHidden(false).setDisabled(false);
        this.down('#classification-text').setHidden(false).setDisabled(disableClassifications ? true : false);
        this.down('#version').setHidden(true).setDisabled(true);
        this.down('#versionlabel').setHidden(true).setDisabled(true);
        this.down('#classification-combo').setHidden(true).setDisabled(true);
    },

    _setupStandardAlgorithm: function(record, disableClassifications) {
        this.down('#logname').setHidden(true).setDisabled(true);
        this.down('#classification-text').setHidden(true).setDisabled(true);
        this.down('#version').setHidden(false).setDisabled(false);
        this.down('#versionlabel').setHidden(false).setDisabled(false);
        this.down('#classification-combo').setHidden(false).setDisabled(disableClassifications ? true : false);
    },

    _setupAlgorithm: function(disableClassifications) {
        var algorithmCombo = this.down('#algorithm');
        var algorithmOutputStore = algorithmCombo.getStore();

        var recIndex = algorithmOutputStore.find('algorithmId', algorithmCombo.getValue());
        if (recIndex < 0) {
            return;
        }
        var record = algorithmOutputStore.getAt(recIndex);
        var versionCombo = this.down('#version');
        var versionStore = versionCombo.getStore();

        if (record) {
            if (record.get('algorithmId') === auscope.layer.analytic.form.NVCLAnalyticsForm.NON_STANDARD_ALGORITHM_ID) {
                this._setupNonStandardAlgorithm(record, disableClassifications);
            } else {
                this._setupStandardAlgorithm(record, disableClassifications);
            }
        }
    },

    _onAlgorithmOutputSelect: function(combo, record) {
        var versionCombo = this.down('#version');
        versionCombo.setValue(null);

        var versionStore = versionCombo.getStore();
        versionStore.removeAll();

        versionStore.loadData(record.get('versions'));
        if (versionStore.getCount()) {
            var highestVersion = versionStore.getAt(0);
            versionCombo.setValue(highestVersion.get('algorithmOutputId'));
        }

        this._setupAlgorithm();
    },

    _onVersionChange: function(combo, newValue, oldValue) {
        if (!Ext.isEmpty(newValue)) {
            var classCombo = this.down('#classification-combo');
            var classText = this.down('#classification-text');
            classCombo.setValue(null);
            classText.setValue('');

            var classStore = classCombo.getStore();
            classStore.removeAll();
            classStore.getProxy().setExtraParams({
                serviceUrl: auscope.layer.analytic.form.NVCLAnalyticsForm.NVCL_DATA_SERVICE,
                algorithmOutputId: newValue
            });
            classStore.load();
        }
    },

    _saveUserEmail: function(email) {
        if (window.localStorage) {
            localStorage.setItem('auscope-nvcl-analytics-email', email);
        }
    },

    _recoverUserEmail: function() {
        if (window.localStorage) {
            return localStorage.getItem('auscope-nvcl-analytics-email');
        } else {
            return '';
        }
    },

    /**
     * Shows the status popup for the given user email (ignores any entered email).
     *
     * If jobId is set, that particular jobID will be highlighted in the status popup.
     */
    showStatusPopup: function(jobEmail, jobId) {
        this._onStatus(jobEmail, jobId);
    },

    _onStatus: function(jobEmail, jobId) {
        var params = {};
        if (Ext.isEmpty(jobEmail)) {
            var formPanel = this.down('form');
            var emailField = formPanel.down('#email');

            if (!emailField.isValid()) {
                return;
            }

            var email = emailField.getValue();
            this._saveUserEmail(email);
            params.email = email;
        } else {
            params.email = jobEmail;
        }

        var mask = new Ext.LoadMask({
            msg: 'Checking status...',
            target: this
        });
        mask.show();
        portal.util.Ajax.request({
            url: 'checkNVCLProcessingJob.do',
            params: params,
            scope: this,
            callback: function(success, data, message) {
                mask.hide();

                if (!success) {
                    Ext.Msg.alert('Error', 'Unable to check your processing jobs at this time. Please try again later.');
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
                    width: 500,
                    height: 200,
                    items: [{
                        xtype: 'analyticaljobstatuspanel',
                        statuses: data,
                        listeners: {
                            statusselect: Ext.bind(function(panel, rec) {
                                this._loadFilterForJob(rec.get('jobId'), rec.get('jobDescription'));
                                popup.close();
                                this.close();
                            }, this),

                            statusdownload: Ext.bind(function(panel, rec) {
                                this._downloadJobResults(rec.get('jobId'));
                            }, this),

                            afterrender: function(panel) {
                                if (jobId) {
                                    var recIdx = panel.getStore().find('jobId', jobId);
                                    if (recIdx >= 0) {
                                        var record = panel.getStore().getAt(recIdx);
                                        panel.getSelectionModel().select(record);
                                    }
                                }
                            }
                        }
                    }]
                });
                popup.show();
            }
        });
    },

    _downloadJobResults: function(jobId) {
        portal.util.FileDownloader.downloadFile('downloadNVCLProcessingResults.do', {
            jobId: jobId
        });
    },

    _loadFilterForJob: function(jobId, jobName) {
        this.layer.get('filterer').setParameters({
            analyticsJobId: jobId,
            nvclJobName: jobName
        }, false);
        //this.layer.get('filterForm').readFromFilterer(this.layer.get('filterer'));
        portal.map.openlayers.ActiveLayerManager.addLayer(this.layer);
    },

    _onSubmit: function() {
        var formPanel = this.down('form');
        if (!formPanel.isValid()) {
            return;
        }

        //Build up our parameters for job submission
        var params = {};
        if (this.layer) {
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

        this._saveUserEmail(params.email);

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