/**
 * capdfHydrogeochemCtrl class used for capdf hydrogeochem controller
 * @module controllers
 * @class capdfHydrogeochemCtrl
 */
allControllers.controller('capdfHydrogeochemCtrl', ['$scope','GoogleMapService','$http','LayerManagerService','UtilitiesService','$timeout','CapdfWMSService','$filter', 
                                                    function ($scope,GoogleMapService,$http,LayerManagerService,UtilitiesService,$timeout,CapdfWMSService,$filter) {
    
    //VT: there should only be one wms resource for capdf
    var wfsResource = LayerManagerService.getWFS($scope.cswrecord)[0];
    $scope.paramOfInterest=[];
    
     var getGOIs = function(){ 
        $http.get('../doGetGroupOfInterest.do',{
            params:{
                serviceUrl:wfsResource.url            
            }
        }).then(function (response) {
            $scope.gois = response.data.data;
        });
     };
     getGOIs();
   
     
     $scope.getPOIs = function(group){
         $scope.slider = null;
         $http.get('../doGetAOIParam.do',{
             params:{
                 serviceUrl:wfsResource.url,
                 featureType : group
             }
         }).then(function (response) {
             $scope.pois = response.data.data;
         });
     };
     
     $scope.augmentLabel = function(param1, param2){
         if(UtilitiesService.isEmpty(param2)){
             return param1;
         }
         else{
             return param1+" ("+param2+")"; 
         }
         
     };
     
     $scope.renderSlider=function(min,max,paramOfInterest){
         //VT: A strange bug where the ng-model in <select> is not bind to ng-model outside of select
         $scope.paramOfInterest=paramOfInterest;
         var minNumber=Number($filter('number')(min, 2)) ;
         var maxNumber=Number($filter('number')(Number(max), 2)) ;
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
     
     
     $scope.renderColorCode = function(goi,poi,minValue, maxValue){
         
         GoogleMapService.removeActiveLayer($scope.cswrecord);
         CapdfWMSService.renderLayer(goi,$scope.cswrecord,{
             featureType:goi,
             poi : poi,
             minMax:[minValue,maxValue]
         }); 
     };
    
}]);