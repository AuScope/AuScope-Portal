/**
 * An implementation of portal.layer.legend.Legend for providing
 * simple GUI details on an IRIS layer added to the map
 */
Ext.define('auscope.layer.legend.iris.IRISLegend', {
    extend: 'portal.layer.legend.Legend',

    iconUrl : '',

    /**
     * @param cfg an object in the form {
     *  iconUrl : String The URL of the marker icon for this layer
     * }
     */
    constructor : function(cfg) {
        this.iconUrl = cfg.iconUrl;
        this.callParent(arguments);
    },

    /**
     * Implemented function, see parent class
     */
    getLegendComponent : function(resources, filterer,response, isSld_body, callback) {
        var table="";
        if (resources.length>=1) {
            table = '<table><tr><td><img height="16" width="16" src="' + this.iconUrl +'"></td><td>FDSN Network Code \'' + resources[0].get('name') + '\'</td></tr></table>';
        }
        var form = Ext.create('Ext.form.Panel',{
            title : "IRIS Feature",
            layout: 'fit',
            width: 250,
            html :  table
            });
        
        callback(this, resources, filterer, true, form); //this layer cannot generate a GUI popup
    },

    /**
     * Implemented function, see parent class
     */
    getLegendIconHtml : function(resources, filterer) {
        if (this.iconUrl && this.iconUrl.length > 0) {
            return Ext.DomHelper.markup({
                tag : 'div',
                style : 'text-align:center;',
                children : [{
                    tag : 'img',
                    width : 16,
                    height : 16,
                    align: 'CENTER',
                    src: this.iconUrl
                }]
            });
        } else {
            return '';
        }
    }
});