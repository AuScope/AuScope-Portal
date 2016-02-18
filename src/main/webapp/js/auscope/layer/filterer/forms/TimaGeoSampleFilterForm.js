/**
 * Builds a form panel for Mine filters
 */
Ext.define('auscope.layer.filterer.forms.TimaGeoSampleFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {       

     // The data store containing the list of states
        var fieldStore = Ext.create('Ext.data.Store', {
            fields: ['field', 'value'],
            data : [
                {"field":"elev", "value":"elev"},
                {"field":"wt", "value":"wt"},
                {"field":"sd", "value":"sd"}            
            ]
        });

        Ext.apply(config, {
            delayedFormLoading: false,
            border: false,
            autoScroll: true,
            hideMode:'offsets',
            width:'100%',
            buttonAlign:'right',
            labelAlign:'right',
            labelWidth: 70,
            timeout: 180, //should not time out before the server does
            bodyStyle:'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Show Results\'">' +
                           'Filter data' +
                       '</span>',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'Name' +
                                '</span>',
                    name: 'sampleName'
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'IGSN' +
                                '</span>',
                    name: 'igsn'
                }]
            }]
        });

        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    }
});

