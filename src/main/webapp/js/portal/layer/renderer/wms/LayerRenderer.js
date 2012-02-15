/**
 * An implementation of a portal.layer.Renderer for rendering WMS Layers
 * that belong to a set of portal.csw.CSWRecord objects.
 */
Ext.define('portal.layer.renderer.wms.LayerRenderer', {
    extend: 'portal.layer.renderer.Renderer',

    constructor: function(config) {
        this.callParent(arguments);
    },

    /**
     * An abstract function for displaying data from a variety of data sources. This function will
     * raise the renderstarted and renderfinished events as appropriate. The effect of multiple calls
     * to this function (ie calling displayData again before renderfinished is raised) is undefined.
     *
     * This function will re-render itself entirely and thus may call removeData() during the normal
     * operation of this function
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
        this.removeData();
        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.WMS);

        for (var i = 0; i < wmsResources.length; i++) {
            var tileLayer = new GWMSTileLayer(this.map, new GCopyrightCollection(""), 1, 17);
            tileLayer.baseURL = wmsResources[i].get('url');
            tileLayer.layers = wmsResources[i].get('name');
            //TODO: VT: temporary workaround as filterer is not built yet. filterer.getParameter('opacity') should return non null value
            //tileLayer.opacity = filterer.getParameter('opacity');
            tileLayer.opacity=1;
            this.overlayManager.addOverlay(new GTileLayerOverlay(tileLayer));
        }
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
     * filterer - (same as displayData) A custom filter that can be applied to the specified data sources
     */
    getLegend : portal.util.UnimplementedFunction,

    /**
     * An abstract function that is called when this layer needs to be permanently removed from the map.
     * In response to this function all rendered information should be removed
     *
     * function()
     *
     * returns - void
     */
    removeData : function() {
        this.overlayManager.clearOverlays();
    },

    /**
     * You can't abort a WMS layer from rendering as it does so via img tags
     */
    abortDisplay : Ext.emptyFn
});