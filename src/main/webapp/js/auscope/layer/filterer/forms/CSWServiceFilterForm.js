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
                title : 'Filter data',
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