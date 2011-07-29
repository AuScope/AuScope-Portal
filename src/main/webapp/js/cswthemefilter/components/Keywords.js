Ext.namespace("CSWThemeFilter");

/**
 * An extension of CSWThemeFilter.BaseComponent to allow the selection of keywords
 */
CSWThemeFilter.Keywords = Ext.extend(CSWThemeFilter.BaseComponent, {
    constructor : function() {
        CSWThemeFilter.Keywords.superclass.constructor.call(this, {
            title : 'Keywords',
            collapsible : true,
            items : [{
                xtype : 'textfield',
                fieldLabel : 'Test Field'
            }]
        });
    },

    getFilterValues : function() {
        return {};
    },

    /**
     * The Keywords component supports all URN's
     */
    supportsTheme : function(urn) {
        return true;
    }
});
