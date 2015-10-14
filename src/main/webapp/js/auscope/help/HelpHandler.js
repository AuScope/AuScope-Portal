/**
 * Configures the help messages depending on what VGL page is or isn't loaded.
 *
 * This is seperated from the top level JS files so there is a physical distinction between
 * this help logic and the logic that runs the actual page.
 */
Ext.define('auscope.HelpHandler', {
    statics : {
        manager : Ext.create('portal.util.help.InstructionManager', {}),
    }

}, function() {
    Ext.onReady(function() {
        var helpButtonEl = Ext.get('help-button');
        if(!helpButtonEl){
            //VT: not the landing page
            return;            
        }

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