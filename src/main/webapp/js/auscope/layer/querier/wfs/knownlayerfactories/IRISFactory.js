Ext.define('auscope.layer.querier.wfs.knownlayerfactories.IRISFactory', {
    extend : 'portal.layer.querier.wfs.knownlayerfactories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only IRIS layers.
     */
    supportsKnownLayer : function(knownLayer) {
        
        console.log('supportsKnownLayer');
        console.log(knownLayer.getId());
        // TODO: Why does this say mscl??
        return knownLayer.getId() === 'mscl-borehole';
    },

    /**
     * Overrides abstract parseKnownLayerFeature
     */
    parseKnownLayerFeature : function(featureId, parentKnownLayer,
            parentOnlineResource) {
//        return Ext.create('portal.layer.querier.BaseComponent', {
//            border : false,
//            tabTitle : 'MSCL Data',
//            items : [ {
//                xtype : 'fieldset',
//                title : 'Petrophysical Observations',
//                items : [ {
//                    xtype : 'form',
//                    border : 0,
//                    items : [ {
//                        xtype : 'numberfield',
//                        fieldLabel : 'Start depth (m)',
//                        name : 'startDepth',
//                        allowBlank : false,
//                        minValue : 0
//                    }, {
//                        xtype : 'numberfield',
//                        fieldLabel : 'End depth (m)',
//                        name : 'endDepth',
//                        allowBlank : false,
//                        minValue : 0
//                    }, {
//                        xtype : 'checkboxgroup',
//                        fieldLabel : 'Observation',
//                        // Arrange radio buttons into two columns, distributed vertically
//                        columns : 2,
//                        vertical : true,
//                        items : [ {
//                            boxLabel : 'Diameter',
//                            name : 'observationToReturn',
//                            inputValue : 'diameter',
//                        }, {
//                            boxLabel : 'P-Wave amplitude',
//                            name : 'observationToReturn',
//                            inputValue : 'p_wave_amplitude'
//                        }, {
//                            boxLabel : 'P-Wave velocity',
//                            name : 'observationToReturn',
//                            inputValue : 'p_wave_velocity'
//                        }, {
//                            boxLabel : 'Density',
//                            name : 'observationToReturn',
//                            inputValue : 'density'
//                        }, {
//                            boxLabel : 'Mag sus',
//                            name : 'observationToReturn',
//                            inputValue : 'magnetic_susceptibility'
//                        }, {
//                            boxLabel : 'Impedence',
//                            name : 'observationToReturn',
//                            inputValue : 'impedance'
//                        }, {
//                            boxLabel : 'Natural Gamma',
//                            name : 'observationToReturn',
//                            inputValue : 'natural_gamma'
//                        }, {
//                            boxLabel : 'Resistivity',
//                            name : 'observationToReturn',
//                            inputValue : 'resistivity'
//                        } ]
//                    } ],
//                    buttons : [ {
//                        text : 'Submit',
//                        formBind : true, // only enabled once the form is valid
//                        handler : function() {
//                            var formValues = this.up('form').getForm().getValues();
//                            var fieldset = this.up('fieldset');
//                            fieldset.setLoading("Loading...");
//                            drawGraph(parentOnlineResource.get('url'),
//                                    featureId, formValues.startDepth,
//                                    formValues.endDepth,
//                                    formValues.observationToReturn,
//                                    fieldset);
//                        }
//                    } ]
//                } ]
//            } ]
//        });
    }
});