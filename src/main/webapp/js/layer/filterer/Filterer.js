Ext.define('portal.layer.filterer.Filterer', {
    extend: 'Ext.util.Observable',
    constructor: function(config){

        this.addEvents({
            "change" : true
        });

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    map : {},

    getParameters : function(){
        return this.map;
    }

    getParameter : function(key){
        return this.map[key];
    }

    setParameter : function(key,value){
        this.map[key]=value;
        this.fireEvent("change",this,key);
    }

});