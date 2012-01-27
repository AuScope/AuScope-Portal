/**
 * A downloader is an abstract class representing the
 * functionality of downloading a layer's data in some
 * form of archive. Typically as a ZIP
 */
Ext.define('portal.layer.downloader.Downloader', {
    extend: 'Ext.util.Observable',

    constructor: function(config){
        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    /**
     * An abstract function for downloading all data
     * from a particular data source
     *
     * The result of the query should be that the user
     * is prompted for a download (via an actual download
     * or some form of popup prompt).
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer renderedFilterer,
     *          portal.layer.filterer.Filterer currentFilterer)
     *
     * returns - void (implementors should implement some form of prompt)
     *
     * resources - an array of data sources that were used to render data
     * renderedFilterer - custom filter that was applied when rendering the specified data sources
     * currentFilterer - The value of the custom filter, this may differ from renderedFilterer if the
     *                   user has updated the form/map without causing a new render to occur
     */
    downloadData : portal.util.UnimplementedFunction
});