import {Injectable, Inject} from '@angular/core';
import * as $ from 'jquery';

declare var d3: any;
declare var Rickshaw: any;
declare var RenderControls: any;

/**
 * Service class to handle rendering of rickshaw chart
 *
 */
@Injectable()
export class RickshawService {


  constructor() {}

  public plot(data_bin, xaxis_name, yaxis_names, yaxis_keys, metric_colours) {
    if (yaxis_keys.length === 0) {
      alert('auscope.chart.rickshawChart.plot(): \'yaxis_keys\' must have 1 member');
    }
    yaxis_keys.forEach(function(yaxis_key) {
      if (!(yaxis_key in data_bin)) {
        alert('auscope.chart.rickshawChart.plot(): values in \'yaxis_keys\' are not keys of \'data_bin\'');
      }
      if (!(yaxis_key in yaxis_names)) {
        alert('auscope.chart.rickshawChart.plot(): values in \'yaxis_keys\' are not keys of \'yaxis_names\'');
      }
    });

    const local_div = d3.select('[id=rickshawChart_outer]');
    let depth_list = [];

    d3.keys(data_bin).forEach(function(dataType) {
      const temp_depth_list = [].concat.apply([], d3.values(data_bin[dataType])).map(function(a) {return a.x; });
      depth_list = depth_list.concat(temp_depth_list);
    });
    const global_depth_set = d3.set(depth_list);

    // There is a series of y-values (measurements of a metric) for certain x-values (depth).
    // For any x-values, there must be a full complement of y-values (a y-value for each measurement type) otherwise stack graphs will not work.
    // So we must fill in missing x-values with y=0 . i.e. (x,0) I have assumed that if a measurement is taken at a certain depth, and a certain metric is missing,
    // (it is present at other depths), it is zero at this depth. Rickshaw will interpolate more readily when when the missing values are filled with zeros.
    // You can also use 'null' to fill missing values, but this gives ugly gaps in the line graph, and single isolated points that cannot be plotted.
    //
    d3.keys(data_bin).forEach(function(dataType) {
      d3.keys(data_bin[dataType]).forEach(function(db_key) {
        const local_depth_list = data_bin[dataType][db_key].map(function(currentValue) {return currentValue.x; });
        global_depth_set.forEach(function(global_depth) {
          // console.log("db_val JSON: "+JSON.stringify(data_bin[dataType][db_key]));
          const local_depth_set = d3.set(local_depth_list);
          if (!local_depth_set.has(global_depth)) {
            data_bin[dataType][db_key].push({'x': parseFloat(global_depth), 'y': 0.0});
          }
        })
      });
    });

    // Find max and min of x and y values
    const max_y_val = new Object;
    const min_y_val = new Object;
    d3.keys(data_bin).forEach(function(dataType) {
      const temp_y_list = [].concat.apply([], d3.values(data_bin[dataType])).map(function(a) {return a.y; });
      max_y_val[dataType] = d3.max(temp_y_list);
      min_y_val[dataType] = d3.min(temp_y_list);
    });


    // Use max/min values to setup two sets of scales for the y-axis
    const scales = new Object;
    d3.keys(data_bin).forEach(function(dataType) {
      scales[dataType] = new d3.scale.linear().domain([min_y_val[dataType], max_y_val[dataType]]);
    });


    // Strong colours do best with the 'mouseover the legend to display individual colours separately' function
    const colorScale = function(colour_idx) {
      const scale = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
        '#bcbd22', '#17becf', '#393b79', '#5254a3', '#6b6ecf', '#637939', '#8ca252', '#b5cf6b',
        '#8c6d31', '#bd9e39', '#e7ba52', '#843c39', '#ad494a', '#d6616b', '#e7969c', '#7b4173',
        '#a55194', '#ce6dbd', '#de9ed6']; return scale[colour_idx % scale.length];
    };
    const graph_list = [];

    const ticksTreatment = 'plain'; // 'glow';

    // Used to format the depth measurements on the x-axis
    const formatMetres = function(n) {
      const abs_n = Math.abs(n);
      if (abs_n > 9999) {
        return n / 1000 + 'km'
      } else if (abs_n >= 1) {
        return n + 'm'
      } else if (abs_n < 1) {
        return n.toFixed(2) + 'm'
      } else {
        return ''
      }
    };

    // Draw each graph
    yaxis_keys.forEach(function(yaxis_key, idx, arr) {

      if (idx > 0) {
        return;
      }

      // Create an array of all the X-values for the graph, values must be sorted by x-value
      const seriesX = [];
      let index = 0;

      // If defined, use the colours in 'metric_colours', if colour can be found else the local colour table
      d3.keys(data_bin[yaxis_key]).forEach(function(currentValue) {
        if (metric_colours && currentValue in metric_colours) {
          // Supplied colour table
          const X = {
            color: metric_colours[currentValue],
            data: data_bin[yaxis_key][currentValue].sort(function(a, b) {return d3.ascending(a.x, b.x); }),
            name: currentValue,
            scale: scales[yaxis_key]
          };
          seriesX.push(X);
        } else {
          // local colour table
          const X = {
            color: colorScale(index),
            data: data_bin[yaxis_key][currentValue].sort(function(a, b) {return d3.ascending(a.x, b.x); }),
            name: currentValue,
            scale: scales[yaxis_key]
          };
          seriesX.push(X);
        }
        index += 1;
      });

      // Instantiate our graph!
      const graph = new Rickshaw.Graph({
        element: local_div.select('[id=chart_' + idx.toString() + ']').node(),
        renderer: 'area',
        width: '500',
        height: 400,
        stroke: true,
        preserve: true,
        series: seriesX
      });

      graph_list.push(graph);

      // Set up a popup box with shows upon mouseover
      const hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        formatter: function(series, x, y) {
          return series.name + ': ' + x.toString() + ',' + y.toString();
        },
        xFormatter: function(x) {return null; } // This stops annoying times hovering at the top of the graph
      });

      // Create a legend, listing all the metrics
      const legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: local_div.select('[id=legend_' + idx.toString() + ']').node()
      });

      // Can turn on/off a metric by clicking on its name in the legend
      const shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
      });

      // Can re-order the metric in the legend, and it will be reflected in the graph
      const order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: graph,
        legend: legend
      });

      // This makes the graph highlight the colours of a metric when mouseover the name of the metric in the legend
      const highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
      });



      // Graph's x-axis
      const xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: formatMetres,
        ticksTreatment: ticksTreatment,
        orientation: 'bottom',
        element: local_div.select('[id=x_axis_' + idx.toString() + ']').node()
      });

      // Graph's y-axes
      const yAxis = new Rickshaw.Graph.Axis.Y.Scaled({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment,
        orientation: 'left',
        element: local_div.select('[id=y_axis_' + idx.toString() + ']').node(),
        grid: true,
        scale: scales[yaxis_key]
      });


      // A callback function to redraw labels each time graph is rendered (needed?)
      const render_labels = function() {

        local_div.select('[id=x_axis_' + idx.toString() + ']').select('svg').append('text')
          .attr('text-anchor', 'start')
          .attr('x', 250)
          .attr('y', 35)
          .text(xaxis_name);

        const label_div = local_div.select('[id=y_axis_' + idx.toString() + ']');

        // One y-axis
        if (label_div.size() === 1) {
          label_div.select('svg').append('text')
            .attr('text-anchor', 'start')
            .attr('x', 0)
            .attr('y', 20)
            .text(yaxis_names[yaxis_key]);
        }
      }; // end of callback function

      // Configure graph. Input the starting values. These must match the HTML radio buttons etc. above.
      graph.configure({'renderer': 'bar', 'interpolation': 'cardinal', 'unstack': false, 'offset': 'zero'});

      // Register routine to redraw labels upon graph update
      graph.onUpdate(render_labels);

    }); // forEach yaxis_key

    // Create range slider underneath graphs
    const preview = new Rickshaw.Graph.RangeSlider.MultiPreview({
      graphs: graph_list,
      width: 500 + 20, // Add 20 to allow for the grips at both ends of the previewer, this ensures that the
      // preview window and the real window are the same width and their ticks line up together
      element: local_div.select('[id=preview_0]').node(),
      height: yaxis_keys.length * 50,
    });




    // Render graph
    graph_list.forEach(function(graph, idx, arr) {

      // One set of controls for each graph
      const controls = new RenderControls({
        element: local_div.select('[id=left_side_panel_' + idx.toString() + ']').node(),
        graph: graph
      });

      // A slider which can be used to smooth out the peaks in the graph
      const smoother = new Rickshaw.Graph.SmootherPlus({
        graph: graph,
        element: local_div.select('[id=smoother_' + idx.toString() + ']').node()
      });

      // X-Axis for the preview slider
      const previewXAxis = new Rickshaw.Graph.Axis.X({
        graph: preview.previews[idx],
        tickFormat: formatMetres,
        ticksTreatment: ticksTreatment,
        orientation: 'top'
      });
      previewXAxis.render();

      graph.render();
    }, this);

  }


  

}
