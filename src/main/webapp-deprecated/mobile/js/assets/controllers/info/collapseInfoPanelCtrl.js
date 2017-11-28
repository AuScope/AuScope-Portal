/**
 * collapseInfoPanelCtrl class holds state and manipulates the preview map of the collapsible information panels
 * @module controllers
 * @class collapseInfoPanelCtrl
 * 
 */ 
allControllers.controller('collapseInfoPanelCtrl', ['$scope', 'PreviewMapService', function ($scope, PreviewMapService) {
  $scope.isCollapsed = true;
  $scope.isCollapsedHorizontal = false;
  
  /**
  * Changes a rectangle in the preview map to a special highlighted colour
  * @method highlightOnPreviewMap
  * @param reportName Name of the reports displayed in the preview map
  * @param adminArea Name of the region where the reports apply
  *
  */
  $scope.highlightOnPreviewMap = function(reportName, adminArea) {
      PreviewMapService.setBBoxOptions(reportName, adminArea, { strokeColor: '#00FF00'});
  };
  
  /**
  * Returns a rectangle on the preview map to the default non-highlighted colour
  * @method lowlightOnPreviewMap 
  * @param reportName Name of the reports displayed in the preview map
  * @param adminArea Name of the region where the reports apply
  *
  */
  $scope.lowlightOnPreviewMap = function(reportName, adminArea) {
      PreviewMapService.setBBoxOptions(reportName, adminArea, { strokeColor: '#FF0000'});
  }
}]);
