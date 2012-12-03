/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require([ 'Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox' ]);

function drawGraph(serviceUrl, boreholeHeaderId, startDepth, endDepth, observationsToReturn, maskedElement) {
    // I want this to always be an array, even if only has one element.
    observationsToReturn = [].concat(observationsToReturn);
    
    // Define the model:
    Ext.define('DynamicModel', {
        extend : 'Ext.data.Model',
        fields : observationsToReturn.concat('depth')
    });

    Ext.Ajax.request({
        url : 'getMsclObservationsForGraph.do',
        params: {
            // .../wfs?request=GetFeature&typename=mscl:scanned_data&filter=%3CFilter%3E%0D%0A%09%3CPropertyIs%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Aborehole%3C%2FPropertyName%3E%0D%0A%09%09%3CLiteral%3EPRC-5%3C%2FLiteral%3E%0D%0A%09%3C%2FPropertyIs%3E%0D%0A%09%3CPropertyIsBetween%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Adepth%3C%2FPropertyName%3E%0D%0A%09%09%3CLowerBoundary%3E%0D%0A%09%09%09%3CLiteral%3E66.9%3C%2FLiteral%3E%0D%0A%09%09%3C%2FLowerBoundary%3E%0D%0A%09%09%3CUpperBoundary%3E%0D%0A%09%09%09%3CLiteral%3E89%3C%2FLiteral%3E%0D%0A%09%09%3C%2FUpperBoundary%3E%0D%0A%09%3C%2FPropertyIsBetween%3E%0D%0A%3C%2FFilter%3E
            serviceUrl : serviceUrl,
            boreholeHeaderId : boreholeHeaderId,
            startDepth : startDepth,
            endDepth : endDepth,
            observationsToReturn : observationsToReturn
        },
        success: function(response) {
            var responseObject = Ext.decode(response.responseText);
            var windowTitle = '';
            var charts = [];
            for (var i = 0; i < observationsToReturn.length; i++) {
                var first = i == 0;
                var xAxisTitle = 
                    observationsToReturn[i] == 'diameter' ? 'Diameter (cm)' :
                    observationsToReturn[i] == 'p_wave_amplitude' ? 'P-Wave amp (dB)' :
                    observationsToReturn[i] == 'p_wave_velocity' ? 'P-Wave vel (m/s)' :
                    observationsToReturn[i] == 'density' ? 'Density (gm/cc)' :
                    observationsToReturn[i] == 'magnetic_susceptibility' ? 'Mag. Sus. (cgs)' :
                    observationsToReturn[i] == 'impedance' ? 'Impedance (Ohm)' :
                    observationsToReturn[i] == 'natural_gamma' ? 'Natural gamma (Hz)' :
                    observationsToReturn[i] == 'resistivity' ? 'Resistivity (Ohm/m)' : 
                    undefined;
                
                // Add the comma if needed:
                windowTitle += (windowTitle === '' ? '' : ', ') + xAxisTitle;
                
                var store = Ext.create('Ext.data.Store', {
                    model : 'DynamicModel',
                    data : responseObject.data.series
                });
                
                store.filter({ 
                    fn: function (item) {
                        // TODO ReverseAxisIssue: This code is here to workaround a
                        // limitation of ExtJS 4.1.1a; it doesn't have any option to
                        // 'reverse' the order of the y axis's values. We want to show
                        // the y values ascending as you read from top to bottom since
                        // this results in a plot which is more intuitive, i.e: as you
                        // look DOWN the line, you're seeing points that indicate the
                        // values of observations from cores further DOWN the borehole.
                        // The workaround is to invert the depth so that it becomes
                        // negative, and then manipulate the label renderer so that it
                        // doesn't display the negative sign.
                        // Look at the other TODO named 'ReverseAxisIssue', below,
                        // and see http://stackoverflow.com/questions/6133676/create-numericaxis-with-config-param-reverse-in-ext4
                        // for more info.
                        // This workaround can be removed if a new version of ExtJS
                        // reintroduces a 'reverse' option for the axis object.
                        item.data['depth'] = -item.data['depth'];
                        // End ReverseAxisIssue.
                        
                        // Only use items that actually have a value for the 
                        // desired observation:
                        return item.data[observationsToReturn[i]] != '';
                    }
                });

                // Create the array of charts
                charts[i] = Ext.create('Ext.chart.Chart', {
                    height : 700,
                    width : first ? 400 : 369, // The first chart is slightly wider to accommodate its yAxis label.
                    shadow : false,
                    store : store,
                    axes : [ {
                        title : first ? 'Depth (m)' : false, // Only the first chart will have a depth label.
                        type : 'Numeric',
                        position : 'left',
                        fields : [ 'depth' ],
                        minorTickSteps : 1
                        // TODO ReverseAxisIssue: See other TODO with this name,
                        // above, for more information.
                        // This code is here to modify the label's value so that
                        // it doesn't include the negative sign.                        
                        ,label : {
                            renderer: function(v) {
                                return Ext.util.Format.number(Math.abs(v), '0.0');
                            }
                        }
                        // End ReverseAxisIssue.
                    }, {
                        title : xAxisTitle,
                        type : 'Numeric',
                        position : 'top',
                        fields : [ observationsToReturn[i] ],
                        minorTickSteps : 1
                    } ],
                    series : [ {
                        type : 'line',
                        xField : observationsToReturn[i],
                        yField : 'depth',
                        showMarkers : false,
                        style : {
                            'stroke-width' : 1
                        }
                    } ]
                })
            }

            Ext.create('Ext.Window', {
                border : true,
                layout : 'hbox',
                resizable : false,
                modal : true,
                plain : false,
                title : 'Changes to ' + windowTitle + ' over Depth (m)',
                items : charts
            }).show();
            
            // Remove the load mask once the window has been rendered:
            maskedElement.setLoading(false);
        }
    });
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
                        xtype : 'checkboxgroup',
                        fieldLabel : 'Observation',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns : 2,
                        vertical : true,
                        items : [ {
                            boxLabel : 'Diameter',
                            name : 'observationToReturn',
                            inputValue : 'diameter',
                        }, {
                            boxLabel : 'P-Wave amplitude',
                            name : 'observationToReturn',
                            inputValue : 'p_wave_amplitude'
                        }, {
                            boxLabel : 'P-Wave velocity',
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
                        formBind : true, // only enabled once the form is valid
                        handler : function() {
                            var formValues = this.up('form').getForm().getValues();
                            var fieldset = this.up('fieldset');
                            fieldset.setLoading("Loading...");
                            drawGraph(parentOnlineResource.get('url'),
                                    featureId, formValues.startDepth,
                                    formValues.endDepth,
                                    formValues.observationToReturn,
                                    fieldset);
                        }
                    } ]
                } ]
            } ]
        });
    }
});