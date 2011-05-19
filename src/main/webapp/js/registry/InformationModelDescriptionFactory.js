InformationModelDescriptionFactory = {
	
	/**
	 * Given a URN for an information model this function makes a request to the server for more information
	 * 
	 * Parameters
	 * callback function(success, InformationModelDescription) : called when the server returns with a response
	 * infoModelUrn String : the URN of the information model that you wish to have described  
	 */
	newInstance : function(infoModelUrn, callback) {
		Ext.Ajax.request({
	    	url			: 'describeInformationModel.do',
	    	params		: {
				urn : infoModelUrn
			},
	    	timeout		: 1000 * 60 * 20, //20 minute timeout
	    	failure		: function(response) {
				callback(false, null);
	    	},
	    	success		: function(response) {
	    		var jsonResponse = Ext.util.JSON.decode(response.responseText);
	
	    		if (jsonResponse.success) {
	    			callback(true, new InformationModelDescription(jsonResponse.data));
	    		}
	    	}
		});
	}
};