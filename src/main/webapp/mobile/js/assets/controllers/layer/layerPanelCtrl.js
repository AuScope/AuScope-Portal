allControllers.controller('layerPanelCtrl', ['$scope','GetCSWRecordService', function ($scope,GetCSWRecordService) {
    $scope.cswRecords={};
    GetCSWRecordService.getCSWKnownLayers().then(function(data){
        $scope.cswRecords=data;      
    });

    $scope.status = {};    
 
    //VT: we only want 1 panel open at a time
    $scope.togglePanels = function(panelType,group,cswRecordId){
        
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
    
    
    
    //VT: we only want 1 layer open at a time
    var toggleLayers = function(group,cswRecordId){
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
