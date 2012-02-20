/**
 * A specialised Ext.grid.Panel instance for
 * displaying a store of portal.layer.Layer objects.
 *
 * Adds the following events : {
 *  downloadlayer(portal.widgets.panel.LayerPanel callingInstance, portal.layer.Layer layerToDownload) - raised whenever the user hits the 'download icon' for a layer
 * }
 */
Ext.define('portal.widgets.panel.LayerPanel', {
    extend : 'Ext.grid.Panel',
    alias: 'widget.layerpanel',

    constructor : function(cfg) {
        var me = this;

        this.filterPanel = cfg.filterPanel;

        Ext.apply(cfg, {
            columns : [{
                dataIndex : 'renderer',
                renderer : this._legendIconRenderer,
                width : 32
            },{
                dataIndex : 'loading',
                renderer : this._loadingRenderer,
                hasTip : true,
                tipRenderer : Ext.bind(this._loadingTipRenderer, this),
                width: 32
            },{
                text : 'Layer Name',
                dataIndex : 'name',
                flex : 1
            },{
                xtype : 'renderablecheckcolumn',
                text : 'Visible',
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
                width : 32,
                renderer : this._downloadRenderer
            }],
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl : [
                    '<p>{description}</p><br>'
                ]
            },{
                ptype: 'celltips'
            }],
            selType : 'cellrowmodel',
            bbar: [{
                text : 'Remove Layer',
                iconCls : 'remove',
                handler : function(button) {
                    var grid = button.findParentByType('layerpanel');
                    var sm = grid.getSelectionModel();
                    var selectedRecords = sm.getSelection();
                    if (selectedRecords && selectedRecords.length > 0) {
                        var store = grid.getStore();
                        store.remove(selectedRecords);
                    }
                }
            }]
        });

        this.addEvents('downloadlayer');

        this.callParent(arguments);

        this.getSelectionModel().on('select', this._cellClickHandler, this);
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
                tag : 'a',
                href : 'javascript: void(0)',
                children : [{
                    tag : 'img',
                    width : 16,
                    height : 16,
                    src: 'img/page_code.png'
                }]
            });
        } else {
            return Ext.DomHelper.markup({
                tag : 'a',
                href : 'javascript: void(0)',
                children : [{
                    tag : 'img',
                    width : 16,
                    height : 16,
                    src: 'img/page_code_disabled.png'
                }]
            });
        }
    },

    /**
     * A renderer for generating the contents of the tooltip that shows when the
     * layer is loading
     */
    _loadingTipRenderer : function(value, layer, column, tip) {
        var renderer = layer.get('renderer');
        var update = function(renderStatus, keys) {
            tip.update(renderStatus.renderHtml());
        };

        //Update our tooltip as the underlying status changes
        renderer.renderStatus.on('change', update, this);
        tip.on('hide', function() {
            renderer.renderStatus.un('change', update); //ensure we remove the handler when the tip closes
        });

        return renderer.renderStatus.renderHtml();
    },

    _wmsLegendFormClick : function(legend, resources, filterer, success, form,layer){
        var win = Ext.create('Ext.window.Window', {
            title       : 'Legend: '+ layer.get('name'),
            layout      : 'fit',
            width       : 200,
            height      : 300,
            items: form
        });
        return win.show();
    },

    /**
     * Handles all clicks
     */
    _cellClickHandler : function(cellModel, layer, row, column) {
        var downloadColumnIndex = 5;
        var legendColumnIndex=1;

        switch(column) {
        case downloadColumnIndex:
            var downloader = layer.get('downloader');
            if (downloader) {
                this.fireEvent('downloadlayer', this, layer);
            }
            break;
        case legendColumnIndex:
            var fn=Ext.bind(this._wmsLegendFormClick,this,[layer],true);
            layer.get('renderer').getLegend().getLegendComponent(layer.getAllOnlineResources(), layer.get('filterer'),fn);
        }
    }
});