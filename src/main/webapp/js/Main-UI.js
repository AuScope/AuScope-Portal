//this runs on DOM load - you can access all the good stuff now.
var theglobalexml;
//var host = "http://localhost:8080";
//Ext.Ajax.timeout = 180000; //3 minute timeout for ajax calls

//A global instance of GMapInfoWindowManager that helps to open GMap info windows
var mapInfoWindowManager = null;

Ext.onReady(function() {
    var map;
    var formFactory = new FormFactory();
    var searchBarThreshold = 6; //how many records do we need to have before we show a search bar
    
    //Generate our data stores
    var cswRecordStore = new CSWRecordStore('getCSWRecords.do');
    var knownFeatureTypeStore = new KnownFeatureTypeStore('getKnownFeatureTypes.do');
    var customLayersStore = new CSWRecordStore('getCustomLayers.do');
    var activeLayersStore = new ActiveLayersStore();
    
    //Called whenever any of the KnownFeatureType panels click 'Add to Map'
    var kftPanelAddHandler = function(knownFeatureType) {
        var activeLayerRec = activeLayersStore.getByKnownFeatureType(knownFeatureType);
        
        //Only add if the record isn't already there
        if (!activeLayerRec) {
            //add to active layers (At the top of the Z-order)
        	activeLayerRec = activeLayersStore.addKnownFeatureType(knownFeatureType, cswRecordStore);
            
            //invoke this layer as being checked
            activeLayerCheckHandler(activeLayerRec, true);
        }
        
        //set this record to selected
        activeLayersPanel.getSelectionModel().selectRecords([activeLayerRec.internalRecord], false);
    };
    
    //Called whenever any of the CSWPanels click 'Add to Map'
    var cswPanelAddHandler = function(cswRecord) {
        var activeLayerRec = activeLayersStore.getByCSWRecord(cswRecord);
        
        //Only add if the record isn't already there
        if (!activeLayerRec) {
            //add to active layers (At the top of the Z-order)
        	activeLayerRec = activeLayersStore.addCSWRecord(cswRecord);
            
            //invoke this layer as being checked
            activeLayerCheckHandler(activeLayerRec, true);
        }

        //set this record to selected
        activeLayersPanel.getSelectionModel().selectRecords([activeLayerRec.internalRecord], false);
    };
    
    //Returns true if the CSWRecord record intersects the GMap viewport (based on its bounding box)  
    var visibleCSWRecordFilter = function(record) {
    	var cswRecord = new CSWRecord(record);
    	var geoEls = cswRecord.getGeographicElements();
    	var visibleBounds = map.getBounds();
		
		//Iterate every 'bbox' geographic element type looking for an intersection
		//(They will be instances of the BBox class)
		for (var j = 0; j < geoEls.length; j++) {
			var bbox = geoEls[j];
			
			var sw = new GLatLng(bbox.southBoundLatitude, bbox.westBoundLongitude);
	    	var ne = new GLatLng(bbox.northBoundLatitude, bbox.eastBoundLongitude);
	    	var bboxBounds = new GLatLngBounds(sw,ne);
	    	
	    	if (visibleBounds.intersects(bboxBounds)) {
	    		return true;
	    	}
		}
    };
    
    //Returns true if the current records (from the knownFeatureTypeStore) 
    //intersects the GMap viewport (based on its bounding box)
    //false otherwise
    var visibleKnownFeaturesFilter = function(record) {
    	var kft = new KnownFeatureType(record);
    	var linkedCSWRecords = kft.getLinkedCSWRecords(cswRecordStore);
    	var visibleBounds = map.getBounds();
    	
    	//iterate over every CSWRecord that makes up this layer, look for
    	//one whose reported bounds intersects the view port
		for (var i = 0; i < linkedCSWRecords.length; i++) {
			if (visibleCSWRecordFilter(linkedCSWRecords[i].internalRecord)) {
				return true;
			}
		}
		
		return false;
    };
    
    //Given a CSWRecord, show (on the map) the list of bboxes associated with that record temporarily
    //bboxOverlayManager - if specified, will be used to store the overlays, otherwise the cswRecord's 
    //                      bboxOverlayManager will be used
    var showBoundsCSWRecord = function(cswRecord, bboxOverlayManager) {
    	var geoEls = cswRecord.getGeographicElements();
    	
    	if (!bboxOverlayManager) {
	    	bboxOverlayManager = cswRecord.getBboxOverlayManager();
	    	if (bboxOverlayManager) {
	    		bboxOverlayManager.clearOverlays();
	    	} else {
	    		bboxOverlayManager = new OverlayManager(map);
	    		cswRecord.setBboxOverlayManager(bboxOverlayManager);
	    	}
    	}
    	
    	//Iterate our geographic els to get our list of bboxes
    	for (var i = 0; i < geoEls.length; i++) {
    		var geoEl = geoEls[i];
    		if (geoEl instanceof BBox) {
    			var polygonList = geoEl.toGMapPolygon('00FF00', 0, 0.7,'#00FF00', 0.6);
        	    
        	    for (var j = 0; j < polygonList.length; j++) {
        	    	polygonList[j].title = 'bbox';
        	    	bboxOverlayManager.addOverlay(polygonList[j]);
        	    }
    		}
    	}
    	
    	//Make the bbox disappear after a short while 
    	var clearTask = new Ext.util.DelayedTask(function(){
    		bboxOverlayManager.clearOverlays();
    	});

    	clearTask.delay(2000); 
    };
    
    //Pans/Zooms the map so the specified BBox object is visible
    var moveMapToBounds = function(bbox) {
    	var sw = new GLatLng(bbox.southBoundLatitude, bbox.westBoundLongitude);
    	var ne = new GLatLng(bbox.northBoundLatitude, bbox.eastBoundLongitude);
    	var layerBounds = new GLatLngBounds(sw,ne);
    	
    	//Adjust zoom if required
    	var visibleBounds = map.getBounds();
    	map.setZoom(map.getBoundsZoomLevel(layerBounds));
    	
    	//Pan to position
    	var layerCenter = layerBounds.getCenter();
    	map.panTo(layerCenter);
    };
    
    //Pans the map so that all bboxes linked to this record are visible.
    //If currentBounds is specified
    var moveToBoundsCSWRecord = function(cswRecord) {
    	var bboxExtent = cswRecord.generateGeographicExtent();
    	
    	if (!bboxExtent) {
    		return;
    	}
    	
    	moveMapToBounds(bboxExtent);
    };
    
    //Given a KnownFeatureType, show (on the map) the list of bboxes associated with that layer temporarily
    var showBoundsKnownFeatureType = function(knownFeatureType) {
    	var bboxOverlayManager = knownFeatureType.getBboxOverlayManager();
    	if (bboxOverlayManager) {
    		bboxOverlayManager.clearOverlays();
    	} else {
    		bboxOverlayManager = new OverlayManager(map);
    		knownFeatureType.setBboxOverlayManager(bboxOverlayManager);
    	}
    	
    	var linkedRecords = knownFeatureType.getLinkedCSWRecords(cswRecordStore);
    	for (var i = 0; i < linkedRecords.length; i++) {
    		showBoundsCSWRecord(linkedRecords[i], bboxOverlayManager);
    	}
    };
    
    var moveToBoundsKnownFeatureType = function(knownFeatureType) {
    	var linkedRecords = knownFeatureType.getLinkedCSWRecords(cswRecordStore);
    	var superBbox = null;
    	for (var i = 0; i < linkedRecords.length; i++) {
    		var bboxToCombine =  linkedRecords[i].generateGeographicExtent();
    		if (bboxToCombine != null) {
	    		if (superBbox == null) {
	    			superBbox = bboxToCombine;
	    		} else {
	    			superBbox = superBbox.combine(bboxToCombine);
	    		}
    		}
    	}
    	
    	if (superBbox) {
    		moveMapToBounds(superBbox);
    	}
    };
    
    //-----------Known Features Panel Configurations (Groupings of various CSWRecords)
    var knownFeaturesPanel = new KnownFeatureTypeGridPanel('kft-layers-panel', 
												    		'Featured Layers', 
												    		knownFeatureTypeStore, 
												    		kftPanelAddHandler, 
												    		visibleKnownFeaturesFilter, 
												    		showBoundsKnownFeatureType, 
												    		moveToBoundsKnownFeatureType);
        
    //----------- Map Layers Panel Configurations (Drawn from CSWRecords that aren't a KnownFeatureType and are primarily a WMS)
    var wmsLayersFilter = function(cswRecord) {
    	//doesnt show WFS's
    	var onlineResources = cswRecord.getFilteredOnlineResources('WFS');
    	if (onlineResources.length > 0) {
    		return false;
    	}
    	
    	//doesn't show WCS's
    	onlineResources = cswRecord.getFilteredOnlineResources('WCS');
    	if (onlineResources.length > 0) {
    		return false;
    	}
    	
    	//If we don't have a WMS, dont include it
    	onlineResources = cswRecord.getFilteredOnlineResources('WMS');
    	if (onlineResources.length == 0) {
    		return false;
    	}
    	
    	//ensure its not referenced via KnownFeatureType
    	var knownFeatureTypes = cswRecord.getLinkedKnownFeatureTypes(knownFeatureTypeStore);
    	return knownFeatureTypes.length == 0;
    };
    var wmsLayersPanel = new CSWRecordGridPanel('wms-layers-panel', 
									    		'Map Layers', 
									    		cswRecordStore, 
									    		cswPanelAddHandler, 
									    		wmsLayersFilter, 
									    		visibleCSWRecordFilter,
									    		showBoundsCSWRecord, 
									    		moveToBoundsCSWRecord);
        
    
    //----------- Coverage Layers Panel Configurations (Drawn from CSWRecords that aren't a KnownFeatureType and are primarily a WCS)
    var wcsLayersFilter = function(cswRecord) {
    	//doesnt show WFS's
    	var onlineResources = cswRecord.getFilteredOnlineResources('WFS');
    	if (onlineResources.length > 0) {
    		return false;
    	}    	
    	
    	//must include show WCS's
    	onlineResources = cswRecord.getFilteredOnlineResources('WCS');
    	if (onlineResources.length == 0) {
    		return false;
    	}
    	
    	//ensure its not referenced via KnownFeatureType
    	var knownFeatureTypes = cswRecord.getLinkedKnownFeatureTypes(knownFeatureTypeStore);
    	return knownFeatureTypes.length == 0;
    };
    var wcsLayersPanel = new CSWRecordGridPanel('wcs-layers-panel', 
									    		'Coverage Layers',  
									    		cswRecordStore, 
									    		cswPanelAddHandler, 
									    		wcsLayersFilter,
									    		visibleCSWRecordFilter,
									    		showBoundsCSWRecord, 
									    		moveToBoundsCSWRecord);
    
    //------ Custom Layers
    var customLayersPanel = new CustomLayersGridPanel('custom-layers-panel', 
										    		'Custom Layers', 
										    		customLayersStore, 
										    		cswPanelAddHandler, 
										    		showBoundsCSWRecord, 
										    		moveToBoundsCSWRecord);
    
    //Returns an object
    //{
    //    bboxSrs : 'EPSG:4326'
    //    lowerCornerPoints : [numbers]
    //    upperCornerPoints : [numbers]
    //}
    var fetchVisibleMapBounds = function(gMapInstance) {
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
				bboxSrs : 'http://www.opengis.net/gml/srs/epsg.xml#4326',
				lowerCornerPoints : [Math.min(adjustedSWLng, adjustedNELng), Math.min(sw.lat(), ne.lat())],
				upperCornerPoints : [Math.max(adjustedSWLng, adjustedNELng), Math.max(sw.lat(), ne.lat())]
		};
    };
    
    var filterButton = new Ext.Button({
        text     :'Apply Filter >>',
        tooltip  :'Apply Filter',
        disabled : true,
        handler  : function() {
            var activeLayerRecord = new ActiveLayersRecord(activeLayersPanel.getSelectionModel().getSelected());
            wfsHandler(activeLayerRecord);
        }
    });

    /**
     * Used to show extra details for querying services
     */
    var filterPanel = new Ext.Panel({
        title: "Filter Properties",
        region: 'south',
        split: true,
        layout: 'card',
        activeItem: 0,
        height: 200,
        autoScroll  : true,
        layoutConfig: {
            layoutOnCardChange: true// Important when not specifying an items array
        },
        items: [
            {
                html: '<p style="margin:15px;padding:15px;border:1px dotted #999;color:#555;background: #f9f9f9;"> Filter options will be shown here for special services.</p>'
            }
        ],
        bbar: ['->', filterButton]
    });

    /**
     *Iterates through the activeLayersStore and updates each WMS layer's Z-Order to is position within the store
     *
     *This function will refresh every WMS layer too
     */
    var updateActiveLayerZOrder = function() {
        //Update the Z index for each WMS item in the store
        for (var i = 0; i < activeLayersStore.getCount(); i++) {
            var activeLayerRec = new ActiveLayersRecord(activeLayersStore.getAt(i));
            var overlayManager = activeLayerRec.getOverlayManager();
            
            if (overlayManager && activeLayerRec.getLayerVisible()) {
            	var newZOrder = activeLayersStore.getCount() - i;
            	
            	overlayManager.updateZOrder(newZOrder);
            }
        }
    };

    /**
     *@param forceApplyFilter (Optional) if set AND isChecked is set AND this function has a filter panel, it will force the current filter to be loaded
     */
    var activeLayerCheckHandler = function(activeLayerRecord, isChecked, forceApplyFilter) {
        //set the record to be selected if checked
        activeLayersPanel.getSelectionModel().selectRecords([activeLayerRecord.internalRecord], false);

        if (activeLayerRecord.getIsLoading()) {
        	activeLayersPanel.setLayerVisible(!isChecked); //reverse selection
            Ext.MessageBox.show({
                title: 'Please wait',
                msg: "There is an operation in process for this layer. Please wait until it is finished.",
                buttons: Ext.MessageBox.OK,
                animEl: 'mb9',
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        
        activeLayerRecord.setLayerVisible(isChecked); 

        if (isChecked) {
        	var filterPanelObj = activeLayerRecord.getFilterPanel();
        	
            //Create our filter panel if we haven't already
            if (!filterPanelObj) {
            	filterPanelObj = formFactory.getFilterForm(activeLayerRecord, map);
            	activeLayerRecord.setFilterPanel(filterPanelObj);
            } 

            //If the filter panel already exists, this may be a case where we are retriggering visiblity
            //in which case just rerun the previous filter
            if (filterPanelObj.form && forceApplyFilter && !filterButton.disabled) {
                filterButton.handler();
            }
            
            //If there is a filter panel, show it
            if (filterPanelObj.form) {
            	filterPanel.add(filterPanelObj.form);
                filterPanel.getLayout().setActiveItem(activeLayerRecord.getId());
            }
            
            //if we enable the filter button we don't download the layer immediately (as the user will have to enter in filter params)
            if (filterPanelObj.supportsFiltering) {
                filterButton.enable();
                filterButton.toggle(true);
            } else {
            	//Otherwise the layer doesn't need filtering, just display it immediately
                var cswRecords = activeLayerRecord.getCSWRecords();
                
                //We simplify things by treating the record list as a single type of WFS, WCS or WMS
                //So lets find the first record with a type we can choose (Prioritise WFS -> WCS -> WMS) 
                for (var i = 0; i < cswRecords.length; i++) {
                	
                	var onlineResources = cswRecords[i].getFilteredOnlineResources('WFS');
                	if (onlineResources.length != 0) {
                		wfsHandler(activeLayerRecord);
                		break;
                	}
                	
                	onlineResources = cswRecords[i].getFilteredOnlineResources('WCS');
                	if (onlineResources.length != 0) {
                		wcsHandler(activeLayerRecord);
                		break;
                	}
                	
                	onlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
                	if (onlineResources.length != 0) {
                		wmsHandler(activeLayerRecord);
                		break;
                	}
                }
            }
            filterPanel.doLayout();
            
        } else {
        	//Otherwise we are making the layer invisible, so clear any overlays
        	var overlayManager = activeLayerRecord.getOverlayManager();
        	if (overlayManager) {
        		overlayManager.clearOverlays();
        	}
        	
            filterPanel.getLayout().setActiveItem(0);
            filterButton.disable();
        }
    };
    
    //The WCS handler will create a representation of a coverage on the map for a given WCS record
    //If we have a linked WMS url we should use that (otherwise we draw an ugly red bounding box)
    var wcsHandler = function(activeLayerRecord) {
    	
    	//get our overlay manager (create if required)
    	var overlayManager = activeLayerRecord.getOverlayManager();
    	if (!overlayManager) {
    		overlayManager = new OverlayManager(map);
    		activeLayerRecord.setOverlayManager(overlayManager);
    	}
    	
    	overlayManager.clearOverlays();
        
    	var responseTooltip = new ResponseTooltip();
    	activeLayerRecord.setResponseToolTip(responseTooltip);
    	
    	//Attempt to handle each CSW record as a WCS (if possible).
    	var cswRecords = activeLayerRecord.getCSWRecordsWithType('WCS');
    	for (var i = 0; i < cswRecords.length; i++) {
    		var wmsOnlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
    		var wcsOnlineResources = cswRecords[i].getFilteredOnlineResources('WCS');
    		var geographyEls = cswRecords[i].getGeographicElements();
    		
    		//Assumption - We only contain a single WCS in a CSWRecord (although more would be possible)
    		var wcsOnlineResource = wcsOnlineResources[0];
    		
    		if (geographyEls.length == 0) {
    			responseTooltip.addResponse(wcsOnlineResource.url, 'No bounding box has been specified for this coverage.');
    			continue;
    		}
    		
    		//We will need to add the bounding box polygons regardless of whether we have a WMS service or not.
            //The difference is that we will make the "WMS" bounding box polygons transparent but still clickable
    		var polygonList = [];
    		for (var j = 0; j < geographyEls.length; j++) {
    			var thisPolygon = null;
    			if (wmsOnlineResources.length > 0) {
    				thisPolygon = geographyEls[j].toGMapPolygon('#000000', 0, 0.0,'#000000', 0.0);
    	        } else {
    	        	thisPolygon = geographyEls[j].toGMapPolygon('#FF0000', 0, 0.7,'#FF0000', 0.6);
    	        }
    			
    			polygonList = polygonList.concat(thisPolygon);
    		}
    		
    		//Add our overlays (they will be used for clicking so store some extra info)
    		for (var j = 0; j < polygonList.length; j++) {
    			polygonList[j].onlineResource = wcsOnlineResource;
            	polygonList[j].cswRecord = cswRecords[i].internalRecord;
            	polygonList[j].activeLayerRecord = activeLayerRecord.internalRecord;
    	        
            	overlayManager.addOverlay(polygonList[j]);
    		}
    		
    		//Add our WMS tiles (if any)
            for (var j = 0; j < wmsOnlineResources.length; j++) {
            	var tileLayer = new GWMSTileLayer(map, new GCopyrightCollection(""), 1, 17);
                tileLayer.baseURL = wmsOnlineResources[i].url;
                tileLayer.layers = wmsOnlineResources[i].name;
                tileLayer.opacity = activeLayerRecord.getOpacity();

                overlayManager.addOverlay(new GTileLayerOverlay(tileLayer));
            }
    	}
    	
    	//This will update the Z order of our WMS layers
        updateActiveLayerZOrder();
    };

    var wfsHandler = function(activeLayerRecord) {
        //if there is already a filter running for this record then don't call another
        if (activeLayerRecord.getIsLoading()) {
            Ext.MessageBox.show({
                title: 'Please wait',
                msg: "There is an operation in process for this layer. Please wait until it is finished.",
                buttons: Ext.MessageBox.OK,
                animEl: 'mb9',
                icon: Ext.MessageBox.INFO
            });
            return;
        }

        //Get our overlay manager (create if required).
        var overlayManager = activeLayerRecord.getOverlayManager();
        if (!overlayManager) {
        	overlayManager = new OverlayManager(map);
        	activeLayerRecord.setOverlayManager(overlayManager);
        }
        overlayManager.clearOverlays();

        //a response status holder
        var responseTooltip = new ResponseTooltip();
        activeLayerRecord.setResponseToolTip(responseTooltip);

        //Prepare our query/locations
        var cswRecords = activeLayerRecord.getCSWRecordsWithType('WFS');
        var iconUrl = activeLayerRecord.getIconUrl();
        var finishedLoadingCounter = cswRecords.length;
        
        //Begin loading from each service 
        activeLayerRecord.setIsLoading(true);
        for (var i = 0; i < cswRecords.length; i++) {
        	//Assumption - We will only have 1 WFS linked per CSW
        	var wfsOnlineResource = cswRecords[i].getFilteredOnlineResources('WFS')[0];
        	
        	//Generate our filter parameters for this service
        	var filterParameters = null;
            if (filterPanel.getLayout().activeItem == filterPanel.getComponent(0)) {
            	filterParameters = {typeName : wfsOnlineResource.name}; 
            } else {
            	filterParameters = filterPanel.getLayout().activeItem.getForm().getValues();
            }
            filterParameters.maxFeatures=200; // limit our feature request to 200 so we don't overwhelm the browser
        	filterParameters.bbox = Ext.util.JSON.encode(fetchVisibleMapBounds(map)); // This line activates bbox support AUS-1597
        	filterParameters.serviceUrl = wfsOnlineResource.url;
        	
            handleQuery(activeLayerRecord, cswRecords[i], wfsOnlineResource, filterParameters, function() {
                //decrement the counter
                finishedLoadingCounter--;

                //check if we can set the status to finished
                if (finishedLoadingCounter <= 0) {
                	activeLayerRecord.setIsLoading(false);
                }
            });
        }
    };
                    
    /**
     * internal helper method for Handling WFS filter queries via a proxyUrl and adding them to the map.
     */
    var handleQuery = function(activeLayerRecord, cswRecord, onlineResource, filterParameters, finishedLoadingHandler) {

    	var responseTooltip = activeLayerRecord.getResponseToolTip();
        responseTooltip.addResponse(filterParameters.serviceUrl, "Loading...");

        var kfts = cswRecord.getLinkedKnownFeatureTypes(knownFeatureTypeStore);
        
        Ext.Ajax.request({
        	url			: activeLayerRecord.getProxyUrl(),
        	params		: filterParameters,
        	timeout		: 1000 * 60 * 20, //20 minute timeout
        	failure		: function(response) {
        		responseTooltip.addResponse(filterParameters.serviceUrl, 'ERROR ' + response.status + ':' + response.statusText);
        		finishedLoadingHandler();
        	},
        	success		: function(response) {
        		var jsonResponse = Ext.util.JSON.decode(response.responseText);
        		
        		if (jsonResponse.success) {
                	var icon = new GIcon(G_DEFAULT_ICON, activeLayerRecord.getIconUrl());   
                	
                	//Assumption - we are only interested in the first (if any) KnownFeatureType
                	if (kfts.length > 0) {
                		var iconSize = kfts[0].getIconSize();
                		if (iconSize) {
                			icon.iconSize = new GSize(iconSize.width, iconSize.height);
                		}
                		
                		var iconAnchor = kfts[0].getIconAnchor();
                		if(iconAnchor) {
                        	icon.iconAnchor = new GPoint(iconAnchor.x, iconAnchor.y);
                        }
                		
                		var infoWindowAnchor = kfts[0].getInfoWindowAnchor();
                        if(infoWindowAnchor) {
                        	icon.infoWindowAnchor = new GPoint(infoWindowAnchor.x, infoWindowAnchor.y);
                        }
                	}
                	
                	//TODO: This is a hack to remove marker shadows. Eventually it should be 
                    // put into an external config file or become a session-based preference.
                	icon.shadow = null;
                	
                    //Parse our KML
                    var parser = new KMLParser(jsonResponse.data.kml);
                    parser.makeMarkers(icon, function(marker) {
                        marker.activeLayerRecord = activeLayerRecord.internalRecord;
                        marker.cswRecord = cswRecord.internalRecord;
                        marker.onlineResource = onlineResource;
                    });
                    
                    var markers = parser.markers;
                    var overlays = parser.overlays;
                    
                    //Add our single points and overlays
                    var overlayManager = activeLayerRecord.getOverlayManager();
                    overlayManager.markerManager.addMarkers(markers, 0);
                    for(var i = 0; i < overlays.length; i++) {
                    	overlayManager.addOverlay(overlays[i]);
                    }
                    overlayManager.markerManager.refresh();

                    //store the status
                    responseTooltip.addResponse(filterParameters.serviceUrl, (markers.length + overlays.length) + " records retrieved.");
                } else {
                    //store the status
                	responseTooltip.addResponse(filterParameters.serviceUrl, jsonResponse.msg);
                }
        		
        		//we are finished
        		finishedLoadingHandler();
        	}
        });
    };

    var wmsHandler = function(activeLayerRecord) {
    	
    	//Get our overlay manager (create if required).
        var overlayManager = activeLayerRecord.getOverlayManager();
        if (!overlayManager) {
        	overlayManager = new OverlayManager(map);
        	activeLayerRecord.setOverlayManager(overlayManager);
        }
        overlayManager.clearOverlays();
    	
    	//Add each and every WMS we can find
    	var cswRecords = activeLayerRecord.getCSWRecordsWithType('WMS');
    	for (var i = 0; i < cswRecords.length; i++) {
    		var wmsOnlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
    		for (var j = 0; j < wmsOnlineResources.length; j++) {
		        var tileLayer = new GWMSTileLayer(map, new GCopyrightCollection(""), 1, 17);
		        tileLayer.baseURL = wmsOnlineResources[j].url;
		        tileLayer.layers = wmsOnlineResources[j].name;
		        tileLayer.opacity = activeLayerRecord.getOpacity();
		
		        overlayManager.addOverlay(new GTileLayerOverlay(tileLayer));
    		}
    	}
    	
    	//This will handle adding the WMS layer(s) (as well as updating the Z-Order)
        updateActiveLayerZOrder();
    };

    //This handler is called whenever the user selects an active layer
    var activeLayerSelectionHandler = function(activeLayerRecord) {
        //if its not checked then don't do any actions
        if (!activeLayerRecord.getLayerVisible()) {
            filterPanel.getLayout().setActiveItem(0);
            filterButton.disable();
        } else if (activeLayerRecord.getFilterPanel() != null) {
        	var filterPanelObj = activeLayerRecord.getFilterPanel();
        	
            //if filter panel already exists then show it
            filterPanel.getLayout().setActiveItem(activeLayerRecord.getId());
            
            if (filterPanelObj.supportsFiltering) {
            	filterButton.enable();
                filterButton.toggle(true);
            } else {
            	filterButton.disable();
            }
        } else {
            //if this type doesnt need a filter panel then just show the default filter panel
            filterPanel.getLayout().setActiveItem(0);
            filterButton.disable();
        }
    };


    //This handler is called on records that the user has requested to delete from the active layer list
    var activeLayersRemoveHandler = function(activeLayerRecord) {
        if (activeLayerRecord.getIsLoading()) {
            Ext.MessageBox.show({
                title: 'Please wait',
                msg: "There is an operation in process for this layer. Please wait until it is finished.",
                buttons: Ext.MessageBox.OK,
                animEl: 'mb9',
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        
        var overlayManager = activeLayerRecord.getOverlayManager();
        if (overlayManager) {
        	overlayManager.clearOverlays();
        }

        //remove it from active layers
        activeLayersStore.removeActiveLayersRecord(activeLayerRecord);

        //set the filter panels active item to 0
        filterPanel.getLayout().setActiveItem(0);
    };             

    this.activeLayersPanel = new ActiveLayersGridPanel('active-layers-panel', 
											    		'Active Layers', 
											    		activeLayersStore, 
											    		activeLayerSelectionHandler, 
											    		updateActiveLayerZOrder, 
											    		activeLayersRemoveHandler,
											    		activeLayerCheckHandler);
    
    /**
     * Tooltip for the active layers
     */
    var activeLayersToolTip = null;

    /**
     * Handler for mouse over events on the active layers panel, things like server status, and download buttons
     */
    this.activeLayersPanel.on('mouseover', function(e, t) {
        e.stopEvent();

        var row = e.getTarget('.x-grid3-row');
        var col = e.getTarget('.x-grid3-col');

        //if there is no visible tooltip then create one, if on is visible already we dont want to layer another one on top
        if (col != null && (activeLayersToolTip == null || !activeLayersToolTip.isVisible())) {

            //get the actual data record
            var theRow = activeLayersPanel.getView().findRow(row);
            var activeLayerRecord = new ActiveLayersRecord(activeLayersPanel.getStore().getAt(theRow.rowIndex));
            
            //This is for the key/legend column
            if (col.cellIndex == '1') {
            	
            	if (activeLayerRecord.getCSWRecordsWithType('WMS').length > 0) {
	                activeLayersToolTip = new Ext.ToolTip({
	                    target: e.target ,
	                    autoHide : true,
	                    html: 'Show the key/legend for this layer' ,
	                    anchor: 'bottom',
	                    trackMouse: true,
	                    showDelay:60,
	                    autoHeight:true,
	                    autoWidth: true
	                });
            	}
            }
            //this is the status icon column
            else if (col.cellIndex == '2') {
                var html = 'No status has been recorded.';
                
                if (activeLayerRecord.getResponseToolTip() != null)
                    html = activeLayerRecord.getResponseToolTip().getHtml();

                activeLayersToolTip = new Ext.ToolTip({
                    target: e.target ,
                    title: 'Status Information',
                    autoHide : true,
                    html: html ,
                    anchor: 'bottom',
                    trackMouse: true,
                    showDelay:60,
                    autoHeight:true,
                    autoWidth: true
                });
            }
            //this is the column for download link icons
            else if (col.cellIndex == '5') {
                activeLayersToolTip = new Ext.ToolTip({
                    target: e.target ,
                    //title: 'Status Information',
                    autoHide : true,
                    html: 'Download data for this layer.' ,
                    anchor: 'bottom',
                    trackMouse: true,
                    showDelay:60,
                    autoHeight:true,
                    autoWidth: true
                });
            }
        }
    });

    /**
     * Handler for click events on the active layers panel, used for the  
     * new browser window popup which shows the GML or WMS image
     */
    this.activeLayersPanel.on('click', function(e, t) {
        e.stopEvent();

        var row = e.getTarget('.x-grid3-row');
        var col = e.getTarget('.x-grid3-col');

        // if there is no visible tooltip then create one, if on is 
        // visible already we don't want to layer another one on top
        if (col != null) {

            //get the actual data record
            var theRow = activeLayersPanel.getView().findRow(row);
            var activeLayerRecord = new ActiveLayersRecord(activeLayersPanel.getStore().getAt(theRow.rowIndex));
            
            //This is the marker key column
            if (col.cellIndex == '1') {
            	//For WMS, we request the Legend and display it
            	var cswRecords = activeLayerRecord.getCSWRecordsWithType('WMS');
            	if (cswRecords.length > 0) {
            		
            		//Only show the legend window if it's not currently visible
            		var win = activeLayerRecord.getLegendWindow();
            		if (!win || (win && !win.isVisible())) {
            			
            			//Generate a legend for each and every WMS linked to this record
            			var html = '';
            			var titleTypes = '';
            			for (var i = 0; i < cswRecords.length; i++) {
            				var wmsOnlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
            				for (var j = 0; j < wmsOnlineResources.length; j++) {
			            		var url = new LegendManager(wmsOnlineResources[j].url, wmsOnlineResources[j].name).generateImageUrl();
			            		
			            		if (titleTypes.length != 0) {
			            			titleTypes += ', ';
			            		}
			            		titleTypes += wmsOnlineResources[j].name;
			            		
			            		html += '<a target="_blank" href="' + url + '">';
			            		html += '<img alt="Loading legend..." src="' + url + '"/>';
			            		html += '</a>';
			            		html += '<br/>';
            				}
            			}
	            		
	            		win = new Ext.Window({
	            			title		: 'Legend: ' + titleTypes,
	                        layout		: 'fit',
	                        width		: 200,
	                        height		: 300,
	
	                        items: [{
	                        	xtype 	: 'panel',
	                        	html	: html,
	                        	autoScroll	: true
	                        }]
	                    });
	
	            		//Save our window reference so we can tell if its already been open
	            		activeLayerRecord.setLegendWindow(win);
	            		
	            		win.show(this);
            		} else if (win){
            			//The window is already open
            			win.toFront();
            			win.center();
            			win.focus();
            		}
            	}
            }
            //this is the column for download link icons
            else if (col.cellIndex == '5') {
            	var keys = [];
                var values = [];
            	
                //We simplify things by treating the record list as a single type of WFS, WCS or WMS
                //So lets find the first record with a type we can choose (Prioritise WFS -> WCS -> WMS)
                var cswRecords = activeLayerRecord.getCSWRecordsWithType('WFS');
                if (cswRecords.length != 0) {
                	for (var i = 0; i < cswRecords.length; i++) {
                		var wfsOnlineResources = cswRecords[i].getFilteredOnlineResources('WFS');
                		
                		for (var j = 0; j < wfsOnlineResources.length; j++) {
                			var typeName = wfsOnlineResources[j].name;
                			var url = wfsOnlineResources[j].url;
                			var filterParameters = filterPanel.getLayout().activeItem == filterPanel.getComponent(0) ? "&typeName=" + typeName : filterPanel.getLayout().activeItem.getForm().getValues(true);
                			
                			keys.push('serviceUrls');
                			values.push(window.location.protocol + "//" + window.location.host + WEB_CONTEXT + "/" + activeLayerRecord.getProxyUrl() + "?" + filterParameters + "&serviceUrl=" + url);
                		}
                	}

                    openWindowWithPost("downloadGMLAsZip.do?", 'WFS_Layer_Download_'+new Date().getTime(), keys, values);
                    return;
                }
                
                cswRecords = activeLayerRecord.getCSWRecordsWithType('WCS');
                if (cswRecords.length != 0) {
                	//Assumption - we only expect 1 WCS 
            		var wcsOnlineResource = cswRecords[0].getFilteredOnlineResources('WCS')[0];
            		showWCSDownload(wcsOnlineResource.url, wcsOnlineResource.name);
            		return;
                }
                
                //For WMS we download every WMS
                cswRecords = activeLayerRecord.getCSWRecordsWithType('WMS');
                if (cswRecords.length != 0) {
                	for (var i = 0; i < cswRecords.length; i++) {
	                	var wmsOnlineResources = cswRecords[i].getFilteredOnlineResources('WMS');
	    				for (var j = 0; j < wmsOnlineResources.length; j++) {
	    					var boundBox = (map.getBounds().getSouthWest().lng() < 0 ? map.getBounds().getSouthWest().lng() + 360.0 : map.getBounds().getSouthWest().lng()) + "," +
	                        map.getBounds().getSouthWest().lat() + "," +
	                        (map.getBounds().getNorthEast().lng() < 0 ? map.getBounds().getNorthEast().lng() + 360.0 : map.getBounds().getNorthEast().lng()) + "," +
	                        map.getBounds().getNorthEast().lat();
	
					         var url = wmsOnlineResources[j].url;
					         var typeName = wmsOnlineResources[j].name;
					                                       
					         var last_char = url.charAt(url.length - 1);
					         if ((last_char !== "?") && (last_char !== "&")) {
					             if (url.indexOf('?') == -1) {
					                 url += "?";
					             } else {
					                 url += "&";
					             }
					         }
					          
					         url += "REQUEST=GetMap";
					         url += "&SERVICE=WMS";
					         url += "&VERSION=1.1.0";
					         url += "&LAYERS=" + typeName;
					         if (this.styles)
					             url += "&STYLES=" + this.styles;
					         else
					             url += "&STYLES="; //Styles parameter is mandatory, using a null string ensures default style  
					         /*
					          if (this.sld)
					          url += "&SLD=" + this.sld;*/
					         url += "&FORMAT=" + "image/png";
					         url += "&BGCOLOR=0xFFFFFF";
					         url += "&TRANSPARENT=TRUE";
					         url += "&SRS=" + "EPSG:4326";
					         url += "&BBOX=" + boundBox;
					         url += "&WIDTH=" + map.getSize().width;
					         url += "&HEIGHT=" + map.getSize().height;
					
					         keys.push('serviceUrls');
					         values.push(url);
	    				}
	                }
                	
                	openWindowWithPost("downloadWMSAsZip.do?", 'WMS_Layer_Download_'+new Date().getTime(), keys, values);
                	return;
                }
            }
        }
    });

    /**
     * Opens a new window to the specified URL and passes URL parameters like so keys[x]=values[x]
     *
     * @param {String} url
     * @param {String} name
     * @param {Array}  keys
     * @param {Array} values
     */
    var openWindowWithPost = function(url, name, keys, values)
    {
        if (keys && values && (keys.length == values.length)) {
            for (var i = 0; i < keys.length; i++) {
                url += '&' + keys[i] + '=' + escape(values[i]);
            }
        }
        downloadFile(url);
    };

    //downloads given specified file.
    downloadFile = function(url) {
        var body = Ext.getBody();
        var frame = body.createChild({
            tag:'iframe',
            cls:'x-hidden',
            id:'iframe',
            name:'iframe'
        });
        var form = body.createChild({
            tag:'form',
            cls:'x-hidden',
            id:'form',
            target:'iframe',
            method:'POST'
        });
        form.dom.action = url;
        form.dom.submit();
    }
    
    // basic tabs 1, built from existing content
    var tabsPanel = new Ext.TabPanel({
        //width:450,
        activeTab: 0,
        region:'north',
        split: true,
        height: 225,
        autoScroll: true,
        //autosize:true,
        items:[
            knownFeaturesPanel,
            wmsLayersPanel,
            wcsLayersPanel,
            customLayersPanel
        ]
    });

    /**
     * Used as a placeholder for the tree and details panel on the left of screen
     */
    var westPanel = {
        layout: 'border',
        region:'west',
        border: false,
        split:true,
        //margins: '100 0 0 0',
        margins:'100 0 0 3',
        width: 380,
        items:[tabsPanel , activeLayersPanel, filterPanel]
    };

    /**
     * This center panel will hold the google maps
     */
    var centerPanel = new Ext.Panel({
        region: 'center', 
        id: 'center_region', 
        margins: '100 0 0 0', 
        cmargins:'100 0 0 0'
    });

    /**
     * Add all the panels to the viewport
     */
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[westPanel, centerPanel]
    });

    // Is user's browser suppported by Google Maps?
    if (GBrowserIsCompatible()) {

        map = new GMap2(centerPanel.body.dom);
        
        /* TODO:    AUS-1526
        // Two ways of enabling search bar      
        map = new GMap2( centerPanel.body.dom
                       , {googleBarOptions:{ showOnLoad : true//,
                          //resultList:G_GOOGLEBAR_RESULT_LIST_SUPPRESS//,
                                             //onMarkersSetCallback : myCallback
                                            }
                        });
        or ... */
        
        map.enableGoogleBar();
        /*        
        // Problems, find out how to
        1. turn out advertising
        2. Narrow down location seraches to the current map view 
                        (or Australia). Search for Albany retruns Albany, US
        */
        
        map.setUIToDefault();
        
        //add google earth
        map.addMapType(G_SATELLITE_3D_MAP);

        // Large pan and zoom control
        //map.addControl(new GLargeMapControl(),  new GControlPosition(G_ANCHOR_TOP_LEFT));

        // Toggle between Map, Satellite, and Hybrid types
        map.addControl(new GMapTypeControl());

        var startZoom = 4;
        map.setCenter(new google.maps.LatLng(-26, 133.3), startZoom);
        map.setMapType(G_SATELLITE_MAP);

        //Thumbnail map
        var Tsize = new GSize(150, 150);
        map.addControl(new GOverviewMapControl(Tsize));

        map.addControl(new DragZoomControl(), new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(345, 7)));
        
        mapInfoWindowManager = new GMapInfoWindowManager(map);
    }

    // Fix for IE/Firefox resize problem (See issue AUS-1364 and AUS-1565 for more info)
    map.checkResize();
    centerPanel.on('resize', function() {
        map.checkResize();
    });
    
    //updateCSWRecords dud gloabal for geoxml class
    theglobalexml = new GeoXml("theglobalexml", map, null, null);

    //event handlers and listeners
    //tree.on('click', function(node, event) { treeNodeOnClickController(node, event, viewport, filterPanel); });
    //tree.on('checkchange', function(node, isChecked) { treeCheckChangeController(node, isChecked, map, statusBar, viewport, downloadUrls, filterPanel); });

    //when updateCSWRecords person clicks on updateCSWRecords marker then do something
    GEvent.addListener(map, "click", function(overlay, latlng) {
        gMapClickController(map, overlay, latlng, activeLayersStore);
    });

    GEvent.addListener(map, "mousemove", function(latlng){
        var latStr = "<b>Long:</b> " + latlng.lng().toFixed(6)
                   + "&nbsp&nbsp&nbsp&nbsp"
                   + "<b>Lat:</b> " + latlng.lat().toFixed(6);
    	document.getElementById("latlng").innerHTML = latStr;
    });

    GEvent.addListener(map, "mouseout", function(latlng){
        document.getElementById("latlng").innerHTML = "";
    });
    
    //new Ext.LoadMask(tabsPanel.el, {msg: 'Please Wait...', store: wmsLayersStore});
    //new Ext.LoadMask(complexFeaturesPanel.el, {msg: 'Please Wait...', store: complexFeaturesStore});
    //new Ext.LoadMask(wmsLayersPanel.el, {msg: 'Please Wait...', store: wmsLayersStore});
    
    cswRecordStore.load({});
    knownFeatureTypeStore.load();
});