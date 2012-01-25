/**
 * LocatedSpecimens are a representation of observation and sampling data for the Yilgarn Laterite Geochemistry dataset
 */
Ext.define('portal.knownlayer.yilgarngeochem.LocatedSpecimen', {
    extend: 'Ext.data.Model',

    fields : [
        {name : 'datasetId', type: 'string'},
        {name : 'datasetName', type: 'string'},
        {name : 'omUrl', type: 'string'}
    ]
});