/**
 *
 * This is the paging panel used for GA Search Results
 *
 */
Ext.define('ga.widgets.GASearchResultsPanel', {
    extend : 'Ext.grid.Panel',
    alias: 'widget.gasearchresultspanel',

    cswRecordStore : null,
    pageSize: 20,
    displayTemplate: null,
    map : null,
    layerFactory : null,
    layerStore : null,
    
    constructor : function(cfg) {
        var me = this;

        me.cswRecordStore = cfg.store;
       
        me.map = cfg.map;
        me.layerStore = cfg.layerStore;
        
        me.layerFactory = cfg.layerFactory;
        
        Ext.apply(cfg, {
            hideHeaders : true,
            height: 200,
            layout : 'fit',

            columns: [{
                //Title column
                dataIndex: 'onlineResource',
                sortable: false,
                cellWrap : true,
                flex: 1,
                xtype: 'componentcolumn', 
                autoWidthComponents : false,
                renderer: Ext.bind(me._cellRenderer, me)
            }],
            store : this.cswRecordStore,
            viewConfig : {
                forceFit : true,
                enableRowBody:true
            },

            loadMask : {msg : 'Performing CSW Filter...'},
            multiSelect: true,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                pageSize: me.pageSize,
                store: me.cswRecordStore,
                dock: 'bottom',
                displayInfo: true
            }],
            listeners : {
                afterrender : function(grid,eOpts) {
                    grid.cswRecordStore.load();
                    
                },
                
                // when the view is fully loaded we need to check for availability of some features and update the DOM                    
                viewready: function(view) {
                    
                    var dataItems = ga.widgets.OnlineResourceSelectionPanelRow.parseCswRecordsFromStore(me.cswRecordStore);
                    
                    me.cswRecordStore.each(function(record,id){
                        var hasWMSResource = false;
                        
                        var onlineResources = record.data.onlineResources;
                        for (var j = 0; j < onlineResources.length; j++) {
                            var onlineResource = onlineResources[j]; 
                            var type = onlineResource.get('type');                            ;
                            if (type == portal.csw.OnlineResource.WMS) {
                                hasWMSResource = true;
                                break;
                            } 
                            if (!hasWMSResource) {
                                var name = record.get('name');                                
                                var addWMSLinkId = '_' + name.replace(/\W/g, '') + '_addWMSLink'; 
                                Ext.get(addWMSLinkId).el.style = 'color: gray';
                                Ext.get(addWMSLinkId).click = null;
                            }
                            
                        }
                    });
                },
                
                itemdblclick : function(grid, record, item, index, e, eOpts ){
                    this.displayInfo(record);
                }

            }

        });

      this.callParent(arguments);
    },

    /**
     * On single click, show a highlight of all BBoxes
     */
    showSpatialBounds : function(record) {
        var me = this;
        var spatialBoundsArray;
        if (record.internalId == 'portal-InSar-reports') {
            spatialBoundsArray = this.getWholeGlobeBounds();
        } else {
            spatialBoundsArray = this.getSpatialBoundsForRecord(record);
        }
        var nonPointBounds = [];

        //No point showing a highlight for bboxes that are points
        for (var i = 0; i < spatialBoundsArray.length; i++) {
            var bbox = spatialBoundsArray[i];
            if (bbox.southBoundLatitude !== bbox.northBoundLatitude ||
                bbox.eastBoundLongitude !== bbox.westBoundLongitude) {

                //VT: Google map uses EPSG:3857 and its maximum latitude is only 85 degrees
                // anything more will stretch the transformation
                if(bbox.northBoundLatitude>85){
                    bbox.northBoundLatitude=85;
                }
                if(bbox.southBoundLatitude<-85){
                    bbox.southBoundLatitude=-85;
                }
                nonPointBounds.push(bbox);
            }
        }

        me.map.highlightBounds(nonPointBounds);
    },    
    
    /**
     * Helper function.  Useful to define here for subclasses.
     *
     * Return the max bbox for insar layer as it is a dummy CSW.
     */
    getWholeGlobeBounds : function() {
        var bbox = new Array();
        bbox[0] = Ext.create('portal.util.BBox', {
            northBoundLatitude : 85,
            southBoundLatitude : -85,
            eastBoundLongitude : 180,
            westBoundLongitude : -180
        });
        return bbox;
    },
    
    getSpatialBoundsForRecord : function(record) {
        return record.data.geographicElements;
    },
    
    
    /**
     * Creates a layer out of this CSW record and adds it to the map
     */
    addLayerToMap : function(record) {     
        this.map.layerStore.suspendEvents(true);
        var layer = this.layerFactory.generateLayerFromCSWRecord(record);  
        var filterer = layer.get('filterer');      
        
        //Before applying filter, update the spatial bounds (silently)
        filterer.setSpatialParam(this.map.getVisibleMapBounds(), true);
        this.layerStore.add(layer); //this adds the layer to our store
        this.map.layerStore.add(layer);
        this.map.layerStore.resumeEvents();      
        layer.get('filterForm').writeToFilterer(filterer);
        AppEvents.broadcast('addlayer', {layer: layer});
 
        //VT: Tracking
        portal.util.PiwikAnalytic.trackevent('Add:' + layer.get('sourceType'), 'Layer:' + layer.get('name'),'Filter:' + filterer.getParameters());
        
    },
   
    
    // renderer for the details of the resource (name, description, links)
    _cellRenderer : function(value, metaData, record, row, col, store) {        
        var me = this;       
        
        if (record) {
            var name;

            var name = record.get('name');            
            
            //Ensure there is a title (even it is just '<Untitled>'
            if (!name || name.length === 0) {
                name = '&lt;Untitled&gt;';
            }
            
            var description = record.get('description');
            //Truncate description
            var maxLength = 300;
            if (description.length > maxLength) {
                description = description.substring(0, maxLength) + '...';
            }        
            
            var recordInfoUrl = record.get('recordInfoUrl');
            
            var addWMSLinkId = '_' + name.replace(/\W/g, '') + '_addWMSLink'; 
            
            return {
                xtype: 'panel',
                cls : 'gasearchresult',              
                items: [{
                    xtype: 'box',
                    cls: 'name',
                    autoEl: {
                      tag: 'div',
                      html: name
                    }  
                },{
                    xtype : 'displayfield',
                    value : Ext.util.Format.format('<span class="description">{0}</span>', description) 
                },{
                    xtype : 'toolbar',
                    cls : 'links', 
                    docked: 'top',
                    title: 'controls',
                    items : [{       
                        xtype: 'box',
                        autoEl: {
                          tag: 'a',
                          target : '_blank',
                          href: recordInfoUrl,
                          cn: 'Full metadata'
                        }                    
                    },
                    {
                        xtype: 'box',
                        listeners: {
                            render: function(component) {
                                component.getEl().on('click', function(e) {
                                    e.stopEvent();
                                    me.showSpatialBounds(record);
                                });    
                            }
                        },
                        autoEl: {
                          tag: 'a',
                          target : '_blank',
                          href: '#',
                          cn: 'Show extent'
                        }                      
                    },
                    {
                        xtype: 'box',
                        listeners: {
                            render: function(component) {            
                                component.getEl().on('click', function(e) {
                                    e.stopEvent();   
                                    me.displayFileDownloadWindow(record);
                                });    
                            }
                        },
                        autoEl: {
                          tag: 'a',
                          target : '_blank',
                          href: '#',
                          cn: 'Download file'
                        }
                    },
                    {
                        xtype: 'box',
                        listeners: {
                            render: function(component) {            
                                component.getEl().on('click', function(e) {
                                    e.stopEvent();   
                                    me.displayWMSLayers(record);
                                });    
                            }
                        },
                        id: addWMSLinkId,
                        autoEl: {                            
                          tag: 'a',
                          target : '_blank',
                          href: 'recordInfoUrl',
                          cn: 'Add WMS to map'
                        }
                    }]
                }]
                
            }
        }       
        
    },

    // TODO HEYA
    displayFileDownloadWindow : function(record){
        Ext.Msg.show({
            title:'Not implemented',
            msg: 'The selected function is not currently implemented.',
            buttons: Ext.Msg.OK
        });
    },    

    // TODO HEYA
    displayWMSLayers : function(record){
        Ext.Msg.show({
            title:'Not implemented',
            msg: 'The selected function is not currently implemented.',
            buttons: Ext.Msg.OK
        });
        
        /*
        Ext.create('ga.widgets.WMSSelectionWindow', {
            title : 'Add WMS Layers',
            cswRecord: record
        }).show();
        */
    },
    
    /**
     * Function to handle double click of the CSW to bring up a window to display its information
     */    
    displayInfo : function(record){
        Ext.create('Ext.window.Window', {
            title : 'CSW Record Information',
            items : [{
                xtype : 'cswmetadatapanel',
                width : 500,
                border : false,
                cswRecord : record
            }]
        }).show();
    }

});