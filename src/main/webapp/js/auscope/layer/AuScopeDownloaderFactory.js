/**
 * A factory class for creating instances of portal.layer.downloader.Downloader
 */
Ext.define('auscope.layer.AuScopeDownloaderFactory', {

    extend : 'portal.layer.downloader.DownloaderFactory',


    _generateDownloader : function(source, wfsResources, wmsResources, wcsResources,useDownloadTracker) {
        if (wfsResources.length > 0 && useDownloadTracker) {
            var enableFormatSelection = true;
            var enableFeatureCounts = true;
            //We don't allow certain functions on a number of known layers
            switch(source.get('id')) {
                case 'nvcl-borehole':
                case 'erml-mine':
                case 'erml-mineraloccurrence':
                case 'erml-miningactivity':
                case 'mineral-tenements':
                    enableFormatSelection = false;
                    break;
                case 'capdf-hydrogeochem':
                    enableFormatSelection = false;
                    enableFeatureCounts = false;
                    break;
            }


            return Ext.create('portal.layer.downloader.wfs.KLWFSDownloader', {map : this.map, featureCountUrl: 'getFeatureCount.do', enableFeatureCounts: enableFeatureCounts, enableFormatSelection: enableFormatSelection});
        }

        if (wfsResources.length > 0 && !useDownloadTracker) {
            return Ext.create('portal.layer.downloader.wfs.WFSDownloader', {map : this.map});
        }

        if (wcsResources.length > 0) {
            return Ext.create('portal.layer.downloader.coverage.WCSDownloader', {map : this.map});
        }

        if (wmsResources.length > 0) {
            return Ext.create('portal.layer.downloader.wms.WMSDownloader', {map : this.map});
        }

        //Not having a downloader isn't a problem.
        return null;
    },

    /**
     * See parent class for defn
     */
    buildFromKnownLayer : function(knownLayer) {
        var allOnlineResources = knownLayer.getAllOnlineResources();

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        return this._generateDownloader(knownLayer, wfsResources, wmsResources, wcsResources,true);
    },

    /**
     * See parent class for defn
     */
    buildFromCswRecord : function(cswRecord) {
        var allOnlineResources = cswRecord.get('onlineResources');

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        return this._generateDownloader(cswRecord, wfsResources, wmsResources, wcsResources,false);
    }
});