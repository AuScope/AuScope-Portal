/**
 * A factory for parsing a gsml:Borehole element.
 */
Ext.define('portal.layer.querier.wfs.factories.BoreholeFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_GSML_2 &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'Borehole';
    },

    /**
     * Generates a simple tree panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl, rootCfg) {
        var bf = this;
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var allNames = portal.util.xml.SimpleXPath.evaluateXPathNodeArray(domNode, 'gml:name');
        var elevationUom = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:collarLocation/gsml:BoreholeCollar/gsml:elevation/@uomLabels');
        var elevation = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:collarLocation/gsml:BoreholeCollar/gsml:elevation');
        var startDepth = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:coredInterval/gml:Envelope/gml:lowerCorner');
        var endDepth = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:coredInterval/gml:Envelope/gml:upperCorner');
        var coreCustodian = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:coreCustodian/@xlink:title');
        var drillingCo = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:driller/@xlink:title');
        var drillingDate = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:dateOfDrilling');
        var drillingMethod = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:drillingMethod');
        var inclinationType = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:inclinationType');
        var startPoint = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:indexData/gsml:BoreholeDetails/gsml:startPoint');

        //For IE we can't apply XPath predicates like gml:name[@codeSpace=\'http://www.ietf.org/rfc/rfc2616\']
        //so we do a manual loop instead over gml:name instead
        var rawId = '';
        var boreholeName = '';
        for (var i = 0; i < allNames.length; i++) {
            if (portal.util.xml.SimpleXPath.evaluateXPathString(allNames[i], '@codeSpace') === 'http://www.ietf.org/rfc/rfc2616') {
                rawId = portal.util.xml.SimpleDOM.getNodeTextContent(allNames[i]);
            } else {
                boreholeName = portal.util.xml.SimpleDOM.getNodeTextContent(allNames[i]);
            }
        }

        //Build our component
        Ext.apply(rootCfg, {
            border : false,
            items : [{
                xtype : 'fieldset',
                title : 'Borehole',
                items : [{
                    xtype : 'label',
                    fieldLabel : 'Name',
                    html : this._makeGeneralPopupHtml(rawId, boreholeName, 'Click here for the raw WFS data')
                },{
                    xtype : 'label',
                    fieldLabel : String.format('Elevation ({0})',elevationUom),
                    text : elevation
                },{
                    xtype : 'label',
                    fieldLabel : 'Start Depth (m)',
                    text : startDepth
                },{
                    xtype : 'label',
                    fieldLabel : 'End Depth (m)',
                    text : endDepth
                },{
                    xtype : 'label',
                    fieldLabel : 'Core Custodian',
                    text : coreCustodian
                },{
                    xtype : 'label',
                    fieldLabel : 'Drilling Co.',
                    text : drillingCo
                },{
                    xtype : 'label',
                    fieldLabel : 'Drilling Date',
                    text : drillingDate
                },{
                    xtype : 'label',
                    fieldLabel : 'Drilling Method',
                    text : drillingMethod
                },{
                    xtype : 'label',
                    fieldLabel : 'Inclination Type',
                    text : inclinationType
                },{
                    xtype : 'label',
                    fieldLabel : 'Start Point',
                    text : startPoint
                }]
            }],
            buttonAlign : 'right',
            buttons : [{
                xtype : 'button',
                text : 'Download Borehole',
                iconCls : 'download',
                handler : function() {
                    var getXmlUrl = bf._makeFeatureRequestUrl(wfsUrl, 'gsml:Borehole', gmlId);
                    var url = 'downloadGMLAsZip.do?serviceUrls=' + escape(getXmlUrl);
                    FileDownloader.downloadFile(url);
                }
            }]
        });

        return Ext.create('portal.layer.querier.BaseComponent', rootCfg);
    }
});