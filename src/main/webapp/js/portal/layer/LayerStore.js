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

        this.on('remove', this._onLayerRemove);
    },

    /**
     * Raised whenever a layer is removed from this store. Used to
     * ensure that the layer's data is removed from the map.
     */
    _onLayerRemove : function(store, record, index, eOpts) {
        var renderer = record.data.renderer;
        renderer.abortDisplay();
        renderer.removeData();
    }
});