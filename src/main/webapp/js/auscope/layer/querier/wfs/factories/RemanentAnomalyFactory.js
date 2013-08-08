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
        return portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'Anomaly';
    },

    /**
     * Generates a simple panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl, rootCfg) {
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var actualId = gmlId.substring('anomaly.'.length);
        var baseUrl = this._getBaseUrl(wfsUrl);
        console.debug("baseUrl: " + baseUrl);
        
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
            height: 300, 
            items : [{
                xtype : 'treepanel',
                autoScroll : true,
                rootVisible : true,
                root : rootNode
            }],
            buttonAlign : 'right',
            buttons : [{
                text : 'Download Grid',
                iconCls : 'download',
                handler : function() {
                    var anomalyDataUrl = baseUrl + '/getAnomalyData.ashx?anomalyid=' + escape(actualId);
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
                    var modelFileUrl = baseUrl + '/getModelFile.ashx?modelid=' + escape(actualId);
                    portal.util.FileDownloader.downloadFile(modelFileUrl);
                }
            }]
        };

        return Ext.create('portal.layer.querier.BaseComponent', Ext.apply(panelConfig, rootCfg));        
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