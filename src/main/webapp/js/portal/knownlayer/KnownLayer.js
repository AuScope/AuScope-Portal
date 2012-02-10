/**
 * KnownLayer's are a portal defined grouping of CSWRecords. The records are grouped
 * 'manually' at the portal due to limitations with the way services can identify themselves.
 *
 * For example, there may be many WFS's with gsml:Borehole features but there is no way to
 * automatically identify them as 'Pressure DB' or 'National Virtual Core Library' feature
 * services. Instead we manually perform the grouping on the portal backend
 */
Ext.require('portal.csw.CSWRecordType');
Ext.define('portal.knownlayer.KnownLayer', {
    extend: 'Ext.data.Model',

    requires: ['portal.csw.CSWRecordType'],

    fields: [
        { name: 'id', type: 'string' }, //a unique ID of the known layer grouping
        { name: 'title', type: 'string'}, //A human readable name/title for this grouping
        { name: 'description', type: 'string' }, //A human readable description of this KnownLayer
        { name: 'group', type: 'string' }, //A term in which like KnownLayers can be grouped under
        { name: 'proxyUrl', type: 'string' }, //A URL of a backend controller method for fetching available data with a filter specific for this KnonwLayer
        { name: 'proxyCountUrl', type: 'string' }, //A URL of a backend controller method for fetching the count of data available (eg for WFS a URL that will set featureType=hits)
        { name: 'iconUrl', type: 'string' }, //A URL of an icon that will be used for rendering GMarkers associated with this layer
        { name: 'cswRecords', convert: portal.csw.CSWRecordType.convert} //a set of portal.csw.CSWRecord objects that belong to this KnownLayer grouping
    ]
});