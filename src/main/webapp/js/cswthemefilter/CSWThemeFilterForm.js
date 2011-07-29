/**
 * A Ext.form.FormPanel specialisation for allowing the user to generate
 * a filter query for an underlying CSW based on a number of preconfigured themes.
 *
 * The filter is generated dynamically from a series of plugin components
 */
CSWThemeFilterForm = Ext.extend(Ext.form.FormPanel, {

    availableComponents : [],
    themeStore : null,

    /**
     * Constructor for this class, accepts all configuration options that can be
     * specified for a Ext.form.FormPanel
     */
    constructor : function(cfg) {
        var cswThemeFilterForm = this;  //To maintain our scope in callbacks

        //Load our list of themes
        this.themeStore = new Ext.data.Store({
            proxy    : new Ext.data.HttpProxy({url: 'getAllCSWThemes.do'}),
            reader : new Ext.data.JsonReader({
                root            : 'data',
                id              : 'urn',
                successProperty : 'success',
                messageProperty : 'msg',
                fields          : [
                    'urn',
                    'label',
                    'indent'
                ]
            })
        });
        this.themeStore.load();

        //Load all components
        this.availableComponents.push(CSWThemeFilter.Keywords);

        //Build our configuration
        Ext.apply(cfg, {
            items : [{
                xtype : 'fieldset',
                title : 'CSW Theme Filter',
                hideBorders : true,
                items : [{
                    xtype : 'combo',
                    fieldLabel : 'Theme',
                    name : 'theme',
                    store : this.themeStore,
                    forceSelection : true,
                    triggerAction : 'all',
                    typeAhead : true,
                    typeAheadDelay : 500,
                    displayField : 'label',
                    valueField : 'urn',
                    //This template allows us to treat 'indent' levels differently
                    tpl :  new Ext.XTemplate(
                            '<tpl for=".">',
                                '<div class="x-combo-list-item">',
                                    '<tpl if="indent==0"><b>{label}</b></tpl>',
                                    '<tpl if="indent==1">&bull; {label}</tpl>',
                                '</div>',
                            '</tpl>'),
                    listeners : {
                        // On selection update our list of active base components
                        select : function(combo, record, index) {
                            cswThemeFilterForm.clearBaseComponents();
                            if (record) {
                                var urn = record.get('urn');
                                for (var i = 0; i < cswThemeFilterForm.availableComponents.length; i++) {
                                    //Only add components that support the newly selected theme
                                    var cmp = new cswThemeFilterForm.availableComponents[i]();
                                    if (cmp.supportsTheme(urn)) {
                                        this.ownerCt.add(cmp);
                                    } else {
                                        cmp.destroy();
                                    }
                                }
                            }
                            cswThemeFilterForm.doLayout();
                        }
                    }
                }]
            }]
        });

        //construct our instance
        CSWThemeFilter.BaseComponent.superclass.constructor.call(this, cfg);
    },

    /**
     * Deletes all BaseComponents (excluding the Theme Combo) from a
     * CSWThemeFilterForm
     */
    clearBaseComponents : function() {
        var parentFieldSet = this.findByType('fieldset')[0];
        var components = parentFieldSet.items.filterBy(function(item) {
            return item.isBaseComponent;
        });

        for (var i = 0; i < components.length; i++) {
            var cmp = components.get(i);
            var parent = cmp.ownerCt;
            var obj = parent.remove(cmp);
        }
    }
});