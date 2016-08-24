allControllers.controller('layerPanelCtrl', ['$scope','GetCSWRecordService', function ($scope,GetCSWRecordService) {
    $scope.cswRecords={};
    GetCSWRecordService.getCSWKnownLayers().then(function(data){
        $scope.cswRecords=data;
    });
    
  
    $scope.status = {};    
    $scope.showPanel = {};
    
    $scope.togglePanels = function(panelType,cswRecordId){
        
        var closeOthers = function(){
            for (var showPanelType in $scope.showPanel) {
                if(showPanelType != panelType){
                    $scope.showPanel[showPanelType][cswRecordId]=false;
                }
            }
        }
        
        if($scope.showPanel[panelType]===undefined ){  
            $scope.showPanel[panelType]={};
            $scope.showPanel[panelType][cswRecordId] = false;
        }
        $scope.showPanel[panelType][cswRecordId] = !$scope.showPanel[panelType][cswRecordId];
        closeOthers();
        return;
        
    };
    
    $scope.isExpanded = function(cswRecordId){
        for (var showPanelType in $scope.showPanel) {
            if($scope.showPanel[showPanelType][cswRecordId]==true){
                return true;
            };            
        };
        return false;
    };
    
   
    
}]);