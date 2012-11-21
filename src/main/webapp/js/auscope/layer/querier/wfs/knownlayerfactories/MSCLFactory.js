/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

function drawGraph(
        serviceUrl,
        boreholeName,
        startDepth,
        endDepth,
        observationsToReturn) {
    
    // Define the model:
    Ext.define('DynamicModel', {
        extend: 'Ext.data.Model',
        fields: ['depth', 'diameter']
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
                boreholeName : boreholeName,
                startDepth : startDepth,
                endDepth : endDepth,
                observationsToReturn : observationsToReturn
            },
            reader : {
                type : 'json',
                root : 'data.series'
            },
            noCache: false
        }
    });
    
    store.load();
    
    Ext.create('Ext.Window', {
        border      : true,
        layout      : 'fit',
        resizable   : false,
        modal       : true,
        plain       : false,
        title       : 'Title', // TODO: Make dynamic

        items       : [
            Ext.create('Ext.chart.Chart', {
                height      : 700, // TODO: Fix up dimensions
                width       : 400,
                shadow: false,
                store: store,
                axes: [  // TODO: Make dynamic
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
	            	xtype : 'button',
	            	text : 'Submit',
	            	listeners : {
		            	click : function (e, eOpts) {
		            		drawGraph(
		            		        parentOnlineResource.get('url'),
		            		        'PRC-5', // TODO: Make dynamic
		                            66, // TODO: Make dynamic
		                            200, // TODO: Make dynamic
		                            'ct' // TODO: Make dynamic
		                            );
		        		}
	            	}
	           	},
	           	{
	           	    xtype: 'form',
	           	    height: 400,
	           	    width: 400,
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
                                { boxLabel: 'Mag sus', name: 'rb', inputValue: 'msus1' },
                                { boxLabel: 'P-Wav vel', name: 'rb', inputValue: 'pvel' },
                                { boxLabel: 'P-Wav amp', name: 'rb', inputValue: 'pamp' },
                                { boxLabel: 'Diameter', name: 'rb', inputValue: 'ct' },
                                { boxLabel: 'Natural Gamma', name: 'rb', inputValue: 'ngam' },
                                { boxLabel: 'Density', name: 'rb', inputValue: 'den1' }
                            ]
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