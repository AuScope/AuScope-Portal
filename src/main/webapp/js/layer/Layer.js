Ext.define('portal.layer.Layer', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'source', type: 'string' },
        { name: 'renderer', type: 'auto' },
        { name: 'filterer', type: 'auto' },
        { name: 'downloader', type: 'auto' },
        { name: 'querier', type: 'auto' },

    ],
    hasMany: {model: 'portal.csw.CSWRecord', name: 'cswRecords'},

});