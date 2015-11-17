/**
 * A Ext.Window specialisation for allowing the user to browse
 * through the metadata within a single CSWRecord in a self contained window
 */
Ext.define('ga.widgets.WMSSelectionWindow', {
    extend : 'Ext.window.Window',

    cswRecord : null,
    wmsSelectionPanel : null,
    Panel : null,
    
    /**
     * Constructor for this class, accepts all configuration options that can be
     * specified for a Ext.Window as well as the following values
     * {
     *  cswRecord : A single CSWRecord object
     * }
     */
    constructor : function(cfg) {

        var me = this;
        
        me.cswRecord = cfg.cswRecord;

        me.wmsSelectionPanel = new ga.widgets.WMSSelectionPanel({
            cswRecord : this.cswRecord
        });
        
        var controlButtons = [{
            xtype: 'button',
            text:'Add selected layers to map',
            handler:function(button){
                me.wmsSelectionPanel.resetForm();                        
            }
        }];
        
        //Build our configuration object
        Ext.apply(cfg, {
            layout : 'fit',
            autoScroll : true,
            autoHeight: true,
            cellWrap : true,
            items : [{
                xtype : 'wmsselectionpanel',
                cswRecord : me.cswRecord,
                bodyStyle : {
                    'background-color' : '#ffffff'
                },
                hideBorders : true
            }],
            buttons: controlButtons             
        }, {
            width : 800,
            //height : 450,
            title : me.cswRecord.get('name')
        });

        //Call parent constructor
        this.superclass.constructor.call(me, cfg);
    }
});