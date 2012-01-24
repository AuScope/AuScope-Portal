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
    extend: 'Ext.util.Observable',

    config : {
        parameters : {}
    }

    constructor: function(config){

        this.addEvents({
            'change' : true
        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    /**
     * Gets the set of parameters configured within this filter as
     * a simple javascript object with key/value pairs
     *
     * returns - a javascript object
     */
    getParameters : function() {
        return Ext.apply({}, this.parameters); //return a copy of the internal object
    }

    /**
     * Given a set of parameters as a plain old javascript object of
     * key/value pairs, apply it's contents to this filter.
     *
     * This is a useful function if you want to set multiple parameters
     * and only raise a single event
     *
     * parameters - a plain old javascript object
     */
    setParameters : function(parameters) {
        this.parameters = Ext.apply(this.parameters, parameters);

        //generate the list of keys that changed
        var key;
        var keyList = [];
        for (key in parameters) {
            keyList.push(key);
        }
        this.fireEvent('change', this, keyList);
    }

    /**
     * Sets a single parameter of this filter
     *
     * key - a string key whose value will be set. Will override any existing key of the same name
     * value - The object value to set
     */
    setParameter : function(key, value){
        this.parameters[key] = value;
        this.fireEvent('change', this, [key]);
    }

    /**
     * Gets the value of the specified key as an Object
     *
     * key - A string key whose value will be fetched.
     *
     * returns - a javascript object matching key
     */
    getParameter : function(key) {
        return this.parameters[key];
    }


});