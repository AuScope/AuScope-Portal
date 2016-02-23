Ext.define('auscope.chart.rickshawChart', {
    extend : 'portal.charts.BaseD3Chart',
    
    /**
     * Plot the data and have controls which allow the user to change the plot type (bar, chart etc.), apply smoothing,
     * change the order of the metrics on display, look at a small section of data, add or remove metrics etc.
     * 
     * Will plot all data on one graph, with up to 2 y-axes and an x-axis
     * If there are too many metrics to display within the window, then scrollbars will be used
     * 
     * function(data_bin,xaxis_name,yaxis_names, yaxis_keys)
     * data_bin - 2D Object array - first keys are the y-axis keys (i.e. values in 'yaxis_keys' array)
     *                              second keys are the names of the metrics
     *                              values are lists of {x:X-num, y:Y-num} pairs
     *
     * xaxis_name - string, label for the x-axis
     *
     * yaxis_names - Object array, keys are in 'yaxis_keys', values are the labels for the y-axis
	 *
	 * yaxis_keys - array of names of y-axis keys, length is 1 or 2 (since there can only be 1 or 2 y-axes)
     *
     */
    plot : function(data_bin,xaxis_name,yaxis_names, yaxis_keys) {
        
        var htmlSelection = d3.select("[id="+this.innerId+"]");
        var graphWidth = this.graphWidth;
        var graphHeight = this.graphHeight;
        var innerId = this.innerId;
		
		// Check input parameters
		if (yaxis_keys.length>2 || yaxis_keys.length==0) {
			throw new Error("auscope.chart.rickshawChart.plot(): 'yaxis_keys' must have 1 or 2 members");
		}
		if (yaxis_keys.length==1) {
			if (!(yaxis_keys[0] in data_bin)) {
				throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'data_bin'");
			}
			if (!(yaxis_keys[0] in yaxis_names)) {
				throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'yaxis_names'");
			}	
		} else {
			if (!(yaxis_keys[0] in data_bin) || !(yaxis_keys[1] in data_bin)) {
				throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'data_bin'");
			}
			if (!(yaxis_keys[0] in yaxis_names) || !(yaxis_keys[1] in yaxis_names)) {
				throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'yaxis_names'");
			}	 
		}
        
        // Clean out HTML
        htmlSelection.html("");

        var currentHTML = htmlSelection.html();
            
        // add the graph's div area to the webpage with id="rickshawChart_outer"
        var graph_html = currentHTML +
        '<div id="rickshawChart_outer">' +
        '    <div id="left_side_panel">' + // LHS panel - the list of metrics is here
        '        <section><div id="legend"></div></section>' +
        '    </div>' +
        '    <div id="chart_container">' +      // Chart
        '       <div id="y_axis_'+yaxis_keys[0]+'"></div>' +
        '       <div id="chart"></div>';
        
        // Add second axis only if required
        if (yaxis_keys.length==2) {
            graph_html +='       <div id="y_axis_'+yaxis_keys[1]+'"></div>';
        }

        graph_html += '       <div id="x_axis"></div>' +
        '       <div id="preview"></div>' +
        '    </div>' +
        '    <form id="right_side_panel">' + // RHS panel - the graph controls are here
        '        <section>' +
        '            <div id="renderer_form" class="toggler">' +
        '                <input type="radio" name="renderer" id="area" value="area" checked>'+
        '                <label for="area">area</label>' +
        '                <input type="radio" name="renderer" id="bar" value="bar">' +
        '                <label for="bar">bar</label>' +
        '                <input type="radio" name="renderer" id="line" value="line">' +
        '                <label for="line">line</label>' +
        '                <input type="radio" name="renderer" id="scatter" value="scatterplot">' +
        '                <label for="scatter">scatter</label>' +
        '            </div>' +
        '        </section>' + 
        '        <section>' +
        '            <div id="offset_form">' +
        '                <label for="stack">' +
        '                    <input type="radio" name="offset" id="stack" value="zero" checked>' +
        '                    <span>stack</span>' +
        '                </label>' +
		'                <label for="value">' +
        '                    <input type="radio" name="offset" id="value" value="value">' +
        '                    <span>value</span>' +
        '                </label>' +
        '                <label for="stream">' +
        '                    <input type="radio" name="offset" id="stream" value="wiggle">' +
        '                    <span>stream</span>' +
        '                </label>' +
        '                <label for="pct">' +
        '                    <input type="radio" name="offset" id="pct" value="expand">' +
        '                    <span>pct</span>' +
        '                </label>' +
        '            </div>' +
        '            <div id="interpolation_form">' +
		'                <label for="linear">' +
        '                    <input type="radio" name="interpolation" id="linear" value="linear" checked>' +
        '                    <span>linear</span>' +
        '                </label>' +
        '                <label for="cardinal">' +
        '                    <input type="radio" name="interpolation" id="cardinal" value="cardinal">' +
        '                    <span>cardinal</span>' +
        '                </label>' +
        '                <label for="step">' +
        '                    <input type="radio" name="interpolation" id="step" value="step-after">' +
        '                    <span>step</span>' +
        '                </label>' +
        '            </div>' +
        '        </section>' +
        '        <section>' +
        '            <h6>smoothing</h6>' +
        '            <div id="smoother"></div>' +
        '        </section>' +
        '        <section></section>' +
        '    </form>' +
        '</div>';
        
		// Append HTML to the <div>
        htmlSelection.html(graph_html);
        
		// Use this to reference graph later on
        var local_div = d3.select("[id=rickshawChart_outer]");
		
        // Make up a list of all depths, then remove duplicates by turning it into a set
        var depth_list = [];
		
		d3.keys(data_bin).forEach(function(dataType) {
            var temp_depth_list = [].concat.apply([],d3.values(data_bin[dataType])).map(function(a){ return a.x; });
			depth_list = depth_list.concat(temp_depth_list);
        }); 
        var global_depth_set = d3.set(depth_list);
    
        // There is a series of y-values (measurements of a metric) for certain x-values (depth).
        // For any x-values, there must be a full complement of y-values (a y-value for each measurement type) otherwise stack graphs will not work. 
        // So we must fill in missing x-values with y=0 . i.e. (x,0) I have assumed that if a measurement is taken at a certain depth, and a certain metric is missing,
        // (it is present at other depths), it is zero at this depth. Rickshaw will interpolate more readily when when the missing values are filled with zeros. 
        // You can also use 'null' to fill missing values, but this gives ugly gaps in the line graph, and single isolated points that cannot be plotted.
        //
		d3.keys(data_bin).forEach(function(dataType) {
            d3.keys(data_bin[dataType]).forEach(function(db_key) {
                var local_depth_list=data_bin[dataType][db_key].map(function(currentValue) { return currentValue.x; });
                global_depth_set.forEach(function(global_depth) {
                    //console.log("db_val JSON: "+JSON.stringify(data_bin[dataType][db_key]));
                    var local_depth_set=d3.set(local_depth_list);
                    if (!local_depth_set.has(global_depth)) {
                        data_bin[dataType][db_key].push({"x":parseFloat(global_depth), "y":0.0});
                    }
                })
            });
	    });
		
		// Find max and min of x and y values
		var max_y_val = new Object;
		var min_y_val = new Object;
		d3.keys(data_bin).forEach(function(dataType) {
			var temp_y_list = [].concat.apply([],d3.values(data_bin[dataType])).map(function(a){ return a.y; });
			max_y_val[dataType] = d3.max(temp_y_list);
			min_y_val[dataType] = d3.min(temp_y_list);
	    });
		
		
        // Use max/min values to setup two sets of scales for the y-axis
		var scales = new Object;
		d3.keys(data_bin).forEach(function(dataType) {
			scales[dataType] = new d3.scale.linear().domain([min_y_val[dataType], max_y_val[dataType]]);
		});
        
        // Strong colours do best with the 'mouseover the legend to display individual colours separately' function
        var colorScale = function (colour_idx) { var scale = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f',
                                                      '#bcbd22','#17becf','#393b79','#5254a3','#6b6ecf','#637939','#8ca252','#b5cf6b',
                                                      '#8c6d31','#bd9e39','#e7ba52','#843c39','#ad494a','#d6616b','#e7969c','#7b4173',
                                                      '#a55194','#ce6dbd','#de9ed6']; return scale[colour_idx%scale.length]; };

        // Create an array of all the X-values for the graph, values must be sorted by x-value
		var seriesX = [];
		var index=0;
		d3.keys(data_bin).forEach(function(dataType) {
            d3.keys(data_bin[dataType]).forEach(function(currentValue) {
				var X = { color: colorScale(index), 
                         data: data_bin[dataType][currentValue].sort(function(a,b) { return d3.ascending(a.x,b.x); }),
                         name: currentValue,
						 scale: scales[dataType]
					   };
                seriesX.push(X);
				index+=1;
		    });
        });
        
        // Instantiate our graph!
        var graph = new Rickshaw.Graph( {
            element: local_div.select("[id=chart]").node(),
            width: graphWidth,
            height: graphHeight,
            renderer: 'area',
            stroke: true,
            preserve: true,
            series: seriesX
        });


        
        // Create range slider underneath graph
        var preview = new Rickshaw.Graph.RangeSlider.Preview({
            graph: graph,
            width: graphWidth+20, // Add 20 to allow for the grips at both ends of the previewer, this ensures that the
                                 // preview window and the real window are the same width and their ticks line up together
            element: local_div.select("[id=preview]").node()
        });

        // Set up a popup box with shows upon mouseover
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            formatter: function(series, x, y) {
                return series.name+": "+x.toString()+","+y.toString();
            },
            xFormatter: function(x) { return null; } // This stops annoying times hovering at the top of the graph
        });

        // Create a legend, listing all the metrics
        var legend = new Rickshaw.Graph.Legend({
            graph: graph,
            element: local_div.select("[id=legend]").node()
        });

        // Can turn on/off a metric by clicking on its name in the legend
        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: graph,
            legend: legend
        });

        // Can re-order the metric in the legend, and it will be reflected in the graph
        var order = new Rickshaw.Graph.Behavior.Series.Order({
            graph: graph,
            legend: legend
        });

        // This makes the graph highlight the colours of a metric when mouseover the name of the metric in the legend
        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: graph,
            legend: legend
        });

        // A slider which can be used to smooth out the peaks in the graph
        var smoother = new Rickshaw.Graph.Smoother({
            graph: graph,
            element: local_div.select("[id=smoother]").node()
        });

        
        var ticksTreatment = 'plain'; //'glow';
        
        // Used to format the depth measurements on the x-axis
        var formatMetres = function(n) { var abs_n = Math.abs(n);
            if (abs_n > 9999)             { return n / 1000 + "km" }
            else if (abs_n >= 1)          { return n + "m" }
            else if (abs_n < 1)           { return n.toFixed(2) + "m" }
            else                          { return '' } 
        };

        // Graph's x-axis
        var xAxis = new Rickshaw.Graph.Axis.X( {
            graph: graph,
            tickFormat: formatMetres,
            ticksTreatment: ticksTreatment,
            orientation: 'bottom',
            element: local_div.select("[id=x_axis]").node()
        });
        
        // Graph's y-axes
		var has_grid=true;
		var orient_str = 'left';
		yaxis_keys.forEach(function(dataType) {
            var yAxis = new Rickshaw.Graph.Axis.Y.Scaled({
                graph: graph,
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                ticksTreatment: ticksTreatment,
                orientation: orient_str,
                element: local_div.select("[id=y_axis_"+dataType+"]").node(),
				grid: has_grid,
				scale: scales[dataType]
            });
			// Only first y-axis has a grid
			if (has_grid==true) {
				has_grid=false;
			}
			// First right, then left
			if (orient_str=='left') {
				orient_str='right';
			}
		});

		// A callback function to redraw labels each time graph is rendered (needed?)
        var render_labels = function() {
            
		    local_div.select("[id=x_axis]").select("svg").append("text")
                 .attr("text-anchor", "start")
                 .attr("x", 640)
                 .attr("y", 40)
                 .text(xaxis_name);
				 
		    if (yaxis_keys.length==2) {
			
                var num_label_div =  local_div.select("[id=y_axis_"+yaxis_keys[1]+"]");
                var txt_label_div = local_div.select("[id=y_axis_"+yaxis_keys[0]+"]");
            
                // Two y-axes
                if (num_label_div.size()==1 && txt_label_div.size()==1) {
                    num_label_div.select("svg").append("text")
                     .attr("text-anchor", "start")
                     .attr("x", 10)
                     .attr("y", 20)
                     .text(yaxis_names[yaxis_keys[1]]);
                    num_label_div.style("left","605px");
				 
		            txt_label_div.select("svg").append("text")
                     .attr("text-anchor", "start")
                     .attr("x", 0)
                     .attr("y", 60)
                     .text(yaxis_names[yaxis_keys[0]]);
                    txt_label_div.style("left","-105px");
				}
				
			} else if (yaxis_keys.length==1) {
				
				var label_div =  local_div.select("[id=y_axis_"+yaxis_keys[0]+"]");
                 
                // One y-axis, numerics
                if (label_div.size()==1) {
                    label_div.select("svg").append("text")
                     .attr("text-anchor", "start")
                     .attr("x", 0)
                     .attr("y", 60)
                     .text(yaxis_names[yaxis_keys[0]]);
                    label_div.style("left","-105px");
				}
            }
			
		}; // end of callback function
        

        // Create and register the controls
        var controls = new RenderControls({
            element: local_div.select("[id=right_side_panel]").node(),
            graph: graph
        });
		
        // X-Axis for the preview slider
        var previewXAxis = new Rickshaw.Graph.Axis.X({
            graph: preview.previews[0],
            tickFormat: formatMetres,
            ticksTreatment: ticksTreatment,
            orientation: 'top'
        });
        previewXAxis.render();
		
		
		
		// Configure graph. Input the starting values. These must match the HTML radio buttons etc. above.
		graph.configure({"renderer":"area","interpolation":"linear","unstack":false,"offset":"zero"});
        
        // Register routine to redraw labels upon graph update
		graph.onUpdate(render_labels);
        
        // Render graph
        graph.render();
    
    } // plot()

}) // define rickshawChart