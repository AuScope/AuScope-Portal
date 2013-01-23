/**
 * A class for creating instances of portal.layer.renderer.Renderer
 */
Ext.define('auscope.layer.AuScopeRendererFactory', {

    extend : 'portal.layer.renderer.RendererFactory',

    /**
     * Creates a new instance of renderer based on the specified values
     */
    _generateRenderer : function(wfsResources, wmsResources, irisResources, proxyUrl, proxyCountUrl, iconUrl, iconSize, iconAnchor,polygonColor) {
        var icon = Ext.create('portal.map.Icon', {
            url : iconUrl,
            width : iconSize ? iconSize.width : 16,
            height : iconSize ? iconSize.height : 16,
            anchorOffsetX : iconAnchor ? iconAnchor.x : 0,
            anchorOffsetY : iconAnchor ? iconAnchor.y : 0
        });

        if(wmsResources.length > 0 && wfsResources.length > 0){
            return Ext.create('portal.layer.renderer.wfs.FeatureWithMapRenderer', {
                map : this.map,
                icon : icon,
                proxyUrl : proxyUrl ? proxyUrl : 'getAllFeatures.do',
                proxyCountUrl : proxyCountUrl
            });
        } else if (wmsResources.length > 0) {
            return Ext.create('portal.layer.renderer.wms.LayerRenderer', {map : this.map});
        } else if (wfsResources.length > 0) {
            return Ext.create('portal.layer.renderer.wfs.FeatureRenderer', {
                map : this.map,
                icon : icon,
                proxyUrl : proxyUrl ? proxyUrl : 'getAllFeatures.do',
                proxyCountUrl : proxyCountUrl
            });
        } else if (irisResources.length > 0) {
            return Ext.create('portal.layer.renderer.iris.IRISRenderer', {
                map : this.map,
                icon : icon,
                proxyUrl : proxyUrl,
                proxyCountUrl : proxyCountUrl
            });
        } else {
            return Ext.create('portal.layer.renderer.csw.CSWRenderer', {
                map : this.map,
                icon : icon,
                polygonColor: polygonColor
            });
        }
    },

    /**
     * See parent class for defn
     */
    buildFromKnownLayer : function(knownLayer) {
        var allOnlineResources = knownLayer.getAllOnlineResources();

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var irisResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.IRIS);

        return this._generateRenderer(wfsResources, wmsResources, irisResources, knownLayer.get('proxyUrl'), knownLayer.get('proxyCountUrl'),
                knownLayer.get('iconUrl'), knownLayer.get('iconSize'), knownLayer.get('iconAnchor'),knownLayer.get('polygonColor'));
    },

    /**
     * See parent class for defn
     */
    buildFromCswRecord : function(cswRecord) {
        var allOnlineResources = cswRecord.get('onlineResources');

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var irisResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.IRIS);

        return this._generateRenderer(wfsResources, wmsResources, irisResources, undefined, undefined, undefined, undefined, undefined,undefined);
    }
});