/**
 * pressureDbCtrl class used for pressuredb-borehole controller. This controller sits under loadAnalyticCtrl
 * @extends loadAnalyticCtrl
 * @module controllers
 * @class pressureDbCtrl
 */
allControllers.controller('pressureDbCtrl', ['$scope','$timeout','RenderHandlerService',
                                                    function ($scope,$timeout,RenderHandlerService) {
    
    /* Value displayed in property selector */
    $scope.propertySelectLabel = "-- Select Property --";
    
    $scope.broadcast = function() {
        $timeout(function() {
            $scope.$broadcast('reCalcViewDimensions');
        });
    }; 
    
    $scope.param = {
        ccLevels : 9            
    };
    
    $scope.slider = {          
        options: {
            floor: 3,
            ceil: 9,
            step: 1             
        }
    };
       
    $scope.addLayer = function(layer){
        RenderHandlerService.renderLayer(layer,$scope.param);
    };
    
    /**
     * Sets the value displayed in the property dropdown selector and updates '$scope.param'
     * to trigger the slider below
     * @method setPropSelectList
     * @param val value to be set in dropdown selector
     */
    $scope.setPropSelectList = function(val) {
        var setVal = val;
        $scope.propertySelectLabel = setVal;
        $scope.param.ccProperty=setVal;
        // Force slider to update itself
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        });
    }
    
}]);