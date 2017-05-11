/**
 * AuScope implementation of the core portal FormFactory
 */
Ext.define('auscope.layer.AuscopeFilterPanelMenuFactory', {
    extend : 'portal.widgets.FilterPanelMenuFactory',

    map : null,


    constructor : function(config) {
        this.map = config.map;
        this.callParent(arguments);
    },

    /**
     * Given an portal.layer.Layer, check if there is necessary to append additional style url params.
     *
     * returns sldConfig {
     * sldUrl:sldUrl,
     * isSld_body:isSld_body
     * }.
     *
     */



    appendAdditionalLegendParams : function(layer, filter, styleUrl) {
        var ccProperty;
        var isSld_body = true;
        var sldUrl;
        if (layer.id === "pressuredb-borehole") {
            // LJ: AUS-2619 Additional params for pressureDB legend.
            ccProperty = filter.getParameter('ccProperty') || '';
            var ccLevels = filter.getParameter('ccLevels') || 9;
            sldUrl = portal.util.URL.base + styleUrl
                    + "?ccProperty=" + ccProperty
                    + "&ccLevels=" + ccLevels;
            isSld_body = false;
        } else if (layer.id === "mineral-tenements") {
            ccProperty = filter.getParameter('ccProperty');
            sldUrl = "getMineralTenementLegendStyle.do?ccProperty=" + ccProperty;
            isSld_body = true;
        } else {
            sldUrl = styleUrl;
            isSld_body = true;
        }
        return { sldUrl : sldUrl,isSld_body : isSld_body };
    },
    /**
     * Given an portal.layer.Layer, check if there are any additional action to display
     *
     * returns an array of menu action items.
     *
     */
    appendAdditionalActions : function(menuItems,layer,group) {
        //VT:Should have a download action except for Insar data.
        if((layer.get('cswRecords').length > 0 &&
                layer.get('cswRecords')[0].get('noCache')==false) && layer.id != 'portal-reports' ){
                 menuItems.push(this._getDownloadAction(layer));
        }

         //VT:  link layer to VGL if contain under the Analytic grouping
        if(group && group.indexOf('Analytic') >= 0){
            menuItems.push(this._getAnalyticLink(layer));
        }
        //VT: check for any layer specific analytic function
        var analytics = this._getlayerAnalytics(layer)
        if(analytics){
            menuItems.push(analytics);
        }
    },

    layerRemoveHandler : function(layer){
        this.fireEvent('removeLayer', layer);
    },
         
    layerAddHandler : function(layer){
        this.fireEvent('addLayer', layer);
    },
    
    _getDownloadAction : function(layer){
        var me = this;
        var downloadLayerAction = new Ext.Action({
            text : 'Download Layer',
            iconCls : 'download',
            handler : function(){
                var downloader = layer.get('downloader');
                var renderer = layer.get('renderer');
                if (downloader) {// && renderer.getHasData() -> VT: It is too confusing when the download will be active. We will treat it as always active to
                                 // make it easier for the user.
                    //We need a copy of the current filter object (in case the user
                    //has filled out filter options but NOT hit apply filter) and
                    //the original filter objects
                    var renderedFilterer = layer.get('filterer').clone();
                    var currentFilterer = Ext.create('portal.layer.filterer.Filterer', {});
                    var currentFilterForm = layer.get('filterForm');

                    currentFilterer.setSpatialParam(me.map.getVisibleMapBounds(), true);
                    currentFilterForm.writeToFilterer(currentFilterer);

                    //Finally pass off the download handling to the appropriate downloader (if it exists)
                    var onlineResources = layer.getAllOnlineResources();
                    downloader.downloadData(layer, onlineResources, renderedFilterer, currentFilterer);

                }
            }
        });

        return downloadLayerAction
    },



    _getAnalyticLink : function(layer){
        var me=this;
        return new Ext.Action({
            text : 'Vgl Analytics',
            iconCls : 'link',
            handler : function(){

                var mss = Ext.create('portal.util.permalink.MapStateSerializer');
                var layerStore = Ext.create('portal.layer.LayerStore', {});
                layerStore.insert(0,layer);

                mss.addMapState(me.map);
                mss.addLayers(layerStore);
                mss.serialize(function(state, version) {
                    var urlParams = Ext.Object.fromQueryString(location.search.substring(1));
                    urlParams.s = state;
                    if (version) {
                        urlParams.v = version;
                    }
                    //VT: Hardcoding this for now, don't foresee any changes anytime soon.
                    var linkedUrl = "http://vgl.auscope.org/VGL-Portal/gmap.html";

                    var params = Ext.Object.toQueryString(urlParams);

                    //*HACK:* sssssshhhh dont tell anyone we don't care about escaping....
                    linkedUrl = Ext.urlAppend(linkedUrl, decodeURIComponent(params));
                    window.open(linkedUrl);
                });

            }
        });

    },

    _enableButton : function(layer){

    },
    _getlayerAnalytics : function(layer){
        var me = this;
        if( auscope.layer.analytic.AnalyticFormFactory.supportLayer(layer)){

            if(layer.get('sourceType')=='KnownLayer' && layer.id == 'capdf-hydrogeochem') {
                //&& layer.get('source').get('active') && layer.get('filterer').parameters.featureType){
                return new Ext.Action({
                    text : '<span data-qtip="Add layer to map and select \'Group of Interest\' to enable this function">' + 'Graph',
                    iconCls : 'graph',
                    disabled : true,
                    myWin : null,
                    selfme : null,
                    initComponent: function () {
                        myWin = null;
                        selfme = null;
                        me.on('removeLayer',function(closeLayer){
                            if(closeLayer.get('id')==layer.get('id')){
                                if ( myWin !== null) {
                                    myWin.close();
                                }
                                if ( selfme !== null) {
                                    selfme.setDisabled(true);
                                }
                            }
                        });        
                        me.on('addLayer',function(closeLayer){
                            if(closeLayer.get('id')==layer.get('id') && layer.get('source').get('active') && layer.get('filterer').parameters.featureType) {
                                if ( selfme !== null) {
                                    selfme.setDisabled(false);
                                }
                            }
                        });
                        this.callParent();
                        selfme = this;
                    },                    
                    handler : function(){
                        if ( myWin == null && layer.get('source').get('active') && layer.get('filterer').parameters.featureType) {
                            var win = auscope.layer.analytic.AnalyticFormFactory.getAnalyticForm(layer,me.map);
                            myWin = win;
                            win.show();
                        }
                    }
                });
            } else if (layer.id == 'sf0-borehole-nvcl') {
                return new Ext.Action({
                    iconCls : 'analytics-button',
                    text: 'Analytical Jobs',
                    handler: function() {
                        var win = auscope.layer.analytic.AnalyticFormFactory.getAnalyticForm(layer,me.map)
                        win.show();
                        me.on('removelayer',function(closeLayer){
                            if(closeLayer.get('id')==layer.get('id')){
                                win.close();
                            }
                        });
                    }
                });
            }
        }else{
            return null;
        }


    }

});