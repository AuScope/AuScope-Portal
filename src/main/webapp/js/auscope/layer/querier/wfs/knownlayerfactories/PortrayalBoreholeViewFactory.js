/**
 * A factory for parsing WFS features from the National Virtual Core Library known layer.
 */
Ext.define('auscope.layer.querier.wfs.knownlayerfactories.PortrayalBoreholeViewFactory', {
    extend : 'auscope.layer.querier.wfs.knownlayerfactories.NVCLFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only the Portrayal Borehole View known layer
     */
    supportsKnownLayer : function(knownLayer) {
        return (knownLayer.getId() === 'sf0-borehole-nvcl' || knownLayer.getId() === 'nvcl-v2-borehole');
    }

});