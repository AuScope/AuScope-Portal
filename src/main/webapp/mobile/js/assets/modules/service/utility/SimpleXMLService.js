/**
 * SimpleXPathService handles xml file manipulation.
 * @module utility
 * @class SimpleXPathService
 * 
 */
allModules.service('SimpleXMLService',['$rootScope','Constants',function ($rootScope,Constants) {
   
    /**
     * A wrapper around the DOM defined Document.evaluate function
     * Because not every browser supports document.evaluate we need to have a pure javascript
     * backup in place
     * 
     * @method evaluateXPath
     * @param document - document
     * @param domNode - domNode
     * @param xPath - xPath
     * @param resultType - https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate#Result_types
     * @return dom - the dom result
     */
    this.evaluateXPath = function(document, domNode, xPath, resultType) {
        if (document.evaluate) {
            var result;
            try {
                result = document.evaluate(xPath, domNode, document.createNSResolver(domNode), resultType, null);
                return result;
            } catch(e) {
                console.error("SimpleXMLService.evaluateXPath() Exception", e);
                // Return empty result
                switch(resultType) {
                    case Constants.XPATH_STRING_TYPE:
                        return {
                            stringValue : ""
                        };
                    case Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE:
                        return {
                            _arr : [],
                            _i : 0,
                            iterateNext : function() {
                                return null;
                            }
                        };
                    default:
                        throw 'Unrecognised resultType';
                }
            };
            
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
    
    
    /**
     * Evaluates an XPath which will return an array of W3C DOM nodes
     * 
     * @method evaluateXPathNodeArray
     * @param domNode - domNode
     * @param xPath - xPath
     * @return dom - the dom result
     */
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
     * The localName is the node name without any namespace prefixes
     * @method getNodeLocalName
     * @param domNode - domNode
     * @return String - local name of the node or empty string upon error
     */
    this.getNodeLocalName = function(domNode) {
        if (domNode)
            return domNode.localName ? domNode.localName : domNode.baseName;
        return "";
    };

    /**
     * Returns the set of classes this node belongs to as an array of strings
     * @method getClassList
     * @param domNode - domNode
     * @return dom - the dom result
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
     * @method isLeafNode
     * @param domNode - domNode
     * @return boolean - is leaf or not
     */
    this.isLeafNode = function(domNode) {
        var isLeaf = true;
        if (domNode && domNode.childNodes) {
            for ( var i = 0; i < domNode.childNodes.length && isLeaf; i++) {
                isLeaf = domNode.childNodes[i].nodeType !== this.XML_NODE.XML_NODE_ELEMENT;
            }
        }
        return isLeaf;
    };

    /**
     * Filters an array of DOM Nodes according to the specified parameters
     * @method filterNodeArray
     * @param nodeArray An Array of DOM Nodes
     * @param nodeType [Optional] An integer node type
     * @param namespaceUri [Optional] String to compare against node namespaceURI
     * @param nodeName [Optional] String to compare against the node localName
     * @return dom - return the result in a dom
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
     * @method getMatchingChildNodes
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     * @return dom - return the result in a dom
     */
    this.getMatchingChildNodes = function(domNode, childNamespaceURI, childNodeName) {
        return this.filterNodeArray(domNode.childNodes, this.XML_NODE.XML_NODE_ELEMENT, childNamespaceURI, childNodeName);
    };

    /**
     * Gets all Attributes of domNode as an Array that match the specified filter parameters
     * @method getMatchingAttributes
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     * @return dom - return the result in a dom or null upon error
     */
    this.getMatchingAttributes = function(domNode, attributeNamespaceURI, attributeName) {
        //VT: cannot find the _fitlerNodeArray, suspect bug
        //return this._filterNodeArray(domNode.attributes, XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
        if (domNode.attributes) {
            return this.filterNodeArray(domNode.attributes, this.XML_NODE.XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
        }
        return null;
    };

    /**
     * Given a DOM node, return its text content (however the browser defines it)
     * @method getNodeTextContent
     * @param domNode - domNode
     * @return string - text content
     */
    this.getNodeTextContent = function(domNode) {
        if (domNode) 
            return domNode.textContent ? domNode.textContent : domNode.text;
        return "";
    };

    /**
     * Parse string to DOM
     * @method parseStringToDOM
     * @param xmlString - xml string
     * @return dom - return the result in a dom
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