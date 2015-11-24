/**
 * This is the GA portal footer.
 * It contains the logos of the state and federal agencies that contributed to the portal. 
 */
Ext.define('ga.widgets.GAHeader', {
    extend : 'Ext.panel.Panel',
    alias: 'widget.gaheader',

    map: null,
    layerStore: null,
    registryStore: null,
    
    constructor : function(config){   
        
        var me = this;
        me.map = config.map;
        me.layerStore = config.layerStore;  
        me.registryStore = config.registryStore;    
        
        //Create our advanced search control handler
        var advancedSearchLinkHandler = function() {
            
            var cswFilterWindow = Ext.getCmp('cswFilterWindow');
            if (!cswFilterWindow) {
                cswFilterWindow = new portal.widgets.window.CSWFilterWindow({
                    name : 'CSW Filter',
                    id : 'cswFilterWindow',
                    cswFilterFormPanel:  new ga.widgets.GAAdvancedSearchPanel({
                        name : 'Filter Form',
                        map: me.map
                    }),
                    listeners : {
                        filterselectcomplete : function(filteredResultPanels) {
                            var cswSelectionWindow = new CSWSelectionWindow({
                                title : 'CSW Record Selection',
                                id: 'cswSelectionWindow',
                                resultpanels : filteredResultPanels,
                                listeners : {
                                    selectioncomplete : function(csws){  
                                        var tabpanel =  Ext.getCmp('auscope-tabs-panel');
                                        var customPanel = me.ownerCt.getComponent('org-auscope-custom-record-panel');
                                        tabpanel.setActiveTab(customPanel);
                                        if(!(csws instanceof Array)){
                                            csws = [csws];
                                        }
                                        for(var i=0; i < csws.length; i++){
                                            csws[i].set('customlayer',true);
                                            customPanel.getStore().insert(0,csws[i]);
                                        }
                                        
                                    }
                                }
                            });
                            cswSelectionWindow.show();
                        }
                    }
                });
            }
            
            var basicSearchInput = Ext.get('basic-search-input');
            if (basicSearchInput) {
                //basicSearchInput.dom.disabled = 'true';
                basicSearchInput.dom.value = '';
            }           
            
            var cswSelectionWindow = Ext.getCmp('cswSelectionWindow');
            if (cswSelectionWindow) {
                cswSelectionWindow.destroy();
            }           
            
            cswFilterWindow.show();
        };
        
    
        //Create our 'Basic Search' handler
        var basicSearchButtonHandler = function() {
    
            var basicSearchInput = Ext.get('basic-search-input');
            
            // hmmm... validate empty input or just ignore it?
            if (!basicSearchInput) {
                return false;
            }  
            
            if (basicSearchInput.dom.value === '') {
                Ext.Msg.alert('Search Term Required', 'Please enter a search term in the provided input field.');
                return false;
            }
                        
            var filteredResultPanels=[];
    
            for(arrayIndex in me.registryStore.data.items){
                filteredResultPanels.push(getTabPanels(me.registryStore.data.items[arrayIndex].data, basicSearchInput.dom.value));                
            }
            
            var cswFilterWindow = Ext.getCmp('cswFilterWindow');
            if (cswFilterWindow) {
                cswFilterWindow.destroy();
            }
            var cswSelectionWindow = Ext.getCmp('cswSelectionWindow');
            if (!cswSelectionWindow) {
                cswSelectionWindow = new CSWSelectionWindow({
                    title : 'CSW Record Selection',
                    id: 'cswSelectionWindow',
                    resultpanels : filteredResultPanels,
                    showControlButtons : false,
                    listeners : {
                        selectioncomplete : function(csws){  
                            var tabpanel =  Ext.getCmp('auscope-tabs-panel');
                            var customPanel = me.ownerCt.getComponent('org-auscope-custom-record-panel');
                            tabpanel.setActiveTab(customPanel);
                            if(!(csws instanceof Array)){
                                csws = [csws];
                            }
                            for(var i=0; i < csws.length; i++){
                                csws[i].set('customlayer',true);
                                customPanel.getStore().insert(0,csws[i]);
                            }
                            
                        }
                    }
                });
            }
            cswSelectionWindow.show();                  
        };
    
        /**
         * Return configuration for the tabpanels in the basic search results
         *
         * params - the parameter used to filter results for each tab panel
         * cswServiceId - The id of the csw registry.
         */
        var getTabPanels = function(cswService,basicSearchValue) {
            //Convert our keys/values into a form the controller can read
            var keys = [];
            var values = [];
            var customRegistries=[];
    
            keys.push("basicSearchTerm");
            values.push(basicSearchValue);
            
            keys.push('cswServiceId');
            values.push(cswService.id);
            
            //Create our CSWRecord store (holds all CSWRecords not mapped by known layers)
            var filterCSWStore = Ext.create('Ext.data.Store', {
                model : 'portal.csw.CSWRecord',
                pageSize: 35,
                autoLoad: false,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                proxy : {
                    type : 'ajax',
                    url : 'getFilteredCSWRecords.do',
                    reader : {
                        type : 'json',
                        rootProperty : 'data',
                        successProperty: 'success',
                        totalProperty: 'totalResults'
                    },
                    extraParams: {
                        key : keys,
                        value : values
                    }
    
                }
    
            });
            
            tabTitle = cswService.title || 'Error retrieving title';
    
            var result={
                    title : tabTitle,
                    xtype: 'cswrecordpagingpanel',
                    layout : 'fit',
                    store : filterCSWStore
                };
    
            return result;
        };
        
        //Create our 'Clear Search' handler
        var clearSearchLinkHandler = function() {
            var cswFilterWindow = Ext.getCmp('cswFilterWindow');
            if (cswFilterWindow) {
                cswFilterWindow.destroy();
            }
            var cswSelectionWindow = Ext.getCmp('cswSelectionWindow');
            if (cswSelectionWindow) {
                cswSelectionWindow.destroy();
            }
            
            var basicSearchInput = Ext.get('basic-search-input');
            if (basicSearchInput) {
                basicSearchInput.dom.value = '';
            }
        };
        
        //Create our 'Simple Search' handler for the Enter key. 
        var simpleSearchSubmitHandler = function(e) {
            if (e.getKey() == e.ENTER) {
                basicSearchButtonHandler();
            }
        };     
            
        // north panel contains the Contact Us and Skip to content links
        var northPanel = {
            height: '40px',
            items: [{
                xtype : 'box',
                id: 'header-controls',
                autoEl : {
                    tag : 'div',
                    html: 
                         '<ul>\
                              <li><a href="mailto:geoscience-portal-aws@ga.gov.au">Contact Us</a></li>\
                              <li><a href="#auscope-tabs-panel">Skip to Content</a></li>\
                          </ul> '   
                }       
            }]    
                               
        };

        // center panel contains the Logo and search tools
        var centerPanel = {   
            height: '70px',    
            items:[{
                xtype : 'box',
                id: 'ausgin-logo',
                autoEl : {
                    tag : 'span'
                }  
            },{
                /* TODO consider redoing this in ExtJS */
                xtype : 'box',
                id: 'search-controls',
                
                autoEl : {
                    tag : 'span',
                    html: '<label for="basic-search-input">Search for data and publications</label>\
                            <input type="text" id="basic-search-input" name="searchBox" maxlength="50"/>\
                            <span id="basic-search-link"><a href="javascript:void(0)"></a></span>\
                            <a id="advanced-search-link" href="javascript:void(0)">Advanced Search</a>\
                            <a id="clear-search-link" href="javascript:void(0)">Clear Search</a>' 
                }  
            }]
        };
        
        // south panel contains the menu bar
        var southPanel = {
            xtype: 'gamenubar',
            map: me.map,
            layerStore: me.layerStore
        };        
        
        Ext.apply(config, {
            items: [{
                xtype : 'panel',
                height: '140px',
                layout: 'vbox',
                id: 'header-container',
                items : [northPanel, centerPanel, southPanel],
            }],
        
            listeners: {
                render: function (view) {
                    Ext.get('basic-search-link').on('click', basicSearchButtonHandler);
                    Ext.get('basic-search-input').on('keyup', simpleSearchSubmitHandler);   
                    Ext.get('advanced-search-link').on('click', advancedSearchLinkHandler);
                    Ext.get('clear-search-link').on('click', clearSearchLinkHandler);
                }
            }
        });
    
        this.callParent(arguments);
    
    }

});