/**
 * A factory for parsing a RemAnon:Anomaly element.
 */
Ext.define('auscope.layer.querier.wfs.factories.RemanentAnomalyFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === 'http://remanentanomalies.csiro.au' &&
            portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'Anomaly';
    },

    /**
     * Generates a simple panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var actualId = gmlId.substring('anomaly.'.length);

        //ASSUMPTION - image service at same host as geoserver
        var baseUrl = this._getBaseUrl(wfsUrl);
        var imgUrl = baseUrl + '/getJpeg.ashx?anomalyId=' + escape(actualId);

        var models = portal.util.xml.SimpleXPath.evaluateXPathNodeArray(domNode, 'RemAnom:modelCollection');
        var disableModelsDownload = (models.length > 0) ? false : true;

        var analyses = portal.util.xml.SimpleXPath.evaluateXPathNodeArray(domNode, 'RemAnom:analysisCollection');
        var disableAnalysesDownload = (analyses.length > 0) ? false : true;

        // Turn our DOM Node in an ExtJS Tree
        var rootNode = this._createTreeNode(domNode);
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var sf = this;
        this._parseXmlTree(domNode, rootNode);
        rootNode.expanded = true;

        // Continuously expand child nodes until we hit a node with
        // something "interesting" defined as a node with more than 1 child
        if (rootNode.children.length == 1) {
            var childNode = rootNode.children[0];
            while (childNode) {
                childNode.expanded = true;

                if (childNode.children.length > 1) {
                    break;
                } else {
                    childNode = childNode.children[0];
                }
            }
        }

        var panelConfig = {
            layout : 'fit',
            tabTitle : gmlId,
            height: 300,
            items : [{
                xtype : 'tabpanel',
                activeItem : 0,
                enableTabScroll : true,
                buttonAlign : 'center',
                items : [{
                    title : 'Anomaly',
                    xtype : 'treepanel',
                    autoScroll : true,
                    rootVisible : true,
                    root : rootNode
                },{
                   title : 'Image',
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
                text : 'Download KML',
                iconCls : 'download',
                handler : function() {
                    var anomalyKMLUrl = baseUrl + '/getKml.aspx?anomalyid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(anomalyKMLUrl);
                }
            },{
                text : 'Download Grid',
                iconCls : 'download',
                handler : function() {
                    var anomalyDataUrl = baseUrl + '/getAnomalyData.ashx?anomalyid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(anomalyDataUrl);
                }
            },{
                text : 'Download Analyses',
                iconCls : 'download',
                disabled : disableAnalysesDownload,
                handler : function() {
                    var magEstDataUrl = baseUrl + '/getAllAnalysesForAnomaly.ashx?anomalyid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(magEstDataUrl);
                }
            },{
                text : 'Download Models',
                iconCls : 'download',
                disabled : disableModelsDownload,
                handler : function() {
                    var modelFileUrl = baseUrl + '/getAllModelsForAnomaly.ashx?anomalyid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(modelFileUrl);
                }
            }]
        };

        return Ext.create('portal.layer.querier.BaseComponent', panelConfig);
    },

    /**
     * This is for creating a Node Objects from a DOM Node in the form
     * {
     *  text : String
     *  leaf : Boolean
     * }
     */
    _createTreeNode : function(documentNode) {
        var treeNode = null;

        // We have a leaf
        if (portal.util.xml.SimpleDOM.isLeafNode(documentNode)) {
            var textContent = portal.util.xml.SimpleDOM.getNodeTextContent(documentNode);

            treeNode = {
                text : documentNode.tagName + " = " + textContent,
                children : [],
                leaf: true
            };
        } else { // we have a parent node
            var parentName = documentNode.tagName;
            if (documentNode.attributes.length > 0) {
                parentName += '(';
                for ( var i = 0; i < documentNode.attributes.length; i++) {
                    parentName += ' ' + documentNode.attributes[i].nodeName +
                                  '=' + documentNode.attributes[i].value;
                }
                parentName += ')';
            }
            treeNode = {
                text : parentName,
                children : [],
                leaf: true
            };
        }

        return treeNode;
    },

    /**
     * Given a DOM tree starting at xmlDocNode, this function returns the
     * equivelant tree in ExtJs Tree Nodes
     */
    _parseXmlTree : function(xmlDocNode, treeNode) {
        var nodes = [];
        Ext.each(xmlDocNode.childNodes, function(docNodeChild) {
            if (docNodeChild.nodeType == portal.util.xml.SimpleDOM.XML_NODE_ELEMENT) {
                var treeChildNode = this._createTreeNode(docNodeChild);
                treeNode.leaf = false;
                treeNode.children.push(treeChildNode);
                nodes.push(treeNode);
                this._parseXmlTree(docNodeChild, treeChildNode);
            }
        }, this);

        return nodes;
    }
});