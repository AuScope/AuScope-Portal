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
     * Given an portal.layer.Layer, work out whether there is an appropriate portal.layer.filterer.BaseFilterForm to show
     *
     * Returns a response in the form
     * {
     *    form : Ext.FormPanel - the formpanel to be displayed when this layer is selected (can be EmptyFilterForm)
     *    supportsFiltering : boolean - whether this formpanel supports the usage of the filter button
     *    layer : portal.layer.Layer that was used to generate this object
     * }
     *
     */
    appendAdditionalActions : function(menuItems,layer,group) {
                               
        if(group && group.indexOf('Analytic') >= 0){
            menuItems.push(this._getAnalyticLink(layer));
        }
        
        if(layer.id='capdf-hydrogeochem'){
            menuItems.push(this._getlayerGraphing(layer));
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
    
    
    _getlayerGraphing : function(layer,map){    
        
        return new Ext.Action({
            text : 'Graph',
            iconCls : 'graph',
            handler : function(){                                                
                
            }
        });
        
    }
    
});