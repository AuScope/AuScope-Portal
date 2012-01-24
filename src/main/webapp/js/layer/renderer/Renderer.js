/**
 * Renderer is an abstract class representing the process of
 * requesting and displaying data from a data source.
 *
 *  events:
 *      datadisplayed(portal.layer.renderer.Renderer this, portal.csw.OnlineResource[] resources, portal.layer.filterer.Filterer filterer)
 *          Fired whenever the renderer displays new data successfully
 *      datadisplayed(portal.layer.renderer.Renderer this, portal.csw.OnlineResource[] resources, portal.layer.filterer.Filterer filterer)
 *          Fired whenever the renderer fails to render new data
 *      visibilitychanged(portal.layer.renderer.Renderer this, bool newVisibility)
 *          Fired whenever the layer's visibility changes
 */
Ext.define('portal.layer.renderer.Renderer', {
    extend: 'Ext.util.Observable',

    /**
     * Configuration values for all renderers
     */
    config : {
        visible : true
    }

    constructor: function(config){

        this.addEvents({
            'datadisplayed' : true,
            'displayerror' : true,
            'visibilitychanged' : true
        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    /**
     * An abstract function for displaying data from a variety of data sources.
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
    displayData : portal.util.UnimplementedFunction,

    /**
     * An abstract function for creating a legend that can describe the displayed data
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer filterer)
     *
     * returns - portal.layer.legend.Legend
     *
     * resources - (same as displayData) an array of data sources which should be used to render data
     * filterer - (same as displayData) A custom filter that can be applied to the specified data sources
     */
    getLegend : portal.util.UnimplementedFunction,

    /**
     * An abstract function that is called when this layer needs to be permanantly removed from the map.
     * In response to this function all rendered information should be removed
     *
     * function()
     *
     * returns - void
     */
    removeData : portal.util.UnimplementedFunction

    /**
     * A function for setting this layer's visibility.
     *
     * visible - a bool
     */
    setVisible : function(visible) {
        this.visible = visible;
        this.fireEvent('visibilitychanged', this, visible);
    }

});