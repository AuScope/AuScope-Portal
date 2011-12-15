Ext.ns('Admin.Tests');

/**
 * A test for ensuring that the WFS's registered in Known Layers are working as expected
 */
Admin.Tests.KnownLayerWFS = Ext.extend(Admin.Tests.SingleAJAXTest, {

    constructor : function(cfg) {
        Admin.Tests.KnownLayerWFS.superclass.constructor.call(this, cfg);
    },

    getTitle : function() {
        return 'Known layer WFS availability';
    },

    getDescription : function() {
        var baseDescription = 'This tests the backend connection to all web feature services that belong to known layers. A simple GetFeature request is made both with and without a bounding box.';

        baseDescription += Admin.Tests.KnownLayerWFS.superclass.getDescription.call(this);

        return baseDescription;
    },


    /**
     * The entirety of our test is making a request to the controller and parsing the resposne
     */
    startTest : function(knownLayerStore, cswRecordStore) {
        //Init our params
        var bbox = new BBox(-3, -47, 160, 110); //rough bounds around Australia.
        var typeNames = [];
        var serviceUrls = [];

        //Get every single WFS attached to a known layer
        for (var i = 0; i < knownLayerStore.getCount(); i++) {
            var knownLayer = knownLayerStore.getKnownLayerAt(i);
            if (knownLayer.getHidden()) {
                continue;
            }
            var cswRecords = knownLayer.getLinkedCSWRecords(cswRecordStore);

            for (var j = 0; j < cswRecords.length; j++) {
                var cswRecord = cswRecords[j];
                var wfsOnlineResources = cswRecord.getFilteredOnlineResources('WFS');

                for (var k = 0; k < wfsOnlineResources.length; k++) {
                    typeNames.push(wfsOnlineResources[k].name);
                    serviceUrls.push(wfsOnlineResources[k].url);
                }
            }
        }

        //Run our test
        this._singleAjaxTest('testWFS.do', {
            bbox : Ext.util.JSON.encode(bbox),
            serviceUrls : serviceUrls,
            typeNames : typeNames
        });
    }
});