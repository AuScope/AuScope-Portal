Ext.application({
    //Here we build our GUI from existing components - this function should only be assembling the GUI
    //Any processing logic should be managed in dedicated classes - don't let this become a
    //monolithic 'do everything' function
    launch : function() {
        var map = null; //an instance of a GMap2 object (google map v2 API)

        //Send these headers with every AJax request we make...
        Ext.Ajax.defaultHeaders = {
                'Accept-Encoding': 'gzip, deflate' //This ensures we use gzip for most of our requests (where available)
        };

        //Create our CSWRecord store (holds all CSWRecords not mapped by known layers)
        var unmappedCSWRecordStore = Ext.create('Ext.data.Store', {
            model : 'portal.csw.CSWRecord',
            groupField: 'contactOrg',
            proxy : {
                type : 'ajax',
                url : 'getUnmappedCSWRecords.do',
                reader : {
                    type : 'json',
                    root : 'data'
                }
            },
            autoLoad : true
        });

        //Our custom record store holds layers that the user has
        //added to the map using a OWS URL entered through the
        //custom layers panel
        var customRecordStore = Ext.create('Ext.data.Store', {
            model : 'portal.csw.CSWRecord',
            data : []
        });

        //Create our KnownLayer store
        var knownLayerStore = Ext.create('Ext.data.Store', {
            model : 'portal.knownlayer.KnownLayer',
            groupField: 'group',
            proxy : {
                type : 'ajax',
                url : 'getKnownLayers.do',
                reader : {
                    type : 'json',
                    root : 'data'
                }
            },
            autoLoad : true
        });

        //Create our store for holding the set of
        //layers that have been added to the map
        var layerStore = Ext.create('Ext.data.Store', {
            model : 'portal.layer.Layer',
            data : []
        });


        //Utility function for adding a new layer to the map
        var handleAddRecordToMap = function(sourceGrid, record) {
            var layerFactory = Ext.create('portal.layer.LayerFactory', {map : map});
            var newLayer = null;

            if (record instanceof portal.csw.CSWRecord) {
                newLayer = layerFactory.generateLayerFromCSWRecord(record);
            } else {
                newLayer = layerFactory.generateLayerFromKnownLayer(record);
            }

            layerStore.add(newLayer);
        };

        var knownLayersPanel = Ext.create('portal.widgets.panel.KnownLayerPanel', {
            title : 'Featured Layers',
            store : knownLayerStore,
            listeners : {
                addlayerrequest : handleAddRecordToMap
            }
        });

        var unmappedRecordsPanel = Ext.create('portal.widgets.panel.CSWRecordPanel', {
            title : 'Registered Layers',
            store : unmappedCSWRecordStore,
            listeners : {
                addlayerrequest : handleAddRecordToMap
            }
        });

        var customRecordsPanel = Ext.create('portal.widgets.panel.CSWRecordPanel', {
            title : 'Custom Layers',
            store : customRecordStore,
            listeners : {
                addlayerrequest : handleAddRecordToMap
            }
        });

        /**
         * Used to show extra details for querying services
         */
        var filterPanel = Ext.create('Ext.Panel', {
            title: 'Filter Properties',
            region: 'south',
            split: true,
            layout: 'card',
            activeItem: 0,
            height: 200,
            autoScroll  : true,
            layoutConfig: {
                layoutOnCardChange: true// Important when not specifying an items array
            },
            items: [{
                html: '<p id="filterpanelbox"> Filter options will be shown here for special services.</p>'
            }],
            buttonAlign : 'right',
            bbar: [{
                text :'Apply Filter >>',
                disabled : true,
                handler : function() {
                    alert('TODO');
                }
            }]
        });

        var layersPanel = Ext.create('portal.widgets.panel.LayerPanel', {
            title : 'Active Layers',
            region : 'center',
            store : layerStore
        });

        // basic tabs 1, built from existing content
        var tabsPanel = Ext.create('Ext.TabPanel', {
            activeTab : 0,
            region : 'north',
            split : true,
            height : 225,
            autoScroll : true,
            enableTabScroll : true,
            items:[knownLayersPanel,
                unmappedRecordsPanel,
                customRecordsPanel
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
            width: 350,
            items:[tabsPanel , layersPanel, filterPanel]
        };

        /**
         * This center panel will hold the google maps instance
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

            /* AUS-1526 search bar. */

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
        }

        // Fix for IE/Firefox resize problem (See issue AUS-1364 and AUS-1565 for more info)
        map.checkResize();
        centerPanel.on('resize', function() {
            map.checkResize();
        });

        //when updateCSWRecords person clicks on updateCSWRecords marker then do something
        GEvent.addListener(map, "click", function(overlay, latlng, overlayLatlng) {
            //gMapClickController(map, overlay, latlng, overlayLatlng, activeLayersStore);
            alert('TODO - handle click');
        });

        GEvent.addListener(map, "mousemove", function(latlng){
            var latStr = "<b>Long:</b> " + latlng.lng().toFixed(6) +
                       "&nbsp&nbsp&nbsp&nbsp" +
                       "<b>Lat:</b> " + latlng.lat().toFixed(6);
            document.getElementById("latlng").innerHTML = latStr;
        });

        GEvent.addListener(map, "mouseout", function(latlng){
            document.getElementById("latlng").innerHTML = "";
        });
    }
});