/**
 * Class for making and then parsing a WFS request/response using a GenericParser.Parser class
 */
Ext.define('portal.layer.querier.wfs.WFSQuerier', {
    extend: 'portal.layer.querier.Querier',

    constructor: function(config){

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;
        this.parser = Ext.create('portal.layer.querier.wfs.Parser', {});
        this.knownLayerParser = Ext.create('portal.layer.querier.wfs.KnownLayerParser', {});

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    /**
     * See parent class for definition
     *
     * Makes a WFS request, waits for the response and then parses it passing the results to callback
     */
    query : function(queryTarget, callback) {
        //This class can only query for specific WFS feature's
        if (!queryTarget.data.id) {
            callback(this, null, queryTarget);
            return;
        }

        //we need to get a reference to the parent known layer (if it is a known layer)
        var knownLayer = null;
        if (queryTarget.data.layer.data.sourceType === portal.layer.Layer.KNOWN_LAYER) {
            knownLayer = queryTarget.data.layer.data.source;
        }

        var me = this;
        var onlineResource = queryTarget.data.onlineResource;
        Ext.Ajax.request( {
            url : 'requestFeature.do',
            params : {
                serviceUrl : onlineResource.data.url,
                typeName : onlineResource.data.name,
                featureId : queryTarget.data.id
            },
            callback : function(options, success, response) {
                if (!success) {
                    callback(me, null, queryTarget);
                    return;
                }

                var jsonResponse = Ext.JSON.decode(response.responseText);
                if (!jsonResponse.success) {
                    callback(me, null, queryTarget);
                    return;
                }

                // Load our xml string into DOM
                var xmlString = jsonResponse.data.gml;
                var xmlDocument = portal.util.xml.SimpleDOM.parseStringToDOM(xmlString);
                if(xmlDocument == null){
                    alert('Your web browser doesn\'t seem to support any form of XML to DOM parsing. Functionality will be affected');
                    callback(me, null, queryTarget);
                    return;
                }

                //Skip the opening containing elements (as they are constant for WFS)
                var wfsResponseRoot = xmlDocument.documentElement.childNodes[0].childNodes[0];

                //Parse our response into a number of GUI components, pass those along to the callback
                var allComponents = [];
                allComponents.push(me.parser.parseNode(wfsResponseRoot, onlineResource.data.url, me.rootCfg));
                if (knownLayer && me.knownLayerParser.canParseKnownLayerFeature(queryTarget.data.id, knownLayer, onlineResource)) {
                    allComponents.push(me.knownLayerParser.parseKnownLayerFeature(queryTarget.data.id, knownLayer, onlineResource, me.rootCfg));
                }

                callback(me, allComponents, queryTarget);
            }
        });
    }
});