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
                     {name: 'timeStampMillis', type: 'int'},
                     {name: 'msgId', type: 'string'},
                     {name: 'correlationId', type: 'string'}],
            data: cfg.statuses
        });

        Ext.apply(cfg, {
            columns: [
                {
                    text: 'Name',
                    dataIndex: 'jobDescription',
                    flex: 1,
                    renderer: this._nameRenderer
                },{
                    text: 'Submitted',
                    dataIndex: 'timeStampMillis',
                    width: 160,
                    renderer: this._timestampRenderer
                },{
                    text: 'Status',
                    dataIndex: 'status'
                },{
                    xtype: 'actioncolumn',
                    width: 48,
                    items: [{
                        iconCls: 'add',
                        tooltip: 'View the job results on the map',
                        scope: this,
                        handler: function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('statusselect', this, record);
                        }
                    },{
                        iconCls: 'download',
                        tooltip: 'Download the borehole IDs to your local machine',
                        scope: this,
                        handler: function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('statusdownload', this, record);
                        }
                    }]
                }],
            store: store
        });

        this.callParent(arguments);
    },

    _nameRenderer: function(value, md, record) {
        return '<b>' + value + '</b>';
    },

    _timestampRenderer: function(value, md, record) {
        var date = new Date(value);
        return Ext.util.Format.date(date, 'Y/m/d H:i');
    }
});