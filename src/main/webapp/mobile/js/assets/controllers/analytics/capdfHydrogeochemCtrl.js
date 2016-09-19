/**
 * capdfHydrogeochemCtrl class used for capdf hydrogeochem controller
 * @module controllers
 * @class capdfHydrogeochemCtrl
 */
allControllers.controller('capdfHydrogeochemCtrl', ['$scope','GoogleMapService','$http','LayerManagerService','UtilitiesService','$timeout', 
                                                    function ($scope,GoogleMapService,$http,LayerManagerService,UtilitiesService,$timeout) {
    
    //VT: there should only be one wms resource for capdf
    var wfsResource = LayerManagerService.getWFS($scope.cswrecord)[0];
    
    
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
     
     $scope.renderSlider=function(min,max){
         var minNumber=Number(min);
         var maxNumber=Number(max);
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
                     ceil: maxNumber,
                     step: 0.1
                 }
             };
         $timeout(function () {
             $scope.$broadcast('rzSliderForceRender');
         }); 
     };
    
}]);