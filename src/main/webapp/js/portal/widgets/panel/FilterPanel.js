/**
 * A panel for displaying filter forms for a given portal.layer.Layer
 *
 *
 */
Ext.define('portal.widgets.panel.FilterPanel', {
    extend: 'Ext.Panel',

    /**
     * The Panel to be shown when we have no matching filter form
     */
    _emptyCard : null,
    /**
     * an instance of portal.layer.filterer.FormFactory
     */
    _formFactory : null,
    /**
     * For caching responses from the form factory
     */
    _formCache : {},

    _filterButton : null,

    /**
     * Accepts all parameters for a normal Ext.Panel instance
     */
    constructor : function(config) {
        this._emptyCard = Ext.create('Ext.Panel', {
            id: Ext.id(),
            html: '<p class="centeredlabel"> Filter options will be shown here for special services.</p>'
        });
        this._filterButton = Ext.create('Ext.button.Button', {
            text :'Apply Filter >>',
            disabled : true,
            handler : Ext.bind(this._onApplyFilter, this)

        });



        this._formFactory = Ext.create('portal.layer.filterer.FormFactory', {});
        Ext.apply(config, {
            layout : 'card',
            buttonAlign : 'right',
            items : [this._emptyCard],
            bbar: [this._filterButton]
        });

        this.callParent(arguments);
    },

    /**
     * Gets the filter form object for layer (checking an internal cache first or using the FormFactory second).
     */
    _getFilterForm : function(layer) {
        var id = layer.get('id');

        //Use cache wherever possible
        if (this._formCache[id]) {
            return this._formCache[id];
        }

        var newFilterObj = this._formFactory.getFilterForm(layer);
        this._formCache[id] = newFilterObj;
        return newFilterObj;
    },

    /**
     * Internal handler for when the user clicks 'Apply Filter'.
     *
     * Simply updates the appropriate layer filterer. It's the responsbility
     * of renderers/layers to listen for filterer updates.
     */
    _onApplyFilter : function() {
        var baseFilterForm = this.getLayout().getActiveItem();
        if (baseFilterForm.id === this._emptyCard.id) {
            return;
        }

        var filterer = baseFilterForm.layer.get('filterer');
        baseFilterForm.writeToFilterer(filterer);
    },

    /**
     * Given an instance of portal.layer.Layer - update the displayed panel
     * with an appropriate filter form (as defined by portal.layer.filterer.FormFactory).
     */
    showFilterForLayer : function(layer) {
        var layout = this.getLayout();
        var responseObj = this._getFilterForm(layer);

        //Load the form (by either switching to it or adding it)
        if (responseObj.form) {
            if (!layout.setActiveItem(responseObj.form)) {
                //Now this will return false when activating the current card
                //or activating a form that DNE. We can eliminate the first
                //problem with a simple ID check
                if (layout.getActiveItem().id !== responseObj.form.id) {
                    //So now we can be sure the setting failed because it's the first
                    //time this form has been added to this panel
                    this.add(responseObj.form);
                    layout.setActiveItem(responseObj.form);
                }
            }
        } else {
            layout.setActiveItem(this._emptyCard);
        }

        //Activate the filter button (if appropriate)
        this._filterButton.setDisabled(!responseObj.supportsFiltering);
    },

    /**
     * Returns true if the currently selected filter form has it's filtering support disabled.
     *
     * This is commonly the case with the emptyCard and some specific filter windows which
     * interact with their filter objects in a different way
     */
    isFilteringDisabled : function() {
        return this._filterButton.disabled;
    },

    /**
     * Returns the instance of portal.layer.filterer.BaseFilterForm that
     * is being used as a filter form for a particular layer.
     *
     * If no such form exists then null will be returned
     *
     * @param layer An instance of portal.layer.Layer
     */
    getFilterFormForLayer : function(layer) {
        return this._getFilterForm(layer).form;
    }
});