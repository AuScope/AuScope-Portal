/**
 * An Ext.data.Store specialisation for storing
 * portal.layer.Layer objects.
 */
Ext.define('portal.layer.LayerStore', {
    extend: 'Ext.data.Store',

    /**
     * Creates an empty store - no configuration options
     */
    constructor : function() {
        this.callParent([{
            model : 'portal.layer.Layer',
            data : []
        }]);

        this.on('add', this._onLayerAdd);
        this.on('remove', this._onLayerRemove);
    },

    /**
     * Raised whenever a layer is added to this store.
     */
    _onLayerAdd : function(store, records, index, eOpts) {
        //For each layer, render it on the map
        for (var i = 0; i < records.length; i++) {
            var renderer = records[i].get('renderer');
            var filterer = records[i].get('filterer');
            var resources = records[i].getAllOnlineResources();

            renderer.displayData(resources, filterer, Ext.emptyFn);
        }
    },

    /**
     * Raised whenever a layer is removed from this store
     */
    _onLayerRemove : function(store, record, index, eOpts) {
        var renderer = record.data.renderer;
        renderer.abortDisplay();
        renderer.removeData();
    }
});