/**
 * A factory for parsing a er:MiningFeatureOccurrence element.
 */
Ext.define('auscope.layer.querier.wfs.factories.TIMAGeoSampleFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_TIMA &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'geosample_and_mineralogy';
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
        var imageUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:image_url');
        var imageThumbnailUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:image_thumbnail_url');
        var analysedBy = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:analysed_by');
        var analysedByUrl = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:analysed_by_url');
        var analysisDate = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:analysis_date').substr(0, 10);

        var pie = Ext.create('auscope.chart.pieChart',{
            targetWidth : 650,
            targetHeight : 400
        });
        
        var mineral_information_json = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:mineral_information_json');
        
        mineral_information_json = Ext.decode(mineral_information_json);

        var dataset = new Array();
        for (var mineral_name in mineral_information_json) {
            mineral_information = mineral_information_json[mineral_name];
            mineral_pixel_count = mineral_information["mineral_pixel_count"];
            colour = mineral_information["colour"];
            mass = mineral_information["mass"];
            dataset.push({label: mineral_name, count: mineral_pixel_count, colour: colour});
        }
       
        pie.on('afterrender',function(){
            pie.plot(dataset);
        })
        
                
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
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Analysis Date',
                        value : analysisDate
                    }]
                },{
                    title : 'Graph',
                    xtype : 'container',
                    autoScroll : true,                   
                    items : pie
                 }{
                     title : 'Classification Panorama',
                     xtype : 'container',
                     autoScroll : true,
                     html : '<a href="' + imageUrl + '"><img src="' + imageThumbnailUrl + '"></a>' 
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