/**
 * A panel for rendering a NVCL analytical services status response
 */
Ext.define('auscope.layer.analytic.form.nvcl.AnalyticalJobStatusPanel', {
    extend : 'Ext.grid.Panel',

    alias: 'widget.analyticaljobstatuspanel',

    /**
     * statuses: Object[] - Job statuses to render
     */
    constructor : function(cfg) {
        var store = Ext.create('Ext.data.Store', {
            fields: [{name: 'jobId', type: 'string'},
                     {name: 'jobDescription', type: 'string'},
                     {name: 'email', type: 'string'},
                     {name: 'status', type: 'string'},
                     {name: 'jobUrl', type: 'string'},
                     {name: 'message', type: 'string'},
                     {name: 'timeStamp', type: 'string'},
                     {name: 'msgId', type: 'string'},
                     {name: 'correlationId', type: 'string'}],
            data: cfg.statuses
        });

        Ext.apply(cfg, {
            columns: [
                {text: 'Name', dataIndex: 'jobDescription', flex: 1},
                {
                    xtype: 'clickcolumn',
                    text: 'Status',
                    dataIndex: 'status',
                    renderer: this._statusRenderer,
                    listeners: {
                        columnclick:  Ext.bind(this._statusClick, this)
                    }
                }],
            hideHeaders: true,
            store: store
        });

        this.callParent(arguments);
    },

    _statusClick: function(col, record) {
        if (record.get('status') === "Success") {
            this.fireEvent('statusselect', this, record);
        }
    },

    _statusRenderer: function(value, md, record) {
        if (value === "Success") {
            return '<a href="javascript:void(0)">' + value + '</a>';
        } else {
            return value;
        }
    }
});