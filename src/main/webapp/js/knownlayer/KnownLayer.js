Ext.define('portal.knownlayer.KnownLayer', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'grouping', type: 'string' },
        { name: 'proxyCountUrl', type: 'string' },
        { name: 'proxyUrl', type: 'string' }
    ],

    hasMany: {model: 'portal.csw.CSWRecord', name: 'cswRecords'}

});