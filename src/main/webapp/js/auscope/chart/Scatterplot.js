Ext.define('auscope.chart.scatterplot', {
    extend : 'portal.charts.BaseD3Chart',
    
    /**
     * Will plot the specified data
     * 
     * function(data)
     * data - Object -  
     */
    plot : function(data){
        this.d3=d3;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = this.targetWidth - margin.left - margin.right,
        height = this.targetHeight - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);
    
        var y = d3.scale.linear()
            .range([height, 0]);
    
        var color = d3.scale.category10();
    
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    
        var svg = this.d3svg;
           
        svg = svg
            .attr("width", this.targetWidth)
            .attr("height", this.targetHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
    
          x.domain(d3.extent(data, function(d) { 
              return d.br; 
              })).nice();
          y.domain(d3.extent(data, function(d) { 
              return d.sc; 
              })).nice();
    
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("BR");
    
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("SC")
    
          svg.selectAll(".dot")
              .data(data)
            .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", function(d) { return x(d.br); })
              .attr("cy", function(d) { return y(d.sc); })
              .style("fill", function(d) { return color(d.highlight); });
    
          var legend = svg.selectAll(".legend")
              .data(color.domain())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);
    
          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });
                    
    
    }

    
})