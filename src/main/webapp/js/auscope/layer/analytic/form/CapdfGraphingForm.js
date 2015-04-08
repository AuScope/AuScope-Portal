/**
 * A factory for parsing WFS features from the National Virtual Core Library known layer.
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
            toggle : true,
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
            layout: 'vbox',
            align : 'stretch',
            pack  : 'start',
            listeners : {
                close : function(panel,opts){
                    var myMap = me.map.map;
                    for(var i in myMap.controls){
                        if(myMap.controls[i] instanceof OpenLayers.Control.DrawFeature){                                                     
                           boxLayer.removeAllFeatures();                                
                           myMap.controls[i].deactivate();                           
                        }
                    }
                }
            },
            items : [{
                xtype : 'fieldset',
                itemId : 'cswspatialfiltercoordfieldset',
                title : 'Coordinates',
                width: '100%',
                
                flex :1,
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
                  flex :2,
                  width: '100%',
                  
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
            }]
        });

        Ext.tip.QuickTipManager.init();        
        this.callParent(arguments);
    },


   
    display : function(layer) {
        
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
            var ctrl = e.object;
            var feature = e.feature;

            //raise the data selection event
            var originalBounds = feature.geometry.getBounds();
            var bounds = originalBounds.transform('EPSG:3857','EPSG:4326').toArray();
            var spatialCoordFieldSet = c.getComponent('cswspatialfiltercoordfieldset');
            spatialCoordFieldSet.getComponent('north').setValue(bounds[3]);
            spatialCoordFieldSet.getComponent('south').setValue(bounds[1]);
            spatialCoordFieldSet.getComponent('east').setValue(bounds[2]);
            spatialCoordFieldSet.getComponent('west').setValue(bounds[0]);

            c.toggleCollapse();
            c.setTitle('Capricorn distal Footprint');
            
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
                if(button.toggle == true){     
                    button.toggle = false;
                    button.setText('Clear bounds')
                    myMap.controls[i].activate();                                  
                    window.toggleCollapse();
                    window.setTitle('Select Area on Map to reactivate window');
                }else{
                    button.toggle=true;
                    window.setTitle('Capricorn distal Footprint');
                    button.setText('Draw Bounds')
                    boxLayer.removeAllFeatures();
                    button.ownerCt.getComponent('north').setValue('');
                    button.ownerCt.getComponent('south').setValue('');
                    button.ownerCt.getComponent('east').setValue('');
                    button.ownerCt.getComponent('west').setValue('');
                    myMap.controls[i].deactivate();
                    
                    if(window.getCollapsed()){
                        window.toggleCollapse();
                    }
                    
                }

            }
        }
    }
    
   

   
});