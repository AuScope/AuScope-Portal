/**
 * Builds a form panel for Pressure DB filters
 */
Ext.define('auscope.layer.filterer.forms.PressureDBFilterForm', {
    extend: 'auscope.layer.filterer.forms.SF0BoreholeFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        this.callParent(arguments);

        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setTitle('Pressure DB Filter Properties');
        var ccPropertyStore = Ext.create('Ext.data.Store', {
            fields : ['ccProperty', 'ccProperty'],
            proxy : {
                type : 'ajax',
                url : 'doGetPropertyOfInterest.do',
                extraParams: {
                    serviceUrl: this.serviceUrl
                },
                reader : {
                    type : 'array',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });       
        
        fieldSet.remove('serviceFilter-field');
        
        fieldSet.add({
            xtype: 'combo',
            anchor: '95%',
            itemId: 'ccProperty',
            fieldLabel: 'Color code property',
            name: 'ccProperty',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: ccPropertyStore,
            valueField: 'ccProperty',
            displayField: 'ccProperty',
            hiddenName: 'ccProperty'
        });      
               
        this.doLayout();
    }
});