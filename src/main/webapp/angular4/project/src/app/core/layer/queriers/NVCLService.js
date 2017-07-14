/**
 * NVCLService handles extraction of information from NVCL service.
 * @module layer
 * @class NVCLService
 * 
 */
allModules.service('NVCLService', ['$http', '$q', 'QuerierPanelService', function ($http, $q, QuerierPanelService) {

    var me = this;
    
    /**
     * Decomposes a 'normal' URL in the form http://url.com/long/path/name to just its prefix + hostname http://url.com
     * @method getBaseUrl
     * @param url The url to decompose
     */
    this.getBaseUrl = function(url) {
        var splitUrl = url.split('://'); //this should split us into 2 parts
        return splitUrl[0] + '://' + splitUrl[1].slice(0, splitUrl[1].indexOf('/'));
    }


    /**
    * Given a online reseource URL it returns its NVCL URL
    * @method getNVCLDataServiceUrl
    * @param url online resource URL
    * @return an NVCL URL
    */
    this.getNVCLDataServiceUrl = function(url) {
        //NVCL URL's are discovered by doing some 'tricky' URL rewriting
        var baseUrl = this.getBaseUrl(url);
        if (baseUrl.indexOf('pir.sa.gov.au') >= 0) {
            baseUrl += '/nvcl'; //AUS-2144 - PIRSA specific fix
        }

        var nvclDataServiceUrl = baseUrl + '/NVCLDataServices/';
        return nvclDataServiceUrl;
    },
    
    /**
    * Returns a list of logids, used when referring to the core sample for various services
    * @method getNVCLLogs
    * @param serviceURL online resource URL
    * @dataSetID dataset id for core sample
    * @return list of logids
    */    
    this.getNVCLLogs = function(serviceURL, dataSetID) {
        return $http.get('../getNVCL2_0_Logs.do', {
                        params: {
                            serviceUrl: serviceURL,
                            datasetId: dataSetID,
                            mosaicService: true
                        }
            });
    },
    
    /**
    * Returns URL of image carousel
    * @method getImageCarouselURL
    * @param serviceUrl online resource URL
    * @param logID log identifier
    * @param sampleNo sample number
    * @return HTML carousel URL
    */
    this.getImageCarouselURL = function(dataServiceUrl, logID, sampleNo) {
        return dataServiceUrl+"/imageCarousel.html?logid="+logID+"&sampleno="+sampleNo;
    },
    
    /**
    * Returns URL of image thumbnail
    * @method getDisplayTrayThumbURL
    * @param dataServiceUrl online resource URL
    * @param logID log identifier
    * @return HTML thumbnail URL
    */
    this.getDisplayTrayThumbURL = function(dataServiceUrl, logID, sampleNo) {
        return dataServiceUrl+"/Display_Tray_Thumb.html?logid="+logID+"&sampleno="+sampleNo;
    },
    
    
    
    /**
    * Calls up NVCL services to get the depths for each core tray image
    * @method getImageTrayDepth
    * @param dataServiceUrl online resource URL
    * @param logID log identifier
    */
    this.getImageTrayDepth = function(dataServiceUrl, logID) {
        return $http.get("../getNVCLImageTrayDepth.do", {
            params: {
                        serviceUrl: dataServiceUrl,
                        logid: logID
                    }
        });
    }
    
    /**
    * Return some HTML which displays a carousel of core images
    * @method getCarouselHTML 
    * @param serviceUrl  online resource URL
    * @param typeName data type name
    * @param featureId id for requested feature
    */
    this.getCoreDisplay = function(serviceURL, typeName, featureId) {
        var dataServiceUrl = this.getNVCLDataServiceUrl(serviceURL);
        
        var dotPos = featureId.lastIndexOf('.');
        if (dotPos>0) {
            var holeID = featureId.substr(dotPos+1);
            var thumbLogID = "";
            var logID = "";
            var sampleCount=0;
            $http.get('../getNVCLDatasets.do', {
                    params: {
                        serviceUrl: dataServiceUrl,
                        holeIdentifier: holeID
                    }
                }).then(function(response) {
                    if (response.data && response.data.data) {
                        var dataSetID = response.data.data[0].datasetId;
                        var dataSetName = response.data.data[0].datasetName;
                        return me.getNVCLLogs(dataServiceUrl,dataSetID);
                    }
                    return $q.reject("Response did not contain image data");
                
                },function(err) {
                    return $q.reject(err);
                
                // parse response from getNVCLLogs
                }).then(function(response) {
                    for (var i=0; i<response.data.data.length; i++) {
                        if (response.data.data[i].logName=='Tray Thumbnail Images') {
                            thumbLogID = response.data.data[i].logId;
                            sampleCount = response.data.data[i].sampleCount;
                        } else if (response.data.data[i].logName=='Tray Images') {
                            logID = response.data.data[i].logId;
                        }
                    }
                    if (logID!="" && thumbLogID!="" && sampleCount>0) {
                        return me.getImageTrayDepth(dataServiceUrl, thumbLogID);
                    } else {
                        return $q.reject("Could not find log_id or enough samples of core tray images");
                    }
                },function(err) {
                    return $q.reject(err);
                    
                // parse response from getImageTrayDepth
                }).then(function(response) {
                    if (response.status==200 && response.data && response.data.success==true) {
                        var depths=response.data.data;
                        imageList = [];
                        
                        for (var sampleNo=0; sampleNo<sampleCount; sampleNo++) {
                            var trayImageThmbUrl=me.getDisplayTrayThumbURL(dataServiceUrl, thumbLogID, sampleNo);
                            var carouselUrl=me.getImageCarouselURL(dataServiceUrl, logID, sampleNo);
                            var depthStr = "Sample "+depths[sampleNo].sampleNo+":    "+depths[sampleNo].startValue+"m - "+depths[sampleNo].endValue+"m";
                            imageList.push({thumbURL: trayImageThmbUrl,depthStr: depthStr, carouselURL: carouselUrl});
                        }
                        QuerierPanelService.setCarouselImages(imageList);
                        
                    } else {
                        console.error("Bad response to get depths for core tray images:", response);
                    }
                    QuerierPanelService.setCarouselBusy(false);
                    
                }, function(err) {
                        console.error("Cannot get depths for core tray images:", err);
                        QuerierPanelService.setCarouselBusy(false);
                });
                
        } else {
            console.error("Can't find hole id for core tray images");
        }
    }


    
    
}]);