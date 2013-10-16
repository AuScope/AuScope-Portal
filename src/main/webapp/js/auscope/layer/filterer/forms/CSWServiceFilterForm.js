/**
 * Builds a form panel for CSW filters
 */
Ext.define('auscope.layer.filterer.forms.CSWServiceFilterForm', {
    extend : 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        // First build our keyword/resource data from our list of CSWRecords
        // Always treat it as an array:
        var cswRecords = [].concat(config.layer.get('cswRecords'));
        var emptyCell = {};

        current_date = new Date();

        Ext.apply(config, {
            delayedFormLoading : false,
            border : false,
            autoScroll : true,
            hideMode : 'offsets',
            width : '100%',
            buttonAlign : 'right',
            labelAlign : 'right',
            labelWidth : 70,
            bodyStyle : 'padding:5px',
            autoHeight : true,
            id : 'cswServiceFilterForm',
            items : [ {
                xtype : 'fieldset',
                title : 'CSW Filter Properties',
                autoHeight : true,
                items : [ {
                    anchor : '100%',
                    xtype : 'textfield',
                    fieldLabel : 'Any text',
                    name : 'anyText'
                }, {
                    anchor : '100%',
                    xtype : 'textfield',
                    fieldLabel : 'Title',
                    name : 'title'
                }, {
                    anchor : '100%',
                    xtype : 'textfield',
                    fieldLabel : 'Abstract',
                    name : 'abstract'
                }, {
                    xtype : 'fieldset',
                    collapsible: true,
                    collapsed: true,
                    title : 'Metadata change date',
                    autoHeight : true,
                    items : [ {
                        anchor : '100%',
                        xtype : 'datefield',
                        fieldLabel : 'From',
                        name : 'metadata_change_date_from',
                        allowBlank : true,
                        maxValue : current_date,
                        format : 'd/m/Y'
                    }, {
                        anchor : '100%',
                        xtype : 'datefield',
                        fieldLabel : 'To',
                        name : 'metadata_change_date_to',
                        allowBlank : true,
                        maxValue : current_date,
                        format : 'd/m/Y'
                    } ]
                }, {
                    xtype : 'fieldset',
                    collapsible: true,
                    collapsed: true,
                    title : 'Temporal extent',
                    autoHeight : true,
                    items : [ {
                        anchor : '100%',
                        xtype : 'datefield',
                        fieldLabel : 'From',
                        name : 'temporal_extent_date_from',
                        allowBlank : true,
                        maxValue : current_date,
                        format : 'd/m/Y'
                    }, {
                        anchor : '100%',
                        xtype : 'datefield',
                        fieldLabel : 'To',
                        name : 'temporal_extent_date_to',
                        allowBlank : true,
                        maxValue : current_date,
                        format : 'd/m/Y'
                    } ]
                }, {
                    xtype : 'fieldset',
                    id : 'bboxFieldset',
                    collapsible: true,
                    collapsed: true,
                    layout : {
                        type : 'table',
                        columns : 3
                    },
                    defaults: {
                        bodyStyle: 'border-width:0px; text-align: center;'
                    },
                    title : 'Bounding box',
                    autoHeight : true,
                    items : [
                    // Row 1:
                    emptyCell, {
                        html : 'lat (max)'
                    }, emptyCell,

                    // Row 2:
                    emptyCell, {
                        xtype : 'textfield',
                        name : 'lat_max',
                        id : 'lat_max',
                        listeners : {
                        	change : Ext.bind(this._toggleSpatialBounds, this)
                        }
                    }, emptyCell,

                    // Row 3:
                    {
                        html : 'long (min)'
                    }, 
                    emptyCell,{
                        html : 'long (max)'
                    },
                    
                    // Row 4:
                    {
                        xtype : 'textfield',
                        name : 'long_min',
                        id : 'long_min',
                        listeners : {
                        	change : Ext.bind(this._toggleSpatialBounds, this)
                        }
                    }, 
                    emptyCell,{
                        xtype : 'textfield',
                        name : 'long_max',
                        id : 'long_max',
                        listeners : {
                        	change : Ext.bind(this._toggleSpatialBounds, this)
                        }
                    },
                    
                    // Row 5:
                    emptyCell, {
                        html : 'lat (min)'
                    }, emptyCell,
                    
                    // Row 6:
                    emptyCell, {
                        xtype : 'textfield',
                        name : 'lat_min',
                        id : 'lat_min',
                        listeners : {
                        	change : Ext.bind(this._toggleSpatialBounds, this)
                        }
                    },                        	
                    // Bbox preview button
                    {
                    	xtype : 'panel',
                    	layout : 'anchor',
                    	hideBorder : true,
                    	items : [{
	                    	xtype : 'button',
	                    	anchor : '30%',
	                    	html : this._spatialBoundsRenderer(),
	                    	id : 'bboxPreviewButton',
	                    	align: 'CENTER',
	                        disabled: true,
	                        tooltip : {
	                        	text: 'Click to preview the bounds of this filter, double click to pan the map to those bounds.',
	                        },
		                    listeners : {
		                        click : Ext.bind(this._spatialBoundsClickHandler, this),
		                        dblclick : Ext.bind(this._spatialBoundsDoubleClickHandler, this),
		                        element : 'el'
		                    }
                    	}]
                    }]
                }]
            }]
        });

        this.callParent(arguments);
    },
    
    /**
     * Enable bbox preview on the map when all bounding box text fields are filled in.
     */
    _toggleSpatialBounds : function() {
    	var lat_max = this.form._fields.get("lat_max").lastValue;
    	var lat_min = this.form._fields.get("lat_min").lastValue;
    	var long_max = this.form._fields.get("long_max").lastValue;
    	var long_min = this.form._fields.get("long_min").lastValue;

    	var previewBtn = Ext.getCmp('bboxPreviewButton');
	    // check if all fields are filled in
 		if (lat_max && lat_min && long_max && long_min) {
    		// enable spatial bounds preview
 		    previewBtn.enable();
 		} else {
 		    previewBtn.disable();
 		}
    },
    
    /**
     * Generates an Ext.DomHelper.markup for the specified imageUrl
     * for usage as an image icon within this grid.
     */
    _spatialBoundsRenderer : function() {
    	return Ext.DomHelper.markup({
            tag : 'div',
            style : 'text-align:center;',
            children : [{
                tag : 'img',
                width : 16,
                height : 16,
                align: 'CENTER',
                src: 'img/magglass.gif'
            }]
        });
    },
    
    /**
     * On single click, show a highlight of all BBoxes
     */
    _spatialBoundsClickHandler : function() {
        // In IE & Chrome, this handler will get called even though the button 
        // is disabled. Hence, we need to do an explicit checking to see if 
        // the preview button is enabled before we continue.
        var previewBtn = Ext.getCmp('bboxPreviewButton');
        if (previewBtn && !previewBtn.disabled) {
            var bbox = this._getBBoxFilterBounds();
            if (bbox) {
                if (bbox.southBoundLatitude !== bbox.northBoundLatitude ||
                    bbox.eastBoundLongitude !== bbox.westBoundLongitude) {

                    //VT: Google map uses EPSG:3857 and its maximum latitude is only 85 degrees
                    // anything more will stretch the transformation
                    if(bbox.northBoundLatitude>85){
                        bbox.northBoundLatitude=85;
                    }
                    if(bbox.southBoundLatitude<-85){
                        bbox.southBoundLatitude=-85;
                    }
                }

                this.map.highlightBounds(bbox);
            }
        }
    },
    
    /**
     * Get the bounding box based on text fields values.
     */
    _getBBoxFilterBounds : function() {
    	// They're assumed to be filled in because this has been checked when the button is enabled
    	var lat_max = Number(this.form._fields.get("lat_max").lastValue);
    	var lat_min = Number(this.form._fields.get("lat_min").lastValue);
    	var long_max = Number(this.form._fields.get("long_max").lastValue);
    	var long_min = Number(this.form._fields.get("long_min").lastValue);
    		
        // validate against non numerical values
        if (isNaN(lat_max) || isNaN(lat_min) || isNaN(long_max) || isNaN(long_min)) {
           alert("You have entered invalid bounding box filter values! Please re-enter and try again.");
           return null;
        } 
        return Ext.create('portal.util.BBox', {
                northBoundLatitude : lat_max,
                southBoundLatitude : lat_min,
                eastBoundLongitude : long_max,
                westBoundLongitude : long_min
        });  	
    },

    /**
     * On double click, move the map so that specified bounds are visible
     */
    _spatialBoundsDoubleClickHandler : function() {
        // In IE & Chrome, this handler will get called even though the button 
        // is disabled. Hence, we need to do an explicit checking to see if 
        // the preview button is enabled before we continue.        
        var previewBtn = Ext.getCmp('bboxPreviewButton');
        if (previewBtn && !previewBtn.disabled) {
            var spatialBounds = this._getBBoxFilterBounds();
            if (spatialBounds) {
                this.map.scrollToBounds(spatialBounds);
            }            
        }
    }
});