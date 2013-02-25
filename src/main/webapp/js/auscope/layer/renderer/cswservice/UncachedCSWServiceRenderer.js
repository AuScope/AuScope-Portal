/**
 * An implementation of a portal.layer.renderer for controlling access to a CSW
 * service endpoint that hasn't been pre-cached.
 */
Ext.define('portal.layer.renderer.cswservice.UncachedCSWServiceRenderer', {
    extend : 'portal.layer.renderer.Renderer',

    _maximumCSWRecordsToRetrieveAtOnce : 100,

    config : {
        /**
         * 
         */
        icon : null
    },

    constructor : function(config) {
        // this.legend = Ext.create('portal.layer.legend.wfs.WFSLegend', {
        // iconUrl : config.icon ? config.icon.getUrl() : ''
        // });

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
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
        // 3. If numberOfRecords < $someLimit
        // then: just get them all (you can just request from position 2 onwards
        // since you already have the 1st).
        // else: ask the user if they want to get them all or just get some
        // 4. Render the responses. TODO: Will they be rendered as CSWRecords or
        // should the CSWOnlineResources be used
        // to determine which specialised renderer to use?

        // Here's step 1:
        // var running = true;
        var cswRecord = this.parentLayer.data.cswRecords[0].data;
        var cswServiceUrl = resources[0].data.url;
        var cqlText = cswRecord.descriptiveKeywords[0];
        
        var bboxFilter = filterer.spatialParam;
        var anyTextFilter = filterer.parameters.anyText;
        var titleFilter = filterer.parameters.title;
        var abstractFilter = filterer.parameters.abstract;
        

        _ajaxRequest = Ext.Ajax.request({
            url : 'getUncachedCSWRecords.do',
            params : {
                cswServiceUrl : cswServiceUrl,
                cqlText : cqlText,
                startPoint : 1,
                maxRecords : this._maximumCSWRecordsToRetrieveAtOnce,
                bbox : Ext.JSON.encode(bboxFilter),
                anyText : anyTextFilter,
                title : titleFilter,
                abstract_ : abstractFilter
            // TODO: add filtering bit here for date ranges.
            },
            scope: this,
            success : function(response) {
                response = Ext.JSON.decode(response.responseText);
                if (response.success) {
                    cswRecords = [];

                    for (i = 0; i < response.data.length; i++) {
                        cswRecords.push(Ext.create('portal.csw.CSWRecord',
                                response.data[i]));
                    }

                    var recordsReturned = cswRecords.length;
                    var recordsAvailable = response.totalResults;

                    if (recordsReturned <= recordsAvailable) {
                        
                        this.parentLayer.set('cswRecords', cswRecords);
                        
                        // Just show the results straight away:
                        var cswRenderer = Ext.create('portal.layer.renderer.csw.CSWRenderer', {
                            map : this.map,
                            icon : this.icon,
                            polygonColor: this.polygonColor
                        });
                        
                        cswRenderer.parentLayer = this.parentLayer;
                        
                        var wholeGlobe = Ext.create('portal.util.BBox', {
                            northBoundLatitude : 90,
                            southBoundLatitude : -90,
                            eastBoundLongitude : -180,
                            westBoundLongitude : 180                            
                        });
                        
                        var emptyFilter = Ext.create('portal.layer.filterer.Filterer', {
                            spatialParam : wholeGlobe}); 
                        
                        cswRenderer.displayData(cswRecords, 
                                emptyFilter,
                                undefined);
                    } else {
                        // We have to ask the user what they want to do.
                    }
                }
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
     * that can be applied to the speHoucified data sources
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
        this.primitiveManager.clearPrimitives();
    },

    /**
     * An abstract function - see parent class for more info
     */
    abortDisplay : function() {
        Ext.Ajax.abort(_ajaxRequest);
    }
});