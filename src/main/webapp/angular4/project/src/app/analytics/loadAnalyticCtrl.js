/**
 * loadAnalyticCtrl class used to draw the analytic panel for the layer
 * @module controllers
 * @class loadAnalyticCtrl
 */
allControllers.controller('loadAnalyticCtrl', ['$scope','$rootScope','$timeout','Constants', function ($scope,$rootScope,$timeout,Constants) {
    
    
    /**
    * A function which returns the URL used to load the analytic panel
    * @method getAnalyticPanel
    */
    $scope.getAnalyticPanel = function(){
        if(Constants.analyticLoader[$scope.layer.id]){
            return Constants.analyticLoader[$scope.layer.id];
        }else{
            return 'views/analytic/defaultAnalytic.htm';
        }
    };

    
}]);