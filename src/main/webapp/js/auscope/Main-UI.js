Ext.application({
    name : 'portal',

    //Here we build our GUI from existing components - this function should only be assembling the GUI
    //Any processing logic should be managed in dedicated classes - don't let this become a
    //monolithic 'do everything' function
    launch : function() {

        //Send these headers with every AJax request we make...
        Ext.Ajax.defaultHeaders = {
            'Accept-Encoding': 'gzip, deflate' //This ensures we use gzip for most of our requests (where available)
        };


        // WARNING - Terry IS playing dangerous games here!
        // if !(oldBrowser) then ....
        Ext.Ajax.method = 'GET';
        //True to add a unique cache-buster param to GET requests. Defaults to true.
        //http://www.sencha.com/forum/showthread.php?257086-Is-there-a-simple-way-to-disable-caching-for-an-entire-ExtJS-4-application
        Ext.data.Connection.disableCaching = false;
        Ext.data.proxy.Server.prototype.noCache = false;
        Ext.Ajax.disableCaching = false;
        // I think this is 300 seconds, 5 mins...
        Ext.Ajax.timeout = 300000;
        //IF END


        var urlParams = Ext.Object.fromQueryString(window.location.search.substring(1));
        var isDebugMode = urlParams.debug;

        //Create our CSWRecord store (holds all CSWRecords not mapped by known layers)
        var unmappedCSWRecordStore = Ext.create('Ext.data.Store', {
            model : 'portal.csw.CSWRecord',
            groupField: 'contactOrg',
            proxy : {
                type : 'ajax',
                url : 'getUnmappedCSWRecords.do',
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });

        //Our custom record store holds layers that the user has
        //added to the map using a OWS URL entered through the
        //custom layers panel
        var customRecordStore = Ext.create('Ext.data.Store', {
            model : 'portal.csw.CSWRecord',
            proxy : {
                type : 'ajax',
                url : 'getCustomLayers.do',
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            },
            autoLoad : false,
            data : [],
            listeners : {
                load  :  function(store, records, successful, eopts){
                    if(!successful){
                        Ext.Msg.show({
                            title:'Error!',
                            msg: 'Your WMS service has to support EPSG:3857 to be supported by Google map. You are seeing this error because either the URL is not valid or it does not conform to EPSG:3857 WMS layers standard',
                            buttons: Ext.Msg.OK
                        });
                    }else{
                        if(records.length === 0){
                            Ext.Msg.show({
                                title:'No WMS Layers!',
                                msg: 'There are no WMS Layers in the given URL',
                                buttons: Ext.Msg.OK
                            });
                        }
                    }
                }
            }
        });


        //Create our KnownLayer store
        var layersSorter = new Ext.util.Sorter({
            sorterFn: function(record1, record2) {
                var order1 = record1.data.order;
                    order2 = record2.data.order;
                return order1 > order2 ? 1 : (order1 < order2 ? -1 : 0);
            },
            direction: 'ASC'
        })
        var layersGrouper = new Ext.util.Grouper({
            groupFn: function(item) {
                console.log("layersGrouper - groupFn: ",item.data.group)
                return item.data.group;
            },
            sorterFn: function(record1, record2) {
                console.log("layersGrouper - sorterFn rec1: ",record1.data.name, ", rec2: ",record2.data.name);
                var order1 = record1.data.order;
                    order2 = record2.data.order;
                return order1 > order2 ? 1 : (order1 < order2 ? -1 : 0);
            },
            direction: 'ASC'
        })
        var knownLayerStore = Ext.create('Ext.data.Store', {
            model : 'portal.knownlayer.KnownLayer',
            proxy : {
                type : 'ajax',
                url : 'getKnownLayers.do',
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            },
            sorters: [layersSorter],
            grouper: layersGrouper,
            autoLoad : true
        });


        // Create the ResearchDataLayer store
        var researchDataLayerStore = Ext.create('Ext.data.Store', {
            model : 'portal.knownlayer.KnownLayer',
            groupField: 'group',
            proxy : {
                type : 'ajax',
                url : 'getResearchDataLayers.do',
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });

        //Create our store for holding the set of
        //layers that have been added to the map
        var layerStore = Ext.create('portal.layer.LayerStore', {});

        //We need something to handle the clicks on the map
        var queryTargetHandler = Ext.create('portal.layer.querier.QueryTargetHandler', {});

        //Create our map implementations
        var mapCfg = {
            container : null,   //We will be performing a delayed render of this map
            layerStore : layerStore,
            listeners : {
                query : function(mapWrapper, queryTargets) {
                    queryTargetHandler.handleQueryTargets(mapWrapper, queryTargets);
                }
            }
        };
        var urlParams = Ext.Object.fromQueryString(window.location.search.substring(1));


        var map = null;

        map = Ext.create('portal.map.openlayers.OpenLayersMap', mapCfg);

        var layerFactory = Ext.create('portal.layer.LayerFactory', {
            map : map,
            formFactory : Ext.create('auscope.layer.filterer.AuScopeFormFactory', {map : map}),
            downloaderFactory : Ext.create('auscope.layer.AuScopeDownloaderFactory', {map: map}),
            querierFactory : Ext.create('auscope.layer.AuScopeQuerierFactory', {map: map}),
            rendererFactory : Ext.create('auscope.layer.AuScopeRendererFactory', {map: map})
        });




        var knownLayersPanel = Ext.create('portal.widgets.panel.KnownLayerPanel', {
            title : 'Featured',
            menuFactory : Ext.create('auscope.layer.AuscopeFilterPanelMenuFactory',{map : map}),
            store : knownLayerStore,
            activelayerstore : layerStore,
            map : map,
            layerFactory : layerFactory,
            tooltip : {
                anchor : 'top',
                title : 'Featured Layers',
                text : '<p1>This is where the portal groups data services with a common theme under a layer. This allows you to interact with multiple data providers using a common interface.</p><br><p>The underlying data services are discovered from a remote registry. If no services can be found for a layer, it will be disabled.</p1>',
                showDelay : 100,
                icon : 'img/information.png',
                dismissDelay : 30000
            }

        });

        var unmappedRecordsPanel = Ext.create('portal.widgets.panel.CSWRecordPanel', {
            title : 'Registered',
            store : unmappedCSWRecordStore,
            activelayerstore : layerStore,
            tooltip : {
                title : 'Registered Layers',
                text : 'The layers that appear here are the data services that were discovered in a remote registry but do not belong to any of the Featured Layers groupings.',
                showDelay : 100,
                dismissDelay : 30000
            },
            map : map,
            layerFactory : layerFactory

        });

        var customRecordsPanel = Ext.create('auscope.widgets.CustomRecordPanel', {
            title : 'Custom',
            itemId : 'org-auscope-custom-record-panel',
            store : customRecordStore,
            activelayerstore : layerStore,
            enableBrowse : true,//VT: if true browse catalogue option will appear
            tooltip : {
                title : 'Custom Data Layers',
                text : 'This tab allows you to create your own layers from remote data services.',
                showDelay : 100,
                dismissDelay : 30000
            },
            map : map,
            layerFactory : layerFactory

        });

        var researchDataPanel = Ext.create('portal.widgets.panel.KnownLayerPanel', {
            title : 'Research Data',
            store : researchDataLayerStore,
            activelayerstore : layerStore,
            enableBrowse : false,//VT: if true browse catalogue option will appear
            map : map,
            layerFactory : layerFactory,
            tooltip : {
                title : 'Research Data Layers',
                text : '<p1>The layers in this tab represent past/present research activities and may contain partial or incomplete information.</p1>',
                showDelay : 100,
                dismissDelay : 30000
            }

        });

        // basic tabs 1, built from existing content
        var tabsPanel = Ext.create('Ext.TabPanel', {
            id : 'auscope-tabs-panel',
            title : 'Layers',
            activeTab : 0,
            region : 'center',
            split : true,
            height : '70%',
            width : '100%',
            enableTabScroll : true,
            items:[
                knownLayersPanel,
                unmappedRecordsPanel,
                customRecordsPanel,
                researchDataPanel
            ]
        });

        /**
         * Used as a placeholder for the tree and details panel on the left of screen
         */
        var westPanel = {
            layout: 'border',//VT: vbox doesn't support splitbar unless we custom it.
            region:'west',
            border: false,
            split:true,
            margin:'100 0 0 3',
            width: 370,
            items:[tabsPanel]
        };

        /**
         * This center panel will hold the google maps instance
         */
        var centerPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            id: 'center_region',
            margin: '100 0 0 0'  ,
            html : "<div style='width:100%; height:100%' id='center_region-map'></div>",
            listeners: {
                afterrender: function () {
                    map.renderToContainer(centerPanel,'center_region-map');   //After our centerPanel is displayed, render our map into it
                }
            }
        });

        /**
         * Add all the panels to the viewport
         */
        var viewport = Ext.create('Ext.container.Viewport', {
            layout:'border',
            items:[westPanel, centerPanel]
        });

        if(urlParams.kml){

            Ext.Ajax.request({
                url: 'addKMLUrl.do',
                params:{
                    url : urlParams.kml
                    },
                waitMsg: 'Adding KML Layer...',
                success: function(response) {
                   var responseObj = Ext.JSON.decode(response.responseText);
                   if(responseObj.data.file.indexOf('<kml') ==-1){
                       Ext.Msg.alert('Status', 'Unable to parse file. Make sure the file is a valid KML file and URL is properly encoded');
                   }else{
                       var tabpanel =  Ext.getCmp('auscope-tabs-panel');
                       var customPanel = tabpanel.getComponent('org-auscope-custom-record-panel')
                       tabpanel.setActiveTab(customPanel);
                       var cswRecord = customPanel.addKMLtoPanel(responseObj.data.name,responseObj.data.file);                            
                       var newLayer = layerFactory.generateLayerFromCSWRecord(cswRecord);
                       cswRecord.set('layer',newLayer);            
                       var filterForm = newLayer.get('filterForm');
                       filterForm.setLayer(newLayer);
                       layerStore.insert(0,newLayer);
                   }

                },
                failure : function(fp,action){
                    Ext.Msg.alert('Status', 'Unable to parse file. Make sure the file is a valid KML file.');
                }
            });

        }


        //Create our permalink generation handler
        var permalinkHandler = function() {
            var mss = Ext.create('portal.util.permalink.MapStateSerializer');

            mss.addMapState(map);
            mss.addLayers(layerStore);

            mss.serialize(function(state, version) {
                var popup = Ext.create('portal.widgets.window.PermanentLinkWindow', {
                    state : state,
                    version : version
                });

                popup.show();
            });
        };
        Ext.get('permalink').on('click', permalinkHandler);
        Ext.get('permalinkicon').on('click', permalinkHandler);

        //Handle deserialisation -- ONLY if we have a uri param called "state".
        var deserializationHandler;
        var urlParams = Ext.Object.fromQueryString(window.location.search.substring(1));
        if (urlParams && (urlParams.state || urlParams.s)) {
            var decodedString = urlParams.state ? urlParams.state : urlParams.s;
            var decodedVersion = urlParams.v;

            deserializationHandler = Ext.create('portal.util.permalink.DeserializationHandler', {
                knownLayerStore : knownLayerStore,
                cswRecordStore : unmappedCSWRecordStore,
                layerFactory : layerFactory,
                layerStore : layerStore,
                map : map,
                stateString : decodedString,
                stateVersion : decodedVersion
            });

        }


    }
});