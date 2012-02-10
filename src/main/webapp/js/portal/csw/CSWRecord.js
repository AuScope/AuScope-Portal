/**
 * CSWRecord is a simplified representation of a metadata record
 * from a catalogue service for the web (CSW)
 */
Ext.define('portal.csw.CSWRecord', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' }, //Based on CSWRecord's file identifier
        { name: 'name', type: 'string' }, //Human readable name/title of this record
        { name: 'description', type: 'string' }, //Human readable description of this record (based on abstract)
        { name: 'adminArea', type: 'string' }, //The adminstrative area this record identifies itself as being a part of (organisation name that owns this record)
        { name: 'resourceProvider', type: 'string' }, //Who is providing this resource (organisation name)
        { name: 'keywords', type: 'auto' }, //an array of strings representing descriptive keywords for this record
        { name: 'geographicElements', type: portal.util.BBoxType}, //an array of portal.util.BBox objects representing the total spatial bounds of this record
        { name: 'onlineResources', type: portal.csw.OnlineResourceType} //A set of portal.csw.OnlineResource objects
    ]
});