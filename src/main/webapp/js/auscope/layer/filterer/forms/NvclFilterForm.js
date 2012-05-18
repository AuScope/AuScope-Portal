/**
 * Builds a form panel for NVCL filters
 */
Ext.define('auscope.layer.filterer.forms.NvclFilterForm', {
    extend: 'auscope.layer.filterer.forms.BoreholeFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        this.callParent(arguments);

        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setTitle('NVCL Filter Properties');
        this.add({
            xtype: 'hidden',
            itemId: 'hylogger-field',
            name: 'onlyHylogger',
            value: true
        });
    }
});
