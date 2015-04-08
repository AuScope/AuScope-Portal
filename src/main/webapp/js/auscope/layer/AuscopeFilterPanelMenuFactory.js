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
     * Given an portal.layer.Layer, check if there are any additional action to display
     * 
     * returns an array of menu action items.
     *
     */
    appendAdditionalActions : function(menuItems,layer,group) {
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
            return new Ext.Action({
                text : 'Graph',
                iconCls : 'graph',
                handler : function(){   
                    var win = auscope.layer.analytic.AnalyticFormFactory.getAnalyticForm(layer,me.map)
                    win.show();
                }
            });
        }else{
            return null;
        }
        
       
        
    }
    
});