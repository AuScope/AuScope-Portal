/**
 * An abstract class represent a 'hash map esque' class
 * representing a custom filter that may be applied a layer
 * for the purposes of subsetting it's referenced data sources
 *
 * events :
 *      change(portal.layer.filterer.Filterer this, String[] keys)
 *          Fired whenever the filter changes, passed an array of all keys that have changed.
 */
Ext.define('portal.layer.filterer.Filterer', {
    extend: 'portal.util.ObservableMap',

    constructor: function(config){
        this.callParent(arguments)
    }
});