//function FormFactory() {

/*Ext.override(Ext.form.Field, {
    hideItem :function(){
        this.formItem.addClass('x-hide-' + this.hideMode);
    },

    showItem: function(){
        this.formItem.removeClass('x-hide-' + this.hideMode);
    },
    setFieldLabel: function(text) {
    var ct = this.el.findParent('div.x-form-item', 3, true);
    var label = ct.first('label.x-form-item-label');
    label.update(text);
  }
});*/

FormFactory = function() {};

FormFactory.prototype.internalGenerateResult = function(form, supportsFiltering) {
	return {
		form				: form,
		supportsFiltering	: supportsFiltering
	};
};

/**
 * Given an activeLayersRecord, work out whether there is an appropriate filter form
 *
 * Returns a response in the form
 * {
 *    form : Ext.FormPanel - can be null - the formpanel to be displayed when this layer is selected
 *    supportsFiltering : boolean - whether this formpanel supports the usage of the filter button
 * }
 *
 */
FormFactory.prototype.getFilterForm = function(activeLayersRecord, map, cswRecordStore) {


    //NVCL
	if (activeLayersRecord.getId() === 'http://auscope.org/ontology/vocabs/topology/1.0/TopologyScheme#InformationModel-AuScopeNVCLProfile') {
		return this.internalGenerateResult(new NvclFilterForm(activeLayersRecord.getId()), true);
	}
	
    return this.internalGenerateResult(null, false);
};