/**
 * An abstract base class to be extended.
 *
 * Represents a grid panel for containing layers
 * that haven't yet been added to the map. Each row
 * will be grouped under a heading, contain links
 * to underlying data sources and have a spatial location
 * that can be viewed by the end user.
 *
 * This class is expected to be extended for usage within
 * the 'Registered Layers', 'Known Layers' and 'Custom Layers'
 * panels in the portal. Support for KnownLayers/CSWRecords and
 * other row types will be injected by implementing the abstract
 * functions of this class
 *
 */

Ext.define('portal.widgets.panel.BaseActiveRecordPanel', {
    extend : 'portal.widgets.panel.CommonBaseRecordPanel',
    alias: 'widget.baseactiverecordpanel',
//    browseCatalogueDNSMessage : false, //VT: Flags the do not show message when browse catalogue is clicked.
//    map : null,
//    activelayerstore : null,
//    menuFactory : null,
//    onlineResourcePanelType : null,

    constructor : function(cfg) {
        var me = this;
//        this.map = cfg.map;
//        this.menuFactory = cfg.menuFactory;
//        this.activelayerstore = cfg.activelayerstore;
//        me.onlineResourcePanelType = cfg.onlineResourcePanelType;
//        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
//            groupHeaderTpl: '{name} ({[values.rows.length]} {[values.rows.length > 1 ? "Items" : "Item"]})',
//            startCollapsed : true
//        });
//       
//        this.listeners = cfg.listeners;
//        
//        var menuItems = [this._getVisibleBoundFilterAction(),this._getActivelayerFilterAction(),
//                         this._getDataLayerFilterAction(),this._getImageLayerFilterAction()];

        Ext.apply(cfg, {
            cls : 'auscope-dark-grid',
            hideHeaders : true,
            //features : [groupingFeature],
            viewConfig : {
                emptyText : '<p class="centeredlabel">No records match the current filter.</p>',
                preserveScrollOnRefresh: true    ,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorganize'
                },
                listeners: {
                    drop: function(node, data, overModel, dropPosition,  dropFunction,  eOpts ){
                        me.map.updateLayerIndex();
                        // Request the redraw of the layers
                        AppEvents.broadcast('layerindexchanged', {});
                    }
                }
            },          
            columns : [{
                text : 'Drag',
                xtype : 'actioncolumn',
                width: 32,
                align: 'center',
                icon : 'portal-core/img/Drag_and_Drop-128.png',
                tooltipType: 'title',
                sortable: false,
                menuDisabled: true,
             },{
                text : 'Name',
                dataIndex : 'name',
                flex : 1,
                renderer : this._titleRenderer
            },{
                text : 'info',
                id : 'infoBLAHBLAH',
                xtype : 'actioncolumn',
                dataIndex : 'info',
                width: 32,
                align: 'center',
                icon : 'portal-core/img/information.png',
                // Still trying to get tooltips going and also investigating crating 'Ext.tip.Tooltip' objects (at bottom of this)
//                tooltip: 'Legend',// Tooltip.  Click for detailed information about the web services this layer utilises.',
//                getTip: function(value, metadata, record, row, col, store) {
//                    return 'Legend';
//                },
//                tooltipType: 'qtip',
                sortable: false,
                menuDisabled: true,
                handler : function(view, rowIndex, colIndex, item, event, record, row) {
                    me._serviceInformationClickHandler(record);
                }
             },{
                text : 'legend',
                xtype : 'actioncolumn',
                dataIndex : 'legend',
                width: 32,
                align: 'center',
                icon : 'portal-core/img/key.png',
                //tooltip: 'Legend',
                getTip: function(value, metadata, record, row, col, store) {
                    return 'Legend';
                },
                tooltipType: 'title',
                sortable: false,
                menuDisabled: true,
                handler : function(view, rowIndex, colIndex, item, event, layer, row) {
                    me._getLegendAction(layer).execute();
                }
            },{
                text : 'Visible',
                xtype : 'actioncolumn',
                dataIndex : 'visible',
                width: 32,
                align: 'center',
                icon : 'portal-core/img/eye.png',
                tooltip: 'Visible',
                sortable: false,
                menuDisabled: true,
                handler : function(view, rowIndex, colIndex, item, event, layer, row) {
                    me._setVisibilityAction(layer).execute();
                }
            },{
                text : 'Remove',
                xtype : 'actioncolumn',
                dataIndex : 'remove',
                width: 32,
                align: 'center',
                icon : 'portal-core/img/cross.png',
                tooltip: 'Remove',
                sortable: false,
                menuDisabled: true,
                handler : function(view, rowIndex, colIndex, item, event, layer, row) {
                    AppEvents.broadcast('removelayer', {layer:layer, rowIdx:rowIndex});
                }
              }],
              plugins:[{                
                  ptype : 'rowexpandercontainer',
                  baseId : 'rowexpandercontainer-activelayers',
                  pluginId : 'maingrid_rowexpandercontainer',
                  toggleColIndexes: [1],
                  generateContainer : function(layer, parentElId) {
                      //VT:if this is deserialized, we don't need to regenerate the layer
                      if(! layer) {
                          Ext.Error.raise("Expecting layer to be an actual layer for the ActiveLayersPanel but it is undefined")
                      }           
                      var filterForm = cfg.layerFactory.formFactory.getFilterForm(layer).form; //ALWAYS recreate filter form - see https://jira.csiro.au/browse/AUS-2588
                      filterForm.setLayer(layer);
                      var filterPanel = me._getInlineLayerPanel(filterForm, parentElId, this);
                      
                      //Update the layer panel to use
                      if (filterForm) {
                          var filterer = newLayer.get('filterer');
                          if (filterer) {
                              var existingParams = filterer.getParameters();
                              filterForm.getForm().setValues(existingParams);
                          }
                      }
                      this.grid.updateLayout({
                          defer:false,
                          isRoot:false
                      });                    
                      return filterPanel;
                 }
             },{
              ptype: 'celltips'
             }]
                  
        });

        this.callParent(arguments);
    },
    
	// Column Function
    _getLegendAction : function(layer){                       
        var legend = layer.get('renderer').getLegend();
        var text = 'Get Legend';
       
        var getLegendAction = new Ext.Action({
            text : text,
            icon : legend.iconUrl,
            //icon : null,
            iconCls : 'portal-ux-menu-icon-size',
            itemId : 'LegendAction',
            
            handler : function(){
                var legendCallback = function(legend, resources, filterer, success, form, layer){
                    if (success && form) {
                        var win = Ext.create('Ext.window.Window', {
                            title       : 'Legend: '+ layer.get('name'),
                            layout      : 'fit',
                            width       : 200,
                            height      : 300,
                            items: form
                        });
                        return win.show();
                    }
                };
    
                var onlineResources = layer.getAllOnlineResources();
                var filterer = layer.get('filterer');
                var renderer = layer.get('renderer');
                var legend = renderer.getLegend(onlineResources, filterer);
    
                //VT: this style is just for the legend therefore no filter is required.
                var styleUrl = layer.get('renderer').parentLayer.get('source').get('proxyStyleUrl');
                
                //VT: if a layer has style, the style should take priority as the default GetLegend source else use default
                if(styleUrl && styleUrl.length > 0){
    
                    Ext.Ajax.request({
                        url: styleUrl,
                        timeout : 180000,
                        scope : this,
                        success:function(response,opts){
                            legend.getLegendComponent(onlineResources, filterer,response.responseText, Ext.bind(legendCallback, this, [layer], true));
                        },
                        failure: function(response, opts) {
                            legend.getLegendComponent(onlineResources, filterer,"", Ext.bind(legendCallback, this, [layer], true));
                        }                        
                    });
                
                }else{
                    legend.getLegendComponent(onlineResources, filterer,"", Ext.bind(legendCallback, this, [layer], true));
                }
                
            }
        });
        
        return getLegendAction;
    },
    
	// Column Function
    _setVisibilityAction : function(layer){
//        var me = this;
        var visibleLayerAction = new Ext.Action({
            text : 'Toggle Layer Visibility OFF',
            iconCls : 'visible_eye',
            handler : function(){
//                var layer = me.filterForm.layer;                 
                layer.setLayerVisibility(!layer.visible);
                if(layer.visible){
                    this.setText('Toggle Layer Visibility OFF');
                }else{
                    this.setText('Toggle Layer Visibility ON');
                }
                
            }
        });
        
        return visibleLayerAction;
    },

    /**
     * Column definition function to draw the panel when a row is clicked upon.  Here is a common one to draw the WMS/WFS filter with Opacity, drop-downs etc..
     * Override
     */
    _getInlineLayerPanel : function(filterForm, parentElId){                             
        var me = this;   
        var panel =Ext.create('portal.widgets.panel.FilterPanel', {    
            wantAddLayerButton : false,
            wantOptionsButton : false,
            menuFactory : this.menuFactory,
            filterForm  : filterForm, 
            detachOnRemove : false,
            map         : this.map,
            renderTo    : parentElId,
        });   
        
        return panel
    },
    
	// CONSTRUCTOR FN
	// SAME
//    _getVisibleBoundFilterAction : function(){   
//        
//        var me = this;
//        return new Ext.Action({
//            text : 'Visible Bound',
//            iconCls : 'visible_eye',
//            tooltip: 'Filter the layers based on its bounding box and the map\'s visible bound',
//            handler : Ext.bind(me._handleVisibleFilterClick, this)
//        })
//        
//    },
    
    // CONSTRUCTOR FN
	// SAME but use this defn
//    _getActivelayerFilterAction : function(){
//        var me = this;
//        return new Ext.Action({
//            text : 'Active Layer',
//            iconCls : 'tick',
//            tooltip: 'Display only active layer',
//            handler : function(){
//                                // TODO: Do I need this but using the new id for rowexpandercontainer?
//                                // var rowExpander = me.getPlugin('maingrid_rowexpandercontainer');
//                                //                rowExpander.closeAllContainers();          
//                
//                //function to check if layer is active on map
//                var filterFn = function(rec) {
//                    return rec.get('active');
//                };
//
//                var searchField = this.findParentByType('toolbar').getComponent(1);
//                searchField.clearCustomFilter();
//                searchField.runCustomFilter('<active layers>', Ext.bind(filterFn, this));
//            }
//        })
//    },
    
	// CONSTRUCTOR FN
	// SAME but use this defn
//    _getDataLayerFilterAction : function(){
//        var me = this;
//        return new Ext.Action({
//            text : 'Data Layer',
//            iconCls : 'data',
//            tooltip: 'Display layer with data service',
//            handler : function(){
//                                // TODO: Do I need this but using the new id for rowexpandercontainer?
//                                // var rowExpander = me.getPlugin('maingrid_rowexpandercontainer');
//                                //                rowExpander.closeAllContainers();          
//                
//                //function to if layer contains data service
//                var filterFn = function(rec) {
//                    var onlineResources = me.getOnlineResourcesForRecord(rec)
//                    var serviceType = me._getServiceType(onlineResources); 
//                    
//                    //VT:This part of the code is to keep it inline with the code in _serviceInformationRenderer
//                    //VT: for rendering the icon
//                    if (serviceType.containsDataService) {
//                        return true; //a single data service will label the entire layer as a data layer
//                    }else{
//                        return false;
//                    } 
//
//                };
//
//                var searchField = this.findParentByType('toolbar').getComponent(1);
//                searchField.clearCustomFilter();
//                searchField.runCustomFilter('<Data Layers>', Ext.bind(filterFn, this));
//            }
//        })
//        
//    },
    
	// CONSTRUCTOR FN
	// SAME but use this defn
//    _getImageLayerFilterAction : function(){
//        var me = this;
//        return new Ext.Action({
//            text : 'Portrayal Layer',
//            iconCls : 'portrayal',
//            tooltip: 'Display layers with image service',
//            handler : function(){
//                                // TODO: Do I need this but using the new id for rowexpandercontainer?
//                                // var rowExpander = me.getPlugin('maingrid_rowexpandercontainer');
//                                //                rowExpander.closeAllContainers();          
//                
//                //function to if layer contains image service
//                var filterFn = function(rec) {           
//                    var onlineResources = me.getOnlineResourcesForRecord(rec);
//                    var serviceType = me._getServiceType(onlineResources);                                                                                             
//                    
//                    //VT:This part of the code is to keep it inline with the code in _serviceInformationRenderer
//                    //VT: for rendering the picture icon
//                    if (serviceType.containsDataService) {
//                        return false; //a single data service will label the entire layer as a data layer
//                    } else if (serviceType.containsImageService) {
//                        return true;
//                    } else {
//                        return false;
//                    }
//                          
//                };
//
//                var searchField = this.findParentByType('toolbar').getComponent(1);
//                searchField.clearCustomFilter();
//                searchField.runCustomFilter('<Portrayal layers>', Ext.bind(filterFn, this));
//            }
//        })
//    },
    
    /**
     * When the visible fn is clicked, ensure only the visible records pass the filter
     */
	 // CONSTRUCTOR FN
	 // SAME
//    _handleVisibleFilterClick : function(button) {                           
//        var currentBounds = this.map.getVisibleMapBounds();
//
//        //Function for testing intersection of a records's spatial bounds
//        //against the current visible bounds
//        var filterFn = function(rec) {
//            var spatialBounds;
//            spatialBounds = this.getSpatialBoundsForRecord(rec);
//            for (var i = 0; i < spatialBounds.length; i++) {
//                if (spatialBounds[i].intersects(currentBounds)) {
//                    return true;
//                }
//            }
//
//            return false;
//        };
//
//        var searchField = button.findParentByType('toolbar').getComponent(1);
//        searchField.clearCustomFilter();
//        searchField.runCustomFilter('<visible layers>', Ext.bind(filterFn, this));      
//    },       
 

    //-------- Abstract methods requiring implementation ---------

    /**
     * Abstract function - Should return a string based title
     * for a given record
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose title should be extracted
     */
//    getTitleForRecord : portal.util.UnimplementedFunction,

    /**
     * Abstract function - Should return an Array of portal.csw.OnlineResource
     * objects that make up the specified record. If no online resources exist
     * then an empty array can be returned
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose underlying online resources should be extracted.
     */
//    getOnlineResourcesForRecord : portal.util.UnimplementedFunction,

    /**
     * Abstract function - Should return an Array of portal.util.BBox
     * objects that represent the total spatial bounds of the record. If no
     * bounds exist then an empty array can be returned
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose spatial bounds should be extracted.
     */
//    getSpatialBoundsForRecord : portal.util.UnimplementedFunction,

    /**
     * Abstract function - Should return an Array of portal.csw.CSWRecord
     * objects that make up the specified record.
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose underlying CSWRecords should be extracted.
     */
//    getCSWRecordsForRecord : portal.util.UnimplementedFunction,

    //--------- Class Methods ---------

    /**
     * Internal method, acts as an ExtJS 4 column renderer function for rendering
     * the title of the record.
     *
     * http://docs.sencha.com/ext-js/4-0/#!/api/Ext.grid.column.Column-cfg-renderer
     */
	 // COL FN
	 // SAME
//    _titleRenderer : function(value, metaData, record, row, col, store, gridView) {
//        return this.getTitleForRecord(record);
//    },
    
	// CONSTRUCTOR FN
	// SAME
//    _getServiceType : function(onlineResources){
//        var containsDataService = false;
//        var containsImageService = false;
//        
//      //We classify resources as being data or image sources.
//        for (var i = 0; i < onlineResources.length; i++) {
//            switch(onlineResources[i].get('type')) {
//            case portal.csw.OnlineResource.WFS:
//            case portal.csw.OnlineResource.WCS:
//            case portal.csw.OnlineResource.SOS:
//            case portal.csw.OnlineResource.OPeNDAP:
//            case portal.csw.OnlineResource.CSWService:
//            case portal.csw.OnlineResource.IRIS:
//                containsDataService = true;
//                break;
//            case portal.csw.OnlineResource.WMS:
//            case portal.csw.OnlineResource.WWW:
//            case portal.csw.OnlineResource.FTP:
//            case portal.csw.OnlineResource.CSW:
//            case portal.csw.OnlineResource.UNSUPPORTED:
//                containsImageService = true;
//                break;
//            }
//        }
//       
//        return result = {
//            containsDataService : containsDataService,
//            containsImageService : containsImageService
//        };
//    },

    /**
     * Show a popup containing info about the services that 'power' this layer
     */
	 // COL FN
	 // SAME
//    _serviceInformationClickHandler : function(record) {
//        var cswRecords = this.getCSWRecordsForRecord(record);
//        if (!cswRecords || cswRecords.length === 0) {
//            return;
//        }
//
//        var popup = Ext.create('portal.widgets.window.CSWRecordDescriptionWindow', {
//            cswRecords : cswRecords,
//            parentRecord : record,
//            onlineResourcePanelType : this.onlineResourcePanelType
//        });
//
//        popup.show();
//    }
});

// An attempt to get tooltips working.  Also trying in-line ones.  Consider moving to CommonBaseRecordPanel.js
var tip = Ext.create('Ext.tip.ToolTip', {target : 'infoBLAHBLAH', html : 'simple tooltip for info'});
