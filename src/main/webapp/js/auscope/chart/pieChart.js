Ext.define('auscope.chart.pieChart', {
    extend : 'portal.charts.BaseD3Chart',
    
    /**
     * Will plot the specified data
     * 
     * function(data)
     * data - Object -  
     */
    plot : function(dataset){
        this.d3=d3;
        var margin = {top: 40, right: 20, bottom: 20, left: 20},
        width = this.targetWidth - margin.left - margin.right,
        height = this.targetHeight - margin.top - margin.bottom;
        var radius = Math.min(width, height) / 2;
      
        var svg = this.d3svg;
        
        svg = svg      
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width / 2)-30) + "," + ((height / 2)+20) + ")");
        
        svg.append("g")
        .attr("class", "labels");
        svg.append("g")
        .attr("class", "lines");

        var arc = d3.svg.arc()
            .outerRadius(radius);

        var pie = d3.layout.pie()
            .value(function(d) { return d.count; })
            .sort(function(a, b) { return d3.ascending(a.count, b.count); });

        svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr("data-legend",function(d) {return d.data.label})
            .attr('fill', function(d, i) {return d.data.colour})
            .attr("class", "slice");
        
         //-------------Text----------//
            
        var key = function(d){ 
            if(Math.abs(d.startAngle - d.endAngle)>0.34906585){
                return d.data.label;
            }
        };    
        
        var outerArc = d3.svg.arc()
        .innerRadius(radius)
        .outerRadius(radius * 1.1);
        
        var innerArc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius);
            
        var text = svg.select(".labels").selectAll("text")
        .data(pie(dataset), key);

        text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {          
            return d.data.label; 
        });
        
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text.exit()
          .remove();
        
        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(dataset), key);
        
        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
                };          
            });
        
        polyline.exit()
            .remove();
        
        /*----- Legend -----*/
        
            
        legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate("+(radius+100)+",-"+(radius-15)+")")
        .style("font-size", "10px")
        .call(d3.legend)

  
    
    }

    
})