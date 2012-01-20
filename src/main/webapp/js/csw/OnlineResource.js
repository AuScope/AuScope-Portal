Ext.define('portal.csw.OnlineResource', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.SequentialIdGenerator'],
    idgen: 'sequential',
    fields: [
        {name: 'id',      type: 'string'},
        {name: 'url',      type: 'string'},
        {name: 'name',    type: 'string'},
        {name: 'description',    type: 'string'},
        {name: 'type',    type: 'string'}

    ]
});