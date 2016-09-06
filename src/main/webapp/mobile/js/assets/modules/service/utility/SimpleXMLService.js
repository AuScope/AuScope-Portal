/**
 * SimpleXPathService handles xml file manipulation.
 * @module utility
 * @class SimpleXPathService
 * 
 */
allModules.service('SimpleXMLService',['$rootScope','Constants',function ($rootScope,Constants) {
   
   
    
    this.evaluateXPath = function(document, domNode, xPath, resultType) {
        if (document.evaluate) {
            return document.evaluate(xPath, domNode, document.createNSResolver(domNode), resultType, null);
        } else {
            //This gets us a list of dom nodes
            var matchingNodeArray = XPath.selectNodes(xPath, domNode);
            if (!matchingNodeArray) {
                matchingNodeArray = [];
            }

            //we need to turn that into an XPathResult object (or an emulation of one)
            switch(resultType) {
            case Constants.XPATH_STRING_TYPE:
                var stringValue = null;
                if (matchingNodeArray.length > 0) {
                    stringValue = this.getNodeTextContent(matchingNodeArray[0]);
                }

                return {
                    stringValue : stringValue
                };
            case Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE:
                return {
                    _arr : matchingNodeArray,
                    _i : 0,
                    iterateNext : function() {
                        if (this._i >= this._arr.length) {
                            return null;
                        } else  {
                            return this._arr[this._i++];
                        }
                    }
                };

            }

            throw 'Unrecognised resultType';
        }
    };
    
    
    this.evaluateXPathNodeArray = function(domNode, xPath) {
        var document = domNode.ownerDocument;
        var xpathResult = null;
        try {
            xpathResult = this.evaluateXPath(document, domNode, xPath,Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE);
        } catch(err) {
            return [];
        }
        var matchingNodes = [];

        var matchingNode = xpathResult.iterateNext();
        while (matchingNode) {
            matchingNodes.push(matchingNode);
            matchingNode = xpathResult.iterateNext();
        }

        return matchingNodes;
    };
    
    this.evaluateXPathString = function(domNode, xPath) {
        var document = domNode.ownerDocument;
        var xpathResult = this.evaluateXPath(document, domNode, xPath, Constants.XPATH_STRING_TYPE);
        return xpathResult.stringValue;
    };
    
    
    
    //Constants
    this.XML_NODE = {
             XML_NODE_ELEMENT : 1,
             XML_NODE_ATTRIBUTE : 2,
             XML_NODE_TEXT : 3  
    };
   
   
    /**
     * Utility for retrieving a W3C DOM Node 'localName' attribute across browsers.
     *
     * The localName is the node name without any namespace prefixes
     */
    this.getNodeLocalName = function(domNode) {
        return domNode.localName ? domNode.localName : domNode.baseName;
    };

    /**
     * Returns the set of classes this node belongs to as an array of strings
     */
    this.getClassList = function(domNode) {
        if (domNode.classList) {
            return domNode.classList;
        } else if (domNode['class']) {
            return domNode['class'].split(' ');
        } else if (domNode.className) {
            return domNode.className.split(' ');
        }
        return [];
    };

    /**
     * Figure out if domNode is a leaf or not
     * (Leaves have no nodes from XML_NODE_ELEMENT)
     */
    this.isLeafNode = function(domNode) {
        var isLeaf = true;
        for ( var i = 0; i < domNode.childNodes.length && isLeaf; i++) {
            isLeaf = domNode.childNodes[i].nodeType !== this.XML_NODE.XML_NODE_ELEMENT;
        }

        return isLeaf;
    };

    /**
     * Filters an array of DOM Nodes according to the specified parameters
     * @param nodeArray An Array of DOM Nodes
     * @param nodeType [Optional] An integer node type
     * @param namespaceUri [Optional] String to compare against node namespaceURI
     * @param nodeName [Optional] String to compare against the node localName
     */
   this.filterNodeArray = function(nodeArray, nodeType, namespaceUri, nodeName) {
        var matchingNodes = [];
        for (var i = 0; i < nodeArray.length; i++) {
            var node = nodeArray[i];

            if (nodeType && node.nodeType !== nodeType) {
                continue;
            }

            if (namespaceUri && namespaceUri !== node.namespaceURI) {
                continue;
            }

            if (nodeName && nodeName !== this.getNodeLocalName(node)) {
                continue;
            }

            matchingNodes.push(node);
        }

        return matchingNodes;
    };

    /**
     * Gets all children of domNode as an Array that match the specified filter parameters
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     */
    this.getMatchingChildNodes = function(domNode, childNamespaceURI, childNodeName) {
        return this.filterNodeArray(domNode.childNodes, this.XML_NODE.XML_NODE_ELEMENT, childNamespaceURI, childNodeName);
    };

    /**
     * Gets all Attributes of domNode as an Array that match the specified filter parameters
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     */
    this.getMatchingAttributes = function(domNode, attributeNamespaceURI, attributeName) {
        //VT: cannot find the _fitlerNodeArray, suspect bug
        //return this._filterNodeArray(domNode.attributes, XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
        return this.filterNodeArray(domNode.attributes, this.XML_NODE.XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
    };

    /**
     * Given a DOM node, return its text content (however the browser defines it)
     */
    this.getNodeTextContent = function(domNode) {
        return domNode.textContent ? domNode.textContent : domNode.text;
    };

    /**
     * Parse string to DOM
     */
    this.parseStringToDOM = function(xmlString){
        var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
        // Load our xml string into DOM
        var xmlDocument = null;
        if(window.DOMParser) {
            //browser supports DOMParser
            var parser = new DOMParser();
            xmlDocument = parser.parseFromString(xmlString, "text/xml");
        } else if(window.ActiveXObject) {
            //IE
            xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
            xmlDocument.async="false";
            xmlDocument.loadXML(xmlString);
        } else {
            return null;
        }
        return xmlDocument;
    };
    
     
}]);