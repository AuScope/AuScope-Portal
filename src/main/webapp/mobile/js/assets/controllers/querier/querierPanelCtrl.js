/*
 * This class handles rendering of the querier panel
 * @module controllers
 * @class querierPanelCtrl
 *
 */
allControllers.controller('querierPanelCtrl',  ['$compile', '$scope', 'GoogleMapService', 'QuerierPanelService', 'SimpleXMLService', 'UtilitiesService', 'Constants', '$timeout',
                                                function ($compile, $scope, GoogleMapService, QuerierPanelService, SimpleXMLService, UtilitiesService, Constants, $timeout) {
    //VT: an array of object
    $scope.treeStruct = {};
    $scope.JSONTreeStruct = [];
    
    // Associative array: key is layer name, values are list of feature names for that layer
    // Used to display the layer name as a header in query panel
    $scope.layerIndex = {};
    
    
    // Turn off carousel
    $scope.useCarousel = false;
    
    // Empty carousel slides
    $scope.slides = [];
    
    // Turn off carousel busy icon
    $scope.carouselBusy = false;
   

    /**
    * Used to initialise the controller.
    * @method init
    * @param xmlPanelId the id of the <div> where the XML accordion tree is to be displayed
    */
    $scope.init = function(xmlPanelId) { 
        $scope.xmlPanelId = xmlPanelId;
        // This registers this class' functions with the QuerierPanelService
        QuerierPanelService.registerPanel($scope.openPanel, $scope.addPanelTree, $scope.setCarouselImages, $scope.setCarouselBusy);
        GoogleMapService.onLayerRemoved($scope, function(evt,layer){ QuerierPanelService.deregisterLayer(layer) });
    };
        
    /**
    * @method resetTree
    * @param panelStatus  status of panel, if closed is false, if open is true
    */    
    $scope.resetTree = function(panelStatus) {
        if (!panelStatus) {
            $scope.treeStruct={};
            $scope.JSONTreeStruct = [];
            $scope.layerIndex = {};
        }
    };
    
    /**
    * Used to display XML in tree form in the panel, calls parse() function
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * It is possible for node to be passed in as a feature node or the whole collection. We attempt to be smart
    * by assuming it is a feature collection and if it fails, we assume it to be a feature node.
    * @method addPanelTree
    * @param xmlString string which will be displayed
    * @param displayName name of layer or feature, to be used only if no suitable name is found within XML string
    * @param appendFlag will append the new tree to the current tree(s) on panel or clear the panel and add a new tree
    * @return boolean value, true if the panel should be opened because there is something to display
    */
    $scope.addPanelTree = function(node, displayName, prependStr, appendFlag) {
        
        var displayable = false;
        
        // Clear the panel
        if (!appendFlag) {
            $scope.resetTree(false);
            $scope.resetCarousel(false);
        }
        if (node) {
            // First try to find any "FeatureCollection" elements 
            // If it not found, and no error report was found, we assume the node to be a feature node.
            var rootNode = node;            
            var wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureCollection");
            var features = null;
            if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
                // Check for error reports - some WMS servers mark their error reports with <ServiceExceptionReport>, some with <html> 
                var exceptionNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, "ServiceExceptionReport");
                var serviceErrorNode = SimpleXMLService.evaluateXPath(rootNode, rootNode, "html", Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE);
                var nextNode=serviceErrorNode.iterateNext();
                if (!UtilitiesService.isEmpty(exceptionNode) || nextNode!=null) {
                    // There is an error report from the server
                    var errorStr = "Sorry - server has returned an error message.";
                    var displayStr = prependStr+" "+displayName;
                    $scope.treeStruct[errorStr] = document.createTextNode("See browser console for more information");
                    if (displayName in $scope.layerIndex) {
                        if ($scope.layerIndex[displayStr].indexOf(errorStr)<0) $scope.layerIndex[displayStr].push(errorStr);
                    } else {                            
                        $scope.layerIndex[displayStr] = [errorStr]; 
                    }
                    console.error("querierPanelCtrl.addPanelTree(): Server returned error", rootNode);
                    return true;
                }
                var featureInfoNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureInfoResponse");
                if (UtilitiesService.isEmpty(featureInfoNode)) {
                    // Assume the node to be a feature node. 
                    features = [node];
                } else {
                    // ArcGIS special format - not standard XML. Must use the passed-in display name.
                    var fieldNodes = SimpleXMLService.getMatchingChildNodes(featureInfoNode[0], null, "FIELDS");
                    features = fieldNodes;
                    for (var i = 0; i < features.length; i++) {
                        var name = features[i].getAttribute('identifier');
                        $scope.treeStruct[name] = features[i];
                        var displayStr = prependStr+" "+displayName;
                        if (displayName in $scope.layerIndex) {
                            if ($scope.layerIndex[displayStr].indexOf(name)<0) $scope.layerIndex[displayStr].push(name);
                        } else {                            
                            $scope.layerIndex[displayStr] = [name]; 
                        }
                        displayable=true;
                    }
                    return displayable;
                }

            } else {
                // Read through our wfs:FeatureCollection and gml:featureMember(s) elements 
                var featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMembers");                 
                if (UtilitiesService.isEmpty(featureMembers)) {
                    featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMember");
                    features = featureMembers;
                } else {
                    features = featureMembers[0].childNodes;
                }
            }
            for (var i = 0; i < features.length; i++) {
                // Pull out some general stuff that we expect all features to have
                var featureNode = features[i];
                var name = featureNode.getAttribute('gml:id');
                if (UtilitiesService.isEmpty(name)) {
                    name = SimpleXMLService.evaluateXPath(rootNode, featureNode, "gml:name", Constants.XPATH_STRING_TYPE).stringValue;
                }
                if (typeof name === 'string' || name.length > 0) {
                    $scope.treeStruct[name] = featureNode;
                    var localName = prependStr+" "+$scope.treeStruct[name].localName;
                    if (localName in $scope.layerIndex) {
                        if ($scope.layerIndex[localName].indexOf(name)<0) $scope.layerIndex[localName].push(name);
                    } else {
                        $scope.layerIndex[localName] = [name]; 
                    }
                    displayable = true;
                }
            }
        }
        return displayable;
    };
    
    /**
    * This is called from the Angular HTML template. It parses the XML tree,
    * creating a JSON representation which is passed in to create a tree view
    * via the "$scope.JSONTreeStruct[]" array
    *
    * @method parseTree
    * @param name - a label displayed at the top of the tree
    */
    $scope.parseTree = function(name){
        
        if($scope.JSONTreeStruct[name]){
            return;
        }
       
        var value=[];
        
        var parseNodeToJson = function(node,tier,child){
            var attrArr = SimpleXMLService.getMatchingAttributes(node);
            var attrChildren = [];
            if (attrArr) {
                for (var i=0; i< attrArr.length; i++) {
                    if (attrArr[i].name && attrArr[i].value)
                        attrChildren.push({label: attrArr[i].name+": "+attrArr[i].value, children : []});
                }
            }
            if (SimpleXMLService.isLeafNode(node)) {
                
                return ({
                    label : SimpleXMLService.getNodeLocalName(node),
                    id:'id'+tier+child,
                    children : [{
                        label : SimpleXMLService.getNodeTextContent(node),
                        id:'id'+(tier+1)+child,
                        children : attrChildren     
                    }]                    
                });
               
            }else{
                var collapsed = true;
                if(tier <= 1){
                    collapsed = false;
                }
                var nodeObj={
                        label : SimpleXMLService.getNodeLocalName(node),
                        id:'id' + tier,
                        collapsed:collapsed,
                        children : attrChildren                    
                };
                
                var child = SimpleXMLService.getMatchingChildNodes(node); 
                for(var i = 0; i< child.length;i++){
                    nodeObj.children.push(parseNodeToJson(child[i],tier+1,i));
                }                
                return nodeObj
            }  
            
        };
        value.push(parseNodeToJson($scope.treeStruct[name],0,0));
        
        $timeout(function() {           
            $scope.JSONTreeStruct[name] = value;
        },0);

    };
    
    /**
    * Used to open and close the panel. 
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * @method openPanel 
    * @param ctrlBool if true panel will open, if false panel will close
    * @param useApply will call $apply() on $parent object if set to true
    */
    $scope.openPanel = function(ctrlBool, useApply) {
        $scope.$parent.showQuerierPanel = ctrlBool;
        if (useApply)
            $scope.$parent.$apply();
    };
    
    
    /**
    * Sets the images for the carousel
    * @method setCarouselImages
    * @param imageList
    */
    $scope.setCarouselImages = function(imageList) {
        // Must do a reset, then set the image list, to force slick to initialise, else AngularJS crashes
        $timeout(function() {
            // Do a reset
            $scope.useCarousel = false;
            $scope.slides = [];
            return $timeout(function() {
                // Set the image list            
                $scope.slides = imageList;
                $scope.useCarousel = true;
            },0);
        });
        
    }
    
    /**
    * Resets the carousel when the panel closes
    * @method resetCarousel
    * @param panelStatus open/closed status of the querier panel
    */
    $scope.resetCarousel = function(panelStatus) {
        if (!panelStatus) {
            $scope.useCarousel = false;
            $scope.slides = [];
        }
    }
    
    /**
    * Controls the display of the spinner to let user know the carousel is loading
    * @method setCarouselBusy
    * @param busyFlag set to true to make the spinner display, else false ot make it go away
    */
    $scope.setCarouselBusy = function(busyFlag) {
        $scope.carouselBusy = busyFlag;
    }
    
}]);