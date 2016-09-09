/**
 * layerSearchCtrl class handles searching layers based on user keywords
 * @module controllers
 * @class layerSearchCtrl
 * 
 */
allControllers.controller('layerSearchCtrl', ['$scope', 'GetCSWRecordService', function ($scope,GetCSWRecordService) {
    /**
     * This is triggered after the user types inside the search text field and press enter.
     * It will search through all known layers CSW records name and description that matches the keywords.
     * It will then show the layer panel with search results or all layers if no keyword is entered.
     * @method submit
     */
    this.submit = function() {
        // search layers that matches keywords and flag them
        GetCSWRecordService.searchLayers($scope.keywords); 
        // show layers
        $scope.$parent.showlayerPanel = !$scope.$parent.showlayerPanel;
    }; 
    
}]);