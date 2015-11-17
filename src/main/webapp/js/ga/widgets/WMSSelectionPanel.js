/**
 * A Ext.Panel specialisation for allowing the user to browse
 * through the metadata within a single CSWRecord
 */
Ext.define('ga.widgets.WMSSelectionPanel', {
    extend : 'Ext.grid.Panel',
    alias : 'widget.wmsselectionpanel',

    cswRecord : null,

    extraItems : null,

    /**
     * Constructor for this class, accepts all configuration options that can be
     * specified for a Ext.Panel as well as the following values
     * {
     *  cswRecord : A single CSWRecord object
     * }
     */
    constructor : function(cfg) {
        var me = this;
        
        
        this.cswRecord = cfg.cswRecord;

        var source = me.cswRecord.get('recordInfoUrl');

        //Build our configuration object
        Ext.apply(cfg, {
            layout : 'grid',
            items : [{
                xtype : 'fieldset',
                items : [{
                    xtype : 'displayfield',
                    fieldLabel : 'Title',
                    anchor : '100%',
                    value : me.cswRecord.get('name')
                },{
                    xtype : 'displayfield',
                    fieldLabel : 'URL endpoint',
                    anchor : '100%',
                    value : me.cswRecord.get('recordInfoUrl')
                }]
                .concat({
                    fieldLabel : 'Resources',
                    xtype : 'onlineresourceselectionpanel',
                    cswRecords : me.cswRecord
                })
            }]
        });

        this.callParent(arguments);
    }
});