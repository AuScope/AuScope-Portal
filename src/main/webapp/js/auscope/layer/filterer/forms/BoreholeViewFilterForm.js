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
                boxLabel: 'Show None-Hylogged Wells',
                name: 'showNoneHylogged',
                value: 'false'
        });        
        this.doLayout();
    }
});