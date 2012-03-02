/**
 * Class for making and then parsing a WFS request/response using a GenericParser.Parser class
 */
Ext.define('portal.layer.querier.wms.WMSQuerier', {
    extend: 'portal.layer.querier.Querier',

    constructor: function(config){

        // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
        this.listeners = config.listeners;
        // Call our superclass constructor to complete construction process.
        this.callParent(arguments)
    },

    /**
     * See parent class for definition
     *
     * Makes a WFS request, waits for the response and then parses it passing the results to callback
     */
    query : function(queryTarget, rootConfig, callback) {
        var latlng=new GLatLng(queryTarget.get('lat'),queryTarget.get('lng'));
        var layer=queryTarget.get('layer');
        var wmsOnlineResource=queryTarget.get('onlineResource');
        var map=layer.get('renderer').getMap();

        //map.getDragObject().setDraggableCursor("pointer");
        var TileUtl = new Tile(map,latlng);
        var typeName = wmsOnlineResource.get('name');
        var serviceUrl = wmsOnlineResource.get('url');

        var url = "wmsMarkerPopup.do";
        url += "?WMS_URL=" + serviceUrl;
        if( serviceUrl.substr(-1) !== "&" ) {
            url += '&';
        }
        url += "lat=" + latlng.lat();
        url += "&lng=" + latlng.lng();
        url += "&QUERY_LAYERS=" + typeName;
        url += "&x=" + TileUtl.getTilePoint().x;
        url += "&y=" + TileUtl.getTilePoint().y;
        url += '&BBOX=' + TileUtl.getTileCoordinates();
        url += '&WIDTH=' + TileUtl.getTileWidth();
        url += '&HEIGHT=' + TileUtl.getTileHeight();

        if(typeName.substring(0, typeName.indexOf(":")) == "gt") {
            var geotransect=Ext.create('portal.layer.querier.wms.type.Geotransect',
                    {url : url,
                     wmsOnlineResource : wmsOnlineResource,
                     map : map,
                     latlng : latlng,
                     queryTarget : queryTarget
                    });
            geotransect.handleGeotransectWmsRecord(callback);
        } else {
           //handleGenericWmsRecord(url, typeName, map, latlng);
        }

    }
});