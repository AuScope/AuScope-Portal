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
        var softwareVersion = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:software_version');
        var viewField = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:view_field_um');
        var imageWidth = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:image_width_px');
        var imageHeight = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:image_height_px');
        var sampleDiameter = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'tima:sample_diameter_um');
        
        
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
                    labelWidth : 75,
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
                        value : igsn
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Software Version',
                        value : softwareVersion
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'View Field',
                        value : viewField
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Image Width',
                        value : imageWidth
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Image Height',
                        value : imageHeight
                    },{
                        xtype : 'displayfield',
                        fieldLabel : 'Sample Diameter',
                        value : sampleDiameter
                    }]
                },{
                   title : 'Graph',
                   xtype : 'container',
                   autoScroll : true,                   
                   items : pie
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