/**
 * A factory for creating an MSCL presentation pane.
 */
Ext.require('Ext.chart.*');
Ext.require([ 'Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox' ]);

Ext.define('Extjs.contribs.chart.axis.layout.Logarithmic', {
  extend: 'Ext.chart.axis.layout.Continuous',
  alias: 'axisLayout.logarithmic',
  
  config: {
    adjustMinimumByMajorUnit: false,
    adjustMaximumByMajorUnit: false
  },
  
  /**
   * Convert the value from the normal to the log10 version.
   * NB: The renderer for the field needs to do the inverse.
   * It is also advised that 0 and negative values be excluded, as they will return negative Infinity
   */
  getCoordFor: function (value, field, idx, items) {
    return Math.log10(value);
  },

  /**
   * Called by the parent class to build the 'tick marks', which also determines where the grid lines get shown.
   * The default behaviour is to get an even spread. Instead, we want to show the grid lines on the multiples of the
   * power of tens - e.g. 1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100, and so forth
   */
  snapEnds: function (context, min, max, estStepSize) {
    var segmenter = context.segmenter;
    var axis = this.getAxis();
    var majorTickSteps = axis.getMajorTickSteps();
        // if specific number of steps requested and the segmenter can do such segmentation
    var out = majorTickSteps && segmenter.exactStep ?
        segmenter.exactStep(min, (max - min) / majorTickSteps) :
        segmenter.preferredStep(min, estStepSize);
    var unit = out.unit;
    var step = out.step;
    var from = segmenter.align(min, step, unit);

    // Calculate the steps.
    var steps = []
    for (var magnitude = Math.floor(min); magnitude < Math.ceil(max); magnitude++) {
      var baseValue = Math.pow(10, magnitude);
      for (var increment = 1; increment < 10; increment++) {
        var value = baseValue * increment;
        var logValue = Math.log10(value);
        if (logValue > min && logValue < max) {
          steps.push(logValue);
        }
      }
    }

    return {
        min: segmenter.from(min),
        max: segmenter.from(max),
        from: from,
        to: segmenter.add(from, steps * step, unit),
        step: step,
        steps: steps.length,
        unit: unit,
        get: function (current) {
            return steps[current]
        }
    };
  },
  
  // Trimming by the range makes the graph look weird. So we don't.
  trimByRange: Ext.emptyFn
  
}, function() {
  // IE (and the PhantomJS system) do not have have a log10 function. So we polyfill it in if needed.
  Math.log10 = Math.log10 || function(x) {
    return Math.log(x) / Math.LN10;
  };
})

Ext.define('Extjs.contribs.chart.axis.segmenter.Logarithmic', {
  extend: 'Ext.chart.axis.segmenter.Numeric',
  alias: 'segmenter.logarithmic',
  config: {
    minimum: 200
  },
  
  renderer: function (value, context) {
    return (Math.pow(10, value)).toFixed(3);
  }

});

Ext.define('Extjs.contribs.chart.axis.Logarithmic', {
  extend: 'Ext.chart.axis.Numeric',
  
  requires: [
    'Extjs.contribs.chart.axis.layout.Logarithmic',
    'Extjs.contribs.chart.axis.segmenter.Logarithmic'
  ],
  
  type: 'logarithmic',
  alias: [
    'axis.logarithmic',
  ],
  config: {
    layout: 'logarithmic',
    segmenter: 'logarithmic',
  }
});

function drawGraph(serviceUrl, boreholeHeaderId, startDepth, endDepth, observationsToReturn, maskedElement) {
    // I want this to always be an array, even if it only has one element.
    observationsToReturn = [].concat(observationsToReturn);

    firstInitialChartWidth = 381;
    initialChartWidth = 350;
    initialChartHeight = 500;

    // Define the model:
    if(Ext.ClassManager.isCreated('DynamicModel')!=true){
        Ext.define('DynamicModel', {
            extend : 'Ext.data.Model',
            fields : observationsToReturn.concat('depth')
        });
    }

    Ext.Ajax.request({
        url : 'getMsclObservationsForGraph.do',
        params: {
            // .../wfs?request=GetFeature&typename=mscl:scanned_data&filter=%3CFilter%3E%0D%0A%09%3CPropertyIs%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Aborehole%3C%2FPropertyName%3E%0D%0A%09%09%3CLiteral%3EPRC-5%3C%2FLiteral%3E%0D%0A%09%3C%2FPropertyIs%3E%0D%0A%09%3CPropertyIsBetween%3E%0D%0A%09%09%3CPropertyName%3Emscl%3Adepth%3C%2FPropertyName%3E%0D%0A%09%09%3CLowerBoundary%3E%0D%0A%09%09%09%3CLiteral%3E66.9%3C%2FLiteral%3E%0D%0A%09%09%3C%2FLowerBoundary%3E%0D%0A%09%09%3CUpperBoundary%3E%0D%0A%09%09%09%3CLiteral%3E89%3C%2FLiteral%3E%0D%0A%09%09%3C%2FUpperBoundary%3E%0D%0A%09%3C%2FPropertyIsBetween%3E%0D%0A%3C%2FFilter%3E
            serviceUrl : serviceUrl,
            boreholeHeaderId : boreholeHeaderId,
            startDepth : startDepth,
            endDepth : endDepth,
            observationsToReturn : observationsToReturn
        },
        success: function(response) {
            var responseObject = Ext.decode(response.responseText);
            var windowTitle = '';
            var charts = [];
            for (var i = 0; i < observationsToReturn.length; i++) {
                var first = i === 0;
                var last = i === observationsToReturn.length - 1;
                
                var xAxisType = ['magnetic_susceptibility', 'resistivity'].indexOf(observationsToReturn[i]) == -1 ? 'numeric' : 'logarithmic';

                var xAxisTitle =
                    observationsToReturn[i] == 'diameter' ? 'Diameter (cm)' :
                    observationsToReturn[i] == 'p_wave_amplitude' ? 'P-Wave amp (mV)' :
                    observationsToReturn[i] == 'p_wave_velocity' ? 'P-Wave vel (m/s)' :
                    observationsToReturn[i] == 'density' ? 'Density (g/cm³)' :
                    // AGOS-42: I.E. Wouldn't render the superscript character properly so I've used the other notation.
                    observationsToReturn[i] == 'magnetic_susceptibility' ? 'Mag. sus. (×10^-5 SI)' :
                    // AGOS-42: I.E. Wouldn't render the superscript character properly so I've used the other notation.
                    observationsToReturn[i] == 'impedance' ? 'Impedance (×10³ kgm^-2 s^-1)' :
                    observationsToReturn[i] == 'natural_gamma' ? 'Natural gamma (cps)' :
                    observationsToReturn[i] == 'resistivity' ? 'Resistivity (Ω·m)' :
                    undefined;

                // Add a comma or ampersand if needed:
                windowTitle += (!first ? (last ? ' &amp; ' : ', ') : '') + 
                    // Remove the unit of measure:
                    new RegExp('^(.+?) \\(').exec(xAxisTitle)[1];

                var store = Ext.create('Ext.data.Store', {
                    model : 'DynamicModel',
                    data : responseObject.data.series
                });

                store.filter({
                    fn: function (item) {
                        // TODO ReverseAxisIssue: This code is here to workaround a
                        // limitation of ExtJS 4.1.1a; it doesn't have any option to
                        // 'reverse' the order of the y axis's values. We want to show
                        // the y values ascending as you read from top to bottom since
                        // this results in a plot which is more intuitive, i.e: as you
                        // look DOWN the line, you're seeing points that indicate the
                        // values of observations from cores further DOWN the borehole.
                        // The workaround is to invert the depth so that it becomes
                        // negative, and then manipulate the label renderer so that it
                        // doesn't display the negative sign.
                        // Look at the other TODO named 'ReverseAxisIssue', below,
                        // and see http://stackoverflow.com/questions/6133676/create-numericaxis-with-config-param-reverse-in-ext4
                        // for more info.
                        // This workaround can be removed if a new version of ExtJS
                        // reintroduces a 'reverse' option for the axis object.
                        if (i === 0) {
                            item.data['depth'] = -item.data['depth'];
                        }
                        // End ReverseAxisIssue.

                        // Return all items regardless of whether they have a value.
                        // This results in gaps in the plot but it's better than having
                        // ExtJS bridge them as this would create a misleading representation.
                        return true;
                    }
                });

                // Create the array of charts
                charts[i] = Ext.create('Ext.chart.Chart', {
                    height : initialChartHeight,
                    width : first ? firstInitialChartWidth : initialChartWidth, // The first chart is slightly wider to accommodate its y-axis label.
                    shadow : false,
                    store : store,
                    axes : [ {
                        title : first ? 'Depth (m)' : false, // Only the first chart will have a depth label.
                        type : 'numeric',
                        position : 'left',
                        fields : [ 'depth' ],
                        minorTickSteps : 1,
                        grid: true
                        // TODO ReverseAxisIssue: See other TODO with this name,
                        // above, for more information.
                        // This code is here to modify the label's value so that
                        // it doesn't include the negative sign.
                        ,renderer: function(v) {
                            return Ext.util.Format.number(Math.abs(v), '0.0');
                        }
                        // End ReverseAxisIssue.
                    }, {
                        title : xAxisTitle,
                        type : xAxisType,
                        position : 'top',
                        fields : [ observationsToReturn[i] ],
                        minorTickSteps : 1
                    } ],
                    series : [ {
                        type : 'line',
                        xField : observationsToReturn[i],
                        yField : 'depth',
                        showMarkers : false,
                        style : {
                            'stroke-width' : 1
                        }
                    } ]
                });
            }

            var graphWindow = Ext.create('Ext.Window', {
                border : true,
                layout : 'hbox',
                resizable : true,
                modal : true,
                plain : false,
                title : 'Changes to ' + windowTitle + ' over Depth',
                items : charts,
                scope : this,
                listeners : {
                    resize : function(me, width, height, oldWidth, oldHeight, eOpts) {
                        // When the user resizes the window we need to resize the charts
                        // within it, too.
                        var differenceInHeight = height - (typeof(oldHeight) === 'undefined' ? height : oldHeight);
                        if (differenceInHeight !== 0) {
                            for (var i = 0; i < me.items.items.length; i++) {
                                me.items.items[i].setHeight(me.items.items[i].height + differenceInHeight);
                            }
                        }

                        var differenceInWidth = width - (typeof(oldWidth) === 'undefined' ? width : oldWidth);
                        if (differenceInWidth !== 0) {
                            differenceInWidth = Math.floor(differenceInWidth / me.items.items.length);
                            for (var i = 0; i < me.items.items.length; i++) {
                                me.items.items[i].setWidth(me.items.items[i].width + differenceInWidth);
                            }
                        }
                    }
                }
            }).show();

            // Make sure that the graph window isn't larger than the browser's viewport:
            var viewSize = Ext.getBody().getViewSize();
            var graphSize = graphWindow.getSize();
            var border = 20;
            graphSize.width = Math.min(graphSize.width, viewSize.width - border);
            graphSize.height = Math.min(graphSize.height, viewSize.height - border);

            graphWindow.setSize(graphSize);
            graphWindow.center();

            // Remove the load mask once the window has been rendered:
            maskedElement.unmask();
        },
        failure: function(){
            maskedElement.unmask();
        }
    });
}

Ext.define('auscope.layer.querier.wfs.knownlayerfactories.MSCLFactory', {
    extend : 'portal.layer.querier.wfs.knownlayerfactories.BaseFactory',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Overrides abstract supportsKnownLayer. Supports only mscl-borehole layer.
     */
    supportsKnownLayer : function(knownLayer) {
        return knownLayer.getId() === 'mscl-borehole';
    },

    /**
     * Overrides abstract parseKnownLayerFeature
     */
    parseKnownLayerFeature : function(featureId, parentKnownLayer,
            parentOnlineResource) {
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            tabTitle : 'MSCL:'+ featureId,
            items : [ {
                xtype : 'fieldset',
                title : 'Petrophysical Observations',
                items : [ {
                    xtype : 'form',
                    border : 0,
                    items : [ {
                        xtype : 'numberfield',
                        fieldLabel : 'Start depth (m)',
                        name : 'startDepth',
                        allowBlank : false,
                        repeatTriggerClick : false,
                        value : 0,
                        minValue : 0
                    }, {
                        xtype : 'numberfield',
                        fieldLabel : 'End depth (m)',
                        name : 'endDepth',
                        allowBlank : false,
                        repeatTriggerClick : false,
                        value : 2000,
                        minValue : 0
                    }, {
                        xtype : 'checkboxgroup',
                        fieldLabel : 'Observation',
                        allowBlank : false,
                        blankText : 'Select at least 1 checkbox',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns : 2,
                        vertical : true,
                        items : [ {
                            boxLabel : 'Diameter',
                            name : 'observationToReturn',
                            inputValue : 'diameter',
                            checked: true
                        }, {
                            boxLabel : 'P-Wave amplitude',
                            name : 'observationToReturn',
                            inputValue : 'p_wave_amplitude'
                        }, {
                            boxLabel : 'P-Wave velocity',
                            name : 'observationToReturn',
                            inputValue : 'p_wave_velocity'
                        }, {
                            boxLabel : 'Density',
                            name : 'observationToReturn',
                            inputValue : 'density'
                        }, {
                            boxLabel : 'Mag sus',
                            name : 'observationToReturn',
                            inputValue : 'magnetic_susceptibility'
                        }, {
                            boxLabel : 'Impedence',
                            name : 'observationToReturn',
                            inputValue : 'impedance'
                        }, {
                            boxLabel : 'Natural Gamma',
                            name : 'observationToReturn',
                            inputValue : 'natural_gamma'
                        }, {
                            boxLabel : 'Resistivity',
                            name : 'observationToReturn',
                            inputValue : 'resistivity'
                        } ]
                    } ],
                    buttons : [ {
                        text : 'Submit',
                        formBind : true, // only enabled once the form is valid
                        handler : function() {
                            var formValues = this.up('form').getForm().getValues();
                            var fieldset = this.up('fieldset');
                            fieldset.getEl().mask('Loading');
                            drawGraph(parentOnlineResource.get('url'),
                                    featureId, formValues.startDepth,
                                    formValues.endDepth,
                                    formValues.observationToReturn,
                                    fieldset);
                        }
                    } ]
                } ]
            } ]
        });
    }
});