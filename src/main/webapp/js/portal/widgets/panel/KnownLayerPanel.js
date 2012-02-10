/**
 * A specialisation of portal.widgets.panel.BaseRecordPanel for rendering
 * records conforming to the portal.knownlayer.KnownLayer Model
 */
Ext.define('portal.widgets.panel.KnownLayerPanel', {
    extend : 'portal.widgets.panel.BaseRecordPanel',

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * Implements method - see parent class for details.
     */
    getTitleForRecord : function(record) {
        return record.data.title;
    },

    /**
     * Implements method - see parent class for details.
     */
    getOnlineResourcesForRecord : function(record) {
        var onlineResources = [];
        var cswRecords = record.data.cswRecords;

        for (var i = 0; i < cswRecords.length; i++) {
            onlineResources = onlineResources.concat(cswRecords[i].data.onlineResources);
        }

        return onlineResources;
    },

    /**
     * Implements method - see parent class for details.
     */
    getSpatialBoundsForRecord : function(record) {
        var bboxes = [];
        var cswRecords = record.data.cswRecords;

        for (var i = 0; i < cswRecords.length; i++) {
            bboxes = bboxes.concat(cswRecords[i].data.geographicElements);
        }

        return bboxes;
    },

    /**
     * Implements method - see parent class for details.
     */
    getGroupForRecord : function(record) {
        return record.data.group;
    }

});