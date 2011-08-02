Ext.namespace("CSWThemeFilter");


/**
 * The 'abstract' base component for all CSWThemeFilterForm components to extend from
 */
CSWThemeFilter.BaseComponent = Ext.extend(Ext.form.FieldSet, {

    /**
     * Constructor for this class, accepts all configuration options that can
     * be specified for a Ext.form.FieldSet
     */
    constructor : function(cfg) {
        Ext.apply(cfg, {
            autoDestroy : true, //Ensure that as components get removed they are also destroyed
            isBaseComponent : true //how we identify base components
        }, {

        });
        CSWThemeFilter.BaseComponent.superclass.constructor.call(this, cfg);
    },

    /**
     * Gets the filterValues configured by this component as a plain
     * old javascript object/dictionary
     *
     * Should be overriden by subclasses.
     */
    getFilterValues : function() {
        return {};
    },

    /**
     * Gets whether this component supports the specified theme. Returns a boolean value
     *
     * If true is returned this component will be displayed whilst the theme is selected.
     * If false is returned this component will be hidden whilst the them is selected.
     *
     * Should be overriden by subclasses.
     */
    supportsTheme : function(urn) {
        if (!urn) {
            return false;
        }

        return true;
    }


});