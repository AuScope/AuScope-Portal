/*
 * This class handles rendering of the querier panel
 * @module controllers
 * @class querierPanelCtrl
 *
 */
allControllers.controller('querierPanelCtrl',  ['$compile', '$scope', 'QuerierPanelService','SimpleXMLService','UtilitiesService', 'Constants','$timeout',
                                                function ($compile, $scope, QuerierPanelService,SimpleXMLService,UtilitiesService,Constants,$timeout) {
    //VT: an array of object
    $scope.treeStruct = {};
    $scope.JSONTreeStruct = [];
   

    /**
    * Used to initialise the controller.
    * @method init
    * @param xmlPanelId the id of the <div> where the XML accordion tree is to be displayed
    */
    $scope.init = function(xmlPanelId) { 
        $scope.xmlPanelId = xmlPanelId;
        // This registers this class' functions with the QuerierPanelService
        QuerierPanelService.registerPanel($scope.openPanel, $scope.setPanelTree);
    };
          
    /**
    * Used to display XML in tree form in the panel, calls parse() function
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * It is possible for node to be passed in as a feature node or the whole collection. We attempt to be smart
    * by assuming it is a feature collection and if it fails, we assume it to be a feature node.
    * @method setPanelTree
    * @param xmlString string which will be displayed
    */
    $scope.setPanelTree = function(node) {
        $scope.treeStruct={};
        
        if (node) {
            // First try to find any "FeatureCollection" elements 
            // If it not found, and no error report was found, we assume the node to be a feature node.
            var rootNode = node;
            var wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureCollection");
            var features = null;
            if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
                var exceptionNode = SimpleXMLService.evaluateXPath(rootNode, rootNode, "//ServiceException", Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE);
                var thisNode = exceptionNode.iterateNext();
                if (thisNode) {
                    // There is an error report from the server
                    $scope.treeStruct["Sorry - server has returned an error message."] = thisNode;
                    console.error("querierPanelCtrl.setPanelTree(): Server returned error", thisNode);
                    return;
                }
                var featureInfoNode =  SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureInfoResponse");
                if (UtilitiesService.isEmpty(featureInfoNode)) {
                    // Assume the node to be a feature node. 
                    features = [node];
                } else {
                    // ArcGIS special format - not standard XML
                    var fieldNodes = SimpleXMLService.getMatchingChildNodes(featureInfoNode[0], null, "FIELDS");
                    features = fieldNodes;
                    for (var i = 0; i < features.length; i++) {
                        var name = features[i].getAttribute('identifier');
                        $scope.treeStruct[name] = features[i];
                    }
                    return;
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
                //Pull out some general stuff that we expect all features to have
                var featureNode = features[i];
                var name = SimpleXMLService.evaluateXPath(rootNode, featureNode, "gml:name", Constants.XPATH_STRING_TYPE).stringValue;
                if (UtilitiesService.isEmpty(name)) {
                    name = featureNode.getAttribute('gml:id');
                } 
                $scope.treeStruct[name] = featureNode;
            };
        }
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
            for (var i=0; i< attrArr.length; i++) {
                if (attrArr[i].name && attrArr[i].value)
                    attrChildren.push({label: attrArr[i].name+": "+attrArr[i].value, children : []});
            }
            if(SimpleXMLService.isLeafNode(node)){
                
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

}]);