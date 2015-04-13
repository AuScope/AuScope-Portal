Ext.define('auscope.chart.boxPlot', {
    extend : 'portal.charts.BaseD3Chart',
    
    /**
     * Will plot the specified data
     * 
     * function(data)
     * data - Object -  
     */
    plot : function(csv){
        this.d3=d3;
        var labels = true; // show the text labels beside individual boxplots?

        var margin = {top: 30, right: 50, bottom: 70, left: 50};
        var  width = this.targetWidth - margin.left - margin.right;
        var height = this.targetHeight - margin.top - margin.bottom;
            
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
            
            // add more rows if your csv file has more columns

            // add here the header of the csv file
            data[0][0] = "box1";
            data[1][0] = "box2";
           
            // add more rows if your csv file has more columns

            data[0][1] = [];
            data[1][1] = [];
         
          
            csv.forEach(function(x) {
                var v1 = Math.floor(x.box1),
                    v2 = Math.floor(x.box2)
                  
                    // add more variables if your csv file has more columns
                    
                var rowMax = Math.max(v1,v2 );
                var rowMin = Math.min(v1,v2 );

                data[0][1].push(v1);
                data[1][1].push(v2);
              
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
                .style("font-size", "18px") 
                //.style("text-decoration", "underline")  
                .text("Test Box Plot");
         
             // draw y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text") // and text1
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .style("font-size", "16px") 
                  .text("Test Values");        
            
            // draw x axis  
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
              .call(xAxis)
              .append("text")             // text label for the x axis
                .attr("x", (width / 2) )
                .attr("y",  10 )
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .style("font-size", "16px") 
                .text("Boxes"); 
      

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
    
    }

    
})