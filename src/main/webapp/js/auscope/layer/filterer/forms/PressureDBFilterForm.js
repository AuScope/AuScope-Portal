/**
 * Builds a form panel for Pressure DB filters
 */
Ext.define('auscope.layer.filterer.forms.PressureDBFilterForm', {
    extend: 'auscope.layer.filterer.forms.BoreholeFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        this.callParent(arguments);

        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setTitle('Pressure DB Filter Properties');
        this.doLayout();
    }
});