/**
 * This is the GA menu bar.
 * It contains navigation and function links at te left and a lay-long indicator at the right.
 */
Ext.define('ga.widgets.GAMenuBar', {
    extend : 'Ext.panel.Panel',
    alias: 'widget.gamenubar',

    map: null,
    
    statics : {
        instructionManager : Ext.create('portal.util.help.InstructionManager', {}),
    },

    constructor : function(config){   
        
        var me = this;
        me.map = config.map;
        
        // Create our Print Map handler         
        var printMapHandler = function() {   
            
            // create some print-only css rules to apply before printing
            var printCSS = 'html, body {\
                margin: 0 0 0 0 !important;\
                padding: 0 0 0 0 !important;\
                height: 99% !important;\
                background-color: #ffffff !important;\
            }\
            div {\
                border: none !important;\
                margin: 0 0 0 0 !important;\
                page-break-after: avoid !important;\
            }\
            .x-panel, .x-tip, .x-splitter {\
                display: none !important;\
                height: 0px !important;\
                width: 0px !important;\
                border: none !important;\
            }\
            #center_region {\
                display: block !important;\
                top: 0px !important;\
                left: 0px !important;\
                height: 100% !important;\
                width: 100% !important;\
            }\
            #center_region-body {\
                padding: 0 0 0 0 !important;\
            }\
            .olButton, .olAlphaImg {\
                display: none !important;\
            }';
            
            // use the browser print() function with the new styles applied
            Ext.util.CSS.createStyleSheet(printCSS, 'printCSSLink');            
            window.print();            
            Ext.util.CSS.removeStyleSheet('printCSSLink');    
        };        
    
        //Create our Reset Map handler
        // revert to the default zoom level, map extent and remove all our layers
        var resetMapHandler = function() {
            me.map.map.zoomTo(4); 
            var center = new OpenLayers.LonLat(133.3, -26).transform('EPSG:4326', 'EPSG:3857');
            me.map.map.setCenter(center);

            /* set the Base Layer for the map */ 
            Ext.each(me.map.layerSwitcher.baseLayers, function(baseLayer) {
                if (baseLayer.layer.name === "Google Satellite") {
                    me.map.map.setBaseLayer(baseLayer.layer);
                    return false;
                }
            });
            
            ActiveLayerManager.removeAllLayers(me.map);
            
            // if the browser supports local storage, clear the stored map state
            if(typeof(Storage) !== "undefined") {
                localStorage.removeItem("portalStorageApplicationState");
                localStorage.removeItem("portalStorageDefaultBaseLayer");
            }
        };                    
        
        //Create our permalink generation handler
        var permalinkHandler = function() {
            var mss = Ext.create('portal.util.permalink.MapStateSerializer');
    
            mss.addMapState(me.map);
            mss.addLayers(me.map);
    
            mss.serialize(function(state, version) {
                var popup = Ext.create('portal.widgets.window.PermanentLinkWindow', {
                    state : state,
                    version : version,
                    mapStateSerializer: mss
                });
    
                popup.show();
            });
            
            
        };
        
        var helpHandler = function() {
            ga.widgets.GAMenuBar.instructionManager.showInstructions([Ext.create('portal.util.help.Instruction', {
                highlightEl : 'auscope-tabs-panel',
                title : 'Find data/layers',
                description : 'In this panel a list of all available datasets in the form of layers will be presented to you.  Select the layer you would like to visualise.<br><br>Selecting a layer will expand any advanced filter options. If you do not wish to filter your datasets, you can visualise the data by clicking "Add to Map".<br/><br/>Further information about the data behind each layer can be displayed by clicking the icons alongside the layer name.'
            }),Ext.create('portal.util.help.Instruction', {
                highlightEl : 'hh-searchfield-Featured',
                title : 'Search Layer',
                description : 'Allow you to filter through the layers via the layer\'s name. Enter a key and click the magnifying glass to filter'
            }),Ext.create('portal.util.help.Instruction', {
                highlightEl : 'hh-filterDisplayedLayer-Featured',
                title : 'Filter Display Layer Option',
                description : 'Provide options to filter the list of displayed layers.'
            }),Ext.create('portal.util.help.Instruction', {
                highlightEl : 'latlng',
                anchor : 'left',
                title : 'Mouse Coordinate',
                description : 'Display the coordinate of the mouse on the map'
            }),Ext.create('portal.util.help.Instruction', {
                highlightEl : 'permanent-link',
                anchor : 'left',
                title : 'Permanent Link',
                description : 'Create a link that captures the current state of the user session.'
            }),Ext.create('portal.util.help.Instruction', {
                highlightEl : 'hh-userGuide',
                anchor : 'left',
                title : 'User guide',
                description : 'For more information, refer to the user guide.'
            })]);
        };
            
  
        Ext.apply(config, {
            height: '40px',
            items: [{
                xtype: 'box',
                id: 'menu-bar',                    
                autoEl: {
                    tag: 'div',
                    html: '<ul>\
                               <li><a href="http://www.geoscience.gov.au"><img src="img/home.png" width="16" height="16"/></a></li>\
                               <li><a id="print-map-link" href="javascript:void(0)">PRINT MAP</a></li>\
                               <li><a id="reset-map-link" href="javascript:void(0)">RESET MAP</a></li>\
                               <li><a id="permanent-link" href="javascript:void(0)"> PERMANENT LINK </a> </li>\
                               <li><a id="help-link" href="javascript:void(0)"> HELP </a> </li>\
                               <span id="latlng"></span>\
                           </ul>'
               }                    
            }],

                
            listeners: {
                render: function (view) {
                    Ext.get('print-map-link').on('click', printMapHandler);
                    Ext.get('reset-map-link').on('click', resetMapHandler);  
                    Ext.get('permanent-link').on('click', permalinkHandler); 
                    Ext.get('help-link').on('click', helpHandler); 
                }
            }
            
        });
    
        this.callParent(arguments);
    
    }

});