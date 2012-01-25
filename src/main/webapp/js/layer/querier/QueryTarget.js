/**
 * an QueryTarget is a fundamental object representing a query for more information
 * about a particular location/feature with respect to a particular data source.
 *
 * A query target will typically be either a lat/long query location OR a specific
 * feature ID to get more information about
 */
Ext.define('portal.layer.querier.QueryTarget', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'}, //A unique id of a feature specifically selected (can be empty)
        {name: 'lat', type: 'float'}, //The EPSG:4326 latitude of the query location (can be empty)
        {name: 'lng', type: 'float'}, //The EPSG:4326 longitude of the query location (can be empty)
        {name: 'onlineResource', type: 'auto'} //A portal.csw.OnlineResource representing the data source to query
        {name: 'layer', type: 'auto'} //A portal.layer.Layer representing the owner of the online resource
    ]
});

