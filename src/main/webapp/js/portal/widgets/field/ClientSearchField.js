/**
 * A search field that performs local filtering on a store
 * instead of proxying external requests
 */
Ext.define('portal.widgets.field.ClientSearchField', {
    extend : 'Ext.ux.form.SearchField',
    alias : 'widget.clientsearchfield',

    initComponent : function() {
        this.callParent(arguments);

        this.on('afterrender', function(cmp) {
            cmp.doComponentLayout();
        });
    },

    /**
     * Disables the text field, leaves any trigger buttons enabled
     */
    _setTextFieldDisabled : function(disabled) {
        var inputFieldEl = Ext.get(this.getInputId());
        inputFieldEl.dom.disabled = disabled;

        //Manual styling because we cannot Ext.Element.mask an input field (it accepts
        //no child nodes)
        if (disabled) {
            inputFieldEl.setStyle('background', '#E5E5E5');
            inputFieldEl.setStyle('color', '#666666');
        } else {
            inputFieldEl.setStyle('background', '#FFFFFF');
            inputFieldEl.setStyle('color', '#000000');
        }
    },

    onTrigger1Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            val;

        if (this.hasSearch) {
            this.setValue('');

            this.store.clearFilter(false);

            this.hasSearch = false;
            this.triggerEl.item(0).setDisplayed('none');
            this.triggerEl.item(1).setDisplayed('block');

            this._setTextFieldDisabled(false);

            this.doComponentLayout();
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }

        this.store.filter(this.fieldName, v, true, false);
        this.hasSearch = true;
        this.triggerEl.item(0).setDisplayed('block');
        this.doComponentLayout();
    },

    /**
     * text : The text to include in the box (to indicate that a custom filter has been run)
     * func : function(record, id) that should return true/false for each record it receives
     */
    runCustomFilter : function(text, func) {
        //Clear any existing filter
        this.onTrigger1Click();

        this.hasSearch = true;
        this.setValue(text);

        this.store.filterBy(func);
        this.triggerEl.item(0).setDisplayed('block');
        this.triggerEl.item(1).setDisplayed('none');

        this._setTextFieldDisabled(true);
        //inputFieldEl.mask();


        this.doComponentLayout();
    }
});