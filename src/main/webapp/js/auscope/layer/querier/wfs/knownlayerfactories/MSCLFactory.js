/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require([ 'Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit',
        'Ext.window.MessageBox' ]);

function drawGraph(serviceUrl, boreholeHeaderId, startDepth, endDepth,
        observationToReturn) {

    // Define the model:
    Ext.define('DynamicModel', {
        extend : 'Ext.data.Model',
        fields : [ 'depth', observationToReturn ]
    });

    // Create the datastore:
    var store = Ext.create('Ext.data.Store', {
        model : 'DynamicModel',
        proxy : {
            type : 'ajax',
            url : 'getMsclObservationsForGraph.do',
            pageParam : undefined,
            startParam : undefined,
            limitParam : undefined,
            extraParams : {
                // .../wfs?request=GetFeature&typename=mscl:scanned_data&filter=%3CFilter%3E%0D%0A%09%3CPropertyIs%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Aborehole%3C%2FPropertyName%3E%0D%0A%09%09%3CLiteral%3EPRC-5%3C%2FLiteral%3E%0D%0A%09%3C%2FPropertyIs%3E%0D%0A%09%3CPropertyIsBetween%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Adepth%3C%2FPropertyName%3E%0D%0A%09%09%3CLowerBoundary%3E%0D%0A%09%09%09%3CLiteral%3E66.9%3C%2FLiteral%3E%0D%0A%09%09%3C%2FLowerBoundary%3E%0D%0A%09%09%3CUpperBoundary%3E%0D%0A%09%09%09%3CLiteral%3E89%3C%2FLiteral%3E%0D%0A%09%09%3C%2FUpperBoundary%3E%0D%0A%09%3C%2FPropertyIsBetween%3E%0D%0A%3C%2FFilter%3E
                serviceUrl : serviceUrl,
                boreholeHeaderId : boreholeHeaderId,
                startDepth : startDepth,
                endDepth : endDepth,
                observationToReturn : observationToReturn
            },
            reader : {
                type : 'json',
                root : 'data.series'
            },
            noCache : false
        },
        listeners : {
            load : {
                single : true,
                fn : function(sender, records, successful, eOpts) {
                    // This loop just keeps looking for the chart component
                    // until it gets a proper
                    // result. It prevents a race condition in which the store's
                    // load callback is
                    // called before the chart has been instantiated.
                    var chart;
                    do {
                        chart = Ext.getCmp('chart');
                    } while (chart == undefined);
                    chart.getEl().unmask();
                }
            }
        }

    });

    store.load();

    xAxisTitle = 
        observationToReturn == 'diameter' ? 'Diameter (cm)' :
        observationToReturn == 'p_wave_amplitude' ? 'P-Wave amp (dB)' :
        observationToReturn == 'p_wave_velocity' ? 'P-Wave vel (m/s)' :
        observationToReturn == 'density' ? 'Density (gm/cc)' :
        observationToReturn == 'magnetic_susceptibility' ? 'Mag. Sus. (cgs)' :
        observationToReturn == 'impedance' ? 'Impedance (Ohm)' :
        observationToReturn == 'natural_gamma' ? 'Natural gamma (Hz)' :
        observationToReturn == 'resistivity' ? 'Resistivity (Ohm/m)' :
        undefined;

    Ext.create('Ext.Window', {
        border : true,
        layout : 'fit',
        resizable : false,
        modal : true,
        plain : false,
        title : 'Changes to ' + xAxisTitle + ' over depth',
        items : [ Ext.create('Ext.chart.Chart', {
            id : 'chart',
            height : 700,
            width : 400,
            shadow : false,
            store : store,
            axes : [ {
                title : 'Depth (m)',
                type : 'Numeric',
                position : 'left',
                fields : [ 'depth' ],
                minorTickSteps : 1
            }, {
                title : xAxisTitle,
                type : 'Numeric',
                position : 'top',
                fields : [ observationToReturn ],
                minorTickSteps : 1
            } ],
            series : [ {
                type : 'line',
                xField : observationToReturn,
                yField : 'depth',
                showMarkers : false,
                style : {
                    'stroke-width' : 2
                }
            } ],
            listeners : {
                afterrender : {
                    single : true,
                    fn : function(chart) {
                        chart.getEl().mask("Loading...");
                    }
                }
            }
        }) ]
    }).show();
}

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
    parseKnownLayerFeature : function(featureId, parentKnownLayer,
            parentOnlineResource) {
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'MSCL Data',
            items : [ {
                itemId : 'msclDataPanel',
                xtype : 'fieldset',
                title : 'Petrophysical Observations',
                items : [ {
                    xtype : 'form',
                    border : 0,
                    items : [ {
                        xtype : 'numberfield',
                        fieldLabel : 'Start depth (m)',
                        name : 'startDepth',
                        allowBlank : false,
                        minValue : 0
                    }, {
                        xtype : 'numberfield',
                        fieldLabel : 'End depth (m)',
                        name : 'endDepth',
                        allowBlank : false,
                        minValue : 0
                    }, {
                        xtype : 'radiogroup',
                        fieldLabel : 'Observation',
                        // Arrange radio buttons into two columns, distributed
                        // vertically
                        columns : 2,
                        vertical : true,

                        items : [ {
                            boxLabel : 'Diameter',
                            name : 'observationToReturn',
                            inputValue : 'diameter'
                        }, {
                            boxLabel : 'P-Wav amp',
                            name : 'observationToReturn',
                            inputValue : 'p_wave_amplitude'
                        }, {
                            boxLabel : 'P-Wav vel',
                            name : 'observationToReturn',
                            inputValue : 'p_wave_velocity'
                        }, {
                            boxLabel : 'Density',
                            name : 'observationToReturn',
                            inputValue : 'density'
                        }, {
                            boxLabel : 'Mag sus',
                            name : 'observationToReturn',
                            inputValue : 'magnetic_susceptibility'
                        }, {
                            boxLabel : 'Impedence',
                            name : 'observationToReturn',
                            inputValue : 'impedance'
                        }, {
                            boxLabel : 'Natural Gamma',
                            name : 'observationToReturn',
                            inputValue : 'natural_gamma'
                        }, {
                            boxLabel : 'Resistivity',
                            name : 'observationToReturn',
                            inputValue : 'resistivity'
                        } ]
                    } ],
                    buttons : [ {
                        text : 'Submit',
                        formBind : true, // only enabled once the form is
                                            // valid
                        handler : function() {
                            var formValues = this.up('form').getForm()
                                    .getValues();
                            drawGraph(parentOnlineResource.get('url'),
                                    featureId, formValues.startDepth,
                                    formValues.endDepth,
                                    formValues.observationToReturn);
                        }
                    } ]
                } ]
            } ]
        });
    }
});