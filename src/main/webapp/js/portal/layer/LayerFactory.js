/**
 * Factory class for creating instances of portal.layer.Layer.
 *
 * Instances are designed to be constructed from portal.cswCSWRecord
 * and portal.knownlayer.KnownLayer objects
 */
Ext.define('portal.layer.LayerFactory', {

    map : null,

    /**
     * Creates a new instance of this factory.
     *
     * @param cfg an object in the form
     * {
     *  map : An instance of a google map GMap2 object
     * }
     */
    constructor : function(cfg) {
        this.map = cfg.map;

        this.callParent(arguments);
    },

    /**
     * Utility function for generating a new Layer from a set of values. Returns a new instance of portal.layer.Layer
     * @param id String based ID for this instance
     * @param source An instance of portal.csw.CSWRecord or portal.knownlayer.KnownLayer that is generating this layer
     * @param name A human readable name/title of this layer
     * @param description  A human readable description/abstract of this layer
     * @param renderer A concrete implementation of a portal.layer.renderer.Renderer
     * @param filterer A concrete implementation of a portal.layer.filterer.Filterer
     * @param downloader A concrete implementation of a portal.layer.downloader.Downloader
     * @param querier A concrete implementation of a portal.layer.querier.Querier
     * @param cswRecords A single instance or Array of portal.csw.CSWRecord
     */
    generateLayer : function(id, source, name, description, renderer, filterer, downloader, querier, cswRecords) {
        //Generate appropriate sourceType string
        var sourceType = null;
        if (source instanceof portal.knownlayer.KnownLayer) {
            sourceType = portal.layer.Layer.KNOWN_LAYER;
        } else {
            sourceType = portal.layer.Layer.CSW_RECORD;
        }

        //If we have a singleton, turn it into an array
        if (!Ext.isArray(cswRecords)) {
            cswRecords = [cswRecords];
        }

        //Create our instance
        var newLayer = Ext.create('portal.layer.Layer', {
            id : id,
            sourceType : sourceType,
            source : source,
            name : name,
            description : description,
            renderer : renderer,
            filterer : filterer,
            downloader : downloader,
            querier : querier,
            cswRecords : cswRecords,
            loading : false
        });

        //Wire up references to our layer
        renderer.setParentLayer(newLayer);

        //Wire up our events so that the layer is listening for changes in its components
        renderer.on('renderstarted', Ext.bind(newLayer.onRenderStarted, newLayer));
        renderer.on('renderfinished', Ext.bind(newLayer.onRenderFinished, newLayer));
        renderer.on('visibilitychanged', Ext.bind(newLayer.onVisibilityChanged, newLayer));
        filterer.on('change', Ext.bind(newLayer.onFilterChanged, newLayer));


        return newLayer;
    },

    /**
     * Creates a new instance of renderer based on the specified values
     */
    _generateRenderer : function(wfsResources, wmsResources, proxyUrl, proxyCountUrl, iconUrl, iconSize, iconAnchor) {
        if (wmsResources.length > 0) {
            return Ext.create('portal.layer.renderer.wms.LayerRenderer', {map : this.map});
        } else if (wfsResources.length > 0) {
            return Ext.create('portal.layer.renderer.wfs.FeatureRenderer', {
                map : this.map,
                iconCfg : {
                    url : iconUrl,
                    size : iconSize,
                    anchor : iconAnchor
                },
                proxyUrl : proxyUrl ? proxyUrl : 'getAllFeatures.do',
                proxyCountUrl : proxyCountUrl
            });
        }

        alert('TODO - BBox renderer');
        return null;
    },

    /**
     * Creates a new instance of a Querier based on the specified values
     */
    _generateQuerier : function(wfsResources, wmsResources) {
        if (wfsResources.length > 0) {
            return Ext.create('portal.layer.querier.wfs.WFSQuerier', {
                rootCfg : {}
            });
        }

        alert('TODO - No supported querier');
        return null;
    },

    _generateFilterer : function() {
        return Ext.create('portal.layer.filterer.Filterer', {});
    },

    _generateDownloader : function(wfsResources, wmsResources, wcsResources) {
        if (wfsResources.length > 0) {
            return Ext.create('portal.layer.downloader.wfs.WFSDownloader', {});
        }

        alert('TODO - No supported downloader');
        return null;
    },

    /**
     * Generates a new instance of portal.layer.Layer from an existing KnownLayer object. Appropriate
     * renderers, queriers etc will be generated according to knownLayer's contents
     *
     * @param knownLayer an instance of portal.knownlayer.KnownLayer
     */
    generateLayerFromKnownLayer : function(knownLayer) {
        var id = knownLayer.data.id;
        var source = knownLayer;
        var description = knownLayer.data.description;
        var name = knownLayer.data.title;
        var cswRecords = knownLayer.data.cswRecords;
        var allOnlineResources = knownLayer.getAllOnlineResources();

        //We need to know what resources this known layer has available
        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        //Create our objects for interacting with this layer
        var renderer = this._generateRenderer(wfsResources, wmsResources,knownLayer.data.proxyUrl, knownLayer.data.proxyCountUrl,
                                              knownLayer.data.iconUrl, knownLayer.data.iconSize, knownLayer.data.iconAnchor);
        var querier = this._generateQuerier(wfsResources, wmsResources);
        var filterer = this._generateFilterer();
        var downloader = this._generateDownloader(wfsResources, wmsResources, wcsResources);

        return this.generateLayer(id, source, name, description, renderer, filterer, downloader, querier, cswRecords);
    },

    /**
     * Generates a new instance of portal.layer.Layer from an existing CSWRecord object. Appropriate
     * renderers, queriers etc will be generated according to CSWRecord's contents
     *
     * @param cswRecord an instance of portal.csw.CSWRecord
     */
    generateLayerFromCSWRecord : function(cswRecord) {
        var id = cswRecord.data.id;
        var source = cswRecord;
        var description = cswRecord.data.description;
        var name = cswRecord.data.name;
        var cswRecords = cswRecord;
        var allOnlineResources = cswRecord.data.onlineResources;

        //We need to know what resources this known layer has available
        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        //Create our objects for interacting with this layer
        var renderer = this._generateRenderer(wfsResources, wmsResources, undefined, undefined, undefined, undefined, undefined);
        var querier = this._generateQuerier(wfsResources, wmsResources);
        var filterer = this._generateFilterer();
        var downloader = this._generateDownloader(wfsResources, wmsResources, wcsResources);

        return this.generateLayer(id, source, name, description, renderer, filterer, downloader, querier, cswRecords);
    }
});