/**
 * Produce a form for graphing Northern Yilgarn Hydrogeochemistry footprint
 */
Ext.define('auscope.layer.analytic.form.CapdfGraphingForm', {
    extend : 'Ext.window.Window',

    layer : null,
    map : null,
    bboxButton : null,
    serviceUrl : null,


    constructor : function(cfg) {

        this.layer=cfg.layer;
        this.map=cfg.map;
        this.featureType = this.layer.get('filterer').parameters.featureType
        //VT: return a reference to boxLayer so we can manipulate it
        var boxLayer = this.initMap();
        var me=this;

        var wfsresource = portal.csw.OnlineResource.getFilteredFromArray(this.layer.getAllOnlineResources(), portal.csw.OnlineResource.WFS);
        //VT: for the time being we assumed that is only one service endpoint.
        wfsresource = wfsresource[0];
        this.serviceUrl = wfsresource.get('url');



        this.bboxButton = Ext.create('Ext.Button',{
            text: 'Draw Bounds',
            handler: function() {
                var myMap = me.map.map;
                me._toggleMapDraw(myMap,me,this,boxLayer);
            }
        })


         var groupStore = Ext.create('Ext.data.Store', {
            fields : ['groupName', 'groupValue'],
            proxy : {
                type : 'ajax',
                url : 'doGetGroupOfInterest.do',
                extraParams: {
                    serviceUrl: this.serviceUrl
                },
                reader : {
                    type : 'array',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });

        this.parameterXCombo = Ext.create('Ext.form.ComboBox', {
            anchor: '100%',
            itemId: 'xparam',
            disabled :  true,
            fieldLabel: '<span data-qtip="Select the x axis">' + 'x-axis' + '</span>',
            name: 'xaxis',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            queryMode: 'local',
            typeAheadDelay: 500,
            valueField: 'classifier',
            displayField: 'classifier',
            listConfig: {
                itemTpl:  Ext.create('Ext.XTemplate',
                        '<tpl if="pref_name == null || pref_name == \'\'">',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b></div>',
                        '<tpl else>',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b> ({pref_name})</div>',
                        '</tpl>'
                )
            }

        });

        this.parameterYCombo = Ext.create('Ext.form.ComboBox', {
            anchor: '100%',
            itemId: 'yparam',
            disabled :  true,
            fieldLabel: '<span data-qtip="Select the y axis">' + 'y-axis' + '</span>',
            name: 'yaxis',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            queryMode: 'local',
            typeAheadDelay: 500,
            valueField: 'classifier',
            displayField: 'classifier',
            listConfig: {
                itemTpl:  Ext.create('Ext.XTemplate',
                        '<tpl if="pref_name == null || pref_name == \'\'">',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b></div>',
                        '<tpl else>',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b> ({pref_name})</div>',
                        '</tpl>'
                )
            }

        });



        Ext.apply(cfg, {
            title: 'Northern Yilgarn Hydrogeochemistry',
            height: 500,
            width: 400,
            collapsible : true,
            layout: 'fit',
            listeners : {
                close : function(panel,opts){
                    var myMap = me.map.map;
                    for(var i in myMap.controls){
                        if(myMap.controls[i] instanceof OpenLayers.Control.DrawFeature){
                           boxLayer.removeAllFeatures();
                           myMap.controls[i].deactivate();
                           myMap.removeControl(myMap.controls[i]);
                        }
                    }
                    this.map.map.removeLayer(boxLayer);
                    this.bboxButton.destroy();
                }
            },
            items : {
                xtype :'form',
                itemId : 'capdfGraphingForm',
                frame : true,
                layout: 'anchor',
                // these are applied to columns
                defaults:{
                    anchor: '100%',
                    hideLabels  : true,
                    border      : false,
                    bodyStyle   : 'padding:10px'
                },
                items :[{
                         xtype : 'label',
                         html: '<p>Selected:<strong>' + this.featureType + '</strong></p>'

                      },{xtype : 'fieldset',
                        itemId : 'cswspatialfiltercoordfieldset',
                        title : 'Coordinates',

                        items : [{
                            xtype : 'textfield',
                            name : 'north',
                            itemId : 'north',
                            allowBlank : false,
                            fieldLabel : 'North'
                        },{
                            xtype : 'textfield',
                            name : 'south',
                            itemId : 'south',
                            allowBlank : false,
                            fieldLabel : 'South'
                        },{
                            xtype : 'textfield',
                            name : 'east',
                            itemId : 'east',
                            allowBlank : false,
                            fieldLabel : 'East'
                        },{
                            xtype : 'textfield',
                            name : 'west',
                            itemId : 'west',
                            allowBlank : false,
                            fieldLabel : 'West'
                        },{
                          xtype: 'label',
                          html : '<p><font size="0.7" color="red">CSV download is based on the \'Group of Interest\' selected as well as the bound selected. Return all results if bounds are not selected.<font></p>'
                        },{
                            xtype : 'container',
                            layout : 'hbox',
                            pack: 'start',
                            align: 'stretch',
                            items :[
                                    this.bboxButton,
                            {
                                xtype:'tbspacer'

                            },{
                                text : 'CSV',
                                xtype : 'button',
                                iconCls : 'download',
                                handler: function() {
                                    me.downloadCSV(me.layer);
                                }
                            }]
                        }]
                      },{
                          xtype : 'fieldset',
                          title : 'Select axis',
                          items : [this.parameterXCombo,this.parameterYCombo]
                    }
                ],
                buttons : [{
                    text : 'Scatter Plot',
                    handler : function(){

                        var myMask = new Ext.LoadMask({
                            msg    : 'Please wait...',
                            target : me
                        }).show();

                       var graphingForm = me.query('form[itemId=capdfGraphingForm]')[0]
                       var formValues =  graphingForm.getValues()
                       var xaxis = formValues.xaxis
                       var yaxis = formValues.yaxis


                       var bbox = Ext.create('portal.util.BBox', {
                           northBoundLatitude : formValues.north,
                           southBoundLatitude : formValues.south,
                           eastBoundLongitude : formValues.east,
                           westBoundLongitude : formValues.west,
                           crs : 'EPSG:4326'
                       });

                       if(!bbox.northBoundLatitude || !bbox.southBoundLatitude || !bbox.eastBoundLongitude || !bbox.westBoundLongitude){
                           myMask.hide();
                           alert('Click on \'Draw Bounds\' to select the area for graph comparison');
                           return;
                       }

                       var parameters=me.layer.get('filterer').getParameters()

                        portal.util.Ajax.request({
                            url: 'doCapdfHydroScatterPlotList.do',
                            scope : this,
                            timeout : 60000,
                            params: {
                                serviceUrl: me.serviceUrl,
                                xaxis : xaxis,
                                yaxis : yaxis,
                                featureType : me.featureType,
                                bbox : Ext.JSON.encode(bbox),
                                obbox : parameters.bbox,
                                batchid : parameters.batchid
                            },
                            callback : function(success, data) {
                              myMask.hide();
                              if(success){
                                  me.scatterPlot(data.series,xaxis,yaxis);
                              }else{
                                  alert('Failed to load resource');
                              }

                            }
                        });
                    }
                },{
                    text : 'Box Plot',
                    handler : function(){

                       var myMask = new Ext.LoadMask({
                           msg    : 'Please wait...',
                           target : me
                       }).show();

                       var graphingForm = me.query('form[itemId=capdfGraphingForm]')[0]
                       var formValues =  graphingForm.getValues()
                       var box1 = formValues.xaxis
                       var box2 = formValues.yaxis


                       var bbox = Ext.create('portal.util.BBox', {
                           northBoundLatitude : formValues.north,
                           southBoundLatitude : formValues.south,
                           eastBoundLongitude : formValues.east,
                           westBoundLongitude : formValues.west,
                           crs : 'EPSG:4326'
                       });

                       if(!bbox.northBoundLatitude || !bbox.southBoundLatitude || !bbox.eastBoundLongitude || !bbox.westBoundLongitude){
                           myMask.hide();
                           alert('Click on \'Draw Bounds\' to select the area for graph comparison');
                           return;
                       }

                       var parameters=me.layer.get('filterer').getParameters()

                        portal.util.Ajax.request({
                            url: 'doCapdfHydroBoxPlotList.do',
                            scope : this,
                            timeout : 60000,
                            params: {
                                serviceUrl: me.serviceUrl,
                                box1 : box1,
                                box2 : box2,
                                featureType:me.featureType,
                                bbox : Ext.JSON.encode(bbox),
                                obbox : parameters.bbox,
                                batchid : parameters.batchid
                            },
                            callback : function(success, data) {
                              myMask.hide();
                              if(success){
                                  me.boxPlot(data.series,box1,box2);
                              }else{
                                  alert('Failed to load resource');
                              }

                            }
                        });
                    }
                }]

            }
        });

        if(this.featureType){
            this.updateParameterCombo(this.featureType);
        }
        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    },



    scatterPlot : function(series,xaxis,yaxis) {
       var splot = Ext.create('auscope.chart.scatterplot',{
           targetWidth : 680,
           targetHeight : 450
       });


       var win = Ext.create('Ext.window.Window', {
           title: 'Scatter Plot',
           height: 500,
           width: 700,
           layout: 'fit',
           items: splot
       }).show();

       splot.mask("Rendering...");

       splot.plot(series,xaxis,yaxis);

       splot.maskClear();

       this.on('close',function(){
           win.close();
       })
    },

    boxPlot : function(series,box1,box2) {
        var splot = Ext.create('auscope.chart.boxPlot',{
            targetWidth : 680,
            targetHeight : 450
        });


        var win = Ext.create('Ext.window.Window', {
            title: 'Scatter Plot',
            height: 500,
            width: 700,
            layout: 'fit',
            items: splot
        }).show();

        splot.mask("Rendering...");

        splot.plot(series,box1,box2);

        splot.maskClear();

        this.on('close',function(){
            win.close();
        })

     },


    initMap : function(){
        var myMap = this.map.map;
        var me=this;
        var boxLayer = new OpenLayers.Layer.Vector("Box layer");
        myMap.addLayer(boxLayer);
        var box= new OpenLayers.Control.DrawFeature(boxLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 4,
                        irregular: true
                    }
                }
            )
        myMap.addControl(box);


        this.map.on('afterZoom',function(obj){
            me._toggleMapDraw(myMap,me,me.bboxButton,boxLayer);
        })


        box.events.register('featureadded', {}, Ext.bind(function(e,c){

            c.expand();
            c.setTitle('Northern Yilgarn Hydrogeochemistry');

            var ctrl = e.object;
            var feature = e.feature;

            //raise the data selection event
            var originalBounds = feature.geometry.getBounds();
            var bounds = originalBounds.transform('EPSG:3857','EPSG:4326').toArray();


            var spatialCoordFieldSet = c.down('form').getComponent('cswspatialfiltercoordfieldset');
            spatialCoordFieldSet.getComponent('north').setValue(bounds[3]);
            spatialCoordFieldSet.getComponent('south').setValue(bounds[1]);
            spatialCoordFieldSet.getComponent('east').setValue(bounds[2]);
            spatialCoordFieldSet.getComponent('west').setValue(bounds[0]);


            //Because click events are still 'caught' even if the click control is deactive, the click event
            //still gets fired. To work around this, add a tiny delay to when we reactivate click events
            var task = new Ext.util.DelayedTask(Ext.bind(function(ctrl){
                ctrl.deactivate();
            }, this, [ctrl]));
            task.delay(50);
        }, this,me,true));




        return boxLayer;
    },


    _toggleMapDraw: function(myMap,window,button,boxLayer){

        for(var i in myMap.controls){
            if(myMap.controls[i] instanceof OpenLayers.Control.DrawFeature){
                //VT : get a hold of the DrawFeature and toggle it.
                if(window.getCollapsed() == false && button.getText() != 'Clear bounds'){
                    button.setText('Clear bounds')
                    myMap.controls[i].activate();
                    window.collapse();
                    window.setTitle('Select Area on Map to reactivate window');
                }else{

                    window.setTitle('Northern Yilgarn Hydrogeochemistry');
                    button.setText('Draw Bounds')
                    boxLayer.removeAllFeatures();

                    button.up('fieldset').getComponent('north').setValue('');
                    button.up('fieldset').getComponent('south').setValue('');
                    button.up('fieldset').getComponent('east').setValue('');
                    button.up('fieldset').getComponent('west').setValue('');
                    myMap.controls[i].deactivate();

                   window.expand()

                }

            }
        }
    },

    updateParameterCombo : function(featureType){
        var aoiParamStore = Ext.create('Ext.data.Store', {
            fields : ['classifier', 'pref_name','min','max'],
            proxy : {
                type : 'ajax',
                url : 'doGetAOIParam.do',
                extraParams: {
                    serviceUrl: this.serviceUrl,
                    featureType : featureType
                },
                reader : {
                    type : 'array',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });

        this.parameterXCombo.setStore(aoiParamStore);
        this.parameterXCombo.setDisabled(false);

        this.parameterYCombo.setStore(aoiParamStore);
        this.parameterYCombo.setDisabled(false);

        var me = this;

        aoiParamStore.on('load',function(store, records, successful, eOpts ){
            if(successful){
                me.parameterXCombo.setSelection(records[0]);
                me.parameterYCombo.setSelection(records[0]);
            }
        })
    },

    downloadCSV : function(layer){

        var filterer = layer.get('filterer')
        var filterParam = filterer.getParameters();
        var serviceUrl = portal.csw.OnlineResource.getFilteredFromArray(this.layer.getAllOnlineResources(), portal.csw.OnlineResource.WFS)[0].get('url')

          var graphingForm = this.query('form[itemId=capdfGraphingForm]')[0]
          var formValues =  graphingForm.getValues()

          var bbox = filterer.getSpatialParam()

          if(formValues.north && formValues.south && formValues.east && formValues.west){
              bbox = Ext.create('portal.util.BBox', {
                  northBoundLatitude : formValues.north,
                  southBoundLatitude : formValues.south,
                  eastBoundLongitude : formValues.east,
                  westBoundLongitude : formValues.west,
                  crs : 'EPSG:4326'
              });
          }


        portal.util.FileDownloader.downloadFile('getCapdfCSVDownload.do', {
            serviceUrl : serviceUrl,
            batchid : filterParam.batchid,
            north : bbox.northBoundLatitude,
            south : bbox.southBoundLatitude,
            east : bbox.eastBoundLongitude,
            west : bbox.westBoundLongitude,
            featureType:this.featureType
        });
    }




});