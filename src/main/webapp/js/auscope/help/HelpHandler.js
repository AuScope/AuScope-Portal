/**
 * Configures the help messages depending on what VGL page is or isn't loaded.
 *
 * This is seperated from the top level JS files so there is a physical distinction between
 * this help logic and the logic that runs the actual page.
 */
Ext.define('auscope.HelpHandler', {
    statics : {
        manager : Ext.create('portal.util.help.InstructionManager', {}),

        /**
         * Asynchronously start an animation (with the specified delay in ms) that will highlight
         * the specified element with an animated arrow
         *
         * @param delay The delay in milli seconds
         * @param element An Ext.Element to highlight
         */
        highlightElement : function(delay, element) {
            var task = new Ext.util.DelayedTask(function() {
                var arrowEl = Ext.getBody().createChild({
                    tag : 'img',
                    src : 'img/right-arrow.png',
                    width : '32',
                    height : '32',
                    style : {
                        'z-index' : 999999
                    }
                });

                //Figure out the x location of the element (in absolute page coords)
                var xLocation = element.getLeft();

                Ext.create('Ext.fx.Animator', {
                    target: arrowEl,
                    duration: 7000,
                    keyframes: {
                        0: {
                            opacity: 1
                        },
                        20: {
                            x: xLocation - 32
                        },
                        30: {
                            x: xLocation - 52
                        },
                        40: {
                            x: xLocation - 32
                        },
                        50: {
                            x: xLocation - 52
                        },
                        60: {
                            x: xLocation - 32
                        },
                        120: {

                        },
                        160: {
                            opacity : 0
                        }
                    },
                    listeners : {
                        afteranimate : Ext.bind(function(arrowEl) {
                            arrowEl.destroy();
                        }, this, [arrowEl])
                    }
                });
            });

            task.delay(delay);
        }
    }

}, function() {
    Ext.onReady(function() {
        var helpButtonEl = Ext.get('help-button');

        //VT: I like the arrow to appear every refresh. If users prefer it only on new session, use
        //sessionStorage.
        auscope.HelpHandler.highlightElement(5000, helpButtonEl);


        //Load help for main page
        if (window.location.pathname.endsWith('/gmap.html')) {
            helpButtonEl.on('click', function() {
                auscope.HelpHandler.manager.showInstructions([Ext.create('portal.util.help.Instruction', {
                    highlightEl : 'auscope-tabs-panel',
                    title : 'Find data/layers',
                    description : 'In this panel a list of all available datasets in the form of layers will be presented to you.  Select the layer you would like to visualise. If you do not wish to filter your datasets, you can visualise the data by clicking "Add to Map" in the window below. <br><br>  Selecting a layer will also bring up any advanced filter options in the window below. <br/><br/>Further information about the data behind each layer can be displayed by clicking the icons alongside the layer name.'
                }),Ext.create('portal.util.help.Instruction', {
                    highlightEl : 'auscope-filter-panel',
                    title : 'Apply filters',
                    description : 'Some layers allow you to filter what data will get visualised on the map. If the layer supports filtering, additional options will be displayed in this window. Select "Add to Map" to update the visualised data on the map'
                }),Ext.create('portal.util.help.Instruction', {
                    highlightEl : 'auscope-layers-panel',
                    title : 'Manage Layers',
                    description : 'Whenever you add a layer to the map, it will be listed in this window. Layers can be removed by selecting them and pressing "Remove Layer".<br><br> Selecting a layer will also bring up any advanced filter options in the window above.'
                }),Ext.create('portal.util.help.Instruction', {
                    highlightEl : 'center_region',
                    anchor : 'right',
                    title : 'Visualise Data',
                    description : 'The map panel here is where all of the currently added layers will be visualised. You can pan and zoom the map to an area of interest if required.'
                })]);
            });
        }  else {
            helpButtonEl.hide();
        }
    });
});