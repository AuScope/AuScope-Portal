/**
 * A factory for parsing a geophysics:Anomalies element.
 */
Ext.define('auscope.layer.querier.wfs.factories.GeophysicsAnomaliesFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === 'http://csiro.au' &&
               portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'Anomalies';
    },

    /**
     * Generates a simple panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var anomalyName = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'geophysics:AnomalyName');
        var dataDerivation = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'geophysics:DataDerivation');
        var dataType = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'geophysics:DataType');

        var actualId = gmlId.substring('Anomalies.'.length);

        //Construct WFS GetFeature request
        var url = Ext.util.Format.format('{0}?version=1.1.0&request=GetFeature&typeName={1}&featureId={2}', 
                wfsUrl, 'geophysics:Anomalies', gmlId);
        
        //ASSUMPTION - image service at same host as geoserver
        var baseUrl = this._getBaseUrl(wfsUrl);
        var imgUrl = baseUrl + '/getJpeg.aspx?anomalyId=' + escape(actualId);
        
        //Build our component
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            autoScroll : false,
            items : [{
                xtype : 'fieldset',
                height : 250,
                title : 'Geophysics Anomaly',
                items : [{
                    xtype : 'displayfield',
                    fieldLabel : 'Id',
                    value : this._makeGeneralPopupHtml(url, gmlId, 'Click here to open xml view of this feature.')
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Anomaly Name',
                    value : anomalyName
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Data Derivation',
                    value : dataDerivation
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Data Type',
                    value : dataType
                },{
                    xtype : 'container',
                    autoScroll : true,
                    height : 140,
                    width : 580,
                    items : [{
                        xtype : 'box',
                        autoEl : {
                            tag:'div',
                            children:[{
                                tag : 'img',
                                src : imgUrl
                            }]
                        }
                    }]
                }]
            }],
            buttonAlign : 'right',
            buttons : [{
                text : 'Download Grid',
                iconCls : 'download',
                handler : function() {
                    var anomalyDataUrl = baseUrl + '/getAnomalyData.ashx?anomalyId=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(anomalyDataUrl);
                }
            },{
                text : 'Download Analyses',
                iconCls : 'download',
                handler : function() {
                    var magEstDataUrl = baseUrl + '/getMagEstData.ashx?magestid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(magEstDataUrl);
                }                
            },{
                text : 'Download Models',
                iconCls : 'download',
                handler : function() {
                    var modelFileUrl = baseUrl + '/getMagEstData.ashx?magestid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(modelFileUrl);
                }
            }]
        });
    }
});