/**
 * This is the panel for the advanced search dialog.
 */
Ext.define('auscope.widgets.GAAdvancedSearchPanel', {
    extend : 'Ext.form.Panel',
    alias: 'widget.gaadvancedsearchpanel',
    
    keywordStore : null,
    yearStore : null,
    keywordIDCounter : 0,
    spacerHeight : 22,
    miniMap : null,
    boxLayer : null,

    /* in order to apply a different filter from the Portal-Core default, we specify the name of the portal */
    portalName : 'geoscience',

    constructor : function(cfg){   
        
        this.keywordStore = new Ext.data.Store({
            autoload: true,
            fields: ['keyword', 'count'],
            proxy : {
                type : 'ajax',
                url : 'getFilteredCSWKeywords.do', 
                extraParams : {
                    cswServiceIds : []
                 },
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            }

        });

        var years = [];

        y = 1900
        while (y <= new Date().getFullYear()){
            years.push([y]);
            y++;
        }
        
        this.yearStore = new Ext.data.SimpleStore
        ({
            fields : ['years'],
            data : years
        });
        
        
        Ext.apply(cfg, {
            xtype : 'form',
            id : 'personalpanelcswfilterform',
            width : 500,
            autoScroll :true,
            border : false,
            height : 520,
            items : [
            {
                 xtype:'tabpanel',
                 layout: 'fit',
                 items : [
                     this.dataProvidersTab(),
                     this.moreSearchFiltersTab()                 
                 ]
            }]
        });

        this.callParent(arguments);
    },

    // tab where the user can select which registries to search on
    dataProvidersTab : function(){
        var me = this;
        var registriesTab = {
                title : '1. Choose Data Provider(s)',
                xtype : 'panel',
                type: 'vbox',
                items:[{
                    xtype: 'checkboxgroup',
                    name : 'cswServiceId',
                    id : 'registryTabCheckboxGroup',
                    allowBlank : 'false',
                    fieldLabel: 'Registries',
                    // Arrange checkboxes into two columns, distributed vertically
                    columns: 1,
                    vertical: true,
                    listeners : {
                        change : function(scope,newValue, oldValue, eOpts ){
                            me.keywordStore.getProxy().extraParams = {
                                cswServiceIds : scope.getValue().cswServiceId
                            };
                        }
                    }
                }]
        };

        var checkBoxItems = [];

        var cswServiceItemStore = new Ext.data.Store({
            model   : 'portal.widgets.model.CSWServices',
            proxy : {
                type : 'ajax',
                url : 'getCSWServices.do',
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            },
            listeners : {
                load  :  function(store, records, successful, eopts){
                    for (var i = 0; i < records.length; i++) {
                        var cswServiceItemRec = records[i];
                        checkBoxItems.push({
                            boxLabel : cswServiceItemRec.get('title'),
                            name : 'cswServiceId',
                            inputValue: cswServiceItemRec.get('id'),
                            checked : cswServiceItemRec.get('selectedByDefault')
                        });
                    }
                    var registry=Ext.getCmp('registryTabCheckboxGroup');
                    registry.add(checkBoxItems);

                    me.keywordStore.getProxy().extraParams = {
                        cswServiceIds : registry.getValue().cswServiceId
                    };
                }
            }

        });
        cswServiceItemStore.load();

        return registriesTab;
    },                                                           
    
    
    moreSearchFiltersTab : function() {
        var generalTab = {
                title : '2. Add More Search Filters',
                layout : 'anchor',
                items : [{
                    items : [         
                    {                        
                        xtype : 'fieldset',
                        title:'Metadata',
                        flex : 1,
                        items : [{
                            xtype : 'textfield',
                            name : 'titleOrAbstract',
                            fieldLabel : 'Title/Abstract'
                        },{
                            xtype : 'tagfield',
                            fieldLabel : 'Keyword(s)',
                            filterPicklist : true,
                            name : 'keywords',
                            queryMode : 'remote',
                            displayField:'keyword',
                            valueField: 'keyword',
                            store : this.keywordStore,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                    '<div class="x-boundlist-item">{keyword} - <b>({count})</b></div>',
                                '</tpl>'
                            )
                        },
                        {
                            xtype : 'textfield',
                            name : 'authorSurname',
                            fieldLabel : 'Author surname'
                        }
                        ]                   
                    }
                    ]
                }
              ]
        };

        return generalTab;
    }


});