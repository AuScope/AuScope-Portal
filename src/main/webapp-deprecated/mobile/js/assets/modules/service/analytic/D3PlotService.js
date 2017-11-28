/**
 * Service class related to handling all things related to making http cswrecords
 * @module analytic
 * @class D3PlotService
 * 
 */
allModules.service('D3PlotService',['$http','$q',function ($http,$q) {
    
    /**
     * Plot a scatter plot graph into the divId selected
     * @method plotScatter
     * @param data - the data for plotting in an array
     * @param divId - the id of the div for rendering the graph
     * @param height - the height of the graph 
     * @param xaxis - x-axis
     * @param yaxis - y-axis
     * 
     */
    this.plotScatter = function(data,divId,height,xaxis,yaxis){
        this.clearPlot(divId);
        this.d3=d3;
        var margin = {top: 15, right: 0, bottom: 20, left: 30};
        
        var targetWidth = $("#" + divId).width();
        var targetHeight = height;
        
        
        width = targetWidth - margin.left - margin.right,
        height = targetHeight - margin.top - margin.bottom;

        var container = d3.select("#" + divId);      
        var svg = container.append("svg");

        /* 
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */ 
    
        // setup x 
        var xValue = function(d) { return d.xaxis;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
            var yValue = function(d) { return d["yaxis"];}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");
    
        // setup fill color
        var cValue = function(d) { return d.highlight;},
            color = d3.scale.category10();
    
        svg = svg
            .attr("width", targetWidth)
            .attr("height", targetHeight)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "graphTooltip")
            .style("opacity", 0);
    
       
          // change string (from CSV) into number format
          data.forEach(function(d) {
            d.xaxis = +d.xaxis
            d["yaxis"] = +d["yaxis"];
    //        console.log(d);
          });
    
          // don't want dots overlapping axis, so add in buffer to data domain
          xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
          yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    
          // x-axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text(xaxis);
    
          // y-axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(yaxis);
    
          // draw dots
          svg.selectAll(".dot")
              .data(data)
            .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .style("fill", function(d) { return color(d.highlight); })
              .on("mouseover", function(d) {
                  tooltip.transition()
                       .duration(200)
                       .style("opacity", .9);
                  tooltip.html(d["tooltip"] + "<br/> (x:" + xValue(d) 
                    + ", y:" + yValue(d) + ")")
                       .style("left", (d3.event.pageX + 5) + "px")
                       .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });
    
          // draw legend
          var legend = svg.selectAll(".legend")
              .data(color.domain())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
          // draw legend colored rectangles
          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);
    
          // draw legend text
          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;});
        };
     
     /**
      * Plot a boxPlot graph into the divId selected
      * @method plotBox
      * @param data - the data for plotting in an array
      * @param id - the id of the div for rendering the graph
      * @param height - the height of the graph 
      * @param x - x-axis
      * @param y - y-axis
      *
      */
     this.plotBox = function(data,id,height,x,y){
         this.clearPlot(id);
         var divId = "#" + id;
         var targetWidth = $(divId).width();
         var targetHeight = height;
         var container = d3.select(divId);
         this.preserveAspectRatio = true;
         this.d3svg = container.append("svg")
             .attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid" : "none")
             .attr("viewBox",  "0 0 " + targetWidth + " " + targetHeight);                                     
         
         var csv = data; 

         
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

     };
                 
     
     /**
      * Clear the div of any graph plotting
      * @param - divId the id of the div to remove the graph.
      */
     this.clearPlot = function(id){
         var divId = "#" + id;        
         var container = d3.select(divId);
         container.select('*').remove();       
         container = null;
     };

   

} ]);