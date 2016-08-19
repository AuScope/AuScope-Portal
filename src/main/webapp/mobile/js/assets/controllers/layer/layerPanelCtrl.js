allControllers.controller('layerPanelCtrl', ['$scope','GetCSWRecordService', function ($scope,GetCSWRecordService) {
    $scope.cswRecords={};
    GetCSWRecordService.getCSWKnownLayers().then(function(data){
        $scope.cswRecords=data;
    });
    
  
    
    
	
    $scope.status = {};
    $scope.isFilterCollapsed = {};
    $scope.showInfoPanel ={};
    
    
}]);