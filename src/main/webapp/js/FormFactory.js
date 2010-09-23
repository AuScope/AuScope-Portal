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
}

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
FormFactory.prototype.getFilterForm = function(activeLayersRecord, map) {

	var cswRecords = activeLayersRecord.getCSWRecords();
    
    //We simplify things by treating the record list as a single type of WFS, WCS or WMS
    //So lets find the first record with a type we can choose (Prioritise WFS -> WCS -> WMS) 
    for (var i = 0; i < cswRecords.length; i++) {
    
    	//a WFS may require a custom filter form
    	var onlineResources = cswRecords[i].getFilteredOnlineResources('WFS');
    	if (onlineResources.length != 0) {
    		//Assumption - we are only interested in 1 WFS 
    		var id = activeLayersRecord.getId();
    		var typeName = onlineResources[0].name;
      	  
            switch (typeName) {
                case 'er:Mine': return this.internalGenerateResult(new MineFilterForm(id), true); break;
                case 'er:MiningActivity': return this.internalGenerateResult(new MiningActivityFilterForm(id), true); break;
                case 'er:MineralOccurrence': return this.internalGenerateResult(new MineralOccurrenceFilterForm(id), true); break;
                default: return this.internalGenerateResult(null, false); break;
            }
    	}
    	
    	//Otherwise we may show opacity if there is an associated WMS
    	onlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
    	if (onlineResources.length != 0) {
    		return this.internalGenerateResult(new WMSLayerFilterForm(activeLayersRecord, map), false);
    	}
    }
    
    return this.internalGenerateResult(null, false);
};