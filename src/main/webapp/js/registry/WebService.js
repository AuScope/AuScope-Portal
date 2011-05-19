/**
 * A simple object representing a WebService from the registry
 * 
 * - Don't instantiate this object directly
 */
WebService = function(config) {
	Ext.apply(this, config);
};


WebService.prototype.getServiceUserUrns = function() {
	return Ext.isArray(this.serviceUserUrns) ? this.serviceUserUrns : [];
}

WebService.prototype.getServiceTypes = function() {
	return Ext.isArray(this.serviceTypes) ? this.serviceTypes : [];
}

WebService.prototype.getServiceEndPoint = function() {
	return Ext.isString(this.serviceEndPoint) ? this.serviceEndPoint : "";
}

WebService.prototype.getUrn = function() {
	return Ext.isString(this.urn) ? this.urn : "";
}