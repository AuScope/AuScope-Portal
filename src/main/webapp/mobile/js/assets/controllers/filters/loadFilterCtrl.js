/**
 * loadFilterCtrl class used to draw the filter panel for the layer reports
 * @module controllers
 * @class loadFilterCtrl
 */
allControllers.controller('loadFilterCtrl', ['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
    
    $scope.urlNotFound={};
    
    $rootScope.$on('$includeContentError', function (event, url) {      
        $scope.urlNotFound[url]=false;
    });
    
    /**
    * A function which returns the URL used to load the filter panel
    * @method getFilterPanel
    */
    $scope.getFilterPanel = function(){
        if($scope.urlNotFound['views/filters/'+$scope.filterPanelCsw.id+'.htm']==false){
            return 'views/filters/defaultFilter.htm';
        }else{
            return 'views/filters/'+ $scope.filterPanelCsw.id+'.htm';
        }
    };

    
}]);