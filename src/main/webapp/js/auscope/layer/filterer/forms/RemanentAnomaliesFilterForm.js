/**
 * Builds a form panel for RemanentAnomalies filters
 */
Ext.define('auscope.layer.filterer.forms.RemanentAnomaliesFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {

        var cswRecords = config.layer.get('cswRecords');


        //Set up a map of admin areas + URL's that belong to each
        var adminAreasMap = {};
        var bbox = null;
        for (var i = 0; i < cswRecords.length; i++) {
            var adminArea = cswRecords[i].get('adminArea');
            var allOnlineResources = cswRecords[i].get('onlineResources');
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'RemAnom:Anomaly');

            for (var j = 0; j < bhOnlineResources.length; j++) {
                if (adminAreasMap[adminArea]) {
                    adminAreasMap[adminArea].push(bhOnlineResources[j].get('url'));
                } else {
                    adminAreasMap[adminArea] = [bhOnlineResources[j].get('url')];
                }
            }
            var geoEl = cswRecords[i].get('geographicElements')[0];

            if (geoEl) {
                if (bbox) {
                    bbox = bbox.combine(geoEl);
                } else {
                    bbox = geoEl;
                }
            }
        }

        Ext.apply(config, {
            delayedFormLoading: false,
            border: false,
            autoScroll: true,
            hideMode:'offsets',
            width:'100%',
            buttonAlign:'right',
            labelAlign:'right',
            labelWidth: 70,
            timeout: 180, //should not time out before the server does
            bodyStyle:'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Show Results\'">' +
                           'Filter data' +
                       '</span>',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'Remanent Anomaly Name' +
                                '</span>',
                    name: 'name'
                },{
                    xtype: 'hidden',
                    name: 'cswBbox',
                    value: Ext.JSON.encode(bbox)
                }]
            }]
        });

        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
    }
});

