/**
 * All things related to making http wms request such as get style, get legend etc
 * @module http
 * @class GetWMSRelatedService
 * 
 */
allModules.service('GetWMSRelatedService',['$http','$q',function ($http,$q) {
       
    /**
     * Get the wms style if proxyStyleUrl is valid
     * @method getWMSStyle
     * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.
     * @return promise - a promise containing the sld for the layer
     */
     this.getWMSStyle = function(layer,param){ 
         if(!param){
             param = {};
         }
        if(layer.proxyStyleUrl){
             return $http.get('../' + layer.proxyStyleUrl,{
                 params:param
             }).then(function (response) {
                 return response.data;
             });
        }else{
            var deferred = $q.defer();
            deferred.resolve(null);
            return deferred.promise;
        }
    };
     
    /**
     * 
     * @method getWMSMarkerInfo
     * @param ptLatLng Lat Lng object of the clicked/touched on point on map
     * @param pixel These are window pixel coords of the clicked/touched point on the map. (0,0) is top LH corner. Not Google Map pixel coords.
     * @serviceInfo CSW service information object 
     */
    this.getWMSMarkerInfo = function(ptLatLng, pixel, map, serviceInfo) {
        
        // This latLng needs to be converted into EPSG:3857 rect coords
        proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
        proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
        
        // transforming lat, lng to map projection coordinates
        var pt=proj4("EPSG:4326", "EPSG:3857", [ptLatLng.lng(), ptLatLng.lat()]);
        
        var TILE_SIZE = 256;
        var zoom = map.getZoom();      // Get zoom level
        var scale = 1 << zoom;         // Calculate map scale
        var proj = map.getProjection();
        
        
        // Get bounds of map, within the current viewport
        var bounds = map.getBounds();
        
        var neBndsLatLng = bounds.getNorthEast();
        var swBndsLatLng = bounds.getSouthWest();
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
            "&QUERY_LAYERS="+encodeURIComponent(serviceInfo.name)+
            "&x="+pixel.x+ // x,y are pixel coords within the map panel (not Google Map pixel coords)
            "&y="+pixel.y+
            "&BBOX="+encodeURIComponent(bbox3)+ // The relevant Google Map tile's bounds, converted to projection map coords
            "&WIDTH="+bbWidth+ // Map panel width, in pixels (not Google Map pixel coords)
            "&HEIGHT="+bbHeight+ // Map panel height, in pixels (not Google Map pixel coords)
            //Invalid format 'application/xml', supported formats are [text/plain, application/vnd.ogc.gml, application/vnd.ogc.gml/3.1.1, text/html, application/json] 
            "&INFO_FORMAT="+encodeURIComponent("application/vnd.ogc.gml/3.1.1")+ //+encodeURIComponent("text/html")+ // Simple HTML for the moment // application/vnd.ogc.gml
            "&SLD_BODY="+ // No styling for the moment
            "&version="+encodeURIComponent(serviceInfo.version);

        return $http({
            method: "POST",
            url: "../wmsMarkerPopup.do",
            data: get_params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
     
     
}]);