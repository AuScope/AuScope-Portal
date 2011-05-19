
/**
 * A simple object for representing the response from a DescribeInformationModel request
 * 
 * - Instantiate this class via the InformationModelDescriptionFactory
 */
InformationModelDescription = function(response) {
	this.informationModel = new InformationModelRecord({objectRecord : response.informationModel});
	
	this.webServices = [];
	for (var i = 0; i < response.webServices.length; i++) {
		this.webServices.push(new WebService(response.webServices[i]));
	}
	
	this.featureTypes = [];
	for (var i = 0; i < response.featureTypes.length; i++) {
		this.featureTypes.push(new FeatureType(response.featureTypes[i]));
	}
};

InformationModelDescription.prototype.informationModel = null;
InformationModelDescription.prototype.webServices = null;
InformationModelDescription.prototype.featureTypes = null;

/**
 * Returns a single InformationModelRecord object
 * @return
 */
InformationModelDescription.prototype.getInformationModel = function() {
	return this.informationModel;
};

/**
 * Returns an array of WebService objects
 * @return
 */
InformationModelDescription.prototype.getWebServices = function() {
	return this.webServices;
};

/**
 * Returns an array of FeatureType objects
 * @return
 */
InformationModelDescription.prototype.getFeatureTypes = function() {
	return this.featureTypes;
};
