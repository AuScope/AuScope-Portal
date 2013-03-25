/**
 * An implementation of a portal.layer.renderer for rendering IRIS sites
 * as transformed by the AuScope portal backend.
 */
Ext.define('portal.layer.renderer.iris.IRISRenderer', {
    extend: 'portal.layer.renderer.Renderer',

    config : {
        /**
         * portal.map.Icon - Information about the icon that is used to represent point locations of this IRIS feed.
         */
        icon : null
    },

    constructor: function(config) {
        this.legend = Ext.create('portal.layer.legend.wfs.WFSLegend', {
            iconUrl : config.icon ? config.icon.getUrl() : ''
        });
        
        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
    },
    
    /**
     * A handle to the currently executed ajax request. It's kept so
     * that we can abort the request if the user tries to remove the layer
     * before it's completed.
     */
    _ajaxRequest : null,

    /**
     * An implementation of the abstract base function. See comments in superclass
     * for more information.
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer filterer,
     *          function(portal.layer.renderer.Renderer this, portal.csw.OnlineResource[] resources, portal.layer.filterer.Filterer filterer, bool success) callback
     *
     * returns - void
     *
     * resources - an array of data sources which should be used to render data
     * filterer - A custom filter that can be applied to the specified data sources
     * callback - Will be called when the rendering process is completed and passed an instance of this renderer and the parameters used to call this function
     */
    displayData : function(resources, filterer, callback) {
        var me = this;
        var irisResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.IRIS);
        var irisResource = irisResources[0];
        var serviceUrl = irisResource.data.url;
        var networkCode = irisResource.data.name;        
        me.renderStatus.initialiseResponses([serviceUrl], 'Loading...');
        var layer = me.parentLayer;

        // Keep track of the _ajaxRequest handle so that we can abort it if need be:
        _ajaxRequest = Ext.Ajax.request({
            url : 'getIRISStations.do',
            params : {
                serviceUrl : serviceUrl,
                networkCode : networkCode
            },
            success : function(response) {
                var jsonReponse = Ext.JSON.decode(response.responseText);

                // This is a bit cheeky because I'm using the WFS KML parser but it's the same anyway as
                // this is what I'm generating. I don't really know why the KML parser is in the WFS
                // namespace because to me it seems like they shouldn't be coupled...
                var parser = Ext.create('portal.layer.renderer.wfs.KMLParser', {kml : jsonReponse.data.kml, map : me.map});
                var primitives = parser.makePrimitives(me.icon, irisResource, layer);
                
                // Add our single points and overlays to the overlay manager (which will add them to the map)
                me.primitiveManager.addPrimitives(primitives);
                
                var s = primitives.length == 1 ? '' : 's';
                me.renderStatus.updateResponse(serviceUrl, primitives.length + " record" + s + " retrieved.");
            }
        });
    },

    /**
     * An abstract function for creating a legend that can describe the displayed data. If no
     * such thing exists for this renderer then null should be returned.
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer filterer)
     *
     * returns - portal.layer.legend.Legend or null
     *
     * resources - (same as displayData) an array of data sources which should be used to render data
     * filterer - (same as displayData) A custom filter that can be applied to the speHoucified data sources
     */
    getLegend : function(resources, filterer) {
        return this.legend;
    },

    /**
     * An abstract function that is called when this layer needs to be permanently removed from the map.
     * In response to this function all rendered information should be removed
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