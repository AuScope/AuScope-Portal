/**
 * Subclass of the portal-core OpenLayers Concrete implementation to add GA-specific features
 * such as the query mode tool.
 */
Ext.define('ga.map.openlayers.GAOpenLayersMap', {
    extend : 'portal.map.openlayers.OpenLayersMap',

    map : null, //Instance of OpenLayers.Map
    vectorLayers : [],    
    selectControl : null,
    layerSwitcher : null,

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Handler for click events
     *
     * @param vector [Optional] OpenLayers.Feature.Vector the clicked feature (if any)
     * @param e Event The click event that caused this handler to fire
     */
    _onClick : function(vector, e) {
        
        // by default, shift+click does a zoom. therefore don't do the query.
        if (e.shiftKey) {
            return;
        }
        
        // secondly, check whether the query control is active
        var queryControl = this.map.getControlsBy('id', 'queryControl')[0];
        if (queryControl.active) {
        
            var primitive = vector ? vector.attributes['portalBasePrimitive'] : null;
            var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
            lonlat = lonlat.transform('EPSG:3857','EPSG:4326');
            var longitude = lonlat.lon;
            var latitude = lonlat.lat;
            var layer = primitive ? primitive.getLayer() : null;
    
            var queryTargets = [];
            if (primitive && layer && primitive instanceof portal.map.openlayers.primitives.Polygon) {
                queryTargets = this._makeQueryTargetsPolygon(primitive, this.layerStore, longitude, latitude);
            } else if (primitive && layer) {
                queryTargets = this._makeQueryTargetsVector(primitive, longitude, latitude);
            } else {
                queryTargets = this._makeQueryTargetsMap(this.layerStore, longitude, latitude);
            }
    
            //We need something to handle the clicks on the map
            var queryTargetHandler = Ext.create('portal.layer.querier.QueryTargetHandler', {});
            
            var navControl = this.map.getControlsByClass('OpenLayers.Control.Navigation')[0];
            if (navControl && navControl.active) {   
                queryTargetHandler.handleQueryTargets(this, queryTargets);
            }            
            
            // reactivate the default control
            var panControl = this.map.getControlsByClass('OpenLayers.Control.Navigation')[0];
            panControl.activate();
        }
    },
    
    
    
    /**
     * Renders this map to the specified Ext.container.Container along with its controls and
     * event handlers.
     *
     * Also sets the rendered property.
     *
     * function(container)
     *
     * @param container The container to receive the map
     */
    renderToContainer : function(container,divId) {
        //VT: manually set the id.
        var containerId = divId;
        var me = this;

        this.map = new OpenLayers.Map({
            div: containerId,
            projection: 'EPSG:3857',
            controls : [],
            layers: [
                     new OpenLayers.Layer.WMS (
                         "World Political Boundaries",
                         "http://www.ga.gov.au/gis/services/topography/World_Political_Boundaries_WM/MapServer/WMSServer",
                         {layers: 'Countries'}
                     ),
                     new OpenLayers.Layer.Google(
                             "Google Hybrid",
                             {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
                     ),
                     new OpenLayers.Layer.Google(
                         "Google Physical",
                         {type: google.maps.MapTypeId.TERRAIN}
                     ),
                     new OpenLayers.Layer.Google(
                         "Google Streets", 
                         {numZoomLevels: 20}
                     ),
                     // the default
                     new OpenLayers.Layer.Google(
                         "Google Satellite",
                         {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
                     )
                 ],
                 center: new OpenLayers.LonLat(133.3, -26)
                     // Google.v3 uses web mercator as projection, so we have to
                     // transform our coordinates
                     .transform('EPSG:4326', 'EPSG:3857'),
                 zoom: 4
        });

        this.highlightPrimitiveManager = this.makePrimitiveManager();
        this.container = container;
        this.rendered = true;               
        
        // default control, the hand/pan control
        var panControl = new OpenLayers.Control.Navigation();
        
        // a customZoomBox which fires an afterZoom event.       
        var zoomBoxControl = new OpenLayers.Control.ZoomBox({alwaysZoom:true,zoomOnClick:false});
        
        var queryControl = new OpenLayers.Control.Button({ 
            title: "Query Mode",
            id: 'queryControl',
            displayClass: 'olControlInfo',
            trigger: function() {me._activateClickControl()},
            type: OpenLayers.Control.TYPE_TOOL
          }); 
        
        queryControl.activate();
        
        var customNavToolBar = OpenLayers.Class(OpenLayers.Control.NavToolbar, {
            initialize: function(options) {
                OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
                this.addControls([panControl, zoomBoxControl, queryControl])
            }
        });
        
        var customNavTb=new customNavToolBar();
        customNavTb.controls[0].events.on({
            'activate': function() {
                Ext.get('center_region-map').dom.style.cursor = 'move';
            }
        });
        customNavTb.controls[1].events.on({
            'activate': function() {
                Ext.get('center_region-map').dom.style.cursor = 'crosshair';
            },
            //VT: once we catch the afterZoom event, reset the control to panning.
            "afterZoom": function() {
                me.fireEvent('afterZoom', this);                             

               // reset the control to panning.
               customNavTb.defaultControl=customNavTb.controls[0];
               customNavTb.activateControl(customNavTb.controls[0]);
            }
        });
        
        customNavTb.controls[2].events.on({
            'activate': function() {
                Ext.get('center_region-map').dom.style.cursor = 'default';
            }
        });
        
        // add controls to trhe map
        this.map.addControl(new OpenLayers.Control.Navigation());
        this.map.addControl(new OpenLayers.Control.PanZoomBar({zoomStopHeight:8}));
        this.map.addControl(new OpenLayers.Control.MousePosition({
            "numDigits": 2,
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            prefix: '<a target="_blank" href="http://spatialreference.org/ref/epsg/4326/">Map coordinates (WGS84 decimal degrees)</a>: ' ,
            suffix : ' / lat lng',
            emptyString : '<a target="_blank" href="http://spatialreference.org/ref/epsg/4326/">Map coordinates (WGS84 decimal degrees): </a> Out of bound',
            element : Ext.get('latlng').dom,
            formatOutput: function(lonLat) {
                var digits = parseInt(this.numDigits);
                var newHtml =
                    this.prefix +
                    lonLat.lat.toFixed(digits) +
                    this.separator +
                    lonLat.lon.toFixed(digits) +
                    this.suffix;
                return newHtml;
             }
        })); 
        this.map.addControl(customNavTb);            

        //If we are allowing data selection, add an extra control to the map
        if (this.allowDataSelection) {
            //This panel will hold our Draw Control. It will also custom style it
            var panel = new OpenLayers.Control.Panel({
                createControlMarkup: function(control) {
                    var button = document.createElement('button'),
                        iconSpan = document.createElement('span'),
                        activeTextSpan = document.createElement('span');
                        inactiveTextSpan = document.createElement('span');

                    iconSpan.innerHTML = '&nbsp;';
                    button.appendChild(iconSpan);

                    activeTextSpan.innerHTML = control.activeText;
                    Ext.get(activeTextSpan).addCls('active-text');
                    button.appendChild(activeTextSpan);

                    inactiveTextSpan.innerHTML = control.inactiveText;
                    Ext.get(inactiveTextSpan).addCls('inactive-text');
                    button.appendChild(inactiveTextSpan);

                    button.setAttribute('id', control.buttonId);

                    return button;
                }
            });
            
            this._drawCtrlVectorLayer = this._getNewVectorLayer();
                       
            var drawFeatureCtrl = new OpenLayers.Control.DrawFeature(this._drawCtrlVectorLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 4,
                    irregular: true
                },
                title:'Draw a bounding box to select data in a region.',
                activeText: 'Click and drag a region of interest',
                buttonId : 'gmap-subset-control',
                inactiveText : 'Select Data'
            });
            panel.addControls([drawFeatureCtrl]);

            //We need to ensure the click controller and other controls aren't active at the same time
            drawFeatureCtrl.events.register('activate', {}, function() {
                me._deactivateClickControl();
                Ext.each(customNavTb.controls, function(ctrl) {
                   ctrl.deactivate();
                });
            });
            drawFeatureCtrl.events.register('deactivate', {}, function() {
                me._activateClickControl();
            });
            Ext.each(customNavTb.controls, function(ctrl) {
                ctrl.events.register('activate', {}, function() {
                    drawFeatureCtrl.deactivate();
                });
            });

            //We need to listen for when a feature is drawn and act accordingly
            drawFeatureCtrl.events.register('featureadded', {}, Ext.bind(function(e) {this._handleDrawCtrlAddFeature(e);}, this));

            this.map.addControl(panel);
        }
        
        // There was an option to call _addMapCreatedEventListener(fn, args) to callback once the map is created.  Call them.
        this._callMapCreatedEventListeners();

        //Finally listen for resize events on the parent container so we can pass the details
        //on to Openlayers.
        container.on('resize', function() {
            this.map.updateSize();
        }, this);
        
        //Finally listen for boxready events on the parent container so we can pass the details
        //on to Openlayers.
        container.on('boxready', function() {
            this.map.updateSize();
        }, this);      
       
    },
    
    _makeQueryTargetsMap : function(layerStore, longitude, latitude) {
        var queryTargets = [];
        if (!layerStore) {
            return queryTargets;
        }
        
        //Iterate everything with WMS/WCS - no way around this :(
        for (var i = 0; i < layerStore.getCount(); i++) {
            var layer = layerStore.getAt(i);
          
            var cswRecords = layer.get('cswRecords');
            for(var j = 0; j < cswRecords.length; j++){

                var cswRecord = cswRecords[j];

                //ensure this click lies within this CSW record
                var containsPoint = false;
                var geoEls = cswRecord.get('geographicElements');
                for (var k = 0; k < geoEls.length; k++) {
                    if (geoEls[k] instanceof portal.util.BBox &&
                        geoEls[k].contains(latitude, longitude)) {
                        containsPoint = true;
                        break;
                    }
                }

                //If it doesn't, don't consider this point for examination
                if (!containsPoint || layer.visible==false) {
                    continue;
                }

                //Finally we don't include WMS query targets if we
                //have WCS queries for the same record
                var allResources = cswRecord.get('onlineResources');
                var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allResources, portal.csw.OnlineResource.WMS);
                var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allResources, portal.csw.OnlineResource.WCS);


                //VT: if layerswitcher layer visibility is set to false, then do not query that layer as well.
                if (wmsResources[0]) {
                    var layerSwitcherVisible=true;
                    var layerName=wmsResources[0].get('name');

                    // We loop over the available to controls to find the layer switcher:
                    var layerSwitcher = null;
                    for (var y=0; y < this.map.controls.length; y++) {
                        if (this.map.controls[y] instanceof OpenLayers.Control.LayerSwitcher) {
                            layerSwitcher = this.map.controls[y];
                            break;
                        }
                    }

                    var layerSwitcherState = layerSwitcher.layerStates;
                    for (var z = 0; z < layerSwitcherState.length; z++) {
                        if (layerSwitcherState[z].name === layerName) {
                            layerSwitcherVisible=layerSwitcherState[z].visibility;
                            break;
                        }
                    }

                    if (!layerSwitcherVisible) {
                        continue;
                    }
                }


                var resourcesToIterate = [];
                if (wcsResources.length > 0) {
                    resourcesToIterate = wcsResources;
                } else {
                    resourcesToIterate = wmsResources;
                }

                //Generate our query targets for WMS/WCS layers
                for (var k = 0; k < resourcesToIterate.length; k++) {
                    var type = resourcesToIterate[k].get('type');
                    if (type === portal.csw.OnlineResource.WMS ||
                        type === portal.csw.OnlineResource.WCS) {

                        var serviceFilter = layer.get('filterer').getParameters().serviceFilter;
                        if (serviceFilter) {
                            if (Ext.isArray(serviceFilter)) {
                                serviceFilter = serviceFilter[0];
                            }
                            // layers get filtered based on the service provider
                            if (resourcesToIterate[k].get('url') != serviceFilter &&
                                    this._getDomain(resourcesToIterate[k].get('url')) != serviceFilter) {
                                continue;
                            }
                        }
                        
                        var nameFilter = layer.get('filterer').getParameters().mineName;
                        if (nameFilter) {
                            // layers get filtered based on the name
                            if (resourcesToIterate[k].get('name') != serviceFilter &&
                                    this._getDomain(resourcesToIterate[k].get('url')) != serviceFilter) {
                                continue;
                            }
                        }
                        
                        queryTargets.push(Ext.create('portal.layer.querier.QueryTarget', {
                            id : '',
                            lat : latitude,
                            lng : longitude,
                            cswRecord   : cswRecord,
                            onlineResource : resourcesToIterate[k],
                            layer : layer,
                            explicit : true
                        }));
                                                
                    }
                }
            }
        }

        return queryTargets;
    },

});

