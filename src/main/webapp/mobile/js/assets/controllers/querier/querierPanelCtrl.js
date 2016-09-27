/*
 * This class handles rendering of the querier panel
 * @module controllers
 * @class querierPanelCtrl
 *
 */
allControllers.controller('querierPanelCtrl',  ['$scope', 'QuerierPanelService', function ($scope, QuerierPanelService) {
    QuerierPanelService.registerParentScope($scope.$parent, $scope);
}]);