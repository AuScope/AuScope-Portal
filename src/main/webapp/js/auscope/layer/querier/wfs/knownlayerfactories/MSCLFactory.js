/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.define('auscope.layer.querier.wfs.knownlayerfactories.MSCLFactory', {
    extend : 'portal.layer.querier.wfs.knownlayerfactories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only mscl-borehole layer.
     */
    supportsKnownLayer : function(knownLayer) {
        return knownLayer.getId() === 'mscl-borehole';
    },

    /**
     * Overrides abstract parseKnownLayerFeature
     */
    parseKnownLayerFeature : function(featureId, parentKnownLayer, parentOnlineResource) {
        // I want to return the data that's located here:
        // http://sisstest.arrc.csiro.au:8080/agos/wfs?request=GetFeature&version=1.1.0&typename=sa:SamplingFeatureCollection&maxfeatures=20&featureId=borehole_header.1

        
//        var store = Ext.create('Ext.data.Store', {
//            model : 'auscope.knownlayer.geodesy.Observation',
//            autoLoad : false,
//            proxy : {
//                type : 'ajax',
//                url : 'getGeodesyObservations.do',
//                extraParams : {
//                    serviceUrl : parentOnlineResource.get('url'),
//                    stationId : featureId
//                },
//                reader : {
//                    type : 'json',
//                    root : 'data'
//                }
//            }
//        });

        //Load the form in full - when it renders we'll actually check what is available.
        //The user won't be able to interact with the form prior to load due to the loading mask
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'MSCL Data',
            items : [{
                xtype : 'fieldset',
                title : 'Petrophysical Observations',
                items : [{
                    xtype : 'button',
                    text : 'Get the data',
                    // TODO: this seems a bit crap; is there a better way of doing this than hard-coding a WFS query string here?
                    // Should you allow users to control MaxFeatures too?
                    // How should all this be rendered?
                    href : parentOnlineResource.get('url') + '?request=GetFeature&version=1.1.0&typename=sa:SamplingFeatureCollection&featureId=' + featureId
                }]
            }]
        });
    }
});