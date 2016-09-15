/**
 * loadAnalyticCtrl class used to draw the analytic panel for the layer
 * @module controllers
 * @class loadAnalyticCtrl
 */
allControllers.controller('loadAnalyticCtrl', ['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
    
    
    /**
    * A function which returns the URL used to load the analytic panel
    * @method getAnalyticPanel
    */
    $scope.getAnalyticPanel = function(){
        if($scope.cswrecord.id == "capdf-hydrogeochem"){
            return 'views/analytic/defaultAnalytic.htm';
        }else{
            return 'views/analytic/defaultAnalytic.htm';
        }
    };

    
}]);