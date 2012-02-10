/**
 * NVCL Logs are a representation of a log response from the NVCL data service
 */
Ext.define('portal.knownlayer.nvcl.Dataset', {
    extend: 'Ext.data.Model',

    fields : [
        {name: 'analyteName', type: 'string'},
        {name: 'analyteValue', type: 'string'},
        {name: 'uom', type: 'string'},
        {name: 'analyticalMethod', type: 'string'},
        {name: 'labDetails', type: 'string'},
        {name: 'analysisDate', type: 'string'},
        {name: 'preparationDetails', type: 'string'},
        {name: 'recordIndex', type: 'int'}
    ]
});