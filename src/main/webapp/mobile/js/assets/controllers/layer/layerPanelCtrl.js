/**
 * layerPanelCtrl class handles rendering of left hand side layer reports
 * @module controllers
 * @class layerPanelCtrl
 * 
 */
allControllers.controller('layerPanelCtrl', ['$scope','GetCSWRecordService','RenderStatusService','$timeout','GoogleMapService',
                                             function ($scope,GetCSWRecordService,RenderStatusService,$timeout,GoogleMapService) {
    $scope.cswRecords={};
    GetCSWRecordService.getCSWKnownLayers().then(function(data){
        $scope.cswRecords=data;      
    });


    $scope.status = {};  
    
    $scope.renderStatus = RenderStatusService.getRenderStatus();
    
    RenderStatusService.onUpdate($scope, function (newRenderStatus) {
        //VT: Inconsistent API (Sync/Async): https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest
        $timeout(function() {
            $scope.renderStatus = newRenderStatus;
        },0);
           
       
    });
 
    
    /**
     * remove the cswLayer
     * @method removeLayer
     * @param layer - the layer to remove
     */
     $scope.removeLayer = function(layer){
        GoogleMapService.removeActiveLayer(layer);
        
    };

    /**
     * @method getCswRecords
     * @return cswRecords - csw records that match the search, or all known layer csw records if search is empty
     */
    this.getCswRecords = function() {
        // if there was a search, return search result
        $scope.cswRecords = GetCSWRecordService.getSearchedLayers();
        return $scope.cswRecords;
    }; 
       
    /**
    * @method togglePanels
    * @param panelType type of panel
    * @param group group
    * @param cswRecordId record identifier
    */
    $scope.togglePanels = function(panelType,group,cswRecordId){
        //VT: we only want 1 panel open at a time
        var closeOtherPanels = function(){
            for (var showPanelType in $scope.status[group][cswRecordId].panels) {
                if(showPanelType != panelType){
                    $scope.status[group][cswRecordId].panels[showPanelType]=false;
                }
            }
        };
        
        if($scope.status[group]===undefined){
            $scope.status[group]={};                                   
        } 
      
        if($scope.status[group][cswRecordId]===undefined){
            $scope.status[group][cswRecordId]={};
            $scope.status[group][cswRecordId].panels={};
        }        
        
        $scope.status[group][cswRecordId].panels[panelType] = !$scope.status[group][cswRecordId].panels[panelType];
        
        if($scope.status[group][cswRecordId].panels[panelType] == true){
            $scope.status[group][cswRecordId].isExpanded = true;
            toggleLayers(group,cswRecordId);
        }else{
            $scope.status[group][cswRecordId].isExpanded = false;
        }
        closeOtherPanels();
        return;
        
    };
    
    
    
    
    /**
    * @method toggleLayers
    * @param group group
    * @param cswRecordId record identifier
    */
    var toggleLayers = function(group,cswRecordId){
        //VT: we only want 1 layer open at a time
        for(var cswRecord in $scope.status[group]){
            if(cswRecord != cswRecordId){
                if(cswRecord == "isOpen"){
                    continue;
                }
                for (var panelType in $scope.status[group][cswRecord].panels) {                    
                    $scope.status[group][cswRecord].panels[panelType]=false;                   
                }
                $scope.status[group][cswRecord].isExpanded = false;
            }
        }        
    };
    
    
   
    
}]);
