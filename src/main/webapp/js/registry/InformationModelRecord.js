/**
 * A representation of a InformationModelRecord in the user interface.
 * 
 * Must specify one of the fields
 * config {
 *     dataStoreRecord : a raw record from a datastore that will be the source of data for this record 
 *     objectRecord : a plain object parsed from a JSON response object
 * }
 */
InformationModelRecord = function(config) {
	this.dataStoreRecord = config.dataStoreRecord;
	this.objectRecord = config.objectRecord;
};


InformationModelRecord.prototype.internalRecord = null;
InformationModelRecord.prototype.internalGetRawValue = function(fieldName) {
	if (this.dataStoreRecord) {
		return this.dataStoreRecord.get(fieldName);
	} else {
		return this.objectRecord[fieldName];
	}
};
InformationModelRecord.prototype.internalGetStringField = function(fieldName) {
	var str = this.internalGetRawValue(fieldName);
	if (!str) {
		return '';
	}

	return str;
};
InformationModelRecord.prototype.internalGetArrayField = function(fieldName) {
	var arr = this.internalGetRawValue(fieldName);
	if (!arr) {
		return [];
	}

	return arr;
};

/**
 * Gets the name of the InformationModel as a String
 */
InformationModelRecord.prototype.getName = function() {
	return this.internalGetStringField('name');
};

/**
 * Gets the urn of the InformationModel as a String
 */
InformationModelRecord.prototype.getUrn = function() {
	return this.internalGetStringField('urn');
};

/**
 * Gets the urns of all vocabulary services that are used by this InformationModel as an array Strings
 */
InformationModelRecord.prototype.getVocabularyUrns = function() {
	return this.internalGetArrayField('vocabularyUrns');
};

/**
 * Gets the urns of all vocabulary services that are used by this InformationModel as an array Strings
 */
InformationModelRecord.prototype.getFeatureTypeUrns = function() {
	return this.internalGetArrayField('featureTypeUrns');
};