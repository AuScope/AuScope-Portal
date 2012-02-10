/**
 * An abstract base class to be extended.
 *
 * Represents a grid panel for containing layers
 * that haven't yet been added to the map. Each row
 * will be grouped under a heading, contain links
 * to underlying data sources and have a spatial location
 * that can be viewed by the end user.
 *
 * This class is expected to be extended for usage within
 * the 'Registered Layers', 'Known Layers' and 'Custom Layers'
 * panels in the portal. Support for KnownLayers/CSWRecords and
 * other row types will be injected by implementing the abstract
 * functions of this class
 */
Ext.define('portal.widgets.panel.BaseRecordPanel', {
    extend : 'Ext.grid.Panel',

    constructor : function(cfg) {
        var me = this;

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: '{name} ({[values.rows.length]} {[values.rows.length > 1 ? "Items" : "Item"]})'
            //groupHeaderTpl: 'Cuisine: {group} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
        });

        Ext.apply(cfg, {
            features : [groupingFeature],
            viewConfig : {
                emptyText : 'No records are available, please try refreshing the page in a few moments.'
            },
            columns : [{
                text : 'Title',
                dataIndex : 'title',
                flex: 1,
                renderer : this._titleRenderer
            },{
                dataIndex : 'serviceInformation',
                width: 32,
                renderer : this._serviceInformationRenderer
            },{
                dataIndex : 'spatialBoundsRenderer',
                width: 32,
                renderer : this._spatialBoundsRenderer
            }],
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl : [
                    '<p>{description}</p><br>'
                ]
            }],
            bbar: [{
                text:'Add Layer to Map',
                tooltip:'Add Layer to Map',
                iconCls:'add',
                pressed:true,
                scope:this,
                handler: function() {
                    alert('TODO');
                }
            }]
        });

        this.callParent(arguments);
    },

    //-------- Abstract methods requiring implementation ---------

    /**
     * Abstract function - Should return a string based title
     * for a given record
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose title should be extracted
     */
    getTitleForRecord : portal.util.UnimplementedFunction,

    /**
     * Abstract function - Should return an Array of portal.csw.OnlineResource
     * objects that make up the specified record. If no online resources exist
     * then an empty array can be returned
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose underlying online resources should be extracted.
     */
    getOnlineResourcesForRecord : portal.util.UnimplementedFunction,

    /**
     * Abstract function - Should return an Array of portal.util.BBox
     * objects that represent the total spatial bounds of the record. If no
     * bounds exist then an empty array can be returned
     *
     * function(Ext.data.Model record)
     *
     * record - The record whose spatial bounds should be extracted.
     */
    getSpatialBoundsForRecord : portal.util.UnimplementedFunction,

    //--------- Class Methods ---------

    /**
     * Generates an Ext.DomHelper.markup for the specified imageUrl
     * for usage as an image icon within this grid.
     */
    _generateHTMLIconMarkup : function(imageUrl) {
        return Ext.DomHelper.markup({
            tag : 'div',
            style : 'text-align:center;',
            children : [{
                tag : 'img',
                width : 16,
                height : 16,
                align: 'CENTER',
                src: imageUrl
            }]
        });
    },

    /**
     * Internal method, acts as an ExtJS 4 column renderer function for rendering
     * the title of the record.
     *
     * http://docs.sencha.com/ext-js/4-0/#!/api/Ext.grid.column.Column-cfg-renderer
     */
    _titleRenderer : function(value, metaData, record, row, col, store, gridView) {
        return this.getTitleForRecord(record);
    },

    /**
     * Internal method, acts as an ExtJS 4 column renderer function for rendering
     * the service information of the record.
     *
     * http://docs.sencha.com/ext-js/4-0/#!/api/Ext.grid.column.Column-cfg-renderer
     */
    _serviceInformationRenderer : function(value, metaData, record, row, col, store, gridView) {
        var onlineResources = this.getOnlineResourcesForRecord(record);
        var containsDataSource = false;
        var containsImageSource = false;

        //We classify resources as being data or image sources.
        for (var i = 0; i < onlineResources.length; i++) {
            switch(onlineResources[i].data.type) {
            case portal.csw.OnlineResource.WFS:
            case portal.csw.OnlineResource.WCS:
            case portal.csw.OnlineResource.OPeNDAP:
                containsDataSource = true;
                break;
            case portal.csw.OnlineResource.WMS:
            case portal.csw.OnlineResource.WWW:
                containsImageSource = true;
                break;
            }
        }

        //We show an icon depending on the types
        //of online resources that are available
        if (containsDataSource) {
            return this._generateHTMLIconMarkup('img/binary.png');
        } else if (containsImageSource) {
            return this._generateHTMLIconMarkup('img/picture.png');
        }

        return this._generateHTMLIconMarkup('img/cross.png');
    },

    /**
     * Internal method, acts as an ExtJS 4 column renderer function for rendering
     * the spatial bounds column of the record.
     *
     * http://docs.sencha.com/ext-js/4-0/#!/api/Ext.grid.column.Column-cfg-renderer
     */
    _spatialBoundsRenderer : function(value, metaData, record, row, col, store, gridView) {
        var spatialBounds = this.getSpatialBoundsForRecord(record);
        if (spatialBounds.length > 0) {
            return this._generateHTMLIconMarkup('img/magglass.gif');
        }

        return '';
    }
});