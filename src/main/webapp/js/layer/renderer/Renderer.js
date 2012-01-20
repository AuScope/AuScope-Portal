Ext.define('portal.layer.renderer.Renderer', {
    extend: 'Ext.util.Observable',
    constructor: function(config){

        this.addEvents({
            "datadisplayed" : true,
            "displayerror" : true,
            "visibilitychanged" : true,
            "onclick" : true,
        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    displayData : Ext.emptyFn,

    getLegend : Ext.emptyFn,

    setVisbility : Ext.emptyFn,

    removeData : Ext.emptyFn

});