/**
 * Utility class for handling a series of portal.layer.querier.QueryTarget objects
 * by opening selection menus (if appropriate) or by simply passing along the
 * QueryTarget objects to the appropriate querier instances.
 */
Ext.define('portal.layer.querier.QueryTargetHandler', {

    _loadMaskCount : 0,
    _loadMask : null,
    _infoWindowManager : null,
    _infoWindowHeight : 300,
    _infoWindowWidth : 600,

    /**
     * Accepts a config with {
     *  infoWindowHeight : [Optional] Number height of info window in pixels
     *  infoWindowWidth : [Optional] Number width of info window in pixels
     *  container : The Ext.Container that houses the map instance
     * }
     */
    constructor : function(config) {
        if (config.infoWindowHeight) {
            this._infoWindowHeight = config.infoWindowHeight;
        }
        if (config.infoWindowWidth) {
            this._infoWindowWidth = config.infoWindowWidth;
        }
        this._infoWindowManager = Ext.create('portal.util.gmap.InfoWindowManager', {map: portal.util.gmap.MapUtil.map});
        this._loadMask = new Ext.LoadMask(config.container.getEl(), {}); //For some reason LoadMask isn't designed to work with Ext.create
        this.callParent(arguments);
    },

    _showLoadMask : function() {
        if (this._loadMaskCount++ === 0) {
            this._loadMask.show();
        }
    },

    _hideLoadMask : function() {
        if (--this._loadMaskCount === 0) {
            this._loadMask.hide();
        }
    },

    /**
     * Handles a query response by opening up info windows
     */
    _queryCallback : function(querier, baseComponents, queryTarget) {
        this._hideLoadMask(); //ensure this gets called or we'll have a forever floating 'Loading...'
        if (!baseComponents || baseComponents.length === 0) {
            return; //if the query failed, don't show a popup
        }

        //We need to open an info window with a number of tabs for each of the base components
        //Each tab will need to have an appropriately sized parent container rendered into it
        //AND once they are all rendered, we need to then add each element of baseComponents
        //to each of the tabs

        //Build our info window content (sans parent containers)
        var width = this._infoWindowWidth;
        var height = this._infoWindowHeight;
        var infoWindowIds = []; //this holds the unique ID's to bind to
        var infoWindowTabs = []; //this holds GInfoWindowTab instances
        for (var i = 0; i < baseComponents.length; i++) {
            infoWindowIds.push(Ext.id());
            var html = Ext.util.Format.format('<html><body><div id="{0}" style="width: {1}px; height: {2}px;"></div></body></html>', infoWindowIds[i], width, height);
            infoWindowTabs.push(new GInfoWindowTab(baseComponents[i].tabTitle, html));
        }
        var initFunctionParams = { //this will be passed to the info window manager callback
            width : width,
            height : height,
            infoWindowIds : infoWindowIds,
            baseComponents : baseComponents
        };
        var infoWindowParams = undefined; //we don't dictate any extra info window options

        //Show our info window - create our parent components
        var windowLocation = new GLatLng(queryTarget.get('lat'), queryTarget.get('lng'));
        this._infoWindowManager.openInfoWindow(windowLocation, infoWindowTabs, infoWindowParams, initFunctionParams, function(map, location, params) {
            for (var i = 0; i < params.baseComponents.length; i++) {
                Ext.create('Ext.panel.Panel', {
                    renderTo : params.infoWindowIds[i],
                    border : 0,
                    width : params.width,
                    height : params.height,
                    items : [params.baseComponents[i]],
                    suspendLayout : true,
                    layout : 'fit'
                });
            }
        });
    },

    _generateRootConfig : function() {
        return {

        };
    },

    /**
     * Just query everything in queryTargets
     */
    _handleWithQuery : function(queryTargets) {
        var rootCfg = this._generateRootConfig();
        for (var i = 0; i < queryTargets.length; i++) {
            var queryTarget = queryTargets[i];
            var layer = queryTarget.get('layer');
            var querier = layer.get('querier');

            this._showLoadMask();
            querier.query(queryTarget, rootCfg, Ext.bind(this._queryCallback, this));
        }
    },

    /**
     * Show some form of selection to the user, ask them to decide
     * which query target they meant
     */
    _handleWithSelection : function(queryTargets) {
        //TODO:
        alert('TODO - handle overlapping polygons/markers')
    },

    /**
     * Given an array of portal.layer.querier.QueryTarget objects,
     * figure out how to pass these to appropriate querier instances
     * and optionally show popup information on the map.
     *
     * This function will likely open info windows on the map and
     * hide/show loading masks where appropriate.
     *
     * @param queryTargets Array of portal.layer.querier.QueryTarget objects
     */
    handleQueryTargets : function(queryTargets) {
        if (!queryTargets || queryTargets.length === 0) {
            return;
        }

        var explicitTargets = []; // all QueryTarget instances with the explicit flag set
        for (var i = 0; i < queryTargets.length; i++) {
            if (queryTargets[i].get('explicit')) {
                explicitTargets.push(queryTargets[i]);
            }
        }

        //If we have an ambiguous set of targets - let's just ask the user what they meant
        if (explicitTargets.length > 1) {
            this._handleWithSelection(explicitTargets);
            return;
        }

        //If we have a single explicit target, then our decision is really easy
        if (explicitTargets.length === 1) {
            this._handleWithQuery(explicitTargets);
            return;
        }

        //Otherwise query everything
        this._handleWithQuery(queryTargets);
    }

});