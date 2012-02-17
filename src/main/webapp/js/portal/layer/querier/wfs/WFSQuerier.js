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


    _generateErrorComponent : function(message, rootConfig) {
        var cfg = Ext.apply({}, rootConfig ? rootConfig : {});
        Ext.apply(cfg, {
            html: Ext.util.Format.format('<p class="centeredlabel">{0}</p>', message)
        })
        return Ext.create('portal.layer.querier.BaseComponent', cfg);
    },

    /**
     * See parent class for definition
     *
     * Makes a WFS request, waits for the response and then parses it passing the results to callback
     */
    query : function(queryTarget, rootConfig, callback) {
        //This class can only query for specific WFS feature's
        var id = queryTarget.get('id');
        if (!id) {
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
                if(xmlDocument == null) {
                    callback(me, [me._generateErrorComponent('Your web browser doesn\'t seem to support any form of XML to DOM parsing.')], queryTarget);
                    return;
                }

                //Skip the opening containing elements (as they are constant for WFS)
                var featureMembers = xmlDocument.documentElement.childNodes[0];
                if (featureMembers.childNodes.length === 0) {
                    //we got an empty response - likely because the feature ID DNE.
                    callback(me, [me._generateErrorComponent(Ext.util.Format.format('The remote service returned no data for feature id \"{0}\"', id))], queryTarget);
                    return;
                }
                var wfsResponseRoot = featureMembers.childNodes[0];

                //Parse our response into a number of GUI components, pass those along to the callback
                var allComponents = [];
                allComponents.push(me.parser.parseNode(wfsResponseRoot, onlineResource.data.url, rootConfig));
                if (knownLayer && me.knownLayerParser.canParseKnownLayerFeature(queryTarget.data.id, knownLayer, onlineResource)) {
                    allComponents.push(me.knownLayerParser.parseKnownLayerFeature(queryTarget.data.id, knownLayer, onlineResource, rootConfig));
                }

                callback(me, allComponents, queryTarget);
            }
        });
    }
});