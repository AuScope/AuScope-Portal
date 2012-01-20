Ext.define('portal.csw.CSWRecord', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'adminArea', type: 'string' },
        { name: 'keywords', type: 'auto' }
    ],
    hasMany: {model: 'portal.csw.OnlineResource', name: 'onlineResources'},

});