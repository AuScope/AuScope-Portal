/**
 * A factory for parsing a er:MiningFeatureOccurrence element.
 */
Ext.define('auscope.layer.querier.wfs.factories.SHRIMPGeoSampleFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_TIMA &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'view_shrimp_geochronology_result';
    },

    /**
     * Generates a simple tree panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var bf = this;

        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');

        var name = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gml:name');
        var igsn = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:igsn');
        var igsnUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:igsn_url');
        var mountTypeName = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:mount_type_name');
        var sampleCustodian = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:sample_custodian');
        var sampleCustodianUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:sample_custodian_url');
        var collectionUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:collection_url');
        var instrumentName = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:instrument_name');
        var softwareVersion = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:software_version');
        var dataUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:data_url');
        var analysedBy = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:analysed_by');
        var analysedByUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:analysed_by_url');


        //Build our component
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle: name,
            overrideInfoWindowSize : {
                width : 650,
                height : 400
            },
            layout : 'fit',
            items : [{
                xtype : 'tabpanel',
                activeItem : 0,
                enableTabScroll : true,
                buttonAlign : 'center',
                items : [{
                    xtype : 'fieldset',
                    title : 'TIMA Geosample',
                    labelWidth : 100,
                    autoScroll : true,
                    items : [{
                        xtype : 'displayfield',
                        fieldLabel : 'GML ID',
                        value : gmlId
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Name',
                        value : name
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'IGSN',
                        value : '<a href="' + igsnUrl + '" target="_blank">' + igsn + '</a>'
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Mount Type',
                        value : mountTypeName
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Sample Custodian',
                        value : sampleCustodianUrl?('<a href="' + sampleCustodianUrl + '" target="_blank">' + sampleCustodian + '</a>'):'Not Available'
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Collection Metadata',
                        value : collectionUrl?('<a href="' + collectionUrl + '" target="_blank">click here</a>'):'Not Available'
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Instrument Name',
                        value : instrumentName
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Data',
                        value : dataUrl?('<a href="' + dataUrl + '" target="_blank">click here</a>'):'Not Available'
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Software Version',
                        value : softwareVersion
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Analysed By',
                        value : analysedByUrl?('<a href="' + analysedByUrl + '" target="_blank">' + analysedBy + '</a>'):'Not Available'
                    }]
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