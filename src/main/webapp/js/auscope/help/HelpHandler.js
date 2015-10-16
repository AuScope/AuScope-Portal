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
        if(!helpButtonEl){
            //VT: not the landing page
            return;            
        }

        //VT: I like the arrow to appear every refresh. If users prefer it only on new session, use
        //sessionStorage.
        auscope.HelpHandler.highlightElement(5000, helpButtonEl);


        //Load help for main page
        if (window.location.pathname.endsWith('/gmap.html')) {
            helpButtonEl.on('click', function() {
                auscope.HelpHandler.manager.showInstructions([Ext.create('portal.util.help.Instruction', {
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
                    highlightEl : 'permalinkicon',
                    anchor : 'left',
                    title : 'Permanent Link',
                    description : 'Create a link that captures the current state of the user session.'
                }),Ext.create('portal.util.help.Instruction', {
                    highlightEl : 'hh-userGuide',
                    anchor : 'left',
                    title : 'User guide',
                    description : 'For more information, refer to the user guide.'
                })]);
            });
        }  else {
            helpButtonEl.hide();
        }
    });
});