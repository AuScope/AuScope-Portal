/**
 * When someone clicks on the google maps we show popups specific to each feature type/marker that is clicked on
 * @param overlay
 * @param latlng
 * @param statusBar
 * @param viewport
 */
var gMapClickController = function(map, overlay, latlng, statusBar, viewport, treePanel) {
	
	var selectedNode = treePanel.getSelectionModel().getSelectedNode();
	
    statusBar.showBusy();
    statusBar.setVisible(true);
    viewport.doLayout();

    // WFS markers
    if (overlay instanceof GMarker) {
        if (overlay.featureType == "gsml:Borehole") {
            new NVCLMarker(overlay.title, overlay, overlay.description).getMarkerClickedFn()();
        }
        else if (overlay.featureType == "geodesy:stations") {
            new GeodesyMarker(overlay.wfsUrl, "geodesy:station_observations", overlay.getTitle(), overlay, overlay.description).getMarkerClickedFn()();
        }
        else if (overlay.description != null) {
            overlay.openInfoWindowHtml(overlay.description, {maxWidth:800, maxHeight:600, autoScroll:true});
               // overlay.openInfoWindowHtml(overlay.description);
        }
    } // WMS markers
    else if(latlng != null && selectedNode != null) {  
        if( selectedNode.text == "Geologic Units") {
        	// Query WMS location using WFS via Alistair's kml conversion stylesheet
            var url = "/geologicUnitPopup.do?lat=" + latlng.lat() + "&lng=" + latlng.lng();
            GDownloadUrl(url, function(response, pResponseCode) {
                if(pResponseCode == 200) {
                    map.openInfoWindowHtml(latlng, response, {autoScroll:true});
                }
            });
        } else { 
        	// Query WMS using GetFeatureInfo
        	var TileUtl = new Tile(map,latlng);

			var url = "/wmsMarkerPopup.do"
			url += "?WMS_URL=" + selectedNode.attributes.wmsUrl;
			url += "&lat=" + latlng.lat();
			url += "&lng=" + latlng.lng();
			url += "&QUERY_LAYERS=" + getCheckedNodes(selectedNode.parentNode);
			url += "&x=" + TileUtl.getTilePoint().x; 
			url += "&y=" + TileUtl.getTilePoint().y;
			url += '&BBOX=' + TileUtl.getTileCoordinates();
			url += '&WIDTH=' + TileUtl.getTileWidth();
			url += '&HEIGHT=' + TileUtl.getTileHeight();
			
        	map.getDragObject().setDraggableCursor("pointer");
        	
            GDownloadUrl(url, function(response, pResponseCode) {
                if(pResponseCode == 200) {
                    map.openInfoWindowHtml(latlng, response, {autoScroll:true});
                } else {
                	alert(pResponseCode);
                }
            });
        }        	
    }

    statusBar.clearStatus();
    statusBar.setVisible(false);
    viewport.doLayout();

};

/**
 * Iterates child nodes of a parent node, evaluating each node's checked status
 * @param iParentNode The parent node that contains checked nodes 
 * @return String of comma separated node ids. 
 */
function  getCheckedNodes(iParentNode) {
	var arr = new Array();
	var cs = iParentNode.childNodes;
	
	for (var i=0, len = cs.length; i<len; i++) {
		if (cs[i].getUI().isChecked()) {
			arr.push(cs[i].id);
		}
	}
	return arr.toString(); 
}