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
    $scope.axis={};
    
    
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
         
         GoogleMapService.removeActiveLayer($scope.cswrecord);
         CapdfWMSService.renderLayer(goi,$scope.cswrecord,{
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
             
             var targetWidth = $("#capdf-graph-analytic").width();
             var targetHeight = 400;
             var container = d3.select("#capdf-graph-analytic");
             this.preserveAspectRatio = true;
             this.d3svg = container.append("svg")
                 .attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid" : "none")
                 .attr("viewBox",  "0 0 " + targetWidth + " " + targetHeight);                                     
             
             var csv = response.data.data.series; 
             var x = $scope.axis.x;
             var y = $scope.axis.y;
            
            
             
             this.d3=d3;
             var labels = true; // show the text labels beside individual boxplots?

             var margin = {top: 15, right: 0, bottom: 45, left: 30};
             var width = targetWidth - margin.left - margin.right;
             var height = targetHeight - margin.top - margin.bottom;
                 
             var min = Infinity,
                 max = -Infinity;
                 
             
            
                 // using an array of arrays with
                 // data[n][2] 
                 // where n = number of columns in the csv file 
                 // data[i][0] = name of the ith column
                 // data[i][1] = array of values of ith column

                 var data = [];
                 data[0] = [];
                 data[1] = [];
                 data[2] = [];
                 data[3] = [];
                 
                 // add more rows if your csv file has more columns

                 // add here the header of the csv file
                 data[0][0] = x;
                 data[1][0] = y;
                 data[2][0] = x + "-bounded";
                 data[3][0] = y + "-bounded";
                
                 // add more rows if your csv file has more columns

                 data[0][1] = [];
                 data[1][1] = [];
                 data[2][1] = [];
                 data[3][1] = [];
              
               
                 csv.forEach(function(x) {
                     var v1 = Math.floor(x.x1),
                         v2 = Math.floor(x.y1),
                         v3 = Math.floor(x.x2),
                         v4 = Math.floor(x.y2)
                       
                         // add more variables if your csv file has more columns
                         //2147483646
                         
                         
                     var rowMax = -2147483646
                     for(var i = 0; i < 4; i++){
                         if(v1 > rowMax && v1 != 2147483646){
                             rowMax=v1;
                         }
                         if(v2 > rowMax && v2 != 2147483646){
                             rowMax=v2;
                         }
                         if(v3 > rowMax && v3 != 2147483646){
                             rowMax=v3;
                         }
                         if(v4 > rowMax && v4 != 2147483646){
                             rowMax=v4;
                         }
                     }
                     
                     
                     var rowMin = 2147483646
                     for(var i = 0; i < 4; i++){
                         if(v1 < rowMin && v1 != 2147483646){
                             rowMin=v1;
                         }
                         if(v2 < rowMin && v2 != 2147483646){
                             rowMin=v2;
                         }
                         if(v3 < rowMin && v3 != 2147483646){
                             rowMin=v3;
                         }
                         if(v4 < rowMin && v4 != 2147483646){
                             rowMin=v4;
                         }
                     }
                    
                     

                     data[0][1].push(v1);
                     data[1][1].push(v2);
                     data[2][1].push(v3);
                     data[3][1].push(v4);
                   
                      // add more rows if your csv file has more columns
                      
                     if (rowMax > max) max = rowMax;
                     if (rowMin < min) min = rowMin; 
                 });
               
                 var chart = d3.box()
                     .whiskers(iqr(1.5))
                     .height(height) 
                     .domain([min, max])
                     .showLabels(labels);

                 var svg = this.d3svg;
                 
                 svg = svg
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .attr("class", "box")    
                     .append("g")
                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                 
                 // the x-axis
                 var x = d3.scale.ordinal()     
                     .domain( data.map(function(d) { return d[0] } ) )       
                     .rangeRoundBands([0 , width], 0.7, 0.3);        

                 var xAxis = d3.svg.axis()
                     .scale(x)
                     .orient("bottom");

                 // the y-axis
                 var y = d3.scale.linear()
                     .domain([min, max])
                     .range([height + margin.top, 0 + margin.top]);
                 
                 var yAxis = d3.svg.axis()
                 .scale(y)
                 .orient("left");

                 // draw the boxplots    
                 svg.selectAll(".box")      
                   .data(data)
                   .enter().append("g")
                     .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
                   .call(chart.width(x.rangeBand())); 
                 
                       
                 // add a title
                 svg.append("text")
                     .attr("x", (width / 2))             
                     .attr("y", 0 + (margin.top / 2))
                     .attr("text-anchor", "middle")  
                     .style("font-size", "8px") 
                     //.style("text-decoration", "underline")  
                     .text("Box Plot");
              
                  // draw y axis
                 svg.append("g")
                     .attr("class", "y axis")
                     .call(yAxis)
                     .append("text") // and text1
                       .attr("transform", "rotate(-90)")
                       .attr("y", 6)
                       .attr("dy", ".71em")
                       .style("text-anchor", "end")
                       .style("font-size", "8px") 
                       .text("Values");        
                 
                 // draw x axis  
                 svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
                   .call(xAxis)
                 
           

             // Returns a function to compute the interquartile range.
             function iqr(k) {
               return function(d, i) {
                 var q1 = d.quartiles[0],
                     q3 = d.quartiles[2],
                     iqr = (q3 - q1) * k,
                     i = -1,
                     j = d.length;
                 while (d[++i] < q1 - iqr);
                 while (d[--j] > q3 + iqr);
                 return [i, j];
               };
             }
                   
                 
             var text = svg.selectAll("text")
             .attr("font-size", "10px");
           

            
         
            
             
         });
     };
     
     $scope.platScatter = function(group){
         var viewportBound = GoogleMapService.getCurrentViewPort();
         $http.get('../doCapdfHydroBoxPlotList.do',{
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
             $scope.pois = response.data.data;
         });
     };
     
    
    
}]);