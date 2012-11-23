/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

function drawGraph(
        serviceUrl,
        boreholeHeaderId,
        startDepth,
        endDepth,
        observationToReturn) {
    
    // Define the model:
    Ext.define('DynamicModel', {
        extend: 'Ext.data.Model',
        fields: ['depth', observationToReturn]
    });
    
    // Create the datastore:
    var store = Ext.create('Ext.data.Store', {
        model : 'DynamicModel',
        proxy : {
            type : 'ajax',
            url : 'getMsclObservationsForGraph.do',
            pageParam: undefined,
            startParam: undefined,
            limitParam: undefined,
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
            noCache: false
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
    	observationToReturn == 'resistivity' ? 'Resistivity (Ohm/m)' : undefined;
    
    Ext.create('Ext.Window', {
        border      : true,
        layout      : 'fit',
        resizable   : false,
        modal       : true,
        plain       : false,
        title       : 'Changes to ' + xAxisTitle + ' over depth',
        items       : [
            Ext.create('Ext.chart.Chart', {
                height      : 700,
                width       : 400,
                shadow: false,
                store: store,
                axes: [ // TODO: Make dynamic
                    {
                        title: 'Depth (m)',
                        type: 'Numeric',
                        position: 'left',
                        fields: ['depth'],
                        //minimum: Math.floor(startDepth / 50) * 50, // Round down to a multiple of 50
                        //maximum: Math.ceil(endDepth / 50) * 50, // Round up to a multiple of 50
//                        minimum: 60,
//                        maximum: 200,
//                        majorTickSteps: 10,
                        minorTickSteps: 1
                    },
                    {
                        title: xAxisTitle,
                        type: 'Numeric',
                        position: 'top',
                        fields: [observationToReturn],
//                        minimum: 4,
//                        maximum: 7,
//                        majorTickSteps: 5,
                        minorTickSteps: 1
                    }
                ],
                series: [
                    {
                        type: 'line',
                        xField: observationToReturn,
                        yField: 'depth',
                        showMarkers: false,
                        style: {
                            'stroke-width': 2
                        }
                    }
                ]
            })
        ]
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
    parseKnownLayerFeature : function(featureId, parentKnownLayer, parentOnlineResource) {
		return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'MSCL Data',
            items : [{
	        	itemId : 'msclDataPanel',
	            xtype : 'fieldset',
	            title : 'Petrophysical Observations',
	            items: [
	           	{
	           	    xtype: 'form',
	           	    border: 0,
	           	    items: 
	           	    [
           	            {
           	                xtype : 'numberfield',
                            fieldLabel : 'Start depth (m)',
                            name : 'startDepth',
                            allowBlank : false,
                            minValue : 0
                        },
                        {
                            xtype : 'numberfield',
                            fieldLabel : 'End depth (m)',
                            name : 'endDepth',
                            allowBlank : false,
                            minValue : 0
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'Observation',
                            // Arrange radio buttons into two columns, distributed vertically
                            columns: 2,
                            vertical: true,
                            
                            items: [
								{ boxLabel: 'Diameter', name: 'observationToReturn', inputValue: 'diameter' },
								{ boxLabel: 'P-Wav amp', name: 'observationToReturn', inputValue: 'p_wave_amplitude' },
								{ boxLabel: 'P-Wav vel', name: 'observationToReturn', inputValue: 'p_wave_velocity' },
								{ boxLabel: 'Density', name: 'observationToReturn', inputValue: 'density' },
								{ boxLabel: 'Mag sus', name: 'observationToReturn', inputValue: 'magnetic_susceptibility' },
								{ boxLabel: 'Impedence', name: 'observationToReturn', inputValue: 'impedance' },
								{ boxLabel: 'Natural Gamma', name: 'observationToReturn', inputValue: 'natural_gamma' },
								{ boxLabel: 'Resistivity', name: 'observationToReturn', inputValue: 'resistivity' }
                            ]
                        }
                    ],
                    buttons:
                    [
                     	{
                     		text: 'Submit',
                            formBind: true, //only enabled once the form is valid
                            handler: function() {
                            	var formValues = this.up('form').getForm().getValues();
                            	drawGraph(
		            		        parentOnlineResource.get('url'),
		            		        featureId,
		            		        formValues.startDepth,
		            		        formValues.endDepth,
		            		        formValues.observationToReturn);
                            }
                     	}
                    ]
	           	}]
	    	}]
    	});	
    }
});


























/* THIS IS WORKING 








parseKnownLayerFeature : function(featureId, parentKnownLayer, parentOnlineResource) {
	var tp = Ext.create('Ext.TabPanel', {
        xtype           : 'tabpanel',
        activeItem      : 0,
        enableTabScroll : true,
        buttonAlign     : 'center',
        items           : []
    });

	var win = Ext.create('Ext.Window', {
		border      : true,
        layout      : 'fit',
        resizable   : false,
        modal       : true,
        plain       : false,
        title       : 'Title', // TODO: Title
        height      : 800,
        width       : 400,
        items		: [ tp ]
    });
	
	// This is of the format: http://$domain:$port/$some_path/wfs
	var wfsUrl = parentOnlineResource.get('url');
	
	// For now, just get a button that sends a hard-coded request:
	return Ext.create('portal.layer.querier.BaseComponent', {
        border : false,
        tabTitle : 'MSCL Data',
        items : [{
        	itemId : 'msclDataPanel',
            xtype : 'fieldset',
            title : 'Petrophysical Observations',
            items: [{
            	xtype : 'button',
            	text : 'Submit',
            	listeners : {
	            	click : function (e, eOpts) {
	            		Ext.Ajax.request({
		        			url : 'getMsclObservationsForGraph.do',
		        			params : {
		        				// .../wfs?request=GetFeature&typename=mscl:scanned_data&filter=%3CFilter%3E%0D%0A%09%3CPropertyIs%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Aborehole%3C%2FPropertyName%3E%0D%0A%09%09%3CLiteral%3EPRC-5%3C%2FLiteral%3E%0D%0A%09%3C%2FPropertyIs%3E%0D%0A%09%3CPropertyIsBetween%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Adepth%3C%2FPropertyName%3E%0D%0A%09%09%3CLowerBoundary%3E%0D%0A%09%09%09%3CLiteral%3E66.9%3C%2FLiteral%3E%0D%0A%09%09%3C%2FLowerBoundary%3E%0D%0A%09%09%3CUpperBoundary%3E%0D%0A%09%09%09%3CLiteral%3E89%3C%2FLiteral%3E%0D%0A%09%09%3C%2FUpperBoundary%3E%0D%0A%09%3C%2FPropertyIsBetween%3E%0D%0A%3C%2FFilter%3E
		        				serviceUrl : wfsUrl,
		        				boreholeName : 'PRC-5',
		        				startDepth : 66,
		        				endDepth : 200,
		        				observationsToReturn : 'ct,den1'
		        			},
		        			success : function(response) {
		        				// Define the model:
		        				Ext.define('DiameterPoint', {
		        					extend: 'Ext.data.Model',
		        					fields: ['depth', 'diameter']
		        				});
		        
		        				// Create the datastore:
		        				var store = Ext.create('Ext.data.Store', {
		        					model: 'DiameterPoint',
		        					data: Ext.decode(response.responseText).data.series
		        				});
		        
		        				chart = Ext.create('Ext.chart.Chart', {
		        					renderTo: Ext.getBody(),
		        					width: 150,
		        					height: 1000,
		        					shadow: false,
		        					store: store,
		        					axes: [
		        						{
		        							title: 'Depth (m)',
		        							type: 'Numeric',
		        							position: 'left',
		        							fields: ['depth'],
		        							minimum: 60,
		        							maximum: 200,
		        							majorTickSteps: 10,
		        							minorTickSteps: 1
		        						},
		        						{
		        							title: 'Diameter (cm)',
		        							type: 'Numeric',
		        							position: 'top',
		        							fields: ['diameter'],
		        							minimum: 4,
		        							maximum: 7,
		        							majorTickSteps: 5,
		        							minorTickSteps: 1
		        						}
		        					],
		        					series: [
		        						{
		        							type: 'line',
		        							xField: 'diameter',
		        							yField: 'depth',
		        							showMarkers: false,
		        							style: {
		        								'stroke-width': 1.5
		        							}
		        						}
		        					]
		        				});
		        				
		        				tp.items.add(chart);
		        				win.show();
		        			}
	            		});
	            	}
            	}
           	}]
    	}]
	});	
}
});
//proxy : {
//type : 'ajax',
//url : 'getResearchDataLayers.do',
//reader : {
//    type : 'json',
//    root : 'data'
//}
//},
//autoLoad : true
*/