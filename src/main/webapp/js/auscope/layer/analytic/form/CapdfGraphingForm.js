/**
 * Produce a form for graphing Capricorn distal footprint 
 */
Ext.define('auscope.layer.analytic.form.CapdfGraphingForm', {
    extend : 'Ext.window.Window',
    
    layer : null,
    map : null,
    bboxButton : null,

    constructor : function(cfg) {
        
        this.layer=cfg.layer;
        this.map=cfg.map;
        //VT: return a reference to boxLayer so we can manipulate it
        var boxLayer = this.initMap();
        var me=this;
        
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
            width: 600,     
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
                          
                          
                          
                          items : {
                            xtype : 'checkboxgroup',                              
                            allowBlank : false,
                            fieldLabel : 'Results',
                            allowBlank : false,
                            blankText : 'Select at 2 checkbox',
                            validateOnChange : false,
                            // Arrange radio buttons into two columns, distributed vertically
                            columns : 4,
                            vertical : true,
                            msgTarget: 'under',
                            invalidCls: Ext.baseCSSPrefix + 'form-invalid',
                            items : [ {
                                boxLabel : 'k',
                                name : 'resultField',
                                inputValue : 'k'                       
                            }, {
                                boxLabel : 'mg',
                                name : 'resultField',
                                inputValue : 'mg'                        
                            }, {
                                boxLabel : 'ca',
                                name : 'resultField',
                                inputValue : 'ca'                     
                            }, {
                                boxLabel : 'mg',
                                name : 'resultField',
                                inputValue : 'mg'               
                            }, {
                                boxLabel : 'na',
                                name : 'resultField',
                                inputValue : 'na'         
                            }, {
                                boxLabel : 'sr',
                                name : 'resultField',
                                inputValue : 'sr'                   
                            }, {
                                boxLabel : 'mnl',
                                name : 'resultField',
                                inputValue : 'mnl'               
                            }, {
                                boxLabel : 'mnh',
                                name : 'resultField',
                                inputValue : 'mnh'                     
                            } ],
                            listeners: {
                                change: function(form,newValue,oldValue) {
                                    if(Ext.isArray(newValue.resultField)) {
                                        if(newValue.resultField.length != 2){                                   
                                            form.markInvalid(['Select exactly 2 observation field']);                                   
                                        } else {                                   
                                           form.clearInvalid(); 
                                        }
                                    } else {                               
                                        form.markInvalid(['Select exactly 2 observation field']);
                                    }
                                }
                            }
                         }
                    }
                ],
                buttons : [{
                    text : 'plot',
                    handler : function(){
                        Ext.Ajax.request({
                            url: 'doCapdfHydroScatterPlotList.do',
                            scope : this,
                            params: {
                                xaxis : 'br',
                                yaxis : 'sc'
                            },
                            callback : function(options, success, response) {
                              if(success){
                                  var jsonObj = Ext.JSON.decode(response.responseText);
                                  me.scatterPlot(jsonObj.data.series);
                              }else{
                                  alert('Failed');
                              }

                            }
                        });
                    }
                },{
                    text : 'plot3D',
                    handler : function(){
                        Ext.Ajax.request({
                            url: 'doCapdfHydro3DScatterPlotList.do',
                            scope : this,
                            params: {
                                xaxis : 'br',
                                yaxis : 'sc',
                                zaxis : 'z'
                            },
                            callback : function(options, success, response) {
                              if(success){
                                  var jsonObj = Ext.JSON.decode(response.responseText);
                                  me.scatter3DPlot(jsonObj.data.series);
                              }else{
                                  alert('Failed');
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


   
    scatterPlot : function(series) {
       var splot = Ext.create('auscope.chart.scatterplot',{
           targetWidth : 680,
           targetHeight : 450
       });
      
       
       Ext.create('Ext.window.Window', {
           title: 'Scatter Plot',
           height: 500,
           width: 700,
           layout: 'fit',
           items: splot
       }).show();
       
       splot.plot(series);
        
    },
    
    scatter3DPlot : function(series) {
        var splot = Ext.create('portal.charts.3DScatterPlot',{
               xAttr : 'br',
               xLabel : 'br',                          
               yAttr : 'sc',
               yLabel : 'sc',               
               valueAttr : 'highlight',
               valueLabel : 'highlight'               
        });
       
        
        Ext.create('Ext.window.Window', {
            title: 'Scatter Plot',
            height: 500,
            width: 700,
            layout: 'fit',
            items: splot
        }).show();
        
        splot.plot(series);
         
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
           
            c.on('expand',function(panel,opts){
                var spatialCoordFieldSet = c.down('form').getComponent('cswspatialfiltercoordfieldset');
                spatialCoordFieldSet.getComponent('north').setValue(bounds[3]);
                spatialCoordFieldSet.getComponent('south').setValue(bounds[1]);
                spatialCoordFieldSet.getComponent('east').setValue(bounds[2]);
                spatialCoordFieldSet.getComponent('west').setValue(bounds[0]);
            })
            
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