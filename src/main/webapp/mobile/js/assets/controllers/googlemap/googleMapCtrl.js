/**
 * googleMapCtrl class initialises the Google map used to display the main map
 * @module controllers
 * @class googleMapCtrl
 */
allControllers.controller('googleMapCtrl', ['$scope','$rootScope','GoogleMapService','RenderStatusService','$timeout', 
                                            function ($scope,$rootScope,GoogleMapService,RenderStatusService,$timeout) {
    
    $scope.active = {};
    
    $scope.showlayerPanel=false;
    
    $scope.zoomDrawActive = false;
    
    GoogleMapService.onDrawZoomStart($scope,function(){
        $scope.zoomDrawActive = true;
    });
    
    GoogleMapService.onDrawZoomEnd($scope,function(){
        $scope.zoomDrawActive = false;
    });
    

    //VT: on a small screen, close the panel after adding the layer
    var mq = window.matchMedia( "(max-width: 658px)" );
    if(mq.matches){
        $scope.$on('layer.add', function (evt,layer) {
            $scope.showlayerPanel=false;
        });
        
        GoogleMapService.onSelectDataStart($scope,function(){
            $scope.showlayerPanel=false;
        });

        GoogleMapService.onSelectDataEnd($scope,function(){
            $scope.showlayerPanel=true;
        });
        
    }

    GoogleMapService.initMap();

    $scope.floatingGroupStatus = RenderStatusService.getRenderStatus().group;
    
    RenderStatusService.onUpdate($scope, function (newRenderStatus) {
        //VT: Inconsistent API (Sync/Async): https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest
        $timeout(function() {
            $scope.floatingGroupStatus = newRenderStatus.group;
        },0);
    });
    
    
    $scope.addHeatMapOverlay = function(){
        if(GoogleMapService.heatmap==null){
            var containsPoint = GoogleMapService.addHeatMapOverlay();
            if(!containsPoint){
                alert("No Points rendered on Map yet. Add a point layer to utilize heatmap");
            }
        }else{
            GoogleMapService.removeHeatMapOverlay();
        }
    };
    
    $scope.toggleZoomDraw = function(){
        if($scope.zoomDrawActive){
            GoogleMapService.zoomDrawCancel();
        }else{
            GoogleMapService.zoomDraw();
        }        
    };
    

}]);
