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
    
    // Used to control the map's loading mask
    $scope.mapMaskFlag = false;
    
    GoogleMapService.onDrawZoomStart($scope,function(){
        $scope.zoomDrawActive = true;
    });
    
    GoogleMapService.onDrawZoomEnd($scope,function(){
        $scope.zoomDrawActive = false;
    });
    
    // Register a function that will be called when the website is busy,
    // thus it will enable the map's loading mask
    GoogleMapService.onBusyStart(function(){        
        $scope.mapMaskFlag = true;             
    });
    
    // Register a function that will be called when the website is not busy anymore,
    // thus it will disable the map's loading mask
    GoogleMapService.onBusyEnd(function(){
       // When the user clicks multiple times on many features, this timeout makes sure that the mask is always disabled in the end
       $timeout(function() {           
            $scope.mapMaskFlag = false;         
       },0);

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
            $scope.floatingLayerStatus = newRenderStatus;
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
