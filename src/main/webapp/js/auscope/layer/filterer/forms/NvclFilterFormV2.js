/**
 * Builds a form panel for BoreholeView filters
 */
Ext.define('auscope.layer.filterer.forms.NvclFilterFormV2', {
    extend: 'auscope.layer.filterer.forms.SF0BoreholeFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        this.callParent(arguments);
        var fieldSet = this.getComponent('borehole-fieldset');
        fieldSet.setTitle('NVCL Filter Properties');
        fieldSet.add({
        xtype: 'checkbox',
        anchor: '95%',
        itemId: 'nvcl-analytics-field',
        boxLabel: '',
        submitValue: false,
        hidden: true,
        listeners: {
            change: Ext.bind(this._onAnalyticsCbChange, this)
        }
    },{
        xtype: 'hidden',
        name: 'analyticsJobId',
        listeners: {
            change: Ext.bind(this._onIdsChange, this)
        }
    });
    this.doLayout();
},

_onAnalyticsCbChange: function(cb, newValue, oldValue) {
    if (newValue == false) {
        //Don't set this field to hidden while the change event handlers are still running
        //Doing so will result in Ext errors as the DOM el's suddenly disappear. (so yield and update after events run)
        new Ext.util.DelayedTask(Ext.bind(function() {
            this.layer.get('filterer').setParameter('analyticsJobId', '');
        }, this)).delay(1);
    }
},

_onIdsChange: function(hidden, newValue, oldValue) {
    if (Ext.isEmpty(newValue)) {
        this.down('#nvcl-analytics-field').setHidden(true);
    } else {
        this.down('#nvcl-analytics-field').setBoxLabel('Showing analytics from job "' + this.layer.get('filterer').getParameter('nvclJobName') + '"')
        this.down('#nvcl-analytics-field').setValue(true);
        this.down('#nvcl-analytics-field').setHidden(false);
    }
}
});