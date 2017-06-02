/**
 * All things related to making http wms request such as get style, get legend etc
 * @module http
 * @class GetWMSRelatedService
 * 
 */
allModules.service('GetWMSRelatedService',['$http','$q',function ($http,$q) {
    
    var me = this;
    
    var manageParam = function(layer,onlineResource,param){
        if(!param){
            param = {};
        }
        //VT: hiddenParams- this is to append any fix parameter mainly for legacy reason in NVCL layer to set onlyHylogger to true 
        if(layer.filterCollection){
            var hiddenParams = [];
            if(layer.filterCollection.hiddenParams){
                hiddenParams = layer.filterCollection.hiddenParams;   
            }
            for(var idx in hiddenParams){
                if(hiddenParams[idx].type=="MANDATORY.UIHiddenResourceAttribute"){
                    param[hiddenParams[idx].parameter] = onlineResource[hiddenParams[idx].attribute];
                }else{
                    param[hiddenParams[idx].parameter] = hiddenParams[idx].value;
                }
            }
                
            //VT: mandatoryFilters
            var mandatoryFilters = [];
            if(layer.filterCollection.mandatoryFilters){
                mandatoryFilters = layer.filterCollection.mandatoryFilters;   
            }
            for(var idx in mandatoryFilters){            
                param[mandatoryFilters[idx].parameter] = mandatoryFilters[idx].value;             
            }
        }
        return param;
    };
        
    /**
     * Get the wms style url if proxyStyleUrl is valid
     * @method getWMSStyleUrl
     * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
     * @param onlineResource - the onlineResource of the layer we are rendering
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.Used in capdf
     * @return url - getUrl to retrieve sld
     */
    this.getWMSStyleUrl = function(layer,onlineResource,param){         
            
        param = manageParam(layer,onlineResource,param);
    
        if(layer.proxyStyleUrl){
            return layer.proxyStyleUrl + "?" + $.param(param);
        }else{               
            return null;
        }
    };
       
    /**
     * Get the wms style if proxyStyleUrl is valid
     * @method getWMSStyle
     * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
     * @param onlineResource - the onlineResource of the layer we are rendering
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.Used in capdf
     * @return promise - a promise containing the sld for the layer
     */
     this.getWMSStyle = function(layer,onlineResource,param){         
         
         param = manageParam(layer,onlineResource,param);

        if(layer.proxyStyleUrl){
             return $http.get('../' + layer.proxyStyleUrl,{
                 params:angular.copy(param)
             }).then(function (response) {  
                 var response={
                       onlineResource:onlineResource,
                       style : response.data 
                 }
                 return response
             },function(err){
                 var deferred = $q.defer();
                 err.onlineResource = onlineResource;
                 return $q.reject(err);//throw "err";
             });
        }else{
            var deferred = $q.defer();
            var response={
                    onlineResource:onlineResource,
                    style : null 
            };
             
            deferred.resolve(response);
            return deferred.promise;
        }
    };
    
    /**
     * Sends a request to server for marker popup data
     * @method sendMarkerPopupRequest
     * @param params - a string of parameters 'param1=val1&param2=val2' ...
     * @param slot - an index to the layer number, used by the code which evaluates the response
     */
    this.sendMarkerPopupRequest = function(params, slot) {
        return $http({
                        method: "POST",
                        url: "../wmsMarkerPopup.do",
                        data: params,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        slot_num: slot /* index to layer number, used by response evaluation code */
                    });
    };
    
     
    /**
     * 
     * @method getWMSMarkerInfo
     * @param ptLatLng - Lat Lng object of the clicked/touched on point on map
     * @param pixel - These are window pixel coords of the clicked/touched point on the map. (0,0) is top LH corner. Not Google Map pixel coords.
     * @param map - Google map object
     * @param layerName - Name of layer to use in WMS map query request  
     * @param serviceInfo - CSW service information object
     * @param style - OPTIONAL style to use when making the GetFeatureInfo request 
     * @param slot - an index to the layer number, used by the code which evaluates the response
     */
    this.getWMSMarkerInfo = function(ptLatLng, pixel, map, layerName, serviceInfo, style, slot) {
        
        // This latLng needs to be converted into EPSG:3857 rect coords
        proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
        proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
        
        // transforming lat, lng to map projection coordinates
        var pt=proj4("EPSG:4326", "EPSG:3857", [ptLatLng.lng(), ptLatLng.lat()]);
        
        var zoom = map.getZoom();      // Get zoom level
        var scale = 1 << zoom;         // Calculate map scale
        var proj = map.getProjection();
        
        
        // Get bounds of map, within the current viewport
        var bounds = map.getBounds();
        
        var neBndsLatLng = bounds.getNorthEast();
        var swBndsLatLng = bounds.getSouthWest();
        
        if(neBndsLatLng.lng()<swBndsLatLng.lng()){
            neBndsLatLng=new google.maps.LatLng(neBndsLatLng.lat(), 175);
        }
        
       
        var nePt = proj4("EPSG:4326", "EPSG:3857", [neBndsLatLng.lng(), neBndsLatLng.lat()]);
        var swPt = proj4("EPSG:4326", "EPSG:3857", [swBndsLatLng.lng(), swBndsLatLng.lat()]);
        
        // Make the bounding box string (BBOX)
        var bbox3 = [nePt[0].toString(), nePt[1].toString(),swPt[0].toString(), swPt[1].toString()].join(',');
        
        // Get span of current viewport and convert to pixels
        var gglWorldCoordsNE = proj.fromLatLngToPoint(neBndsLatLng);
        var gglWorldCoordsSW = proj.fromLatLngToPoint(swBndsLatLng);
        
        // Convert Google Map World coords to Google Map Pixel coords
        var gglPixelCoordsNE = new google.maps.Point(gglWorldCoordsNE.x*scale, gglWorldCoordsNE.y*scale);
        var gglPixelCoordsSW = new google.maps.Point(gglWorldCoordsSW.x*scale, gglWorldCoordsSW.y*scale);
        
        var bbWidth = Math.floor(Math.abs(gglPixelCoordsNE.x-gglPixelCoordsSW.x));
        var bbHeight = Math.floor(Math.abs(gglPixelCoordsNE.y-gglPixelCoordsSW.y));
        
        // NB: If SLD_BODY is used in future, look out for ArcGIS which does not like SLD_BODY (see Querier.js)
        var get_params= "WMS_URL="+encodeURIComponent(serviceInfo.url)+
            "&lat="+pt[1]+ // NB: 'lat' and 'lng' are projection map coords, not latitude, longitude angles
            "&lng="+pt[0]+
            "&QUERY_LAYERS="+encodeURIComponent(layerName)+
            "&x="+pixel.x+ // x,y are pixel coords within the map panel (not Google Map pixel coords)
            "&y="+pixel.y+
            "&BBOX="+encodeURIComponent(bbox3)+ // The relevant Google Map tile's bounds, converted to projection map coords
            "&WIDTH="+bbWidth+ // Map panel width, in pixels (not Google Map pixel coords)
            "&HEIGHT="+bbHeight+ // Map panel height, in pixels (not Google Map pixel coords)
            "&version="+encodeURIComponent(serviceInfo.version);
        
        if(style){
            get_params += "&SLD_BODY=" + encodeURIComponent(style);
        }else{
            get_params += "&SLD_BODY=";
        }
        
        var results = $q.defer();
        
        // ArcGIS server requires a different format to Geoserver
        var infoFormat = "application/vnd.ogc.gml/3.1.1";
        if (serviceInfo.applicationProfile && serviceInfo.applicationProfile.indexOf("Esri:ArcGIS Server") > -1) {
            infoFormat = "text/xml";
        }
        
        // Send a request for feature info.
        // If it fails with INFO_FORMAT="application/vnd.ogc.gml/3.1.1", try again with INFO_FORMAT="text/xml". 
        // Most WMS services do support "application/vnd.ogc.gml/3.1.1", and we support only two types of INFO_FORMAT.
        // So it's not worth calling 'GetCapabilities' for each layer.
        // But in future, perhaps could cache names of layers that fail with "application/vnd.ogc.gml/3.1.1" to avoid retries.
        //
        this.sendMarkerPopupRequest(get_params+"&INFO_FORMAT="+encodeURIComponent(infoFormat), slot).then(
            // If no HTTP Error
            function(response) {
                if (response.data.indexOf('<ServiceException code="InvalidFormat">')<0) {
                    results.resolve(response);
                } else {
                    // Try 'text/xml' if 'application/vnd.ogc.gml/3.1.1' did not work
                    me.sendMarkerPopupRequest(get_params+"&INFO_FORMAT="+encodeURIComponent("text/xml"), slot).then(
                        function(response) {
                            results.resolve(response);
                        }
                    );
                }
            },
            // If caused an HTTP Error
            function(response) {
                if (infoFormat == "application/vnd.ogc.gml/3.1.1") {
                    // Try 'text/xml' if 'application/vnd.ogc.gml/3.1.1' did not work
                    me.sendMarkerPopupRequest(get_params+"&INFO_FORMAT="+encodeURIComponent("text/xml"), slot).then(
                        function(response) {
                            results.resolve(response);
                        }
                    );
                } else {
                    results.reject(response.data);
                }
            }
        );        
        return results.promise;
    };
    

     
}]);
