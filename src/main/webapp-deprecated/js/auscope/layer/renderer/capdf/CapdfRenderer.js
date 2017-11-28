/**
 * An implementation of a portal.layer.renderer for rendering WFS with WMS Features
 * as transformed by the AuScope portal backend.
 */
Ext.define('portal.layer.renderer.capdf.CapdfRenderer', {
    extend: 'portal.layer.renderer.wfs.FeatureWithMapRenderer',

    constructor: function(config) {
      
        // Call our superclass constructor to complete construction process.
        this.callParent(arguments);
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
        this.abortDisplay();
        this.removeData();
        this.aborted = false;

        var me = this;
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.WFS);
        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.WMS);

        var urls = [];
        var wmsRendered=[];
     
        var home=portal.util.URL.base;
        if(home.indexOf("localhost") != -1){
            home=home.replace("localhost",LOCALHOST);
        }
        for (var i = 0; i < wmsResources.length; i++) {
            
            var wmsUrl = wmsResources[i].get('url');
            var wmsLayer = (filterer.parameters.featureType?filterer.parameters.featureType: wmsResources[i].get('name'));
            var wmsOpacity = filterer.getParameter('opacity');
           

            if(filterer.getParameters().serviceFilter &&
                    (this._getDomain(wmsResources[i].get('url'))!= this._getDomain(filterer.getParameters().serviceFilter[0]))){
                continue;
            }

            var proxyUrl = this.parentLayer.get('source').get('proxyStyleUrl');
            var filterParams = (Ext.Object.toQueryString(filterer.getMercatorCompatibleParameters()));

            var styleUrl = Ext.urlAppend(proxyUrl,filterParams);
           
            wmsRendered[this._getDomain(wmsUrl)]=1;

            Ext.Ajax.request({
                url: styleUrl,
                timeout : 180000,
                scope : this,
                success: Ext.bind(this._getRenderLayer,this,[wmsResources[i], wmsUrl, wmsLayer, wmsOpacity,wfsResources, filterer],true),
                failure: function(response, opts) {                    
                     if (this.currentRequestCount <= 0) {
                         this.fireEvent('renderfinished', this);
                     }
                    console.log('server-side failure with status code ' + response.status);
                }
            });

        }

        this.hasData = true;
        //this array will contain a list of wfs url that are process by its wms component.
        var wmsUrls = [];

        for (var i = 0; i < wfsResources.length; i++) {
            var wfsUrl = wfsResources[i].get('url');
            var wfsLayer = wfsResources[i].get('name');
            urls.push(wfsUrl);
            // VT: Instead of rendering the WMS url in the status, it is neater to display the wfs url
            if(wmsRendered[this._getDomain(wfsUrl)]){
                wmsUrls.push(wfsUrl);
                this.renderStatus.updateResponse(wfsUrl, "Loading WMS");
            }
        }
        this.renderStatus.initialiseResponses(urls, 'Loading...');

        this.fireEvent('renderstarted', this, wfsResources, filterer);

        if (this.currentRequestCount === 0) {
            this.fireEvent('renderfinished', this);
        }

    }


   
});
