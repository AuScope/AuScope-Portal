/**
 * A factory for parsing a er:MiningFeatureOccurrence element.
 */
Ext.define('auscope.layer.querier.wfs.factories.CapdfHydroGeoChemFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_CAPDF &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'hydrogeochem';
    },

    /**
     * Generates a simple tree panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var bf = this;

        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');

        var sampleId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:sample_id');
        var project = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:project');
        var elev = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:elev');
        var wt = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:wt');
        var sd = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:sd');
        var ph = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:ph');
        var eh = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'public:eh');           
    
        //Build our component
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle: sampleId,           
            layout : 'fit',
            items : [{
                xtype : 'fieldset',
                title : 'Capricorn Distal Hydrochemistry',
                labelWidth : 75,
                autoScroll : true,
                items : [{
                    xtype : 'displayfield',
                    fieldLabel : 'GML ID',
                    value : gmlId
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Sample ID',
                    value : sampleId
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'project',
                    value : project
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Elevation',
                    value : elev
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'wt',
                    value : (wt?wt:'N/A')
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'sd',
                    value : (sd?sd:'N/A')
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'ph',
                    value : (ph?ph:'N/A')
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'eh',
                    value : (eh?eh:'N/A')
                }]
            }],
            buttonAlign : 'right',
            buttons : [{
                text : 'Download Feature',
                iconCls : 'download',
                handler : function() {
                    var getXmlUrl = bf._makeFeatureRequestUrl(wfsUrl, domNode.nodeName, gmlId);
                    portal.util.FileDownloader.downloadFile('downloadGMLAsZip.do',{
                        serviceUrls : getXmlUrl
                    });
                }
            }]
        });
    }
});