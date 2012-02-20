/**
 * An extension to Ext.selection.CellModel which allows
 * fine grained cell selection events but rendering
 * itself like a row selection model
 */
Ext.define('portal.widgets.selection.CellRowModel', {
    extend: 'Ext.selection.CellModel',
    requires : ['Ext.selection.RowModel'],
    alias: 'selection.cellrowmodel',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    // Do exactly as a cell selection model but also
    // highlight the entire row
    onCellSelect: function(position) {
        this.callParent(arguments);

        var layer = this.store.getAt(position.row);
        this.primaryView.onRowSelect(position.row, true);
    },

    // Do exactly as a cell selection model but also
    // unhighlight the entire row
    onCellDeselect: function(position) {
        this.callParent(arguments);

        //Clear the visible selection
        this.primaryView.onRowDeselect(position.row, true);
    },

    //We want the functionality from the RowModel 'onSelectChange' to take effect.
    //The CellModel doesn't do anything in this case and that's not helpful for us
    //The way we go about this is by overriding this method in the prototype
    //on the class load method
    onSelectChange: Ext.util.UnimplementedFunction
}, function() {
    //See comment for onSelectChange for why we do this...
    portal.widgets.selection.CellRowModel.prototype.onSelectChange = Ext.selection.RowModel.prototype.onSelectChange;
});