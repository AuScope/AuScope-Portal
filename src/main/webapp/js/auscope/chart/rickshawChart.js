Ext.define('auscope.chart.rickshawChart', {
    extend : 'portal.charts.BaseD3Chart',
    
    /**
     * Plot the data and have controls which allow the user to change the plot type (bar, chart etc.), apply smoothing,
     * change the order of the metrics on display, look at a small section of data, add or remove metrics etc.
     * 
     * Will plot data on multiple graphs, with multiple y-axes and an x-axis
     * If there are too many metrics to display within the window, then scrollbars will be used
     * 
     * function(data_bin,xaxis_name,yaxis_names, yaxis_keys)
     * data_bin - 2D Object array - first keys are the y-axis keys (i.e. values in 'yaxis_keys' array)
     *                              second keys are the names of the metrics
     *                              values are lists of {x:X-num, y:Y-num} pairs
     *
     * NB: Duplicate keys are not permitted
     *
     * xaxis_name - string, label for the x-axis
     *
     * yaxis_names - Object array, keys are in 'yaxis_keys', values are the labels for the y-axis
     *
     * yaxis_keys - array of names of y-axis keys
     *
     * metric_colours - [OPTIONAL] Object array, keys are the metrics in data_bin, values are RGB colour strings, e.g. '#1f77b4'
     *
     */
    plot : function(data_bin,xaxis_name,yaxis_names, yaxis_keys, metric_colours) {
        
        var htmlSelection = d3.select("[id="+this.innerId+"]");
        var graphWidth = this.graphWidth;
        var graphHeight = this.graphHeight;
        var innerId = this.innerId;
        
        // Check input parameters
        if (yaxis_keys.length==0) {
            throw new Error("auscope.chart.rickshawChart.plot(): 'yaxis_keys' must have 1 member");
        }
        yaxis_keys.forEach(function(yaxis_key) {
            if (!(yaxis_key in data_bin)) {
                throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'data_bin'");
            }
            if (!(yaxis_key in yaxis_names)) {
                throw new Error("auscope.chart.rickshawChart.plot(): values in 'yaxis_keys' are not keys of 'yaxis_names'");
            }
        });
        
        // Clean out HTML
        htmlSelection.html("");

        var currentHTML = htmlSelection.html();
            
        // add the graph's div area to the webpage with id="rickshawChart_outer"
        var graph_html = currentHTML + '<div id="rickshawChart_outer">';
        
        yaxis_keys.forEach(function(yaxis_key, idx, arr) {

            // Add legend on left hand side and a graph with axes
            graph_html += '<div id="content_'+idx.toString()+'">' +
                          '  <div id="left_side_panel_'+idx.toString()+'">'+
                          '    <section><div id="legend_'+idx.toString()+'"></div></section>'+
                          '    <section></section>'+
                          '  </div>'+
                          '  <div id="chartcontainer_'+idx.toString()+'">'+
                          '       <div id="y_axis_'+idx.toString()+'"></div>' +
                          '          <div id="chart_'+idx.toString()+'"></div>'+
                          '       <div id="x_axis_'+idx.toString()+'"></div>';
                          
            // Add graph preview slider, but only after the last graph
            if (idx==yaxis_keys.length-1) {
                graph_html += '       <div id="preview_'+idx.toString()+'"></div>';
            }
            graph_html +=  '  </div>'+
                           '  <form id="right_side_panel_'+idx.toString()+'">';
            
            // Place controls on right hand side of each graph
            graph_html += '    <section>'+
                          '      <div id="renderer_form_'+idx.toString()+'" class="toggler">'+
                          '        <input type="radio" name="renderer" id="area_'+idx.toString()+'" value="area" checked>'+
                          '        <label for="area_'+idx.toString()+'">area</label>'+
                          '        <input type="radio" name="renderer" id="bar_'+idx.toString()+'" value="bar">'+
                          '        <label for="bar_'+idx.toString()+'">bar</label>'+
                          '        <input type="radio" name="renderer" id="line_'+idx.toString()+'" value="line">'+
                          '        <label for="line_'+idx.toString()+'">line</label>'+
                          '        <input type="radio" name="renderer" id="scatter_'+idx.toString()+'" value="scatterplot">'+
                          '        <label for="scatter_'+idx.toString()+'">scatter</label>'+
                          '      </div>'+
                          '    </section>'+
                          '    <section>'+
                          '      <div id="offset_form_'+idx.toString()+'" class="toggler">'+
                          '        <label for="stack_'+idx.toString()+'">'+
                          '          <input type="radio" name="offset" id="stack_'+idx.toString()+'" value="zero" checked>'+
                          '          <span>stack</span>'+
                          '        </label>'+
                          '        <label for="stream_'+idx.toString()+'">'+
                          '          <input type="radio" name="offset" id="stream_'+idx.toString()+'" value="wiggle">'+
                          '          <span>stream</span>'+
                          '        </label>'+
                          '        <label for="pct_'+idx.toString()+'">'+
                          '          <input type="radio" name="offset" id="pct_'+idx.toString()+'" value="expand">'+
                          '          <span>pct</span>'+
                          '        </label>'+
                          '        <label for="value_'+idx.toString()+'">'+
                          '          <input type="radio" name="offset" id="value_'+idx.toString()+'" value="value">'+
                          '          <span>value</span>'+
                          '        </label>'+
                          '      </div>'+
                          '      <div id="interpolation_form_'+idx.toString()+'" class="toggler">'+
                          '        <label for="cardinal_'+idx.toString()+'">'+
                          '          <input type="radio" name="interpolation" id="cardinal_'+idx.toString()+'" value="cardinal" checked>'+
                          '          <span>cardinal</span>'+
                          '        </label>'+
                          '        <label for="linear_'+idx.toString()+'">'+
                          '          <input type="radio" name="interpolation" id="linear_'+idx.toString()+'" value="linear">'+
                          '          <span>linear</span>'+
                          '        </label>'+
                          '        <label for="step_'+idx.toString()+'">'+
                          '          <input type="radio" name="interpolation" id="step_'+idx.toString()+'" value="step-after">'+
                          '          <span>step</span>'+
                          '        </label>'+
                          '      </div>'+
                          '    </section>'+
                          '    <section>'+
                          '      <h6>Smoothing</h6>'+
                          '      <div id="smoother_'+idx.toString()+'"></div>'+
                          '    </section>'+
                          '    <section></section>';

            graph_html +=  '  </form>'+
                           '</div>'; // id='content=_'
        });
        graph_html += '</div>'; // id='rickshawChart_outer'
        
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
        
        var graph_list = [];
            
        // Draw each graph
        yaxis_keys.forEach(function(yaxis_key, idx, arr) {
                                                      
            // Create an array of all the X-values for the graph, values must be sorted by x-value
            var seriesX = [];
            var index=0;

            // If defined, use the colours in 'metric_colours', if colour can be found else the local colour table
            d3.keys(data_bin[yaxis_key]).forEach(function(currentValue) {
                if (metric_colours && currentValue in metric_colours) {
                    // Supplied colour table
                    var X = { color: metric_colours[currentValue], 
                        data: data_bin[yaxis_key][currentValue].sort(function(a,b) { return d3.ascending(a.x,b.x); }),
                        name: currentValue,
                        scale: scales[yaxis_key]
                    };
                } else { 
                    // local colour table
                    var X = { color: colorScale(index), 
                        data: data_bin[yaxis_key][currentValue].sort(function(a,b) { return d3.ascending(a.x,b.x); }),
                        name: currentValue,
                        scale: scales[yaxis_key]
                    };
                }
                seriesX.push(X);
                index+=1;
            });
        
            // Instantiate our graph!
            var graph = new Rickshaw.Graph( {
                element: local_div.select("[id=chart_"+idx.toString()+"]").node(),
                width: graphWidth,
                height: graphHeight,
                renderer: 'area',
                stroke: true,
                preserve: true,
                series: seriesX
            });
            
            graph_list.push(graph);

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
                element: local_div.select("[id=legend_"+idx.toString()+"]").node()
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
                element: local_div.select("[id=x_axis_"+idx.toString()+"]").node()
            });
        
            // Graph's y-axes
            var yAxis = new Rickshaw.Graph.Axis.Y.Scaled({
                graph: graph,
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                ticksTreatment: ticksTreatment,
                orientation: 'left',
                element: local_div.select("[id=y_axis_"+idx.toString()+"]").node(),
                grid: true,
                scale: scales[yaxis_key]
            });


            // A callback function to redraw labels each time graph is rendered (needed?)
            var render_labels = function() {
            
                local_div.select("[id=x_axis_"+idx.toString()+"]").select("svg").append("text")
                         .attr("text-anchor", "start")
                         .attr("x", 660)
                         .attr("y", 15)
                         .text(xaxis_name);
                 
                var label_div =  local_div.select("[id=y_axis_"+idx.toString()+"]");
                 
                // One y-axis
                if (label_div.size()==1) {
                        label_div.select("svg").append("text")
                         .attr("text-anchor", "start")
                         .attr("x", 0)
                         .attr("y", 20)
                         .text(yaxis_names[yaxis_key]);
                }
            }; // end of callback function
        
            // Configure graph. Input the starting values. These must match the HTML radio buttons etc. above.
            graph.configure({"renderer":"area","interpolation":"linear","unstack":false,"offset":"zero"});
        
            // Register routine to redraw labels upon graph update
            graph.onUpdate(render_labels);
    
        }); // forEach yaxis_key
    
        // Create range slider underneath graphs
        var preview = new Rickshaw.Graph.RangeSlider.MultiPreview({
            graphs: graph_list,
            width: graphWidth+20, // Add 20 to allow for the grips at both ends of the previewer, this ensures that the
                               // preview window and the real window are the same width and their ticks line up together
            element: local_div.select("[id=preview_"+(yaxis_keys.length-1).toString()+"]").node(),
            height: yaxis_keys.length*50,
        });
            

        
        
        // Render graph
        graph_list.forEach(function(graph, idx, arr) {
            
            // One set of controls for each graph
            var controls = new RenderControls({
                element: local_div.select("[id=right_side_panel_"+idx.toString()+"]").node(),
                graph: graph
            });
            
            // A slider which can be used to smooth out the peaks in the graph
            var smoother = new Rickshaw.Graph.Smoother({
                graph: graph,
                element: local_div.select("[id=smoother_"+idx.toString()+"]").node()
            });
            
            // X-Axis for the preview slider
            var previewXAxis = new Rickshaw.Graph.Axis.X({
                graph: preview.previews[idx],
                tickFormat: this.formatMetres,
                ticksTreatment: this.ticksTreatment,
                orientation: 'top'
            });
            previewXAxis.render();
            
            graph.render();
        }, this);
    
    } // plot()

}) // define rickshawChart