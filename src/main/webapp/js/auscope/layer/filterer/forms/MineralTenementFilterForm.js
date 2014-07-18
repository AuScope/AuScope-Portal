/**
 * Builds a form panel for Mine filters
 */
Ext.define('auscope.layer.filterer.forms.MineralTenementFilterForm', {
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
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'mt:MineralTenement');

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

        //Set up a list of each unique admin area
        var adminAreasList = [];
        for(key in adminAreasMap){
            adminAreasList.push({
                displayText : key,
                serviceFilter : adminAreasMap[key]
            });
        }

        var adminAreasStore = Ext.create('Ext.data.Store', {
            fields: ['displayText', 'serviceFilter'],
            data : adminAreasList
        });

        var tenementTypeStore = Ext.create('Ext.data.Store', {
            fields: ['displayText', 'valueText'],
            data : [
                {displayText: 'Exploration', valueText: '*exploration*'},
                {displayText: 'Prospecting', valueText: '*prospecting*'},
                {displayText: 'Miscellaneous', valueText: '*miscellaneous*'},
                {displayText: 'Mining Lease', valueText: '*mining*'},
                {displayText: 'Licence', valueText: '*licence*'}
            ]
        });

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
                           'Mine Filter Properties' +
                       '</span>',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'Tenement Name' +
                                '</span>',
                    name: 'name'
                },{
                    xtype: 'combo',
                    anchor: '100%',
                    fieldLabel: 'Tenement Type',
                    name: 'tenementType',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: tenementTypeStore,
                    valueField: 'valueText',
                    displayField: 'displayText',
                    hiddenName: 'valueText'
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'owner' +
                                '</span>',
                    name: 'owner'
                },{
                    anchor: '100%',
                    xtype: 'datefield',
                    fieldLabel: '<span data-qtip="Tenement active till this date">' +
                                'Tenement Expiry End Date' +
                                '</span>',
                    name: 'endDate',
                    format: "Y-m-d",
                    value: ''
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Minimum size of the Tenement">' +
                                'Min Size' +
                                '</span>',
                    name: 'size'
                },{
                    xtype: 'combo',
                    anchor: '100%',
                    itemId: 'serviceFilter-field',
                    fieldLabel: 'Provider',
                    name: 'serviceFilter',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: adminAreasStore,
                    valueField: 'serviceFilter',
                    displayField: 'displayText',
                    hiddenName: 'serviceFilter'
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

