/**
 * A factory for parsing a surfaceaftershock:seismometer element.
 */
Ext.define('auscope.layer.querier.wfs.factories.SurfaceAfterShockFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'seismometer';
    },

    /**
     * Generates a simple panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl) {
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        
        var name = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'surfaceaftershock:station_name');
        var latitude = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'surfaceaftershock:latitude');
        var longitude = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'surfaceaftershock:longitude');
        var startDate = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'surfaceaftershock:start_date');
        var rawDataURL = "http://meiproc.earthsci.unimelb.edu.au/sa_data/" + name;
        rawDataURL = "<a href='" + rawDataURL + "' target='_blank'>" + rawDataURL + "</a>";

        //Build our component
        return Ext.create('portal.layer.querier.BaseComponent', {
            border : false,
            autoScroll : true,
            items : [{
                xtype : 'fieldset',
                title : 'Seismograph',
                items : [{
                    xtype : 'displayfield',
                    fieldLabel : 'Station Name',
                    value : name
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Latitude',
                    value : latitude
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Longitude',
                    value : longitude
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Start Date',
                    value : startDate
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'Raw Data:',
                    value : rawDataURL 
                }]
            }]
        });
    }
});