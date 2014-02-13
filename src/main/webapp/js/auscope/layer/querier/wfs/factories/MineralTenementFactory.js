/**
 * A factory for parsing a er:MiningFeatureOccurrence element.
 */
Ext.define('auscope.layer.querier.wfs.factories.MineralTenementFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_MT &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'MineralTenement';
    },

    /**
     * Generates a simple tree panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var bf = this;

        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');

        var name = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:name');
        var tenementType = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:tenementType');
        var commodity = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:commodity');
        var owner = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:owner');
        var status = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:status');
        var area = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:area');
        var applicationDate = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:applicationDate');
        var expireDate = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:expireDate');
        var status_uri = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'mt:status_uri');

        if(applicationDate){
            applicationDate = new Date(applicationDate.replace("Z", '')).toDateString();
        }else{
            applicationDate = "";
        }

        if(expireDate){
            expireDate = new Date(expireDate.replace("Z", '')).toDateString();
        }else{
            expireDate = "";
        }


        //Build our component
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            layout : 'fit',
            items : [{
                xtype : 'fieldset',
                title : 'Mineral Tenement',
                labelWidth : 75,
                autoScroll : true,
                items : [{
                    xtype : 'displayfield',
                    fieldLabel : 'Name',
                    value : name
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Tenement Type',
                    value : tenementType
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Commodity',
                    value : commodity
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Owner',
                    value : owner
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'status',
                    value : status
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Size of tenement',
                    value : area
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Application Date',
                    value : applicationDate
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Date of expiry',
                    value : expireDate
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Status uri',
                    value : status_uri
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