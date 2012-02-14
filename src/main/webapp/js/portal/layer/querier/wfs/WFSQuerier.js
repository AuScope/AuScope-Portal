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
        if (!queryTarget.id) {
            callback(this, null);
            return;
        }

        //we need to get a reference to the parent known layer (if it is a known layer)
        var knownLayer = null;
        if (queryTarget.layer.sourceType === portal.layer.Layer.KNOWN_LAYER) {
            knownLayer = queryTarget.layer.source;
        }

        var me = this;
        Ext.Ajax.request( {
            url : 'requestFeature.do',
            params : {
                serviceUrl : this.wfsUrl,
                typeName : this.typeName,
                featureId : this.featureId
            },
            callback : function(options, success, response) {
                if (!success) {
                    callback(me, null);
                    return;
                }

                var jsonResponse = Ext.JSON.decode(response.responseText);
                if (!jsonResponse.success) {
                    callback(me, null);
                    return;
                }

                // Load our xml string into DOM
                var xmlString = jsonResponse.data.gml;
                var xmlDocument = portal.util.xml.SimpleDOM.parseStringToDOM(xmlString);
                if(xmlDocument == null){
                    alert('Your web browser doesn\'t seem to support any form of XML to DOM parsing. Functionality will be affected');
                    callback(me, null);
                    return;
                }

                //Skip the opening containing elements (as they are constant for WFS)
                var wfsResponseRoot = xmlDocument.documentElement.childNodes[0].childNodes[0];

                //Parse our response into a number of GUI components, pass those along to the callback
                var allComponents = [];
                allComponents.push(me.parser.parseNode(wfsResponseRoot, queryTarget.onlineResource.url, me.rootCfg));
                if (knownLayer && me.knownLayerParser.canParseKnownLayerFeature(queryTarget.id, knownLayer, queryTarget.onlineResource)) {
                    allComponents.push(me.knownLayerParser.parseKnownLayerFeature(queryTarget.id, knownLayer, queryTarget.onlineResource, me.rootCfg));
                }

                callback(wfsParser, allComponents);
            }
        });
    }
});