/**
 * A specialised Ext.grid.Panel instance for
 * displaying a store of portal.layer.Layer objects.
 */
Ext.define('portal.widgets.panel.LayerPanel', {
    extend : 'Ext.grid.Panel',

    constructor : function(cfg) {
        var me = this;

        Ext.apply(cfg, {
            columns : [{
                dataIndex : 'renderer',
                renderer : this._legendIconRenderer,
                width : 18
            },{
                dataIndex : 'loading',
                renderer : this._loadingRenderer,
                width : 25
            },{
                dataIndex : 'name',
                width: 100
            },{
                xtype : 'checkcolumn',
                dataIndex : 'renderer',
                renderer : this._visibleRenderer,
                width : 30
            },{
                dataIndex : 'renderer',
                renderer : this._loadingRenderer,
                width : 20
            }],
            bbar: [{
                text : 'Remove Layer',
                iconCls : 'remove',
            }]
        });

        this.callParent(arguments);
    },

    /**
     * Renderer for the legend icon column
     */
    _legendIconRenderer : function(value, metaData, record, row, col, store, gridView) {
        if (!value) {
            return '';
        }

        var legend = value.getLegend();
        if (!legend) {
            return '';
        }

        return legend.getLegendIconHtml(record.getAllOnlineResources(), record.getFilterer());
    },

    /**
     * Renderer for the loading column
     */
    _loadingRenderer : function(value, metaData, record, row, col, store, gridView) {
        if (value) {
            return Ext.DomHelper.markup({
                tag : 'img',
                width : 16,
                height : 16,
                src: 'img/loading.gif'
            });
        } else {
            return Ext.DomHelper.markup({
                tag : 'img',
                width : 16,
                height : 16,
                src: 'img/notloading.gif'
            });
        }
    },

    /**
     * Renderer for 'Visibility' column
     */
    _visibleRenderer : function(value, metaData, record, row, col, store, gridView) {
        return value.getVisible();//value is a portal.layer.renderer.Renderer
    },

    _loadingRenderer : function(value, metaData, record, row, col, store, gridView) {
        if (value.getHasData()) { //value is a portal.layer.renderer.Renderer
            return Ext.DomHelper.markup({
                tag : 'img',
                width : 16,
                height : 16,
                src: 'img/page_code.png'
            });
        } else {
            return Ext.DomHelper.markup({
                tag : 'img',
                width : 16,
                height : 16,
                src: 'img/page_code_disabled.png'
            });
        }
    }
});