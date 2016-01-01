/**
 * Geoscience Australia implementation of the core portal FilterPanelMenuFactory
 */
Ext.define('auscope.layer.GAFilterPanelMenuFactory', {
    extend : 'portal.widgets.FilterPanelMenuFactory',
 
    map : null,
    panel: null,
    recordPanel: null,
    
    // whether to add a reset form button on WMS forms. 
    // default to true because that is currently the AuScope portal default
    addResetFormActionForWMS : true,
    
    constructor : function(config) {
        this.map = config.map;
        this.recordPanel = config.recordPanel;
        this.callParent(arguments);
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
            layer.get('cswRecords')[0].get('noCache')==false) && layer.id != 'portal-reports'){
                
                var allOnlineResources = layer.getAllOnlineResources();
            
                var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
                var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
                var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

                // only provide reset option if there are resources other than just WMS resources
                // otherwise there will be no form fields to reset
                if (wfsResources.length > 0 || wcsResources.length > 0) {
                    menuItems.push(this._getResetFormAction());
                }
                    
                // only provide download option if there are WFS resources to download
                if (wfsResources.length > 0) {
                    menuItems.push(this._getDownloadAction(layer));    
                }
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
    
    _getResetFormAction : function(){
        var me = this;
        return new Ext.Action({
            text : 'Reset Form',
            iconCls : 'refresh',
            handler : function(e){
                // this is awkward but we need to get access to the form
                var filterForm = this.up('panel').up('panel').getLayout().owner.filterForm;
                filterForm.reset();
            }
        })
        
    },
    
    layerRemoveHandler : function(layer){
        this.fireEvent('removelayer', layer);
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
    
    
    _getlayerAnalytics : function(layer){ 
        var me = this;
        if( auscope.layer.analytic.AnalyticFormFactory.supportLayer(layer)){
            
            if(layer.get('sourceType')=='KnownLayer' && layer.get('source').get('active') && layer.get('filterer').parameters.featureType){            
                return new Ext.Action({
                    text : 'Graph',
                    iconCls : 'graph',                    
                    handler : function(){   
                        var win = auscope.layer.analytic.AnalyticFormFactory.getAnalyticForm(layer,me.map)                        
                        win.show();
                        me.on('removelayer',function(closeLayer){
                            if(closeLayer.get('id')==layer.get('id')){
                                win.close();
                            }                            
                        })                                               
                    }
                });
            }else{
                return new Ext.Action({
                    text : '<span data-qtip="Add layer to map and select \'Group of Interest\' to enable this function">' + 'Graph',
                    disabled : true,
                    iconCls : 'graph',                    
                    handler : function(){   
                        Ext.Msg.alert('Alert', 'Add layer to map first.');
                    }
                });
            }
        }else{
            return null;
        }
        
       
        
    }
    
});