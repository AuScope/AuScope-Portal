allControllers.controller('layerPanelCtrl', ['$scope','GetCSWRecordService', function ($scope,GetCSWRecordService) {
    $scope.cswRecords={};
    GetCSWRecordService.getCSWKnownLayersGroup().then(function(data){
        $scope.cswRecords=data;
    });
    
  
    
    
	
    $scope.status = {
        
    };
    
    
}]);