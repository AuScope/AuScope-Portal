/**
 * capdfHydrogeochemCtrl class used for capdf hydrogeochem controller. This controller sits under loadAnalayticCtrl
 * @extends loadAnalayticCtrl
 * @module controllers
 * @class capdfHydrogeochemCtrl
 */
allControllers.controller('capdfHydrogeochemCtrl', ['$scope','GoogleMapService','$http','LayerManagerService','UtilitiesService','$timeout','CapdfWMSService','$filter','D3PlotService','RenderHandlerService',
                                                    function ($scope,GoogleMapService,$http,LayerManagerService,UtilitiesService,$timeout,CapdfWMSService,$filter,D3PlotService,RenderHandlerService) {
    
    //VT: there should only be one wms resource for capdf
    var wfsResource = LayerManagerService.getWFS($scope.layer)[0];
    var graphId = "capdf-graph-analytic";
    var layerId = "capdf-hydrogeochem";
    $scope.isLayerActive = GoogleMapService.isLayerActive($scope.layer);
    $scope.paramOfInterest=[];
    $scope.axis={};
    
    GoogleMapService.onLayerAdded($scope, function(evt,layer){
        if(layer.id===layerId){
            $scope.isLayerActive = true; 
        }
    });
  
   
    GoogleMapService.onLayerRemoved($scope, function(evt,layer){
        if(layer.id===layerId){
            $scope.isLayerActive = false; 
        }
    });
    
    $scope.addLayer = function(){
        $scope.isLayerActive = true;
        RenderHandlerService.renderLayer($scope.layer);              
    };
    
   
    
    
    /**
     * register event when user start to select data on map
     * @method onSelectDataStart
     */
    GoogleMapService.onSelectDataStart($scope,function(){
        $scope.selectingData=true;        
    });
    
    /**
     * register event when user selection ends
     * @method onSelectDataEnd
     */
    GoogleMapService.onSelectDataEnd($scope,function(event,bound){
        $scope.selectingData=false;
        $scope.selectedBoundData = bound;
    });
    
    
    /**
     * retrieve grouping for dropdown
     * @method getGOIs
     */
     var getGOIs = function(){
        $http.get('../doGetGroupOfInterest.do',{
            params:{
                serviceUrl:wfsResource.url            
            }
        }).then(function (response) {
            $scope.gois = response.data.data;
        });
     };
     
     if (wfsResource != undefined && wfsResource.url != undefined) getGOIs();
   
     /**
      * get parameter based on group
      * @method getPOIs
      */
     $scope.getPOIs = function(group){
         $scope.slider = null;
         D3PlotService.clearPlot(graphId);
         $http.get('../doGetAOIParam.do',{
             params:{
                 serviceUrl:wfsResource.url,
                 featureType : group
             }
         }).then(function (response) {
             $scope.pois = response.data.data;
         });
     };
     
     /**
      * Cosmetically change the label display on the drop down
      * @method augmentLabel
      */
     $scope.augmentLabel = function(param1, param2){
         if(UtilitiesService.isEmpty(param2)){
             return param1;
         }
         else{
             return param1+" ("+param2+")"; 
         }
         
     };
     
     /**
      * Render the slider widget
      * @method renderSlider
      */
     $scope.renderSlider=function(min,max,paramOfInterest){
         
         //VT: when parameter change, remove graph as well.
         D3PlotService.clearPlot(graphId);
         
         //VT: A strange bug where the ng-model in <select> is not bind to ng-model outside of select
         $scope.paramOfInterest=paramOfInterest;
         var minNumber=Math.round(Number(min) * Math.pow(10,2))/Math.pow(10,2);
         var maxNumber=Math.round(Number(max) * Math.pow(10,2))/Math.pow(10,2);
         if(min == max){
            $scope.noRangeFound = true;
         }else{
             $scope.noRangeFound=false;
         }                       
         
         $scope.slider = {                 
                 minValue: minNumber,
                 maxValue: maxNumber,
                 options: {
                     floor: minNumber,
                     ceil:  maxNumber,
                     step: 0.1                     
                 }
             };
         $timeout(function () {
             $scope.$broadcast('rzSliderForceRender');
         }); 
     };
     
     /**
      * Run the color code request
      * @method renderColorCode
      */
     $scope.renderColorCode = function(goi,poi,minValue, maxValue){
         
         GoogleMapService.removeActiveLayer($scope.layer);
         CapdfWMSService.renderLayer(goi,$scope.layer,{
             featureType:goi,
             poi : poi,
             minMax:[minValue,maxValue]
         }); 
     };
     
     /**
      * Request to start the drawing process for bounding box selection
      * @method selectBound
      */
     $scope.selectBound = function(){
         GoogleMapService.selectMapData();
     };
     
     $scope.plotBox = function(group){         
         $scope.plotting=true;
         var viewportBound = GoogleMapService.getCurrentViewPort();                        
         $http.get('../doCapdfHydroBoxPlotList.do',{
             params:{
                 serviceUrl:wfsResource.url,
                 featureType : group,
                 box1 : $scope.axis.x,
                 box2 : $scope.axis.y,
                 bbox : {
                     northBoundLatitude : $scope.selectedBoundData.getNorthEast().lat(),
                     southBoundLatitude : $scope.selectedBoundData.getSouthWest().lat(),
                     eastBoundLongitude : $scope.selectedBoundData.getNorthEast().lng(),
                     westBoundLongitude : $scope.selectedBoundData.getSouthWest().lng(),
                     crs : "EPSG:4326"
                 },
                 obbox : {
                     northBoundLatitude : viewportBound.getNorthEast().lat(),
                     southBoundLatitude : viewportBound.getSouthWest().lat(),
                     eastBoundLongitude : viewportBound.getNorthEast().lng(),
                     westBoundLongitude : viewportBound.getSouthWest().lng(),
                     crs : "EPSG:4326"
                 }
             }
         }).then(function (response) {  
             D3PlotService.plotBox(response.data.data.series,graphId,400,$scope.axis.x,$scope.axis.y);   
             $scope.plotting=false;
         });
     };
     
     $scope.platScatter = function(group){         
         $scope.plotting=true;
         var viewportBound = GoogleMapService.getCurrentViewPort();
         $http.get('../doCapdfHydroScatterPlotList.do',{
             params:{
                 serviceUrl:wfsResource.url,
                 featureType : group,
                 xaxis : $scope.axis.x,
                 yaxis : $scope.axis.y,
                 bbox : {
                     northBoundLatitude : $scope.selectedBoundData.getNorthEast().lat(),
                     southBoundLatitude : $scope.selectedBoundData.getSouthWest().lat(),
                     eastBoundLongitude : $scope.selectedBoundData.getNorthEast().lng(),
                     westBoundLongitude : $scope.selectedBoundData.getSouthWest().lng(),
                     crs : "EPSG:4326"
                 },
                 obbox : {
                     northBoundLatitude : viewportBound.getNorthEast().lat(),
                     southBoundLatitude : viewportBound.getSouthWest().lat(),
                     eastBoundLongitude : viewportBound.getNorthEast().lng(),
                     westBoundLongitude : viewportBound.getSouthWest().lng(),
                     crs : "EPSG:4326"
                 }
             }
         }).then(function (response) {            
             D3PlotService.plotScatter(response.data.data.series,graphId,400,$scope.axis.x,$scope.axis.y);
             $scope.plotting=false;
            
         });
     };
     
    
    
}]);