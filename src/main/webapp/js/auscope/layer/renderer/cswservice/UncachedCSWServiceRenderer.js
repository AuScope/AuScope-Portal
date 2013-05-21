/**
 * An implementation of a portal.layer.renderer for controlling access to a CSW
 * service endpoint that hasn't been pre-cached.
 */
Ext.define('portal.layer.renderer.cswservice.UncachedCSWServiceRenderer', {
    extend : 'portal.layer.renderer.Renderer',

    config : {
        /**
         *
         */
        icon : null
    },

    _cswRenderer : null,
    layerCSW : null,

    constructor : function(config) {

        // this.legend = Ext.create('portal.layer.legend.wfs.WFSLegend', {
        // iconUrl : config.icon ? config.icon.getUrl() : ''
        // });

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
    },

    _displayCSWsWithCSWRenderer : function (cswRecords) {
        //append the cswRecords to the layer
        var tempCSWRecords = this.parentLayer.get('cswRecords');

        if (!this.layerCSW) {
            this.layerCSW = tempCSWRecords;
        }

        var distinctCSWRecords = [];

        var keyArray = [];

        for (var j=0; j<tempCSWRecords.length;j++) {
            keyArray[tempCSWRecords[j].get('id')] = true;
        }

        for (var i = 0; i< cswRecords.length;i++) {
            if (!(keyArray[cswRecords[i].get('id')])) {
                distinctCSWRecords.push(cswRecords[i]);
            }
        }

        tempCSWRecords = tempCSWRecords.concat(distinctCSWRecords);
        this.parentLayer.set('cswRecords', tempCSWRecords);

        if (!this._cswRenderer) {
            // Show the results:
            this._cswRenderer = Ext.create('portal.layer.renderer.csw.CSWRenderer', {
                map : this.map,
                icon : this.icon,
                polygonColor: this.polygonColor
            });
        }

        this._cswRenderer.parentLayer = this.parentLayer;

        var wholeGlobe = Ext.create('portal.util.BBox', {
            northBoundLatitude : 90,
            southBoundLatitude : -90,
            eastBoundLongitude : -180,
            westBoundLongitude : 180
        });

        var emptyFilter = Ext.create('portal.layer.filterer.Filterer', { spatialParam : wholeGlobe });

        this._cswRenderer.displayData(distinctCSWRecords, emptyFilter, undefined);
    },

    /**
     * Call back function to handle double click of the CSW to bring up a window to display its information
     */
    _callBackDisplayInfo : function(record){
        Ext.create('Ext.window.Window', {
            title : 'CSW Record Information',
            items : [{
                xtype : 'cswmetadatapanel',
                width : 500,
                border : false,
                cswRecord : record
            }]
        }).show();
    },

    /**
     *
     * Function to handle adding all csw records to map
     */
    _addAllFilteredCSWHandler : function(cfg, scope) {
        var me = this;
        var cswRecordStore = Ext.create('Ext.data.Store', {
            id:'addAllCSWStore',
            autoLoad: false,
            model : 'portal.csw.CSWRecord',
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: 'getUncachedCSWRecords.do',
                extraParams:cfg.extraParams,
                reader: {
                    type: 'json',
                    root: 'data',
                    successProperty: 'success',
                    totalProperty: 'totalResults'
                }

            },
            listeners : {
                load : function( store, records, successful, operation, eOpts ){
                    //VT: a cap for testing purposes. Even though results are paged, we really
                    //shouldn't allow more than 200 results // && store.lastOptions.page < 10
                    if(successful && records.length > 0){
                        me._displayCSWsWithCSWRenderer(records);
                        store.nextPage();
                    }else{
                        scope.fireEvent('renderfinished', scope);
                    }
                }
            }
        });

        cswRecordStore.load({
            params:{
                limit : 50,
                start : 1
            },
        });
    },

    /**
     * An implementation of the abstract base function. See comments in
     * superclass for more information.
     *
     * function(portal.csw.OnlineResource[] resources,
     * portal.layer.filterer.Filterer filterer,
     * function(portal.layer.renderer.Renderer this, portal.csw.OnlineResource[]
     * resources, portal.layer.filterer.Filterer filterer, bool success)
     * callback
     *
     * returns - void
     *
     * resources - an array of data sources which should be used to render data
     * filterer - A custom filter that can be applied to the specified data
     * sources callback - Will be called when the rendering process is completed
     * and passed an instance of this renderer and the parameters used to call
     * this function
     */

    displayData : function(resources, filterer, callback,event) {
        //adding a optional parameter event to capture what event calls to display Data. Slightly dodgy
        //and feel free to change if there is a better way of doing this.
        if (event === 'visibilityChange') {
            this._displayCSWsWithCSWRenderer([]);
            return;
        } else if (this.layerCSW) {
            this.parentLayer.set('cswRecords', this.layerCSW);
            this._cswRenderer.parentLayer = this.parentLayer;
        }

        var pageSize = 20;
        this.removeData();
        me = this;
        var cswRecord = this.parentLayer.data.cswRecords[0].data;
        var recordInfoUrl = cswRecord.recordInfoUrl;

        var anyTextFilter = filterer.parameters.anyText;
        var defaultAnyTextFilter = cswRecord.descriptiveKeywords[0];
        var anyText = defaultAnyTextFilter || '';
        anyText += (anyText.length > 0 && anyTextFilter.length > 0 ? " " : '') + anyTextFilter;

        // get bounding box fields, use default max values if empty
        var north = (filterer.parameters.lat_max.length > 0) ? Number(filterer.parameters.lat_max) : 90;
        var east = (filterer.parameters.long_max.length > 0) ? Number(filterer.parameters.long_max) : 180;
        var south = (filterer.parameters.lat_min.length > 0) ? Number(filterer.parameters.lat_min) : -90;
        var west = (filterer.parameters.long_min.length > 0) ? Number(filterer.parameters.long_min) : -180;
        
        // validate against non numerical values                
        if (isNaN(north) || isNaN(east) || isNaN(south) || isNaN(west)) {
        	alert("You have entered invalid bounding box filter values! Please re-enter and try again.");
        	return;
        }        
        // zoom out to max view to show everything
        var fullBbox = Ext.create('portal.util.BBox',{
          	  northBoundLatitude : 90,
              southBoundLatitude : -90,
              eastBoundLongitude : -180,
              westBoundLongitude : 180
          });               
        this.map.scrollToBounds(fullBbox);
        // then highlight bounding box 
        // check for 90 and -90 because they reproject to infinity
        var bbox = Ext.create('portal.util.BBox',{
          	  northBoundLatitude : (north >= 90 ? 85 : north),
              southBoundLatitude : (south <= -90 ? -85 : south),
              eastBoundLongitude : east,
              westBoundLongitude : west,
              crs : 'EPSG:3857'
          });
        this.map.highlightBounds(bbox);
        
        var configuration = Ext.apply({}, {
                extraParams : {
                    cswServiceUrl : resources[0].data.url,
                    recordInfoUrl : cswRecord.recordInfoUrl,
                    bbox : Ext.JSON.encode(filterer.spatialParam),
                    northBoundLatitude : north,
                    eastBoundLongitude : east,
                    southBoundLatitude : south,
                    westBoundLongitude : west,
                    anyText : anyText,
                    title : filterer.parameters.title,
                    abstract_ : filterer.parameters.abstract,
                    metadataDateFrom : filterer.parameters.metadata_change_date_from,
                    metadataDateTo : filterer.parameters.metadata_change_date_to,
                    temporalExtentFrom : filterer.parameters.temporal_extent_date_from,
                    temporalExtentTo : filterer.parameters.temporal_extent_date_to
                },

                pagingConfig:{
                    limit : pageSize,
                    start : 1
                },

                callback: this._callBackDisplayInfo
        });

        Ext.create('Ext.window.Window', {
            title: 'CSW Record Selection',
            height: 500,
            width: 650,
            layout: 'fit',
            items: [{  // Let's put an empty grid in just to illustrate fit layout
                id : 'pagingPanel',
                xtype: 'cswpagingpanel',
                cswConfig : configuration,
                layout : 'fit'
            }],

            buttonAlign : 'right',
            buttons : [{
                xtype : 'button',
                text : 'Add Selected Records',
                iconCls : 'add',
                handler : function(button, e) {

                    var cswPagingPanel = button.findParentByType('window').getComponent('pagingPanel');
                    var csw = cswPagingPanel.getSelectionModel().getSelection();
                    me._displayCSWsWithCSWRenderer(csw);
                }
            },{
                xtype : 'button',
                text : 'Add All Current Page Records',
                iconCls : 'addall',
                handler : function(button, e) {
                    var cswPagingPanel = button.findParentByType('window').getComponent('pagingPanel');
                    var allStore = cswPagingPanel.getStore();
                    var cswRecords = allStore.getRange();
                    me._displayCSWsWithCSWRenderer(cswRecords);
                }
            },{
                xtype : 'button',
                text : 'Add All Records',
                iconCls : 'addall',
                handler : function(button, e) {
                    var cswPagingPanel = button.findParentByType('window').getComponent('pagingPanel');
                    var allStore = cswPagingPanel.getStore();
                    if (allStore.getTotalCount() > 500) {
                        Ext.MessageBox.show({
                            title: "Warning",
                            msg:   'The query you have requested returns more than 500 records.<br>' +
                                   'Your browser may not be able to load this much data and crash.<br>' +
                                   'Would you like to continue?',
                            icon: Ext.MessageBox.WARNING,
                            buttons: Ext.MessageBox.OKCANCEL,
                            fn: function(buttonId) {
                                if (buttonId === "ok") {
                                    me.fireEvent('renderstarted', me, null, null);
                                    me._addAllFilteredCSWHandler(configuration, me);
                                }
                            }
                        });
                    } else {
                        me.fireEvent('renderstarted', me, null, null);
                        me._addAllFilteredCSWHandler(configuration, me);
                    }
                }
            }]
        }).show();
    },

    /**
     * An abstract function for creating a legend that can describe the
     * displayed data. If no such thing exists for this renderer then null
     * should be returned.
     *
     * function(portal.csw.OnlineResource[] resources,
     * portal.layer.filterer.Filterer filterer)
     *
     * returns - portal.layer.legend.Legend or null
     *
     * resources - (same as displayData) an array of data sources which should
     * be used to render data filterer - (same as displayData) A custom filter
     * that can be applied to the specified data sources
     */
    getLegend : function(resources, filterer) {
        return this.legend;
    },

    /**
     * An abstract function that is called when this layer needs to be
     * permanently removed from the map. In response to this function all
     * rendered information should be removed
     *
     * function()
     *
     * returns - void
     */
    removeData : function() {
        if (typeof(this._cswRenderer) != 'undefined' && this._cswRenderer != null) {
            this._cswRenderer.removeData();
        }

        this.primitiveManager.clearPrimitives();
    },

    /**
     * An abstract function - see parent class for more info
     */
    abortDisplay : Ext.emptyFn
});