/*
	Feature Download Manager
	
	A class for dowloading features from a given URL. This class handles all querying for record counts, display
	of modal question's and downloading the actual records
*/
FeatureDownloadManager = function(serviceURL, recordCountURL, recordFetchURL, filterParams, map) {
	this.serviceURL = serviceURL;
	this.filterParams = filterParams;
	this.recordCountURL = recordCountURL;
	this.recordFetchURL = recordFetchURL;
	this.map = map;
	this.currentBoundingBox = null;
};

FeatureDownloadManager.prototype.downloadFinishedHandler = null;
FeatureDownloadManager.prototype.downloadErrorHandler = null;
FeatureDownloadManager.prototype.downloadCancelledHandler = null;
FeatureDownloadManager.prototype.featureSetSizeThreshold = 200;


FeatureDownloadManager.prototype.doDownload = function () {
	var recordFetchURL = this.recordFetchURL;
	var filterParams = this.filterParams;
	Ext.Ajax.request({
        	url			: recordFetchURL,
        	params		: filterParams,
			callingInstance : this,
        	timeout		: 1000 * 60 * 20, //20 minute timeout
        	failure		: function(response, options) {
				options.callingInstance.downloadErrorHandler(response , options);
        	},
        	success		: function(response, options) {
        		options.callingInstance.downloadFinishedHandler(response, options);
			}
		});
};

FeatureDownloadManager.prototype.doCount = function(response, options, alreadyPrompted) {
	
        //var jsonResponse = eval('(' + data + ')');
		var jsonResponse =Ext.util.JSON.decode(response.responseText);
        if (jsonResponse[0] > this.featureSetSizeThreshold) {
        	var win = null;
        	var callingInstance = this;
        	
        	//If we have already prompted the user and they selected to only get the visible records 
        	//AND there are still too many records, lets be 'smart' about how we proceed
        	if (alreadyPrompted) {
        		Ext.MessageBox.show({
        			buttons:{yes:'Download Visible', no:'Abort Download'},
        			fn:function (buttonId) {
	        			if (buttonId == 'yes') {
	        				callingInstance.doDownload();
	        			} else if (buttonId == 'no') {
	        				callingInstance.downloadCancelledHandler();
	        			} 
	        		},
	        		modal:true,
	        		msg: '<p>There will still be ' + jsonResponse[0] + ' features visible. Would you still like to download the visible feature set?</p><br/><p>Alternatively you can cancel this download, adjust your zoom level and try again.</p>',
	        		title:'Warning: Large feature set'
        		});
        	}else {
	        	Ext.MessageBox.show({
	        		buttons:{yes:'Download All', no:'Download Visible', cancel:'Abort Download'},
	        		fn:function (buttonId) {
	        			if (buttonId == 'yes') {
	        				callingInstance.doDownload();
	        			} else if (buttonId == 'no') {
	        				callingInstance.filterParams.bbox = Ext.util.JSON.encode(callingInstance.fetchVisibleMapBounds(callingInstance.map));
	            			
	            			callingInstance.startDownload(true);
	        			} else if (buttonId == 'cancel') {
	        				callingInstance.downloadCancelledHandler();
	        			}
	        		},
	        		modal:true,
	        		msg:'You are about to fetch ' + jsonResponse[0] + ' features, doing so could make the portal run extremely slowly. Would you like to download only the visible markers instead?',
	        		title:'Warning: Large feature set'
	        	});
        	}
        	
        } else {
        	//If we have an acceptable number of records, this is how we shall proceed
        	this.doDownload();
        }
    
};

FeatureDownloadManager.prototype.startDownload = function(alreadyPrompted) {
	
	if (alreadyPrompted == null || alreadyPrompted == undefined)
		alreadyPrompted = false;
		
	//If we have a count function, go through the motions
	//Otherwise just download the URL
	if (!this.recordCountURL || this.recordCountURL.length == 0) {
		this.doDownload();
	} else {
		var recordCountURL = this.recordCountURL;
		var filterParams = this.filterParams;
	    Ext.Ajax.request({
        	url			: recordCountURL,
        	params		: filterParams,
			callingInstance : this,
        	timeout		: 1000 * 60 * 20, //20 minute timeout
        	failure		: function(response, options) {
        		options.callingInstance.downloadErrorHandler(response, options);
        	},
        	success		: function(response, options) {
				options.callingInstance.doCount(response, options, alreadyPrompted);
			}
		});
	}
};

FeatureDownloadManager.prototype.fetchVisibleMapBounds = function(gMapInstance) {
	var mapBounds = gMapInstance.getBounds();
	var sw = mapBounds.getSouthWest();
	var ne = mapBounds.getNorthEast();
	var center = mapBounds.getCenter();

	var adjustedSWLng = sw.lng();
	var adjustedNELng = ne.lng();

	//this is so we can fetch data when our bbox is crossing the anti meridian
	//Otherwise our bbox wraps around the WRONG side of the planet
	if (adjustedSWLng <= 0 && adjustedNELng >= 0 ||
		adjustedSWLng >= 0 && adjustedNELng <= 0) {
		adjustedSWLng = (sw.lng() < 0) ? (180 - sw.lng()) : sw.lng();
		adjustedNELng = (ne.lng() < 0) ? (180 - ne.lng()) : ne.lng();
	}

	return {
			bboxSrs : 'EPSG:4326',
			lowerCornerPoints : [Math.min(adjustedSWLng, adjustedNELng), Math.min(sw.lat(), ne.lat())],
			upperCornerPoints : [Math.max(adjustedSWLng, adjustedNELng), Math.max(sw.lat(), ne.lat())]
	};
};
