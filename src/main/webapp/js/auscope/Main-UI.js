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
            proxy : {
                type : 'ajax',
                url : 'getCustomLayers.do',
                reader : {
                    type : 'json',
                    root : 'data'
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

        // Create the ResearchDataLayer store
        var researchDataLayerStore = Ext.create('Ext.data.Store', {
            model : 'portal.knownlayer.KnownLayer',
            groupField: 'group',
            proxy : {
                type : 'ajax',
                url : 'getResearchDataLayers.do',
                reader : {
                    type : 'json',
                    root : 'data'
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

        var layersPanel = Ext.create('portal.widgets.panel.LayerPanel', {
            id : 'auscope-layers-panel',
            title : 'Active Layers',
            region: 'south',
            store : layerStore,
            map : map,
            flex : 2,
            width : '100%',
            split: true,
            allowDebugWindow : isDebugMode,
            listeners : {
                itemclick : function(sm,record, eOpts){
                    var allTabPanels = tabsPanel.items.items;
                    for (var i=0; i< allTabPanels.length; i++){
                        var tabPanelSelectedRecord = allTabPanels[i].getStore().getById(record.get('id'));
                        if(tabPanelSelectedRecord){
                            allTabPanels[i].getSelectionModel().select([tabPanelSelectedRecord], false);
                            tabsPanel.setActiveTab(allTabPanels[i]);
                            break;
                        }
                    }
                },
                removelayerrequest: function(sourceGrid, record) {
                    //filterPanel.clearFilter();
                }
            }
        });

        var handleFilterSelectionComplete =  function(){
            var activePanel = tabsPanel.activeTab;
            activePanel.addSelectedLayerToActive()
        };

        /**
         * Used to show extra details for querying services
         */
        var filterPanel = Ext.create('portal.widgets.panel.FilterPanel', {
            id : 'auscope-filter-panel',
            title : 'Filter',
            region : 'center',
            width : '100%',
            layerPanel : layersPanel,
            //maxHeight : 350, //VT:settings for vbox layout
            height : 100,
            split: true,
            map : map,
            listeners : {
                filterselectioncomplete : handleFilterSelectionComplete
            }

        });

        var layerFactory = Ext.create('portal.layer.LayerFactory', {
            map : map,
            formFactory : Ext.create('auscope.layer.filterer.AuScopeFormFactory', {map : map}),
            downloaderFactory : Ext.create('auscope.layer.AuScopeDownloaderFactory', {map: map}),
            querierFactory : Ext.create('auscope.layer.AuScopeQuerierFactory', {map: map}),
            rendererFactory : Ext.create('auscope.layer.AuScopeRendererFactory', {map: map})
        });





        //Utility function for adding a new layer to the map
        //record must be a CSWRecord or KnownLayer
        var handleAddRecordToMap = function(sourceGrid, record) {
            if(!(record instanceof Array)){
                record = [record];
            }

            for(var z=0; z < record.length; z++){
                var newLayer = null;

                //Ensure the layer DNE first
                var existingRecord = layerStore.getById(record[z].get('id'));
                if (existingRecord) {                    
                    layersPanel.getSelectionModel().select([existingRecord], false);
                    return;
                }

                //Turn our KnownLayer/CSWRecord into an actual Layer
                if (record[z] instanceof portal.csw.CSWRecord) {
                    newLayer = record[z].get('layer');
                } else {
                    newLayer = record[z].get('layer');
                }

                //if newLayer is undefined, it must have come from some other source like mastercatalogue
                if(!newLayer){
                    newLayer = layerFactory.generateLayerFromCSWRecord(record[z])
                    //we want it to display immediately.
                    newLayer.set('displayed',true);
                }

                //We may need to show a popup window with copyright info
                var cswRecords = newLayer.get('cswRecords');
                for (var i = 0; i < cswRecords.length; i++) {
                    if (cswRecords[i].hasConstraints()) {
                        var popup = Ext.create('portal.widgets.window.CSWRecordConstraintsWindow', {
                            width : 625,
                            cswRecords : cswRecords
                        });

                        popup.show();

                        //HTML images may take a moment to load which stuffs up our layout
                        //This is a horrible, horrible workaround.
                        var task = new Ext.util.DelayedTask(function(){
                            popup.doLayout();
                        });
                        task.delay(1000);

                        break;
                    }
                }

                layerStore.insert(0,newLayer); //this adds the layer to our store                                            
                                
                layersPanel.getSelectionModel().select([newLayer], false); //this ensures it gets selected
                
            }
        };



        var knownLayersPanel = Ext.create('portal.widgets.panel.KnownLayerPanel', {
            title : 'Featured',
            store : knownLayerStore,
            enableBrowse : true,//VT: if true browse catalogue option will appear
            map : map,
            tooltip : {
                anchor : 'top',
                title : 'Featured Layers',
                text : '<p1>This is where the portal groups data services with a common theme under a layer. This allows you to interact with multiple data providers using a common interface.</p><br><p>The underlying data services are discovered from a remote registry. If no services can be found for a layer, it will be disabled.</p1>',
                showDelay : 100,
                icon : 'img/information.png',
                dismissDelay : 30000
            },
            listeners : {
                //On selection, update our filter panel
                select : function(rowModel, record, index) {
                    var newLayer;
                    if(record.get('layer')){
                        newLayer = record.get('layer');
                    }else{
                        newLayer = layerFactory.generateLayerFromKnownLayer(record);
                        record.set('layer', newLayer);
                    }

                    filterPanel.showFilterForLayer(newLayer);
                },
                addlayerrequest : handleAddRecordToMap

            }
        });

        var unmappedRecordsPanel = Ext.create('portal.widgets.panel.CSWRecordPanel', {
            title : 'Registered',
            store : unmappedCSWRecordStore,
            tooltip : {
                title : 'Registered Layers',
                text : 'The layers that appear here are the data services that were discovered in a remote registry but do not belong to any of the Featured Layers groupings.',
                showDelay : 100,
                dismissDelay : 30000
            },
            map : map,
            listeners : {
              //On selection, update our filter panel
                select : function(rowModel, record, index) {
                    var newLayer;
                    if(record.get('layer')){
                        newLayer = record.get('layer');
                    }else{
                        newLayer = layerFactory.generateLayerFromCSWRecord(record);
                        record.set('layer', newLayer);
                    }

                    filterPanel.showFilterForLayer(newLayer);
                },
                addlayerrequest : handleAddRecordToMap
            }
        });

        var customRecordsPanel = Ext.create('portal.widgets.panel.CustomRecordPanel', {
            title : 'Custom',
            store : customRecordStore,
            tooltip : {
                title : 'Custom Data Layers',
                text : 'This tab allows you to create your own layers from remote data services.',
                showDelay : 100,
                dismissDelay : 30000
            },
            map : map,
            listeners : {
                select : function(rowModel, record, index) {
                    var newLayer;
                    if(record.get('layer')){
                        newLayer = record.get('layer');
                    }else{
                        newLayer = layerFactory.generateLayerFromCSWRecord(record);
                        record.set('layer', newLayer);
                    }

                    filterPanel.showFilterForLayer(newLayer);
                },
                addlayerrequest : handleAddRecordToMap
            }
        });

        var researchDataPanel = Ext.create('portal.widgets.panel.KnownLayerPanel', {
            title : 'Research Data',
            store : researchDataLayerStore,
            enableBrowse : false,//VT: if true browse catalogue option will appear
            map : map,
            tooltip : {
                title : 'Research Data Layers',
                text : '<p1>The layers in this tab represent past/present research activities and may contain partial or incomplete information.</p1>',
                showDelay : 100,
                dismissDelay : 30000
            },
            listeners : {
                select : function(rowModel, record, index) {
                    var newLayer;
                    if(record.get('layer')){
                        newLayer = record.get('layer');
                    }else{
                        newLayer = layerFactory.generateLayerFromKnownLayer(record);
                        record.set('layer', newLayer);
                    }

                    filterPanel.showFilterForLayer(newLayer);
                },
                addlayerrequest : handleAddRecordToMap
            }
        });

        // basic tabs 1, built from existing content
        var tabsPanel = Ext.create('Ext.TabPanel', {
            id : 'auscope-tabs-panel',
            title : 'Layers',
            activeTab : 0,
            region : 'north',
            split : true,
            height : 265,
            width : '100%',
            enableTabScroll : true,
            items:[
                knownLayersPanel,
                unmappedRecordsPanel,
                customRecordsPanel,
                researchDataPanel
            ],
            listeners : {
                tabchange : function( tabPanel, newCard, oldCard, eOpts ){
                    var record = newCard.getSelectionModel().getSelection()[0];
                    if(record){
                        var newLayer;
                        if(record.get('layer')){
                            newLayer = record.get('layer');
                        }else{
                            newLayer = layerFactory.generateLayerFromCSWRecord(record);
                            record.set('layer', newLayer);
                        }

                        filterPanel.showFilterForLayer(newLayer);
                    }
                }
            }
        });

        /**
         * Used as a placeholder for the tree and details panel on the left of screen
         */
        var westPanel = {
            layout: 'border',//VT: vbox doesn't support splitbar unless we custom it.
            region:'west',
            border: false,
            split:true,
            //margins: '100 0 0 0',
            margins:'100 0 0 3',
            width: 350,
            items:[tabsPanel , filterPanel, layersPanel]
        };

        /**
         * This center panel will hold the google maps instance
         */
        var centerPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            id: 'center_region',
            margins: '100 0 0 0',
            cmargins:'100 0 0 0'
        });

        /**
         * Add all the panels to the viewport
         */
        var viewport = Ext.create('Ext.container.Viewport', {
            layout:'border',
            items:[westPanel, centerPanel]
        });

        map.renderToContainer(centerPanel);   //After our centerPanel is displayed, render our map into it

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