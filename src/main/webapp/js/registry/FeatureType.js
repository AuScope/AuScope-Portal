/**
 * A simple object representing a FeatureType from the registry
 * 
 * - Don't instantiate this object directly
 */
FeatureType = function(config) {
	Ext.apply(this, config);
};


FeatureType.prototype.getInformationModelUrns = function() {
	return Ext.isArray(this.informationModelUrns) ? this.informationModelUrns : [];
};

FeatureType.prototype.getWebServiceUrns = function() {
	return Ext.isArray(this.webServiceUrns) ? this.webServiceUrns : [];
};

FeatureType.prototype.getTypeName = function() {
	return Ext.isString(this.typeName) ? this.typeName : "";
};

FeatureType.prototype.getUrn = function() {
	return Ext.isString(this.urn) ? this.urn : "";
};