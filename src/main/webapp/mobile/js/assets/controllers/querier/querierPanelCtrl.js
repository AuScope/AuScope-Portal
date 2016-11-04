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
        // This stores the open/closed state of each accordion node
        $scope.status = {};
        // This stores the state of the "Expand All"/"Collapse All" toggle button
        $scope.expandFlag = false;
        // This registers this class' functions with the QuerierPanelService
        QuerierPanelService.registerPanel($scope.openPanel, $scope.setPoint, $scope.setPanelTree);
    };
    

    /**
    * Used to display point in panel
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * @method setPoint 
    * @param pointObj point object for panel display, it has following format:
    *   {name: <name>, description: <description>, latitude: <latitude>, longitude: <longitude>, srsUrl: <srsUrl> }
    */
    $scope.setPoint = function(pointObj) {
        $scope.pointObj = pointObj;
    };
      
    /**
    * Used to display XML in tree form in the panel, calls parse() function
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * @method setPanelTree
    * @param xmlString string which will be displayed
    */
    $scope.setPanelTree = function(xmlString) {
        $scope.treeStruct={};
        
        if (xmlString.length > 0) {

           var rootNode = SimpleXMLService.parseStringToDOM(xmlString);
           var wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureCollection");
            
            var features = null;
            //Read through our wfs:FeatureCollection and gml:featureMember(s) elements
            if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
                document.getElementById($scope.xmlPanelId).innerHTML = "";
                return
            }
            var featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMembers");        
            if (UtilitiesService.isEmpty(featureMembers)) {
                featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMember");
                features = featureMembers;
            }else{
                features = featureMembers[0].childNodes;
            }
            
            for(var i = 0; i < features.length; i++) {
                //Pull out some general stuff that we expect all features to have
                var featureNode = features[i]; 
                
                var name = SimpleXMLService.evaluateXPath(rootNode, featureNode, "gml:name", Constants.XPATH_STRING_TYPE).stringValue
                if(UtilitiesService.isEmpty(name)){
                    name = featureNode.getAttribute('gml:id');
                }
                
                $scope.treeStruct[name] = featureNode;                
               
            };
        } else {
            document.getElementById($scope.xmlPanelId).innerHTML = "";
        }
    };
    
    $scope.parseTree = function(name){
        
        if($scope.JSONTreeStruct[name]){
            return;
        }
       
        var value=[];
        
        var parseNodeToJson = function(node,tier,child){
            if(SimpleXMLService.isLeafNode(node)){
               
                return ({
                    label : SimpleXMLService.getNodeLocalName(node),
                    id:'id'+tier+child,
                    children : [{
                        label : SimpleXMLService.getNodeTextContent(node),
                        id:'id'+(tier+1)+child,
                        children : []     
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
                        children : []                    
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
    * Used to expand all the accordion elements in the panel at once
    * @method expandAll
    */
    $scope.expandAll = function() {       
        $scope.expandFlag = true;
        for (var varName in $scope.status) {
            $scope.status[varName] = true;
        } 
        
    };

    /**
    * Used to collapse all the accordion elements in the panel at once
    * @method collapseAll
    */
    $scope.collapseAll = function() {
      
        $scope.expandFlag = false;
        for (var varName in $scope.status) {
            $scope.status[varName] = false;
        }
    };


}]);