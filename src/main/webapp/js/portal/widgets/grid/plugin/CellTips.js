/**
 * A plugin for an Ext.grid.Panel class that adds dynamic
 * tooltips to individual cells.
 *
 * To use this plugin, assign the following fields to each of the grid's columns
 * {
 *  hasTip : Boolean - whether this column has a tip associated with it
 *  tipRenderer : function(Object value, Ext.data.Model record, Ext.grid.Column column) - should return a value to be rendered into a tool tip
 * }
 *
 * Original idea adapted from http://stackoverflow.com/questions/7539006/extjs4-set-tooltip-on-each-column-hover-in-gridpanel
 */
Ext.define('portal.widgets.grid.plugin.CellTips', {
    alias: 'plugin.celltips',

    _grid : null,

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    init: function(grid) {
        this._grid = grid;
        grid.getView().on('render', this._registerTips, this);

    },

    _registerTips : function(view) {
        view.tip = Ext.create('Ext.tip.ToolTip', {
            // The overall target element.
            target: view.el,
            // Each grid row causes its own seperate show and hide.
            delegate: view.cellSelector,
            // Moving within the row should not hide the tip.
            trackMouse: true,
            // Render immediately so that tip.body can be referenced prior to the first show.
            renderTo: Ext.getBody(),
            listeners: {
                // Change content dynamically depending on which element triggered the show.
                beforeshow: Ext.bind(this._tipRenderer, this, [view], true)
            }
        });
    },

    _tipRenderer : function(tip, opt, view) {
        var gridColums = view.getGridColumns();
        var colIndex = tip.triggerElement.cellIndex;
        var rowIndex = tip.triggerElement.parentNode.rowIndex;
        var column = gridColums[tip.triggerElement.cellIndex];

        if (!column || !column.hasTip) {
            return false;
        }

        var record = this._grid.getStore().getAt(rowIndex);
        var value = record.get(column.dataIndex);
        if (column.tipRenderer) {
            tip.update(column.tipRenderer(value, record, column));
        } else {
            tip.update(value);
        }
        return true;
     }

});