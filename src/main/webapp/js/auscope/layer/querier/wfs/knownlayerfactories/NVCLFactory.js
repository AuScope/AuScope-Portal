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
     * Routine to start up an interactive plot where you the user can specify the kind of graph, apply smoothing etc.
     * Uses Rickshaw library.
     */
    genericPlot : function(series, xaxis_name, yaxis_names, yaxis_keys, metric_colours) {
       var splot = Ext.create('auscope.chart.rickshawChart',{
           graphWidth : 600, // These values are used to set the size of the graph
           graphHeight : 300
       });

       // Create an Ext window to house the chart (panel)
       var win = Ext.create('Ext.window.Window', {
           defaults    : { autoScroll:true }, // Enable scrollbars for underlying panel, if it is bigger than the window
           border      : true,
           items       : splot,
           id          : 'rkswWindow',
           layout      : 'fit',
           maximizable : true,
           modal       : true,
           title       : 'NVCL Interactive Plot: ',
           resizable   : true,
           height  : 700, // Height and width of window the houses the graph
           width   : 1300,
           x           : 10,
           y           : 10
       });
       win.show();

       splot.mask("Rendering...");
       splot.plot(series, xaxis_name, yaxis_names, yaxis_keys, metric_colours);
       splot.maskClear();

       this.on('close',function(){
           win.close();
       });


    },

    /**
     * Shows the NVCL dataset display window for the given dataset (belonging to the selected known layer feature)
     *
     * Note - AUS-2055 brought about the removal of the requirement for an open proxy - work still needs to be done
     *        to break this into more manageable pieces because the code is still very much a copy from the original source.
     */
    showDetailsWindow : function(datasetId, datasetName, omUrl, nvclDataServiceUrl,nvclDownloadServiceUrl, featureId, parentKnownLayer, parentOnlineResource,startDepth,endDepth,scope) {

        var me = scope;
        var this_ptr = this;
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



                //Add our scalars tab (this always exists)
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
                            portal.util.Ajax.request({
                                url : vocabsQuery,
                                logName : logName,
                                callback : function(success, data, message) {
                                    var updateTipText = function(tip, text) {
                                        var tipBody = tip.body.down('.x-autocontainer-innerCt');
                                        if (tipBody) {
                                            tipBody.setHtml(text);
                                        }
                                        tip.doLayout();
                                    };

                                    if (!success) {
                                        updateTipText(tip, 'ERROR: ' + message);
                                        return;
                                    }

                                    //Update tool tip
                                    if (data.definition && data.definition.length > 0) {
                                        updateTipText(tip, data.definition);
                                    } else if (data.scopeNote && data.scopeNote.length > 0) {
                                        updateTipText(tip, data.scopeNote);
                                    } else {
                                        updateTipText(tip, logName);
                                    }
                                }
                           });
                           return 'Loading...';
                       }
                    }]
                });
                // End of scalarGrid 
               
                
                // Start of jobsGrid
                var jobsGrid = Ext.create('Ext.grid.Panel', {
                    
                //This store will be loaded when this component renders
                    store : Ext.create('Ext.data.Store', {
                        autoLoad : true,
                        sorters: [{ property:'jobId', direction:'ASC'}],
                        model : 'auscope.knownlayer.nvcl.JobName',
                        proxy : {
                            type : 'ajax',
                            url : 'getNVCL2_0_TsgJobsByBoreholeId.do',
                            extraParams : {
                                boreholeId : datasetName
                            },
                            reader : {
                                type : 'json',
                                rootProperty : 'data',
                                successProperty : 'success',
                                messageProperty : 'msg'
                            }
                        }
                    }),
                    selModel : Ext.create('Ext.selection.CheckboxModel', { /*mode: 'SINGLE'*/ }),
                    id : 'nvcl-jobs-grid',
                    loadMask : true,
                    plugins : [{
                        ptype: 'celltips'
                    }],
                    columns : [{
                        id: 'job-id-col',
                        header: 'Job Id',
                        flex: 1,
                        dataIndex: 'jobId',
                        sortable: true,
                        hasTip : true,
                        tipRenderer : function(value, record, column, tip) {
                            var jobName = record.get('jobName');
                            return "Job Name: "+jobName;
                        }
                    }]
                });    
                // End of jobsGrid

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
                            columnWidth : 0.3, 
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
                                items       : [scalarGrid],
                                autoscroll  : true
                            }]
                            
                        },{ // column 2
                            // these are applied to fieldsets
                            columnWidth : 0.4,
                            
                            // fieldsets
                            items:[{
                                xtype       : 'fieldset',
                                title       : 'List of Jobs',
                                anchor      : '100%',
                                //autoHeight  : true,
                                height      : 500,

                                // these are applied to fields
                                defaults    : {anchor:'-5', allowBlank:false},

                                // fields
                                layout      : 'fit',
                                items       : [jobsGrid],
                                autoscroll  : true
                            }]
                            
                        },{ // column 3
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
                                        html : 'Select scalar(s) or job(s) from the "Scalar List" or "Jobs List" table on the left and then click "Plot" or "Download" button.'
                                    }
                                }]
                            }],
                            buttons:[{
                                text : 'Plot',
                                xtype : 'button',
                                handler : function () {
                                    // Count up number of items selected
                                    var scalarCount = scalarGrid.getSelectionModel().getCount();
                                    var jobsCount = jobsGrid.getSelectionModel().getCount();
                                    // If nothing was selected
                                    if (scalarCount===0 && jobsCount===0) {
                                        Ext.Msg.show({
                                            title:'Hint',
                                            msg: 'You need to select scalar(s) or jobs(s) from the "List of Scalars" or "List of Jobs" tables to plot the data.',
                                            buttons: Ext.Msg.OK
                                        });
                                    } else if (scalarCount>0) {

                                        var logIds = [];
                                        var logNames = [];
                                        
                                        // Collect logids and matching log names
                                        var datasetIds = scalarGrid.getSelectionModel().getSelection();
                                        for (var i=0;i<datasetIds.length;i++) {
                                            logIds[i] =  datasetIds[i].get('logId');
                                            logNames[i] = datasetIds[i].get('logName');
                                        }
                                        
                                        // Ajax request: Request plot data from server
                                        Ext.Ajax.request({
                                            url: 'getNVCL2_0_JSONDataBinned.do',
                                            scope : this,
                                            timeout : 60000,
                                            params: {
                                                serviceUrl: nvclDataServiceUrl,
                                                logIds : logIds
                                            },
                                            callback : function(options, success, response) {
                                                // Do graph
                                                this_ptr._drawNVCLDataGraph(response, success, logIds, logNames);
                                            } // callback
                                        }); // ajax
                                          
                                    } else if (jobsCount>0) {
                                        var jobIds = [];
                                        
                                        // Collect logids and matching log names
                                        var jobObjs = jobsGrid.getSelectionModel().getSelection();
                                        for (var i=0;i<jobObjs.length;i++) {
                                            jobIds[i] =  jobObjs[i].get('jobId');
                                        }
                                        
                                        // Ajax request: Request plot data from server
                                        Ext.Ajax.request({
                                             url: 'getNVCL2_0_JobsScalarBinned.do',
                                             scope : this,
                                             timeout : 60000,
                                             params: {
                                                 boreholeId: datasetName,
                                                 jobIds : jobIds
                                             },
                                             callback : function(options, success, response) {
                                                 this_ptr._drawNVCLJobsGraph(response, success, {}, jobIds, jobIds);

                                             } // callback
                                          }); // ajax
                                          
                                    } // if
                                }
                            },{
                                text : 'Download',
                                xtype : 'button',
                                iconCls : 'download',
                                handler : function() {
                                    // Count up number of items selected
                                    var scalarCount = scalarGrid.getSelectionModel().getCount();
                                    var jobsCount = jobsGrid.getSelectionModel().getCount();
                                    if (jobsCount>0) {
                                        Ext.Msg.show({
                                            title:'Hint',
                                            msg: 'Sorry - downloading jobs data not supported yet!',
                                            buttons: Ext.Msg.OK
                                        });
                                    } else if (scalarCount===0) {
                                        Ext.Msg.show({
                                            title:'Hint',
                                            msg: 'You need to select a scalar(s) from the "List of Scalars" table to download the csv.',
                                            buttons: Ext.Msg.OK
                                        });
                                    } else {
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
    
    
    _drawNVCLJobsGraph : function (response, success, logid_colour_table, logIds, logNames) {
        if (success) {             
            // Once we have received the plot data, reformat it into (x,y) values and create colour table
            var metric_colours = new Object;
            var data_bin = new Object;
            var has_data = false;
            var yaxis_labels = new Object;
            var yaxis_keys = [];
            var re = new RegExp("[^A-Za-z0-9]","g");
            var jsonObj = Ext.JSON.decode(response.responseText);
            if ('success' in jsonObj && jsonObj.success==true && jsonObj.data.length>0 ) {
                jsonObj.data[0].binnedValues.forEach(function(bv) {
                    ["stringValues","numericValues"].forEach(function(dataType) {
                        if (bv.startDepths.length==bv[dataType].length && bv[dataType].length>0) {
                            var metric_name = bv.name;
                            if (!(metric_name in data_bin)) {
                                data_bin[metric_name] = new Object;
                            }
                                                                     
                            bv[dataType].forEach(function(val, idx, arr) {
                                                                         
                                // "stringValues" ==> units are called "Sample Count" and "numericValues" ==> "Meter Average"
                                if (dataType=="stringValues") {
                                                                     
                                    // Using entries(), make a name,value list, then use that to add to 'data_bin[metric_name]'
                                    d3.entries(val).forEach(function(meas) {                                                                                 
                                        var key=meas.key;
                                        if (!(key in metric_colours)) {
                                            var logIdIdx=999999;
                                            // First, find the logid for the metric returned from the graph data so that mineral colours can be found for graph data
                                            for (var j=0; j<logNames.length; j++) {
                                                // Unfortunately the metric names from the two services do not correspond exactly
                                                if (metric_name.replace(re,"").toUpperCase()==logNames[j].replace(re,"").toUpperCase()) {
                                                    logIdIdx = j;
                                                    break;
                                                }
                                            }
                                            // If mineral name can be found in 'logid_colour_table' put the appropriate colour in the 'metric_colours' table
                                            if ((logIds.length>logIdIdx)&&(logIds[logIdIdx] in logid_colour_table)&&(meas.key in logid_colour_table[logIds[logIdIdx]])) {
                                                    metric_colours[key] = logid_colour_table[logIds[logIdIdx]][meas.key];
                                            }
                                        }
                                        // Start to create graphing data
                                        if (!(key in data_bin[metric_name])) {
                                            data_bin[metric_name][key] = [];
                                            if (!(metric_name in yaxis_labels)) {
                                                yaxis_labels[metric_name] = "Sample Count";
                                                yaxis_keys.push(metric_name);
                                            }
                                        }
                                                                                 
                                        // Depth is 'x' and 'y' is our measured value 
                                        data_bin[metric_name][key].push({"x":parseFloat(bv.startDepths[idx]), "y":parseFloat(meas.value)});
                                        has_data=true;
                                 
                                    });
                                } else if (dataType=="numericValues") {
                                    // Start to create graphing data
                                    if (!(metric_name in data_bin[metric_name])) {
                                        data_bin[metric_name][metric_name] = [];
                                        if (!(metric_name in yaxis_labels)) {
                                            yaxis_labels[metric_name] = "Meter Average";
                                            yaxis_keys.push(metric_name);
                                        }
                                    }
                                    // Depth is 'x' and 'y' is our measured value 
                                    data_bin[metric_name][metric_name].push({"x":parseFloat(bv.startDepths[idx]), "y":parseFloat(val)});
                                    has_data=true;
                                } // if
                            }); // for each
                        } // if
                    }); // for each
                }); // for each
            } // if
            
            // Call 'genericPlot()'
            if (has_data) {
                this.genericPlot(data_bin, "Depth", yaxis_labels, yaxis_keys, metric_colours);
            } else {
                Ext.Msg.show({
                    title:'No data',
                    msg:'Sorry, the selected dataset has no data. Please select a different dataset',
                    buttons: Ext.Msg.OK 
                });
            }

        } else {
            Ext.Msg.show({
                title:'Error',
                msg:'Failed to load resources',
                buttons: Ext.Msg.OK
            });                                 
        } // if success
    },

    /* Converts BGR colour integer into hex RGB string for Javascript */ 
    _colourConvert : function (BGRColorNumber) {
        // String.format("#%1$02x%2$02x%3$02x", (BGRColorNumber & 255), (BGRColorNumber & 65280) >> 8, (BGRColorNumber >> 16));
        return "#"+Ext.String.leftPad((BGRColorNumber & 255).toString(16), 2, '0')+
                   Ext.String.leftPad(((BGRColorNumber & 65280) >> 8).toString(16), 2, '0')+
                   Ext.String.leftPad((BGRColorNumber >> 16).toString(16), 2, '0');
    },

    /* Given a log id ('bvLogId'), and 'logIds' and 'logNames' arrays, return logName for the log id */ 
    _findLogName : function (bvLogId, logIds, logNames) {
        var logIdx=0;
        while (logIdx<logIds.length) {
            if (logIds[logIdx]===bvLogId) return logNames[logIdx];
            logIdx++;
        }
        return "";
    },        

    _drawNVCLDataGraph : function (response, success, logIds, logNames) {
        var this_ptr = this;
        if (success) {             
            // Once we have received the plot data, reformat it into (x,y) values and create colour table
            var metric_colours = new Object;
            var data_bin = new Object;
            var has_data = false;
            var yaxis_labels = new Object;
            var yaxis_keys = [];
            var jsonObj = Ext.JSON.decode(response.responseText);
            // {"success":true, "data":[{ "logId":"logid_1", "stringValues":[{"roundedDepth":170.5,"classCount":1,"classText":"Alunite-K","colour":4351080},
            if ('success' in jsonObj && jsonObj.success==true) {
                var dataObj = Ext.JSON.decode(jsonObj.data);
                for (var i = 0; i < dataObj.length; i++){
                    var bv = dataObj[i];
                    ["stringValues","numericValues"].forEach(function(dataType) {
                        if (bv.hasOwnProperty(dataType) && bv[dataType].length>0) {
                            // Find the log name for our log id, this will be our 'metric_name'
                            var metric_name = this_ptr._findLogName(bv.logId, logIds, logNames);
                            if (metric_name.length > 0) {
                                if (!(metric_name in data_bin)) {
                                    data_bin[metric_name] = new Object;
                                }                      
                                bv[dataType].forEach(function(val) {
                                                                         
                                    // "stringValues" ==> units are called "Sample Count" and "numericValues" ==> "Meter Average"
                                    if (dataType=="stringValues") {
                                        var key=val.classText;
                                        // Use the supplied colour for each metric
                                        if (!(key in metric_colours)) {
                                            metric_colours[key] = this_ptr._colourConvert(val.colour);
                                        }                                            
                                        
                                        // Start to create graphing data
                                        if (!(key in data_bin[metric_name])) {
                                            data_bin[metric_name][key] = [];
                                            if (!(metric_name in yaxis_labels)) {
                                                yaxis_labels[metric_name] = "Sample Count";
                                                yaxis_keys.push(metric_name);
                                            }
                                        }
                                                                                 
                                        // Depth is 'x' and 'y' is our measured value 
                                        data_bin[metric_name][key].push({"x":parseFloat(val.roundedDepth), "y":parseFloat(val.classCount)});
                                        has_data=true;
                                 
                                    } else if (dataType=="numericValues") {
                                        // Start to create graphing data
                                        if (!(metric_name in data_bin[metric_name])) {
                                            data_bin[metric_name][metric_name] = [];
                                            if (!(metric_name in yaxis_labels)) {
                                                yaxis_labels[metric_name] = "Meter Average";
                                                yaxis_keys.push(metric_name);
                                            }
                                        }
                                        // Depth is 'x' and 'y' is our measured value 
                                        data_bin[metric_name][metric_name].push({"x":parseFloat(val.roundedDepth), "y":parseFloat(val.averageValue)});
                                        has_data=true;
                                    } // if
                                }); // for each
                            } // if 
                        } // if
                    }); // for each
                } // for
            } // if
            
            // Call 'genericPlot()'
            if (has_data) {
                console.log("plotting(data_bin, yaxis_labels, yaxis_keys, metric_colours =", data_bin, yaxis_labels, yaxis_keys, metric_colours);
                this.genericPlot(data_bin, "Depth", yaxis_labels, yaxis_keys, metric_colours);
            } else {
                Ext.Msg.show({
                    title:'No data',
                    msg:'Sorry, the selected dataset has no data. Please select a different dataset',
                    buttons: Ext.Msg.OK 
                });
            }

        } else {
            Ext.Msg.show({
                title:'Error',
                msg:'Failed to load resources',
                buttons: Ext.Msg.OK
            });                                 
        } // if success
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
