/**
 * A representation of a KnownFeatureType in the user interface (as returned by the getKnownFeatures.do handler).
 */
KnownFeatureType = function(dataStoreRecord) {
	this.internalRecord = dataStoreRecord;
};


KnownFeatureType.prototype.internalRecord = null;
KnownFeatureType.prototype.internalGetStringField = function(fieldName) {
	var str = this.internalRecord.get(fieldName);
	if (!str) {
		return '';
	}
	
	return str;
};

/**
 * Gets the feature type as a String
 */
KnownFeatureType.prototype.getFeatureTypeName = function() {
	return this.internalGetStringField('featureTypeName');
};

/**
 * Gets the display name as a String
 */
KnownFeatureType.prototype.getDisplayName = function() {
	return this.internalGetStringField('displayName');
};

/**
 * Gets the description as a String
 */
KnownFeatureType.prototype.getDescription = function() {
	return this.internalGetStringField('description');
};

/**
 * Gets the proxy URL as a String
 */
KnownFeatureType.prototype.getProxyUrl = function() {
	return this.internalGetStringField('proxyUrl');
};

/**
 * Gets the icon URL as a String
 */
KnownFeatureType.prototype.getIconUrl = function() {
	return this.internalGetStringField('iconUrl');
};

/**
 * Gets the icon anchor location as an Object
 * {
 * 	x : Number
 * 	y : Number
 * }
 */
KnownFeatureType.prototype.getIconAnchor = function() {
	return this.internalGetStringField('iconAnchor');
};

/**
 * Gets the info window anchor location as an Object
 * {
 * 	x : Number
 * 	y : Number
 * }
 */
KnownFeatureType.prototype.getInfoWindowAnchor = function() {
	return this.internalGetStringField('infoWindowAnchor');
};

/**
 * Gets the icon size as an Object
 * {
 * 	width  : Number
 * 	height : Number
 * }
 */
KnownFeatureType.prototype.getIconSize = function() {
	return this.internalGetStringField('iconSize');
};

/**
 * Given a CSWRecordStore this function will return an array of CSWRecords that 
 * this KnownFeatureType is representing
 */
KnownFeatureType.prototype.getLinkedCSWRecords = function(cswRecordStore) {
	var featureTypeName = this.getFeatureTypeName();
	return cswRecordStore.getCSWRecordsByOnlineResource(featureTypeName, null);
};

/**
* Gets an OverlayManager that holds the list of bounding boxes for this layer (or null/undefined)
*/
KnownFeatureType.prototype.getBboxOverlayManager = function() {
	return this.internalRecord.bboxOverlayManager;
};

/**
* Sets an OverlayManager that holds the list of bounding boxes for this layer (or null/undefined)
*/
KnownFeatureType.prototype.setBboxOverlayManager = function(bboxOverlayManager) {
	this.internalRecord.bboxOverlayManager = bboxOverlayManager;
};

