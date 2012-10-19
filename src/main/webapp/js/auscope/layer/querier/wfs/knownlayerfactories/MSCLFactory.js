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
    	// This is of the format: http://$domain:$port/$some_path/wfs
    	var wfsUrl = parentOnlineResource.get('url');
    	
    	return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'MSCL Data',
            items : [{
            	itemId : 'msclDataPanel',
                xtype : 'fieldset',
                title : 'Petrophysical Observations'
            }],
            listeners : {
            	render : function(panel, eOpts) {
            		Ext.Ajax.request({
                		url : 'getMsclObservations.do',
                		params : {
                			serviceUrl : wfsUrl,
                			typeName : 'sa:SamplingFeatureCollection',
                			featureId : 'sampling_feature_collection.borehole_header.' + featureId
                		},
                		success : function(response) {
                			var jsonResponse = Ext.JSON.decode(response.responseText);
                			var xmlDocument = portal.util.xml.SimpleDOM.parseStringToDOM(jsonResponse.data.gml);
                			var samplingFeatureCollection = portal.util.xml.SimpleXPath.evaluateXPathNodeArray(
                	    			xmlDocument.documentElement,
                	    			'gml:featureMembers/sa:SamplingFeatureCollection')[0];
                			var simpleFactory = Ext.create('portal.layer.querier.wfs.factories.SimpleFactory', {});
                			var xmlTreeComponentWithDownloadButton = simpleFactory.parseNode(samplingFeatureCollection, wfsUrl, { height : 250 });
                			var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(samplingFeatureCollection, '@gml:id');
                			
                			// TODO: This isn't good. I'm modifying the behaviour of the button that simpleFactory has 
                			// added to the XML Tree view. The modification is to change its target from requestFeature.do to
                			// getMsclObservations.do which works-around an assumption made by requestFeature.do that it can
                			// assign a default SRS where one isn't present.
                			// Since I'm expecting the behaviour and the presentation of this SA data to be completely changed
                			// anyway I'm just using this heavy-handed and unglamourous approach as a temporary measure.
                			var button = xmlTreeComponentWithDownloadButton.getDockedItems()[0].items.items[0];
                			button.handler = function() {
                                portal.util.FileDownloader.downloadFile('downloadGMLAsZip.do', {
                                    serviceUrls : 
                                    	portal.util.URL.base + 
                                    	"getMsclObservations.do" +
                        				"?serviceUrl=" + wfsUrl + 
                        				"&typeName=sa:SamplingFeatureCollection" +
                        				"&featureId=" + gmlId
                                });
                			};
                			panel.getComponent('msclDataPanel').add(xmlTreeComponentWithDownloadButton);
                			panel.doLayout();
                		}
                	});
            	}
            }
    	});
    }
});