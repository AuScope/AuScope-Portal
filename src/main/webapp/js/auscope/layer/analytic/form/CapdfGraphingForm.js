/**
 * Produce a form for graphing Capricorn distal footprint 
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
        //VT: return a reference to boxLayer so we can manipulate it
        var boxLayer = this.initMap();
        var me=this;
                                      
        var wfsresource = portal.csw.OnlineResource.getFilteredFromArray(this.layer.getAllOnlineResources(), portal.csw.OnlineResource.WFS);
        //VT: for the time being we assumed that is only one service endpoint.
        wfsresource = wfsresource[0];
        this.serviceUrl = wfsresource.get('url');
        
       
        
        
     // The data store containing the list of states
        var observationStore = Ext.create('Ext.data.Store', {
            fields: ['display', 'value'],
            data : [
                {"display":"elev", "value":"elev"},
                {"display":"wt", "value":"wt"},
                {"display":"sd", "value":"sd"}
            ]
        });

        
        
        this.bboxButton = Ext.create('Ext.Button',{                      
            text: 'Draw Bounds',
            handler: function() { 
                var myMap = me.map.map;                                        
                me._toggleMapDraw(myMap,me,this,boxLayer);
            }
        })

        Ext.apply(cfg, {
            title: 'Capricorn distal Footprint',
            height: 600,
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
                        xtype : 'fieldset',
                        itemId : 'cswspatialfiltercoordfieldset',
                        title : 'Coordinates',
                        
                                                
                        items : [{
                            xtype : 'textfield',
                            name : 'north',
                            itemId : 'north',
                            fieldLabel : 'North'
                        },{
                            xtype : 'textfield',
                            name : 'south',
                            itemId : 'south',
                            fieldLabel : 'South'
                        },{
                            xtype : 'textfield',
                            name : 'east',
                            itemId : 'east',
                            fieldLabel : 'East'
                        },{
                            xtype : 'textfield',
                            name : 'west',
                            itemId : 'west',
                            fieldLabel : 'West'
                        },
                            this.bboxButton
                        ]
                      },{     
                          xtype : 'fieldset',                  
                          title : 'Observation',                                                   
                          items : [{
                              xtype : 'combo',
                              itemId : 'xaxis',
                              name : 'xaxis',
                              fieldLabel: 'x-axis',
                              store: observationStore,
                              queryMode: 'local',
                              displayField: 'display',
                              valueField: 'value',
                         },{
                             xtype : 'combo',
                             itemId : 'yaxis',
                             name : 'yaxis',
                             fieldLabel: 'y-axis',
                             store: observationStore,
                             queryMode: 'local',
                             displayField: 'display',
                             valueField: 'value',
                        }]
                    }
                ],
                buttons : [{
                    text : 'plot',
                    handler : function(){
                        
                        var myMask = new Ext.LoadMask({
                            msg    : 'Please wait...',
                            target : me
                        }).show();
                        
                       var customRegistryForm = me.query('form[itemId=capdfGraphingForm]')[0]
                       var formValues =  customRegistryForm.getValues()
                       var xaxis = formValues.xaxis
                       var yaxis = formValues.yaxis
                       
                       var bbox = Ext.create('portal.util.BBox', {
                           northBoundLatitude : formValues.north,
                           southBoundLatitude : formValues.south,
                           eastBoundLongitude : formValues.east,
                           westBoundLongitude : formValues.west,
                           crs : 'EPSG:4326'
                       });
                       
                       var parameters=me.layer.get('filterer').getParameters()
                    
                        Ext.Ajax.request({
                            url: 'doCapdfHydroScatterPlotList.do',
                            scope : this,
                            timeout : 60000,
                            params: {
                                serviceUrl: me.serviceUrl,
                                xaxis : xaxis,
                                yaxis : yaxis,                                                                
                                bbox : Ext.JSON.encode(bbox),
                                obbox : parameters.bbox,
                                project : parameters.project
                            },
                            callback : function(options, success, response) {
                              myMask.hide();
                              if(success){
                                  var jsonObj = Ext.JSON.decode(response.responseText);
                                  me.scatterPlot(jsonObj.data.series,xaxis,yaxis);
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
                        
                       var customRegistryForm = me.query('form[itemId=capdfGraphingForm]')[0]
                       var formValues =  customRegistryForm.getValues()
                       var box1 = formValues.xaxis
                       var box2 = formValues.yaxis
                       
                       var bbox = Ext.create('portal.util.BBox', {
                           northBoundLatitude : formValues.north,
                           southBoundLatitude : formValues.south,
                           eastBoundLongitude : formValues.east,
                           westBoundLongitude : formValues.west,
                           crs : 'EPSG:4326'
                       });
                       
                       var parameters=me.layer.get('filterer').getParameters()

                        Ext.Ajax.request({
                            url: 'doCapdfHydroBoxPlotList.do',
                            scope : this,
                            timeout : 60000,
                            params: {
                                serviceUrl: me.serviceUrl,
                                box1 : box1,
                                box2 : box2,
                                bbox : Ext.JSON.encode(bbox),
                                obbox : parameters.bbox,
                                project : parameters.project
                            },
                            callback : function(options, success, response) {
                              myMask.hide();
                              if(success){
                                  var jsonObj = Ext.JSON.decode(response.responseText);
                                  me.boxPlot(jsonObj.data.series,box1,box2);
                              }else{
                                  alert('Failed to load resource');
                              }

                            }
                        });
                    }
                }]
                                
            }
        });

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
            c.setTitle('Capricorn distal Footprint');
            
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
                   
                    window.setTitle('Capricorn distal Footprint');
                    button.setText('Draw Bounds')
                    boxLayer.removeAllFeatures();                    
                    button.ownerCt.getComponent('north').setValue('');
                    button.ownerCt.getComponent('south').setValue('');
                    button.ownerCt.getComponent('east').setValue('');
                    button.ownerCt.getComponent('west').setValue('');
                    myMap.controls[i].deactivate();
                    
                   window.expand()
                    
                }

            }
        }
    }
    
   

   
});