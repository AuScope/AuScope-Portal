/*
 * This class handles rendering of the querier panel
 * @module controllers
 * @class querierPanelCtrl
 *
 */
allControllers.controller('querierPanelCtrl',  ['$compile', '$scope', 'QuerierPanelService', function ($compile, $scope, QuerierPanelService) {
    
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
    * Creates a random variable name, inserts as attribute name in '$scope.status', and sets the attribute value to 'statusVal'
    * This routine is used to store the open/closed state of all the accordion nodes
    * @method genRandomVarName
    * @param statusVal value of the open/closed state
    * @return random variable name
    */
    $scope.genRandomVarName = function (statusVal) {
        // Create var name
        var varName = "openSubQueryPanel_"+Math.floor(Math.random()*10000000).toString();
        // Register and set var name
        $scope.status[varName] = statusVal;
        // Return var name
        return varName;
    }


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
    * Parses XML in 'xmlDoc',
    * calls itself (recursive) for each child in the XML tree,
    * appends Bootstrap accordion to 'parentDiv' in the same structure as the XML
    * @method parse
    * @param xmlDoc XML DOM object to be parsed
    * @param parentDiv div used to append dom objects to make the accordion
    * @param parentStatusVarName var name of parent as used the '$scope.status' object
    */        
    $scope.parse = function(xmlDoc, parentDiv, parentStatusVarName) {
        var body = xmlDoc.textContent && xmlDoc.textContent.trim(),
        hasChildren = xmlDoc.childNodes && xmlDoc.childNodes.length,
        hasAttributes = xmlDoc.attributes && xmlDoc.attributes.length;
        
        // If it's text XML node, then do not make accordion, just append a textNode to the parentDiv
        if (xmlDoc.nodeName=='#text') {
            var textNode = document.createTextNode(body);
            parentDiv.appendChild(textNode);
            // Leaf accordion nodes should start in opened state
            $scope.status[parentStatusVarName] = true;            
            return;
        }

        // Do not display attributes for 'wfs:FeatureCollection'
        if (xmlDoc.nodeName=='wfs:FeatureCollection') {
            hasAttributes = false;
        }
        
        // Default accordion state is closed
        var isOpenVal=false;
        
        // But some accordion nodes are open at first
        if (xmlDoc.nodeName=='gml:featureMembers' || xmlDoc.nodeName=='wfs:FeatureCollection') {
            isOpenVal = true;
        }
        
        // Set up 'accordion'
        var panelDiv = document.createElement('uib-accordion');
        parentDiv.appendChild(panelDiv);
        
        // Set up 'accordion-heading' 
        var headingDiv = document.createElement('uib-accordion-heading');
        
        // Set up chevron icon and open/close state of accordion node
        var varName = $scope.genRandomVarName(isOpenVal);
        var iconElem = document.createElement('i');
        iconElem.className = "glyphicon glyphicon-plus";
        iconElem.setAttribute("ng-class", "{'glyphicon-chevron-down': status."+varName+", 'glyphicon-chevron-right': !status."+varName+"}");
        headingDiv.appendChild(iconElem);
        
        // Set up tag element
        var tagTextNode = document.createTextNode(xmlDoc.nodeName);
        var tagSpan = document.createElement('span');
        tagSpan.className = 'querier-xml-tag';
        tagSpan.appendChild(tagTextNode);
        headingDiv.appendChild(tagSpan);
        headingDiv.appendChild(document.createElement('br'));
        
        // Set up attribute elements
        if (hasAttributes) {
            for (var i=0; i<xmlDoc.attributes.length; i++) {
                var attrNameTextNode = document.createTextNode(xmlDoc.attributes[i].name),
                attrNameSpan = document.createElement('span'),
                attrValTextNode = document.createTextNode(xmlDoc.attributes[i].value),
                attrValSpan = document.createElement('span'),
                equalsTextNode = document.createTextNode('=');
                attrNameSpan.className = 'querier-xml-attrname';
                attrValSpan.className = 'querier-xml-attrval';
                attrNameSpan.appendChild(attrNameTextNode);
                attrValSpan.appendChild(attrValTextNode);
                headingDiv.appendChild(attrNameSpan);
                headingDiv.appendChild(equalsTextNode);
                headingDiv.appendChild(attrValSpan);
                headingDiv.appendChild(document.createElement('br'));
            }
        }
        
        // Set up group div, append 'accordion-heading' to it
        var groupDiv = document.createElement('div');
        groupDiv.setAttribute('uib-accordion-group','');
        groupDiv.setAttribute("is-open","status."+varName);
        groupDiv.className = "panel-default";
        groupDiv.appendChild(headingDiv);
        
        // Finally append groupDiv to panelDiv
        panelDiv.appendChild(groupDiv);
        
        
        if (hasChildren) {
            // Go through all the child nodes, recursively call parse()
            for (var i=0; i<xmlDoc.childNodes.length; i++) {
                $scope.parse(xmlDoc.childNodes[i], groupDiv, varName);
            }
        } else {
            var textNode = document.createTextNode(body);
            groupDiv.appendChild(textNode);
        }
    };

    /**
    * Used to display XML in tree form in the panel, calls parse() function
    * Passed to 'QuerierPanelService' as a parameter, then called by 'QuerierPanelService'
    * @method setPanelTree
    * @param xmlString string which will be displayed
    */
    $scope.setPanelTree = function(xmlString) {
        if (xmlString.length > 0) {
            var XML = new DOMParser().parseFromString(xmlString, "text/xml");
            if (XML.childNodes && XML.childNodes.length > 0) {
                var startNode = document.getElementById($scope.xmlPanelId);
                // Remove old nodes
                while (startNode.hasChildNodes()) {
                    startNode.removeChild(startNode.lastChild);
                }
                // Call parse() to parse the XML tree, and create accordion DOM objects for display
                $scope.parse(XML.childNodes[0], startNode, "root");
                $compile(startNode)($scope);
            }
        } else {
            document.getElementById($scope.xmlPanelId).innerHTML = "";
        }
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
    }


    
    /**
    * Used to expand all the accordion elements in the panel at once
    * @method expandAll
    */
    $scope.expandAll = function() {
        var varName;
        $scope.expandFlag = true;
        for (varName in $scope.status) {
            $scope.status[varName] = true;
        } 
        
    };

    /**
    * Used to collapse all the accordion elements in the panel at once
    * @method collapseAll
    */
    $scope.collapseAll = function() {
        var varName;
        $scope.expandFlag = false;
        for (varName in $scope.status) {
            $scope.status[varName] = false;
        }
    };


}]);