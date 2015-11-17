/**
 * A Panel specialisation for allowing the user to browse
 * the online resource contents of a set of portal.csw.OnlineResource
 * objects.
 */
Ext.define('ga.widgets.OnlineResourceSelectionPanel', {
    extend : 'Ext.grid.Panel',
    alias : 'widget.onlineresourceselectionpanel',

    cswRecords : null, //Array of portal.csw.CSWRecord objects

    /**
     * Accepts all Ext.grid.Panel options as well as
     * {
     *  cswRecords : single instance of array of portal.csw.CSWRecord objects
     *  allow
     * }
     */
    constructor : function(cfg) {
        // Ensures this.cswRecords is an array:
        this.cswRecords = [].concat(cfg.cswRecords);

        //Generate our flattened 'data items' list for rendering to the grid
        var dataItems = ga.widgets.OnlineResourceSelectionPanelRow.parseCswRecords(this.cswRecords, portal.csw.OnlineResource.WMS);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: '{name} ({[values.rows.length]} {[values.rows.length > 1 ? "Items" : "Item"]})'
        });

        //The following two Configs variables can be set by the owner
        var sortable = true;
        var hideHeaders = true;
        if (typeof(cfg.hideHeaders) !== 'undefined' && cfg.hideHeaders != null) {
            hideHeaders = cfg.hideHeaders;
        }
        if (typeof(cfg.sortable) !== 'undefined' && cfg.sortable != null) {
            sortable = cfg.sortable;
        }

        //We allow the owner to specify additional columns
        var columns = [{
            //Title column
            dataIndex: 'onlineResource',
            menuDisabled: true,
            sortable: sortable,
            cellWrap : true,
            flex: 1,
            renderer: Ext.bind(this.detailRenderer, this)
        }];
        if (cfg.columns) {
            columns = columns.concat(cfg.columns);
        }

        //Build our configuration object
        Ext.apply(cfg, {
            selModel: cfg.selModel,
            features : [groupingFeature],
            store : Ext.create('Ext.data.Store', {
                model : 'portal.widgets.panel.OnlineResourcePanelRow',
                data : dataItems
            }),
            plugins : [{
                ptype : 'selectablegrid'
            }],
            hideHeaders : hideHeaders,
            columns: columns,
            viewConfig: {
                enableTextSelection: true
              }
        });

        this.callParent(arguments);
    },
    
    detailRenderer : function(value, metaData, record, row, col, store, gridView) {
        var onlineResource = record.get('onlineResource');
        var cswRecord = record.get('cswRecord');
        var name = onlineResource.get('name');
        var url = onlineResource.get('url');
        var description = onlineResource.get('description');

        //Ensure there is a title (even it is just '<Untitled>'
        if (!name || name.length === 0) {
            name = '&gt;Untitled&lt;';
        }

        //Truncate description
        var maxLength = 190;
        if (description.length > maxLength) {
            description = description.substring(0, maxLength) + '...';
        }

        //Render our HTML

        return Ext.DomHelper.markup({
            tag : 'div',
            children : [{
                html : name
            }]
        });
    },

    /**
     * Given a URL this will determine the correct character that can be appended
     * so that a number of URL parameters can also be appended
     *
     * See AUS-1931 for why this function should NOT exist
     */
    internalURLSeperator : function(url) {
        var lastChar = url[url.length - 1];
        if (lastChar == '?') {
            return '';
        } else if (lastChar === '&') {
            return '';
        } else if (url.indexOf('?') >= 0) {
            return '&';
        } else {
            return '?';
        }
    }

});

/**
 * Convenience class for representing the rows in the OnlineResourcesSelectionPanel.
 * Only returns the resources with te specified type
 * 
 */
Ext.define('ga.widgets.OnlineResourceSelectionPanelRow', {
    extend : 'Ext.data.Model',

    statics : {
        /**
         * Turns an array of portal.csw.CSWRecord objects into an equivalent array of
         * ga.widgets.OnlineResourceSelectionPanelRow objects.
         * Optionally filters by specified type.
         */
        parseCswRecords : function(cswRecords, type) {
            var dataItems = [];
            for (var i = 0; i < cswRecords.length; i++) {
                var cswRecord = cswRecords[i];
                
                var onlineResources = cswRecords[i].getAllChildOnlineResources();
                for (var j = 0; j < onlineResources.length; j++) {

                    var resourceType = onlineResources[j].get('type');
                    
                    //ensure we have a type we want to describe
                    var group = portal.csw.OnlineResource.typeToString(resourceType, onlineResources[j].get('version'));
                    if (!group || (type && type !== resourceType)) {
                        continue; //don't include anything else
                    }

                    dataItems.push(Ext.create('portal.widgets.panel.OnlineResourcePanelRow',{
                        group : group,
                        onlineResource : onlineResources[j],
                        cswRecord : cswRecords[i]
                    }));
                }
            }

            return dataItems;
        },
        
        /**
         * Turns an array of portal.csw.CSWRecord objects inside a data store 
         * into an equivalent array of ga.widgets.OnlineResourceSelectionPanelRow objects.
         * Optionally filters by specified type.
         */
        parseCswRecordsFromStore : function(cswRecordStore, type) {
            var dataItems = [];
            
            cswRecordStore.each(function(cswRecord,id){
                
                var onlineResources = cswRecord.getAllChildOnlineResources();
                for (var j = 0; j < onlineResources.length; j++) {

                    var resourceType = onlineResources[j].get('type');
                    
                    //ensure we have a type we want to describe
                    var group = portal.csw.OnlineResource.typeToString(resourceType, onlineResources[j].get('version'));
                    if (!group || (type && type !== resourceType)) {
                        continue; //don't include anything else
                    }

                    dataItems.push(Ext.create('portal.widgets.panel.OnlineResourcePanelRow',{
                        group : group,
                        onlineResource : onlineResources[j],
                        cswRecord : cswRecord
                    }));
                }
            });

            return dataItems;
        }
    },

    fields: [
             {name : 'group', type: 'string'},
             {name : 'onlineResource', type: 'auto'},
             {name : 'cswRecord', type: 'auto'}
    ]
});