/**
 * Builds a form panel for BoreholeView filters
 */
Ext.define('auscope.layer.filterer.forms.BoreholeViewFilterForm', {
    extend: 'auscope.layer.filterer.forms.SF0BoreholeFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        this.callParent(arguments);

        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setTitle('Borehole View Filter Properties');

        fieldSet.add({
            	xtype: 'checkbox',
                anchor: '95%',
                itemId: 'showNoneHylogged-field',
                boxLabel: 'Show Hylogged boreholes',
                name: 'showNoneHylogged',
                value: 'false'
        });
        this.doLayout();
    },

    /**
     * Adds an array of borehole ID's to the approved filter list. If a list already exists, it is replaced
     */
    addIdFilter: function(ids, name) {
        this.removeIdFilter();

        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setDisabled(true);

        this.add({
            xtype: 'container',
            itemId: 'id-filter',
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: 'Showing results from "' + name + '"'
            },{
                xtype: 'button',
                scope: this,
                text: 'X',
                handler: function() {
                    this.removeIdFilter();
                }
            },{
                xtype: 'hidden',
                value: ids.join(',')
            }]
        });
    },

    /**
     * Removes any ID filter currently in place (or nothing if one isn't in place)
     */
    removeIdFilter: function() {
        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setDisabled(false);
        this.remove('id-filter');
    }
});