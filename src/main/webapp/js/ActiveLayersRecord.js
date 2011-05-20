/**
 * A simple wrapper for records in ActiveLayersStore that provides a number of useful helper methods
 */
ActiveLayersRecord = function(dataStoreRecord) {
	this.internalRecord = dataStoreRecord;
};


ActiveLayersRecord.prototype.internalRecord = null;
ActiveLayersRecord.prototype.internalGetStringField = function(fieldName) {
	var str = this.internalRecord.get(fieldName);
	if (!str) {
		return '';
	}
	
	return str;
};
ActiveLayersRecord.prototype.internalGetArrayField = function(fieldName) {
	var arr = this.internalRecord.get(fieldName);
	if (!arr) {
		return [];
	}
	
	return arr;
};
ActiveLayersRecord.prototype.internalGetBooleanField = function(fieldName) {
	var b = this.internalRecord.get(fieldName);
	if (b === null || b === undefined) {
		return false;
	}
	
	return b;
};
ActiveLayersRecord.prototype.internalGetNumberField = function(fieldName, defaultValue) {
	var num = this.internalRecord.get(fieldName);
	if (num === null || num === undefined) {
		return defaultValue;
	}
	
	return num;
};


/**
 * Gets the id of this active layer as a String
 */
ActiveLayersRecord.prototype.getId = function() {
	return this.internalGetStringField('id');
};

/**
 * Gets the title of this active layer as a String
 */
ActiveLayersRecord.prototype.getTitle = function() {
	return this.internalGetStringField('title');
};

/**
 * Gets an array of FeatureType objects
 */
ActiveLayersRecord.prototype.getFeatureTypes = function() {
	return this.internalGetArrayField('featureTypes');
};

/**
 * Gets an array of WebService objects
 */
ActiveLayersRecord.prototype.getWebServices = function() {
	return this.internalGetArrayField('webServices');
};


/**
 * Gets the URL of this active layer's icon as a String (Can be null/empty)
 */
ActiveLayersRecord.prototype.getIconUrl = function() {
	return this.internalRecord.get('iconUrl');
};

/**
 * Gets whether this record is still loading or not as a boolean
 */
ActiveLayersRecord.prototype.getIsLoading = function() {
	return this.internalGetBooleanField('isLoading');
};

/**
 * Sets whether this record is still loading or not as a boolean
 */
ActiveLayersRecord.prototype.setIsLoading = function(isLoading) {
	this.internalRecord.set('isLoading', isLoading);
};

/**
 * Gets whether this record is visible or not as a boolean
 */
ActiveLayersRecord.prototype.getLayerVisible = function() {
	return this.internalGetBooleanField('layerVisible');
};

/**
 * Sets whether this record is visible or not as a boolean
 */
ActiveLayersRecord.prototype.setLayerVisible = function(layerVisible) {
	this.internalRecord.set('layerVisible', layerVisible);
};

ActiveLayersRecord.prototype.getWebServicesForFeatureType = function(featureType) {
	var webServices = this.getWebServices();
	var webServiceUrns = featureType.getWebServiceUrns();
	var matchingWebServices = [];
	
	for (var i = 0; i < webServices.length; i++) {
		var webService = webServices[i];
		for (var j = 0; j < webServiceUrns.length; j++) {
			if (webService.getUrn() === webServiceUrns[j]) {
				matchingWebServices.push(webService);
				break;
			}
		}
	}
	
	return matchingWebServices;
};


/**
 * Gets an instance of OverlayManager or null
 */
ActiveLayersRecord.prototype.getOverlayManager = function() {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	return this.internalRecord.overlayManager;
};

/**
 * Sets an instance of OverlayManager or null
 */
ActiveLayersRecord.prototype.setOverlayManager = function(overlayManager) {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	this.internalRecord.overlayManager = overlayManager;
};

/**
 * Gets an instance of a FormFactory.getFilterForm response or null
 */
ActiveLayersRecord.prototype.getFilterPanel = function() {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	return this.internalRecord.filterPanel;
};

/**
 * Sets an instance of FormFactory.getFilterForm response or null
 */
ActiveLayersRecord.prototype.setFilterPanel = function(filterPanel) {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	this.internalRecord.filterPanel = filterPanel;
};

/**
 * Gets an instance of ResponseToolTip or null
 */
ActiveLayersRecord.prototype.getResponseToolTip = function() {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	return this.internalRecord.responseToolTip;
};

/**
 * Sets an instance of ResponseToolTip or null
 */
ActiveLayersRecord.prototype.setResponseToolTip = function(responseToolTip) {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	this.internalRecord.responseToolTip = responseToolTip;
};

/**
 * Gets an instance of Ext.Window or null
 * 
 * It represents the popup window with legend information for this active layer
 */
ActiveLayersRecord.prototype.getLegendWindow = function() {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	return this.internalRecord.legendWindow;
};

/**
 * Sets an instance of Ext.Window or null
 * 
 * It represents the popup window with legend information for this active layer
 */
ActiveLayersRecord.prototype.setLegendWindow = function(legendWindow) {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	this.internalRecord.legendWindow = legendWindow;
};

/**
 * Gets an instance of DebuggerData or null
 * 
 * It represents some debug information associated with this layer
 */
ActiveLayersRecord.prototype.getDebuggerData = function() {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	return this.internalRecord.debuggerData;
};

/**
 * Sets an instance of DebuggerData or null
 * 
 * It represents some debug information associated with this layer
 */
ActiveLayersRecord.prototype.setDebuggerData = function(debuggerData) {
	//We are forced to read/write directly to the record because this 
	//field is too complex to be serialized using JSON
	this.internalRecord.debuggerData = debuggerData;
};

/**
 * Gets the last set of filter params (as a basic object) that were used to query
 * this layer. Can be null/undefined
 */
ActiveLayersRecord.prototype.getLastFilterParameters = function() {
    return this.internalRecord.lastFilterParams;
};

/**
 * Sets the last set of filter params (as a basic object) that were used to query
 * this layer. Can be null/undefined
 */
ActiveLayersRecord.prototype.setLastFilterParameters = function(filterParams) {
    this.internalRecord.lastFilterParams = filterParams;
};

/**
 * Gets the array of unique ids of the services request of a layer.
 * Can be null/undefined
 */
ActiveLayersRecord.prototype.getWFSRequestTransId = function() {
    return this.internalRecord.transId;
};

/**
 * Sets the array of unique ids of the services request of a layer.
 * Can be null/undefined
 */
ActiveLayersRecord.prototype.setWFSRequestTransId = function(transId) {
    this.internalRecord.transId = transId;
};

/**
 * Gets the service Url for which the unique ids are set.
 * Can be null/undefined
 */
ActiveLayersRecord.prototype.getWFSRequestTransIdUrl = function() {
    return this.internalRecord.transIdUrl;
};

/**
 * Sets the service Url for which the unique ids are set.
 * Can be null/undefined
 */
ActiveLayersRecord.prototype.setWFSRequestTransIdUrl = function(transIdUrl) {
    this.internalRecord.transIdUrl = transIdUrl;
};
