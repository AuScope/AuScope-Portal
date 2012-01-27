/**
 * An implementation of a portal.layer.renderer for rendering WFS Features
 * as transformed by the AuScope portal backend.
 */
Ext.define('portal.layer.renderer.wfs.FeatureRenderer', {
    extend: 'portal.layer.renderer.Renderer',

    config : {
        //Information about the icon that is used to represent point locations of this WFS
        iconCfg : {
            url : null, //string - the URL of icon image that will be used
            size : {
                width : null, //width of the icon in pixels
                height : null //height of the icon in pixels
            },
            anchor : {
                x : null, //the x offset of where the icon should be anchored to the map
                y : null //the y offset of where the icon should be anchored to the map
            }
        }
    }

    constructor: function(config) {
        this.currentRequestCount = 0;//how many requests are still running

        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
    },

    /**
     * Must be called whenever a download manager returns a response (success or failure)
     *
     * You can optionally pass in an array of markers/overlays that were rendered
     */
    _finishDownloadManagerResponse : function(markerList, overlayList) {
        //If we haven't had any data come back yet from another response (and we have data now)
        //update the boolean indicating that we've had data
        if (markerList && overlayList && !this.getHasData()) {
            this.setHasData((markerList.length > 0) || (overlayList.length > 0));
        }

        this.currentRequestCount--;
        if (this.currentRequestCount === 0) {
            this.fireEvent('renderfinished', this);
        }
    }

    /**
     * Used to handle the case where the download manager returns an error
     */
    _handleDownloadManagerError : function(dm, message, debugInfo, onlineResource) {
        //store the status
        this.renderStatus.updateResponse(onlineResource.url, message);
        if(debugInfo) {
            this.renderDebuggerData.updateResponse(onlineResource.url, message + debugInfo.info);
        } else {
            this.renderDebuggerData.updateResponse(onlineResource.url, message);
        }

        //we are finished
        this._finishDownloadManagerResponse();
    },

    /**
     * Used for handling the case when the user cancels their download request
     */
    _handleDownloadManagerCancelled : function(dm, onlineResource) {
        //store the status
        this.renderStatus.updateResponse(onlineResource.url, 'Request cancelled by user.');

        //we are finished
        this._finishDownloadManagerResponse();
    },

    /**
     * Used for handling a successful response from a request's download manaager
     */
    _handleDownloadManagerSuccess : function(dm, actualFilterParams, data, debugInfo, onlineResource, icon) {
        //Parse our KML into a set of overlays and markers
        var parser = new KMLParser({kml : data.kml});
        parser.makeMarkers(icon, function(marker) {
            marker.renderer = me;
        });

        //Add our single points and overlays to the overlay manager (which will add them to the map)
        this.overlayManager.addMarkers(parser.markers);
        this.overlayManager.addOverlays(parser.overlays)

        //Store some debug info
        if (debugInfo) {
            this.renderDebuggerData.updateResponse(debugInfo.url, debugInfo.info);
        }

        //store the status
        this.renderStatus.updateResponse(onlineResource.url, (markers.length + overlays.length) + " record(s) retrieved.");

        //we are finished
        this._finishDownloadManagerResponse(parser.markers, parser.overlays);
    },

    /**
     * An implementation of the abstract base function. See comments in superclass
     * for more information.
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer filterer,
     *          function(portal.layer.renderer.Renderer this, portal.csw.OnlineResource[] resources, portal.layer.filterer.Filterer filterer, bool success) callback
     *
     * returns - void
     *
     * resources - an array of data sources which should be used to render data
     * filterer - A custom filter that can be applied to the specified data sources
     * callback - Will be called when the rendering process is completed and passed an instance of this renderer and the parameters used to call this function
     */
    displayData : function(resources, filterer, callback) {
        //start by removing any existing data
        this.removeData();

        var me = this;
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.WFS);
        var visibleMapBounds = this.getVisibleMapBounds();

        //this icon will be shared by all features with a point based geometry
        var icon = new GIcon(G_DEFAULT_ICON, this.iconCfg.url);
        icon.shadow = null;
        if (this.iconCfg.size.width && this.iconCfg.size.height) {
            icon.iconSize = new GSize(this.iconCfg.size.width, this.iconCfg.size.height);
        }
        if (this.iconCfg.anchor.x && this.iconCfg.anchor.y) {
            icon.iconAnchor = new GPoint(this.iconCfg.anchor.x, this.iconCfg.anchor.y);
            icon.infoWindowAnchor = new GPoint(this.iconCfg.anchor.x, this.iconCfg.anchor.y);
        }

        //alert any listeners that we are about to start rendering
        this.fireEvent('renderstarted', this, wfsResources, filterer);
        this.currentRequestCount = wfsResources.length; //this will be decremented as requests return

        //Each and every WFS resource will be queried with their own seperate download manager
        for (var i = 0; i < wfsResources.length; i++) {
            //Build our filter params object that will make a request
            var filterParams = filterer.getParameters();
            var onlineResource = wfsResources[i];

            //Our requesting is handled by a download manager
            var downloadManager = Ext.create('portal.layer.renderer.wfs.FeatureDownloadManager', {
                visibleMapBounds : visibleMapBounds,
                proxyFetchUrl : this.proxyUrl,
                proxyCountUrl : this.proxyCountUrl,
                filterParams : filterParams,
                listeners : {
                    success : Ext.bind(this._handleDownloadManagerSuccess, this, [onlineResource, icon], true),
                    error : Ext.bind(this._handleDownloadManagerError, this, [onlineResource], true),
                    cancelled : Ext.bind(this._handleDownloadManagerCancelled, this, [onlineResource], true)
                }
            });

            downloadManager.startDownload();
        }
    }

    /**
     * An abstract function for creating a legend that can describe the displayed data. If no
     * such thing exists for this renderer then null should be returned.
     *
     * function(portal.csw.OnlineResource[] resources,
     *          portal.layer.filterer.Filterer filterer)
     *
     * returns - portal.layer.legend.Legend or null
     *
     * resources - (same as displayData) an array of data sources which should be used to render data
     * filterer - (same as displayData) A custom filter that can be applied to the specified data sources
     */
    getLegend : function(resources, filterer) {
        return null; //no legend available for WFS unless we make our own...
    },

    /**
     * An abstract function that is called when this layer needs to be permanently removed from the map.
     * In response to this function all rendered information should be removed
     *
     * function()
     *
     * returns - void
     */
    removeData : function() {
        this.overlayManager.clearOverlays();
    }
});