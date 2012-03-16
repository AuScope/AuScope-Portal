/**
 * A factory for parsing a gsml:Borehole element.
 */
Ext.define('portal.layer.querier.wfs.factories.GeophysicsAnomaliesFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return false;
    },

    parseNode : function(domNode, wfsUrl) {
        //Empty component
        return Ext.create('portal.layer.querier.BaseComponent', {
        });
    }
});