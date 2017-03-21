/**
 * A factory for parsing WFS features from the Pressure DB known layer.
 */
Ext.define('auscope.layer.querier.wfs.knownlayerfactories.PressureDBFactory', {
    extend : 'portal.layer.querier.wfs.knownlayerfactories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only the Pressure DB known layer
     */
    supportsKnownLayer : function(knownLayer) {
        return knownLayer.getId() === 'pressuredb-borehole';
    },

    retrieveAvailableOM : function(form, boreholeId, serviceUrl) {
        portal.util.Ajax.request({
            url : 'pressuredb-getAvailableOM.do',
            params : {
                wellID : boreholeId,
                serviceUrl : serviceUrl
            },
            scope : this,
            success : function(data) {
                var availableOmResponse = data[0];

                //Update our form based on our response
                var temperatureCbGroup = form.getComponent('temperature');
                var salinityCbGroup = form.getComponent('salinity');
                var pressureCbGroup = form.getComponent('pressure');

                temperatureCbGroup.getComponent('temperature').setDisabled(!availableOmResponse.temperatureT);

                salinityCbGroup.getComponent('total-dissolved-solids').setDisabled(!availableOmResponse.salinityTds);
                salinityCbGroup.getComponent('nacl-concentration').setDisabled(!availableOmResponse.salinityNacl);
                salinityCbGroup.getComponent('cl-concentration').setDisabled(!availableOmResponse.salinityCl);

                pressureCbGroup.getComponent('rock-formation-test').setDisabled(!availableOmResponse.pressureRft);
                pressureCbGroup.getComponent('drill-stem-test').setDisabled(!availableOmResponse.pressureDst);
                pressureCbGroup.getComponent('formation-interval-test-pressure').setDisabled(!availableOmResponse.pressureFitp);

                form.loadMask.hide();
            }
        });
    },
    /**
     * Routine to start up an interactive plot where you the user can specify the kind of graph, apply smoothing etc.
     * Uses Rickshaw library.
     */
    genericPlot : function(series, xaxis_name, yaxis_names, yaxis_keys) {
       var splot = Ext.create('auscope.chart.rickshawChart',{
           graphWidth : 600, // These values are used to set the size of the graph
           graphHeight : 400
       });

       // Create an Ext window to house the chart (panel)
       var win = Ext.create('Ext.window.Window', {
           defaults    : { autoScroll:true }, // Enable scrollbars for underlying panel, if it is bigger than the window
           border      : true,
           items       : splot,
           id          : 'rkswWindowPressureDB',
           layout      : 'fit',
           maximizable : true,
           modal       : true,
           title       : 'Interactive Plot: ',
           resizable   : true,
           height  : 600, // Height and width of window the houses the graph
           width   : 1100,
           x           : 10,
           y           : 10
       });
       win.show();

       splot.mask("Rendering...");
       splot.plot(series, xaxis_name, yaxis_names, yaxis_keys);
       splot.maskClear();

       this.on('close',function(){
           win.close();
       });


    },
    /**
     * Overrides abstract parseKnownLayerFeature
     */
    parseKnownLayerFeature : function(featureId, parentKnownLayer, parentOnlineResource) {
        var me = this;
        var pressureDbUrl = this.getBaseUrl(parentOnlineResource.get('url')) + '/pressuredb-dataservices'; //This is a hack - somehow this needs to make it to the registry
        var actualFeatureId = featureId.replace('gsml.borehole.', '');

        //Load the form in full - when it renders we'll actually check what is available.
        //The user won't be able to interact with the form prior to load due to the loading mask
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'Details:' + featureId,
            items : [{
                xtype : 'form',
                width : 450,
                autoHeight : true,
                listeners : {
                    afterrender : function(form) {
                        form.loadMask = new Ext.LoadMask({
                            msg    : 'Updating from the service',
                            target : form
                        });
                        form.loadMask.show();
                        me.retrieveAvailableOM(form, actualFeatureId, pressureDbUrl);
                    }
                },
                items : [{
                    xtype : 'checkboxgroup',
                    itemId : 'temperature',
                    fieldLabel: '<b>Temperature</b>',
                    columns : 1,
                    items : [{
                        boxLabel : 'Temperature',
                        itemId : 'temperature',
                        name : 't',
                        disabled : true
                    }]
                },{
                    xtype : 'checkboxgroup',
                    itemId : 'salinity',
                    fieldLabel: '<b>Salinity</b>',
                    columns : 1,
                    items : [{
                        boxLabel : 'Total Dissolved Solids',
                        itemId : 'total-dissolved-solids',
                        name : 'tds',
                        disabled : true
                    },{
                        boxLabel : 'NaCl concentration',
                        itemId : 'nacl-concentration',
                        name : 'nacl',
                        disabled : true
                    },{
                        boxLabel : 'Cl concentration',
                        itemId : 'cl-concentration',
                        name : 'cl',
                        disabled : true
                    }]
                },{
                    xtype : 'checkboxgroup',
                    itemId : 'pressure',
                    fieldLabel: '<b>Pressure</b>',
                    columns : 1,
                    items : [{
                        boxLabel : 'Rock Formation Test',
                        itemId : 'rock-formation-test',
                        name : 'rft',
                        disabled : true
                    },{
                        boxLabel : 'Drill Stem Test',
                        itemId : 'drill-stem-test',
                        name : 'dst',
                        disabled : true
                    },{
                        boxLabel : 'Formation Interval Test Pressure',
                        itemId : 'formation-interval-test-pressure',
                        name : 'fitp',
                        disabled : true
                    }]
                }],
                buttons : [{
                    xtype : 'button',
                    text : 'Refresh observations',
                    handler : function() {
                        var form = this.findParentByType('form');
                        form.loadMask.show();
                        me.retrieveAvailableOM(form, actualFeatureId, pressureDbUrl);
                    }
                },{
                    xtype : 'button',
                    text : 'Download selected observations',
                    handler : function() {
                        //We need to generate our download URL
                        var url = 'pressuredb-download.do';
                        var params = {
                            wellID : actualFeatureId,
                            serviceUrl : pressureDbUrl,
                            feature : []
                        };

                        //Find the parent form - iterate the selected values
                        var parentForm = this.findParentByType('form');
                        var featuresAdded = 0;
                        for (feature in parentForm.getForm().getValues()) {
                            params.feature.push(feature);
                            featuresAdded++;
                        }

                        if (featuresAdded > 0) {
                            portal.util.FileDownloader.downloadFile(url, params);
                        } else {
                            Ext.Msg.show({
                                title:'No selection',
                                msg: 'No observations have been selected! You must select at least one before proceeding with a download.',
                                icon: Ext.MessageBox.WARNING
                             });
                        }
                    }
                }, {
                	xtype : 'button',
                	text : 'Plot',
                	handler : function() {
                        var params = {
                                wellID : actualFeatureId,
                                serviceUrl : pressureDbUrl,
                                features : []
                            };

                            //Find the parent form - iterate the selected values
                            var parentForm = this.findParentByType('form');
                            var featuresAdded = 0;
                            for (feature in parentForm.getForm().getValues()) {
                                params.features.push(feature);
                                featuresAdded++;
                            }

                            if (featuresAdded == 1) {
                                portal.util.Ajax.request({
                                    url : 'pressuredb-plot.do',
                                    params : params,
                                    scope : this,
                                    success : function(data) {
                                        var jsonData = {rows:[], wellid:"", feature:"" };
                                        try {
                                            jsonData = JSON.parse(data);
                                        } catch (err) {
                                            Ext.Msg.show({
                                                title:'Data Error',
                                                msg: 'Error in Pressure DB data returned from server.',
                                                icon: Ext.MessageBox.ERROR
                                            });
                                            console.error("Cannot parse data ", err);
                                            return;
                                        }
                                        var data_bin = {};
                                        var xaxis_name;
                                        var yaxis_names = {};
                                        var yaxis_keys = [];
                                        var rows = jsonData.rows;
                                        var wellid = jsonData.wellid;
                                        var feature = jsonData.feature;
                                        var x = "depth";
                                        var y = feature;
                                        var dataType = "metric";
                                        data_bin[dataType] = {};
                                        var metric_name = wellid + '_' + feature;
                                        data_bin[dataType][metric_name] = [];
                                        rows.forEach(function(record) {
                                            data_bin[dataType][metric_name].push({"x":parseFloat(record[x]), "y":parseFloat(record[y])});
                                        });
                                        xaxis_name = "Depth";
                                        yaxis_names={"metric":"Feature"};
                                        yaxis_keys=["metric"];
                                        metric_colours={"3814_dst":'#1f77b4'};
                                        me.genericPlot(data_bin, xaxis_name, yaxis_names, yaxis_keys);
                                    }
                                });
                            } else {
                                Ext.Msg.show({
                                    title:'Wrong selection',
                                    msg: 'You could select one feature only before proceeding with graph plotting.',
                                    icon: Ext.MessageBox.WARNING
                                 });
                            }

                	}

                }]
            }]
        });
    }
});