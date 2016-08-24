allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
    
    $scope.urlNotFound={};
    
    $rootScope.$on('$includeContentError', function (event, url) {      
        $scope.urlNotFound[url]=false;
    });
    
    $scope.getFilterPanel = function(){
        if($scope.urlNotFound['views/filters/'+$scope.filterPanelCsw.id+'.htm']==false){
            return 'views/filters/defaultFilter.htm';
        }else{
            return 'views/filters/'+ $scope.filterPanelCsw.id+'.htm';
        }
    };

    
}]);