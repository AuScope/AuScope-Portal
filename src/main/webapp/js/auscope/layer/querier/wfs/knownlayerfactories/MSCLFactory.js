/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

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
    	// Define the model:
		Ext.define('DiameterPoint', {
			extend: 'Ext.data.Model',
			fields: ['depth', 'diameter']
		});

		// This is of the format: http://$domain:$port/$some_path/wfs
    	var wfsUrl = parentOnlineResource.get('url');

		// Create the datastore:
		var store = Ext.create('Ext.data.Store', {
			model : 'DiameterPoint',
			proxy : {
			    type : 'ajax',
			    url : 'getMsclObservationsForGraph.do',
			    pageParam: undefined,
			    startParam: undefined,
			    limitParam: undefined,
    			extraParams : {
    				// .../wfs?request=GetFeature&typename=mscl:scanned_data&filter=%3CFilter%3E%0D%0A%09%3CPropertyIs%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Aborehole%3C%2FPropertyName%3E%0D%0A%09%09%3CLiteral%3EPRC-5%3C%2FLiteral%3E%0D%0A%09%3C%2FPropertyIs%3E%0D%0A%09%3CPropertyIsBetween%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Adepth%3C%2FPropertyName%3E%0D%0A%09%09%3CLowerBoundary%3E%0D%0A%09%09%09%3CLiteral%3E66.9%3C%2FLiteral%3E%0D%0A%09%09%3C%2FLowerBoundary%3E%0D%0A%09%09%3CUpperBoundary%3E%0D%0A%09%09%09%3CLiteral%3E89%3C%2FLiteral%3E%0D%0A%09%09%3C%2FUpperBoundary%3E%0D%0A%09%3C%2FPropertyIsBetween%3E%0D%0A%3C%2FFilter%3E
    				serviceUrl : wfsUrl,
    				boreholeName : 'PRC-5',
    				startDepth : 66,
    				endDepth : 200,
    				observationsToReturn : 'ct,den1'
    			},
			    reader : {
			        type : 'json',
			        root : 'data.series'
			    },
				noCache: false
			},
			autoLoad : false
		});

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
		            		store.load();
		            		
		            		Ext.create('Ext.Window', {
		                		border      : true,
		                        layout      : 'fit',
		                        resizable   : false,
		                        modal       : true,
		                        plain       : false,
		                        title       : 'Title', // TODO: Title
		                        height      : 800,
		                        width       : 400,
		                        items		: [
		            				Ext.create('Ext.chart.Chart', {
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
		            								'stroke-width': 2
		            							}
		            						}
		            					]
		            				})
		            			]
		                    }).show();
		        		}
	            	}
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