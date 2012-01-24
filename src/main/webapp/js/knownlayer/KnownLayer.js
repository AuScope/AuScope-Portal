/**
 * KnownLayer's are a portal defined grouping of CSWRecords. The records are grouped
 * 'manually' at the portal due to limitations with the way services can identify themselves.
 *
 * For example, there may be many WFS's with gsml:Borehole features but there is no way to
 * automatically identify them as 'Pressure DB' or 'National Virtual Core Library' feature
 * services. Instead we manually perform the grouping on the portal backend
 */
Ext.define('portal.knownlayer.KnownLayer', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' }, //a unique ID of the known layer grouping
        { name: 'name', type: 'string' }, //A human readable name/title for this grouping
        { name: 'description', type: 'string' }, //A human readable description of this KnownLayer
        { name: 'grouping', type: 'string' }, //A term in which like KnownLayers can be grouped under
        { name: 'proxyUrl', type: 'string' } //A URL of a backend controller method for fetching available data with a filter specific for this KnonwLayer
        { name: 'proxyCountUrl', type: 'string' }, //A URL of a backend controller method for fetching the count of data available (eg for WFS a URL that will set featureType=hits)
    ],

    hasMany: {model: 'portal.csw.CSWRecord', name: 'cswRecords'} //a set of portal.csw.CSWRecord objects that belong to this KnownLayer grouping

});