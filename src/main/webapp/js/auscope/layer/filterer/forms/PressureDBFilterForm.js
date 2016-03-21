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
        
        ccLevelsSlider = Ext.create('Ext.slider.Single', {           
            anchor: '100%',
            itemId: 'ccLevelsSlider',
            disabled :  false,
            fieldLabel: '<span data-qtip="Select the levels value for color coding">' + 'Color Code Levels' + '</span>',
            labelAlign: 'left',
            name: 'ccLevels',
            increment: 1,
            minValue:3,
            maxValue:9,   
            value:9,
            tipText: function(thumb){
                return Ext.String.format('<b>Total {0} color code</b>', thumb.value);
            }                            
        });
        
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
        }, ccLevelsSlider);      
               
        this.doLayout();
    }
});