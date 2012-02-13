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
                width : 32
            },{
                dataIndex : 'loading',
                renderer : this._loadingRenderer,
                width: 32
            },{
                text : 'Layer Name',
                dataIndex : 'name',
                flex : 1,
            },{
                text : 'Visible',
                xtype : 'renderablecheckcolumn',
                dataIndex : 'renderer',
                getCustomValueBool : function(header, renderer) {
                    return renderer.getVisible();
                },
                setCustomValueBool : function(header, renderer, checked) {
                    return renderer.setVisible(checked);
                },
                width : 40
            },{
                dataIndex : 'renderer',
                renderer : this._downloadRenderer,
                width : 32
            }],
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl : [
                    '<p>{description}</p><br>'
                ]
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

        return legend.getLegendIconHtml(record.getAllOnlineResources(), record.data.filterer);
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

    _downloadRenderer : function(value, metaData, record, row, col, store, gridView) {
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