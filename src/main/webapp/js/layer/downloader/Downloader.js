Ext.define('portal.layer.downloader.Downloader', {
    extend: 'Ext.util.Observable',
    constructor: function(config){

        this.addEvents({
            "start" : true,
            "finish" : true
        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    downloadData : Ext.emptyFn


});