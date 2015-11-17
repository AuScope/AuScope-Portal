/**
 * This is the window used to display the results from the CSW search.
 * Based on portal-core CSWSelectionWindow.js with Geoscience Australia customisation
 */
GASearchResultsWindow = Ext.extend(Ext.Window, {
    
    store : null,
    pageSize: 20,
    
    constructor : function(cfg) {      
        
        Ext.apply(cfg, {
            title: cfg.title,
            height: 500,
            width: 650,
            layout: 'fit',
            items: [{
                xtype:'tabpanel',
                itemId: 'gasearchresultspanel',
                layout: 'fit',
                items : cfg.resultpanels // GASearchResultsPanel
            }],


            buttonAlign : 'right',
            buttons : [{
                xtype : 'button',
                text : 'Back to Search',
                iconCls : 'magglass',
                scope : this,
                handler : function(button, e) {                    
                    this.destroy();
                    var cswFilterWindow = Ext.getCmp('cswFilterWindow');
                    if (cswFilterWindow) {
                        cswFilterWindow.show();
                    }
                 }
            }]
        });

        //Call parent constructor
        GASearchResultsWindow.superclass.constructor.call(this, cfg);

    },
    
    // overridden close method to obtain a reference to the search window and close it as well
    close: function() {      
        var filterWindow = Ext.getCmp('cswFilterWindow');
        if (filterWindow) {
            filterWindow.close();   
        }
        this.destroy();
    }

});

