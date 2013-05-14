/**
 * An implementation of a portal.layer.renderer for controlling access to a CSW
 * service endpoint that hasn't been pre-cached.
 */
Ext.define('portal.layer.renderer.cswservice.UncachedCSWServiceRenderer', {
    extend : 'portal.layer.renderer.Renderer',

    _maximumCSWRecordsToRetrieveAtOnce : 100,
    
    _cswRenderer : null,
    
    _loadMask : null,
    
    _loadMaskCounter : 0,
    
    _ajaxRequests : [],

    config : {
        icon : null
    },

    constructor : function(config) {
        // this.legend = Ext.create('portal.layer.legend.wfs.WFSLegend', {
        // iconUrl : config.icon ? config.icon.getUrl() : ''
        // });

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
        this._loadMask = new Ext.LoadMask(Ext.getBody(), {msg : "Loading..." });
    },
    
    _displayCSWsWithCSWRenderer : function (cswRecords) {
        // This bit is a bit sneaky: we have to store the CSWRecords on this
        // parent layer so that we can make the CSWRenderer use them.
        // We temporarily store the existing records (i.e. the pointer to the
        // CSW endpoint) and then replace it at the end.
        var tempCSWRecords = this.parentLayer.get('cswRecords');
        this.parentLayer.set('cswRecords', cswRecords);
        
        // Show the results:
        _cswRenderer = Ext.create('portal.layer.renderer.csw.CSWRenderer', {
            map : this.map,
            icon : this.icon,
            polygonColor: this.polygonColor
        });
        
        _cswRenderer.parentLayer = this.parentLayer;
        
        var wholeGlobe = Ext.create('portal.util.BBox', {
            northBoundLatitude : 90,
            southBoundLatitude : -90,
            eastBoundLongitude : -180,
            westBoundLongitude : 180                            
        });
        
        var emptyFilter = Ext.create('portal.layer.filterer.Filterer', {
            spatialParam : wholeGlobe}); 
        
        _cswRenderer.displayData(
                cswRecords, 
                emptyFilter,
                undefined);
        
        // This is where we put the proper CSW record back. 
        // If this wasn't done you'd get a problem where you add
        // the layer to the map and apply filter and then try to
        // filter it again. The second filter will be applied to 
        // the results of the original request instead of the 
        // CSW endpoint itself.
        this.parentLayer.set('cswRecords', tempCSWRecords);
    },
    
    _getCSWRecords : function(resources, filterer, maximumRecords, callback) {
        var cswRecord = this.parentLayer.data.cswRecords[0].data;
        var recordInfoUrl = cswRecord.recordInfoUrl;
        var cswServiceUrl = resources[0].data.url;

        var defaultAnyTextFilter = cswRecord.descriptiveKeywords[0];
        
        var bboxFilter = filterer.spatialParam;
        var anyTextFilter = filterer.parameters.anyText;
        var titleFilter = filterer.parameters.title;
        var abstractFilter = filterer.parameters.abstract;
        var metadataDateFilterFrom = filterer.parameters.metadata_change_date_from;
        var metadataDateFilterTo = filterer.parameters.metadata_change_date_to;
        var temporalExtentFilterFrom = filterer.parameters.temporal_extent_date_from;
        var temporalExtentFilterTo = filterer.parameters.temporal_extent_date_to;
        
        // This _loadMaskCounter is preventing an issue whereby
        // loadMask.show was called a second time before hide had been called at all.
        // It would mean that the first call to hide() would get rid of the load mask
        // even though it should still be kept on. It's because the callback arguments
        // to this method also include calls to this method.
        if (this._loadMaskCounter == 0) {
            this._loadMask.show();
        }
        
        this._loadMaskCounter++;
        
        var anyText = defaultAnyTextFilter || '';
        anyText += (anyText.length > 0 && anyTextFilter.length > 0 ? " " : '') + anyTextFilter;       
        
        this._ajaxRequests.push(Ext.Ajax.request({
            url : 'getUncachedCSWRecords.do',
            params : {
                cswServiceUrl : cswServiceUrl,
                recordInfoUrl : recordInfoUrl,
                startPoint : 1,
                maxRecords : maximumRecords,
                bbox : Ext.JSON.encode(bboxFilter),
                anyText : anyText,
                title : titleFilter,
                abstract_ : abstractFilter,
                metadataDateFrom : metadataDateFilterFrom, 
                metadataDateTo : metadataDateFilterTo,
                temporalExtentFrom : temporalExtentFilterFrom,
                temporalExtentTo : temporalExtentFilterTo
            },
            scope: this,
            success : callback,
            callback : function() {
                if (this._loadMaskCounter == 1) {
                    this._loadMask.hide();    
                }
                
                this._loadMaskCounter--;
            }
        }));
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
    displayData : function(resources, filterer, callback) {
        // This method is called at the time the user presses "Apply Filter >>".
        // You need to do the following things:
        // 
        // 1. Make the request for the CSW records with the specified filter but
        // tell it you only want 1 record.
        // 2. Use that record's 'total number of records' field to decide
        // whether or not you should request the rest of them.
        // 3. If numberOfRecords < this._maximumCSWRecordsToRetrieveAtOnce
        // then: get them all
        // else: ask the user if they want get the first this._maximumCSWRecordsToRetrieveAtOnce 
        // number of records or abort.
        // 4. Render the responses as CSWRecords.
        this.removeData();
        
        // Just try to get one record first so that we can pull out the total result from response
        this._getCSWRecords(resources, filterer, 1, function(initialResponse) {
            initialResponse = Ext.JSON.decode(initialResponse.responseText);
                
            var cswRecords = [],
                me = this;
            if (initialResponse.totalResults > this._maximumCSWRecordsToRetrieveAtOnce) {
                
                // We have to ask the user what they want to do.
                Ext.Msg.show({
                    title:'Display partial result set?',
                    msg: 'This query returns more than ' + this._maximumCSWRecordsToRetrieveAtOnce + 
                    ' records. The portal will only show the first ' + this._maximumCSWRecordsToRetrieveAtOnce + 
                    ' records. Alternatively, you can abort this operation, adjust your filter and try again.',
                    buttonText: {
                        yes : 'Display ' + this._maximumCSWRecordsToRetrieveAtOnce + ' records',
                        no : 'Abort'
                    },
                    icon: Ext.Msg.QUESTION,
                    fn : function (buttonId) {
                        if (buttonId == 'yes') {
                            me._getCSWRecords(resources, filterer, me._maximumCSWRecordsToRetrieveAtOnce, function(response) {
                                response = Ext.JSON.decode(response.responseText);
                                if (response.success) {
                                    for (i = 0; i < response.data.length; i++) {
                                        cswRecords.push(Ext.create('portal.csw.CSWRecord', response.data[i]));
                                    }
                                }
                                
                                me._displayCSWsWithCSWRenderer(cswRecords);
                            });
                        }
                    }
                });
            }
            else {
                me._getCSWRecords(resources, filterer, me._maximumCSWRecordsToRetrieveAtOnce, function(response) {
                    response = Ext.JSON.decode(response.responseText);
                    if (response.success) {
                        for (i = 0; i < response.data.length; i++) {
                            cswRecords.push(Ext.create('portal.csw.CSWRecord', response.data[i]));
                        }
                    }
                    
                    me._displayCSWsWithCSWRenderer(cswRecords);
                });
            }
        });
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
        if (typeof(_cswRenderer) != 'undefined' && _cswRenderer != null) {
            _cswRenderer.removeData();
        }

        this.primitiveManager.clearPrimitives();
    },

    /**
     * An abstract function - see parent class for more info
     */
    abortDisplay : function() {
        for (var i = 0; i < this._ajaxRequests.length; i++) {
            Ext.Ajax.abort(this._ajaxRequests[i]);
        }
    }
});