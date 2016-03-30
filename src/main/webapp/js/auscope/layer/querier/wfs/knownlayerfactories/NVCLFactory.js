/**
 * A factory for parsing WFS features from the National Virtual Core Library known layer.
 */
Ext.define('auscope.layer.querier.wfs.knownlayerfactories.NVCLFactory', {
    extend : 'portal.layer.querier.wfs.knownlayerfactories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only the NVCL known layer
     */
    supportsKnownLayer : function(knownLayer) {
        return knownLayer.getId() === 'nvcl-borehole';
    },


    /**
     * Shows the NVCL dataset display window for the given dataset (belonging to the selected known layer feature)
     *
     * Note - AUS-2055 brought about the removal of the requirement for an open proxy - work still needs to be done
     *        to break this into more manageable pieces because the code is still very much a copy from the original source.
     */
    showDetailsWindow : function(datasetId, datasetName, omUrl, nvclDataServiceUrl,nvclDownloadServiceUrl, featureId, parentKnownLayer, parentOnlineResource,startDepth,endDepth,scope) {

        var me = scope;
        //We create an instance of our popup window but don't show it immediately
        //We need to dynamically add to its contents
        var win = Ext.create('Ext.Window', {
            border      : true,
            layout      : 'fit',
            resizable   : false,
            modal       : true,
            plain       : false,
            title       : 'Borehole Id: ' + datasetName,
            height      : 600,
            width       : 850,
            items:[{
                xtype           : 'tabpanel',
                activeItem      : 0,
                enableTabScroll : true,
                buttonAlign     : 'center',
                items           : []
            }]
        });
        var tp = win.items.getAt(0); // store a reference to our tab panel for easy access

        //This store is for holding log info
        var logStore = Ext.create('Ext.data.Store', {
            model : 'auscope.knownlayer.nvcl.Log',
            proxy : {
                type : 'ajax',
                url : 'getNVCL2_0_Logs.do',
                extraParams : {
                    serviceUrl : nvclDataServiceUrl,
                    datasetId : datasetId,
                    mosaicService : true
                },
                reader : {
                    type : 'json',
                    rootProperty : 'data',
                    successProperty : 'success',
                    messageProperty : 'msg'
                }
            }
        });

        //Load our log store, populate our window when it finishes loading
        logStore.load({
            callback : function(recs, options, success) {
                //Find our 'mosaic' and 'imagery' record
                var trayThumbNail = null;

                for (var i = 0; i < recs.length; i++) {
                    switch(recs[i].get('logName')) {
                    case 'Tray Thumbnail Images':
                        trayThumbNail = recs[i];
                        break;
                    }
                }

                //Add our thumbnail tab (if available)
                if (trayThumbNail !== null) {
                    tp.add({
                        title : 'Images',
                        tooltip : 'Display mosaic images of available core trays. Click on a thumbnail to open the full tray image.',
                        layout : 'fit',
                        html: '<iframe id="nvcl-iframe-nav" style="overflow:auto;width:100%;height:100%;" frameborder="0" src="' +
                              'getNVCL2_0_Thumbnail.do?serviceUrl=' + escape(nvclDataServiceUrl) + '&width=3&dataSetId=' + datasetId + '&logId=' + trayThumbNail.get('logId') +
                              '"></iframe>',
                        listeners : {
                            afterrender : function(comp, eOpts){
                                var myMask = new Ext.LoadMask({
                                    msg    : 'Downloading Images...',
                                    target : comp
                                });                                                           
                                myMask.show();
                                var el = Ext.get('nvcl-iframe-nav');
                                el.on('load',function(){
                                    myMask.hide();
                                })

                            }
                        }
                    });
                }



                //Add our scalars tab (this always exists
                var scalarGrid = Ext.create('Ext.grid.Panel', {
                    //This store will be loaded when this component renders
                    store : Ext.create('Ext.data.Store', {
                        autoLoad : true,
                        sorters: [{ property:'logName', direction:'ASC'}],
                        model : 'auscope.knownlayer.nvcl.Log',
                        proxy : {
                            type : 'ajax',
                            url : 'getNVCLLogs.do',
                            extraParams : {
                                serviceUrl : nvclDataServiceUrl,
                                datasetId : datasetId
                            },
                            reader : {
                                type : 'json',
                                rootProperty : 'data',
                                successProperty : 'success',
                                messageProperty : 'msg'
                            }
                        }
                    }),
                    selModel : Ext.create('Ext.selection.CheckboxModel', {}),
                    id : 'nvcl-scalar-grid',
                    loadMask : true,
                    plugins : [{
                        ptype: 'celltips'
                    }],
                    columns : [{
                        id: 'log-name-col',
                        header: 'Scalar',
                        flex: 1,
                        dataIndex: 'logName',
                        sortable: true,
                        hasTip : true,
                        tipRenderer : function(value, record, column, tip) {
                            //Load our vocab string asynchronously
                        	var logName = record.get('logName');
                            var vocabsQuery = 'getScalar.do?repository=nvcl-scalars&label=' + escape(logName);
                            Ext.Ajax.request({
                                url : vocabsQuery,
                                logName : logName,
                                success : function(pData, options) {
                                    var pResponseCode = pData.status;
                                    var updateTipText = function(tip, text) {
                                        var tipBody = tip.body.down('.x-autocontainer-innerCt');
                                        if (tipBody) {
                                            tipBody.setHtml(text);
                                        }
                                        tip.doLayout();
                                    };
                                    if(pResponseCode !== 200) {
                                        updateTipText(tip, 'ERROR: ' + pResponseCode);
                                        return;
                                    }

                                    var response = Ext.JSON.decode(pData.responseText);
                                    if (!response.success) {
                                        updateTipText(tip, 'ERROR: server returned error');
                                        return;
                                    }

                                    //Update tool tip
                                    if (response.data.definition && response.data.definition.length > 0) {
                                        updateTipText(tip, response.data.definition);
                                    } else if (response.data.scopeNote && response.data.scopeNote.length > 0) {
                                        updateTipText(tip, response.data.scopeNote);
                                    } else {
                                    	updateTipText(tip, logName);
                                    }
                                }
                           });
                           return 'Loading...';
                       }
                    }]
                });

                // Scalars Tab
                tp.add({
                    title : 'Scalars',
                    layout : 'fit',
                    tooltip : 'A scalar refers to any set of imported or calculated values associated with the loaded spectral data.',
                    border : false,
                    items : {
                        // Bounding form
                        id :'scalarsForm',
                        xtype :'form',
                        layout :'column',
                        frame : true,

                        // these are applied to columns
                        defaults:{
                            columnWidth : 0.5,
                            layout      : 'anchor',
                            hideLabels  : true,
                            border      : false,
                            bodyStyle   : 'padding:10px',
                            labelWidth  : 100
                        },

                        // Columns
                        items:[{ // column 1
                            // these are applied to fieldsets

                            // fieldsets
                            items:[{
                                xtype       : 'fieldset',
                                title       : 'List of Scalars',
                                anchor      : '100%',
                                //autoHeight  : true,
                                height      : 500,

                                // these are applied to fields
                                defaults    : {anchor:'-5', allowBlank:false},

                                // fields
                                layout      : 'fit',
                                items       : [scalarGrid]
                            }]
                        },{ // column 2
                            // these are applied to fieldsets
                            defaults:{
                                xtype: 'fieldset',
                                layout: 'form',
                                anchor: '100%',
                                autoHeight: true,
                                paddingRight: '10px'
                            },

                            // fieldsets
                            items:[{
                                title       : 'Hint',
                                defaultType : 'textfield',
                                // fields
                                items:[{
                                    xtype  : 'box',
                                    id     : 'scalarFormHint',
                                    autoEl : {
                                        tag  : 'div',
                                        html : 'Select a scalar(s) from the "Scalar List" table on the left and then click "Plot" button.<br><br>Leave the default depth values for the entire depth.'
                                    }
                                }]
                            },{
                                title       : 'Options',
                                defaultType : 'textfield',

                                // these are applied to fields
                                //,defaults:{anchor:'-20', allowBlank:false}
                                bodyStyle   : 'padding:0 0 0 45px',

                                // fields
                                items:[{
                                    xtype       : 'numberfield',
                                    fieldLabel  : 'Start Depth (m)',
                                    name        : 'startDepth',
                                    minValue    : 1,
                                    value       : startDepth,
                                    accelerate  : true
                                },{
                                    xtype       : 'numberfield',
                                    fieldLabel  : 'End Depth (m)',
                                    name        : 'endDepth',
                                    minValue    : 1,
                                    value       : endDepth,
                                    accelerate  : true
                                },{
                                    xtype                   : 'numberfield',
                                    fieldLabel              : 'Interval (m)',
                                    name                    : 'samplingInterval',
                                    minValue                : 0,
                                    value                   : 2.0,
                                    allowDecimals           : true,
                                    decimalPrecision        : 1,
                                    step                    : 0.1,
                                    //alternateIncrementValue : 2.1,
                                    accelerate              : true
                                }]
                            },{
                                xtype       : 'fieldset',
                                title       : 'Graph Options',
                                padding : '0 0 0 0',
                                border : false,
                                layout: {
                                    type: 'hbox',
                                    pack: 'start',
                                    align: 'stretch'
                                },
                                autoHeight  : true,
                                items       :[{
                                    xtype  : 'fieldset',
                                    title  : 'Graph Type',
                                    flex   : 3,
                                    items :[{
                                        xtype   : 'radiogroup',
                                        flex    : 2,
                                        id      : 'ts1',
                                        columns : 1,
                                        items   : [
                                            {boxLabel: 'Stacked Bar Chart', name: 'graphType', inputValue: 1, checked: true},
                                            {boxLabel: 'Scattered Chart', name: 'graphType', inputValue: 2},
                                            {boxLabel: 'Line Chart', name: 'graphType', inputValue: 3}
                                        ]
                                    }]
                                }, {
                                    xtype: 'fieldset',
                                    title : 'Graph Display Option',
                                    flex: 2,
                                    items : [{
                                        xtype     : 'checkbox',
                                        flex      : 1,
                                        checked   : true,
                                        boxLabel  : 'Show Legend',
                                        name      : 'legend',
                                        inputValue: '1',
                                        itemId    : 'legendcheckbox1'
                                    }]
                                }]

                            }],
                            buttons:[{
                                text: 'Plot',
                                handler: function() {
                                    var sHtml = '';
                                    var item_count = scalarGrid.getSelectionModel().getCount();
                                    var scalarForm = Ext.getCmp('scalarsForm').getForm();
                                    var width = 300;
                                    var height = 600;

                                    if (item_count > 0) {
                                        var s = scalarGrid.getSelectionModel().getSelection();
                                        for(var i = 0, len = s.length; i < len; i++){
                                            sHtml +='<img src="';
                                            sHtml += 'getNVCLPlotScalar.do?logId=';
                                            sHtml += s[i].get('logId');
                                            sHtml += '&' + scalarForm.getValues(true);
                                            sHtml += '&width=' + width;
                                            sHtml += '&height=' + height;
                                            sHtml += '&serviceUrl=';
                                            sHtml += escape(nvclDataServiceUrl);
                                            sHtml += '" ';
                                            sHtml += 'onload="Ext.getCmp(\'plWindow\').doLayout();"';
                                            sHtml += '/>';
                                        }

                                        var winPlot = Ext.create('Ext.Window', {
                                            autoScroll  : true,
                                            border      : true,
                                            html        : sHtml,
                                            id          : 'plWindow',
                                            layout      : 'fit',
                                            maximizable : true,
                                            modal       : true,
                                            title       : 'Plot: ',
                                            autoHeight  : true,
                                            autoWidth   : true,
                                            x           : 10,
                                            y           : 10
                                          });

                                        winPlot.show();
                                    } else if (item_count === 0){
                                        Ext.Msg.show({
                                            title:'Hint',
                                            msg: 'You need to select a scalar(s) from the "List of Scalars" table to plot.',
                                            buttons: Ext.Msg.OK
                                        });
                                    }
                                }
                            },{
                                text : 'Download',
                                xtype : 'button',
                                iconCls : 'download',
                                handler : function() {

                                    if(scalarGrid.getSelectionModel().getCount()===0){
                                        Ext.Msg.show({
                                            title:'Hint',
                                            msg: 'You need to select a scalar(s) from the "List of Scalars" table to download the csv.',
                                            buttons: Ext.Msg.OK
                                        });
                                    }else{
                                        var datasetIds = scalarGrid.getSelectionModel().getSelection();
                                        var logIds = [];
                                        for(var i=0;i<datasetIds.length;i++){
                                            logIds[i] =  datasetIds[i].get('logId');
                                        }
                                        portal.util.FileDownloader.downloadFile('getNVCL2_0_CSVDownload.do', {
                                            serviceUrl : nvclDataServiceUrl,
                                            logIds : logIds
                                        });
                                    }
                                }
                            }]
                        }]
                    }
                });

                var downloadPanel = me.getDownloadPanel(datasetId,
                        datasetName,
                        omUrl,
                        nvclDownloadServiceUrl,
                        featureId,
                        parentKnownLayer,
                        parentOnlineResource);


                tp.add({
                    title : 'Download '+ datasetName,
                    tooltip : 'Download spectral data and more.',
                    layout : 'fit',
                    border : false,
                    items : [downloadPanel]
                })

                win.show();
                win.center();

            }
        });
    },

    /**
     * Shows the NVCL dataset download window for the given dataset (belonging to the selected known layer feature)
     *
     * Note - AUS-2055 brought about the removal of the requirement for an open proxy - work still needs to be done
     *        to break this into more manageable pieces because the code is still very much a copy from the original source.
     */
    getDownloadPanel : function(datasetId, datasetName, omUrl, nvclDownloadServiceUrl, featureId, parentKnownLayer, parentOnlineResource) {

        // Dataset download window
        var panel = Ext.create('Ext.panel.Panel', {
            border          : true,
            layout          : 'fit',
            resizable       : false,
            modal           : true,
            height          : 400,
            width           : 500,
            items:[{
                // Bounding form
                id      : 'nvclDownloadFrm',
                xtype   : 'form',
                frame   : true,

                // fieldsets
                items   :[{
                    xtype       : 'fieldset',
                    layout      : 'anchor',
                    title       : 'Hint',

                    // fields
                    items:[{
                        xtype  : 'box',
                        autoEl : {
                            tag  : 'div',
                            html : 'This data is best viewed in TSG Viewer. Freely available from <a target="_blank" href="http://www.thespectralgeologist.com/tsg_viewer.htm">here</a>.'
                        }
                    }]
                },{
                    xtype   : 'hidden',
                    name    : 'datasetId', //name of the field sent to the server
                    value   : datasetId  //value of the field
                },{
                    xtype           : 'fieldset',
                    id              : 'tsgFldSet',
                    title           : 'Spectral Geologist (TSG) data file',
                    checkboxName    : 'tsg',
                    checkboxToggle  : true,
                    bodyStyle       : 'padding: 0 0 0 50px',
                    items:[{
                        xtype           : 'textfield',
                        id              : 'tsgEmailAddress',
                        fieldLabel      : 'Email Address*',
                        value           : 'Your.Name@email.com.au',
                        name            : 'email',
                        selectOnFocus   : true,
                        allowBlank      : false,
                        anchor          : '-50'
                    },{
                        xtype: 'checkboxgroup',
                        fieldLabel: 'Options',
                        columns: [100,100],
                        vertical: true,
                        items: [
                            {boxLabel: 'linescan', name: 'lineScan', inputValue: 'true', uncheckedValue: 'false', checked: true}
                        ]
                    },{
                        xtype : 'toolbar',
                        border : false,
                        layout : {
                            type : 'hbox',
                            pack : 'end'
                        },
                        items : [{
                            xtype : 'button',
                            text: 'Check Status',
                            iconCls : 'info',
                            handler: function() {
                                var sEmail = Ext.getCmp('tsgEmailAddress').getValue();
                                if (sEmail === 'Your.Name@email.com.au' || sEmail === '') {
                                    Ext.MessageBox.alert('Unable to submit request...','Please Enter valid Email Address');
                                    Ext.getCmp('tsgEmailAddress').markInvalid();
                                    return;
                                } else {
                                    Ext.getCmp('omEmailAddress').setValue(sEmail);
                                    var winStat = new Ext.Window({
                                        autoScroll  : true,
                                        border      : true,
                                        loader: {
                                            url: Ext.util.Format.format('getNVCLTSGDownloadStatus.do?email={0}&serviceUrl={1}', escape(sEmail), escape(nvclDownloadServiceUrl)),
                                            autoLoad: true
                                        },
                                        id          : 'dwldStatusWindow',
                                        layout      : 'fit',
                                        modal       : true,
                                        plain       : false,
                                        title       : 'Download status: ',
                                        height      : 400,
                                        width       : 1200
                                      });

                                    winStat.on('show',function(){
                                        winStat.center();
                                    });
                                    winStat.show();
                                }
                            }
                        },{
                            xtype : 'button',
                            iconCls : 'download',
                            text: 'Download',
                            handler: function(button) {
                                var sUrl = '';
                                var sEmail = Ext.getCmp('tsgEmailAddress').getValue();
                                if (sEmail == 'Your.Name@email.com.au' || sEmail == '') {
                                    Ext.MessageBox.alert('Unable to submit request...','Please Enter valid Email Address');
                                    Ext.getCmp('tsgEmailAddress').markInvalid();
                                    return;
                                } else {

                                    portal.util.GoogleAnalytic.trackevent('NVCL:TSG DOWNLOAD', 'Download:' + nvclDownloadServiceUrl, 'datasetid:' + datasetId);
                                    portal.util.GoogleAnalytic.trackpage('/tsg/getNVCLTSGDownload.do');

                                    Ext.getCmp('omEmailAddress').setValue(sEmail);
                                    var downloadForm = Ext.getCmp('nvclDownloadFrm').getForm();
                                    sUrl += '<iframe id="nav1" style="overflow:auto;width:100%;height:100%;" frameborder="0" src="';
                                    sUrl += 'getNVCLTSGDownload.do?';
                                    sUrl += downloadForm.getValues(true);
                                    sUrl += '&serviceUrl=' + escape(nvclDownloadServiceUrl);
                                    sUrl += '"></iframe>';

                                    var winDwld = new Ext.Window({
                                        autoScroll  : true,
                                        border      : true,
                                        html        : sUrl,
                                        id          : 'dwldWindow',
                                        layout      : 'fit',
                                        maximizable : true,
                                        modal       : true,
                                        plain       : false,
                                        title       : 'Download confirmation: ',
                                        height      : 400,
                                        width       : 840
                                      });

                                    winDwld.on('show',function(){
                                        winDwld.center();
                                    });
                                    winDwld.show();
                                }
                            }
                        }]
                    }],
                    listeners: {
                        'expand' : {
                            scope: this,
                            fn : function(panel, anim) {
                                //Ext.getCmp('csvFldSet').collapse();
                                Ext.getCmp('omFldSet').collapse();
                            }
                        }
                    }
                },{
                    xtype           : 'fieldset',
                    id              : 'omFldSet',
                    title           : 'Observations and Measurements',
                    checkboxName    : 'om',
                    checkboxToggle  : true,
                    collapsed       : true,
                    bodyStyle       : 'padding: 0 0 0 50px',
                    items:[ {
                        id            : 'omEmailAddress',
                        xtype         : 'textfield',
                        fieldLabel    : 'Email Address*',
                        value         : 'Your.Name@email.com.au',
                        name          : 'email',
                        selectOnFocus : true,
                        allowBlank    : false,
                        anchor        : '-50'
                    },{
                        xtype : 'toolbar',
                        border : false,
                        layout : {
                            type : 'hbox',
                            pack : 'end'
                        },
                        items : [{
                            xtype : 'button',
                            text    : 'Check Status',
                            iconCls : 'info',
                            handler : function() {
                                var sEmail = Ext.getCmp('omEmailAddress').getValue();
                                if (sEmail === 'Your.Name@email.com.au' || sEmail === '') {
                                    Ext.MessageBox.alert('Unable to submit request...','Please Enter valid Email Address');
                                    Ext.getCmp('omEmailAddress').markInvalid();
                                    return;
                                } else {
                                    Ext.getCmp('tsgEmailAddress').setValue(sEmail);
                                    var winStat = Ext.create('Ext.Window' , {
                                        autoScroll  : true,
                                        border      : true,                                     
                                        loader: {
                                            url: Ext.util.Format.format('getNVCLWFSDownloadStatus.do?email={0}&serviceUrl={1}', escape(sEmail), escape(nvclDownloadServiceUrl)),
                                            autoLoad: true
                                        },
                                        id          : 'omDwldStatusWindow',
                                        layout      : 'fit',
                                        modal       : true,
                                        plain       : false,
                                        title       : 'Download status: ',
                                        height      : 400,
                                        width       : 1200
                                      });

                                    winStat.on('show',function(){
                                        winStat.center();
                                    });
                                    winStat.show();
                                }
                            }
                        },{
                            xtype : 'button',
                            iconCls : 'download',
                            text : 'Download',
                            handler: function(button) {
                                var sUrl = '';
                                var sEmail = Ext.getCmp('omEmailAddress').getValue();
                                if (sEmail === 'Your.Name@email.com.au' || sEmail === '') {
                                    Ext.MessageBox.alert('Unable to submit request...','Please Enter valid Email Address');
                                    Ext.getCmp('omEmailAddress').markInvalid();
                                    return;
                                } else {

                                    portal.util.GoogleAnalytic.trackevent('NVCL:O&M DOWNLOAD', 'Download:' + nvclDownloadServiceUrl, 'datasetid:' + datasetId);
                                    portal.util.GoogleAnalytic.trackpage('/OM/getNVCLWFSDownload.do');

                                    Ext.getCmp('tsgEmailAddress').setValue(sEmail);
                                    var downloadForm = Ext.getCmp('nvclDownloadFrm').getForm();
                                    sUrl += '<iframe id="nav1" style="overflow:auto;width:100%;height:100%;" frameborder="0" src="';
                                    sUrl += 'getNVCLWFSDownload.do?';
                                    sUrl += 'boreholeId=sa.samplingfeaturecollection.' + datasetId;
                                    sUrl += '&omUrl=' + escape(omUrl);
                                    sUrl += '&serviceUrl=' + escape(nvclDownloadServiceUrl);
                                    sUrl += '&typeName=sa:SamplingFeatureCollection';
                                    sUrl += '&email=' + escape(sEmail);
                                    sUrl += '"></iframe>';
                                    //alert(sUrl);

                                    var winDwld = Ext.create('Ext.Window', {
                                        autoScroll  : true,
                                        border      : true,
                                        //autoLoad  : sUrl,
                                        html        : sUrl,
                                        id          : 'dwldWindow',
                                        layout      : 'fit',
                                        maximizable : true,
                                        modal       : true,
                                        plain       : false,
                                        title       : 'Download confirmation: ',
                                        height      : 400,
                                        width       : 840
                                      });

                                    winDwld.on('show',function(){
                                        winDwld.center();
                                    });
                                    winDwld.show();
                                }
                            }
                        }]
                    }],
                    listeners: {
                        'expand' : {
                            scope: this,
                            fn : function(panel) {
                                //Ext.getCmp('csvFldSet').collapse();
                                Ext.getCmp('tsgFldSet').collapse();
                            }
                        }
                    }
                }]
            }]
        });

        return panel;
        //win.show();
    },

    _getNVCLDataServiceUrl : function(parentOnlineResource){
        //NVCL URL's are discovered by doing some 'tricky' URL rewriting
        var baseUrl = this.getBaseUrl(parentOnlineResource.get('url'));
        if (baseUrl.indexOf('pir.sa.gov.au') >= 0) {
            baseUrl += '/nvcl'; //AUS-2144 - PIRSA specific fix
        }

        var nvclDataServiceUrl = baseUrl + '/NVCLDataServices/';
        return nvclDataServiceUrl;
        var nvclDownloadServiceUrl = baseUrl + '/NVCLDownloadServices/';
    },

    _getNVCLDownloadServiceUrl : function(parentOnlineResource){
        //NVCL URL's are discovered by doing some 'tricky' URL rewriting
        var baseUrl = this.getBaseUrl(parentOnlineResource.get('url'));
        if (baseUrl.indexOf('pir.sa.gov.au') >= 0) {
            baseUrl += '/nvcl'; //AUS-2144 - PIRSA specific fix
        }
        var nvclDownloadServiceUrl = baseUrl + '/NVCLDownloadServices/';
        return nvclDownloadServiceUrl;
    },

    /**
     * Overrides abstract parseKnownLayerFeature
     */
    parseKnownLayerFeature : function(featureId, parentKnownLayer, parentOnlineResource) {
        var me = this;

        var nvclDataServiceUrl =  this._getNVCLDataServiceUrl(parentOnlineResource);
        var nvclDownloadServiceUrl = this._getNVCLDownloadServiceUrl(parentOnlineResource);

        //VT: This is absolutely a last resort to solving this problem without a massive overhaul of the code.
        //VT: A synchronous ajax request to the server to check for dataset. If none are found, return null
        //VT: so that the tab will not even be rendered.
        //VT: https://jira.csiro.au/browse/AUS-2487
        var request = ((window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
        request.open("GET", ('getNVCLDatasets.do?serviceUrl=' + escape(nvclDataServiceUrl) + '&holeIdentifier=' + featureId.replace('gsml.borehole.', '')), false); //<-- false makes it a synchonous request!
        request.send(null);
        var responseObject=Ext.decode(request.responseText);
        if(!responseObject.data || responseObject.data.length==0){
            return null;
        }


        return Ext.create('portal.layer.querier.BaseComponent',{
            tabTitle : featureId + ':Spectral Datasets',
            header : false,
            layout : 'fit',
            //We only have a single child which is our grid
            items : [{
                xtype : 'grid',
                border : false,
                title : 'Spectral Datasets',
                //This is for holding our dataset information
                store : Ext.create('Ext.data.Store', {
                    model : 'auscope.knownlayer.nvcl.Dataset',
                    proxy : {
                        type : 'ajax',
                        url : 'getNVCLDatasets.do',
                        extraParams : {
                            serviceUrl : nvclDataServiceUrl,
                            holeIdentifier : featureId.replace('gsml.borehole.', '')
                        },
                        reader : {
                            idProperty : 'datasetId',
                            rootProperty : 'data',
                            successProperty : 'success',
                            messageProperty : 'msg'
                        }
                    }
                }),
                plugins : [{
                    ptype : 'selectablegrid'
                }],
                hideHeaders : true,
                //Show just the dataset names
                columns : [{
                    header : 'Name',
                    dataIndex : 'datasetName',
                    flex : 1,
                    renderer : function(value, p, record) {
                        return Ext.DomHelper.markup({
                            tag : 'div',
                            children : [{
                                tag : 'b',
                                html : value
                            },{
                                tag : 'br'
                            },{
                                tag : 'span',
                                style : {
                                    color : '#555'
                                },
                                html : record.get('datasetId')
                            }]
                        });
                    }
                }],
                listeners : {
                    //When our grid is rendered - load the datastore and select the first row
                    afterrender : function(grid) {
                        grid.getStore().load({
                            callback : function() {
                                var sm = grid.getSelectionModel();
                                if (sm && grid.getStore().getCount() > 0) {
                                    sm.select(0, false);
                                };

                                if(grid.getStore().getCount()==1){
                                    me._handleBoreholeDetailDisplay(grid,parentOnlineResource,featureId,parentKnownLayer);
                                }
                            }
                        });
                    }
                },
                buttonAlign : 'right',
                buttons : [{
                    xtype : 'button',
                    iconCls : 'info',
                    text : 'Images and Scalars',
                    handler : function(button, e) {
                        var grid = button.ownerCt.ownerCt;
                        me._handleBoreholeDetailDisplay(grid,parentOnlineResource,featureId,parentKnownLayer);


                    }
                }]
            }]
        });
    },

    _handleBoreholeDetailDisplay : function(grid,parentOnlineResource,featureId,parentKnownLayer){

        var nvclDataServiceUrl =  this._getNVCLDataServiceUrl(parentOnlineResource);
        var nvclDownloadServiceUrl = this._getNVCLDownloadServiceUrl(parentOnlineResource);

        var parent = grid.ownerCt.ownerCt.ownerCt;
        var startDepth = parent.query('displayfield#boreholeStartDepth');
        if(startDepth && startDepth.length > 0){
            startDepth = Math.floor(startDepth[0].getValue());
        }else{
            startDepth = 1;
        }
        var endDepth = parent.query('displayfield#boreholeEndDepth');
        if(endDepth && endDepth.length > 0){
            endDepth = Math.ceil(endDepth[0].getValue());
        }else{
            endDepth = 99999;
        }

        var selection = grid.getSelectionModel().getSelection();
        var selectedRec = (selection && (selection.length > 0)) ? selection[0] : null;
        if (selectedRec) {
            this.showDetailsWindow(selectedRec.get('datasetId'),
                    selectedRec.get('datasetName'),
                    selectedRec.get('omUrl'),
                    nvclDataServiceUrl,
                    nvclDownloadServiceUrl,
                    featureId,
                    parentKnownLayer,
                    parentOnlineResource,
                    startDepth,
                    endDepth,
                    this);
        }
    }
});