/**
 * Builds a form panel for Mineral Occurrence filters
 */
Ext.define('auscope.layer.filterer.forms.MinOccurViewFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {

        var cswRecords = config.layer.get('cswRecords');


        //Set up a map of admin areas + URL's that belong to each
        var adminAreasMap = {};
        for (var i = 0; i < cswRecords.length; i++) {
            var adminArea = cswRecords[i].get('adminArea');
            var allOnlineResources = cswRecords[i].get('onlineResources');
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'mo:MinOccView');

            for (var j = 0; j < bhOnlineResources.length; j++) {
                if (adminAreasMap[adminArea]) {
                    adminAreasMap[adminArea].push(bhOnlineResources[j].get('url'));
                } else {
                    adminAreasMap[adminArea] = [bhOnlineResources[j].get('url')];
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

        var commodityStore = Ext.create('Ext.data.Store', {
            fields : ['urn', 'label'],
            proxy : {
                type : 'ajax',
                url : 'getAllCommodities.do',
                reader : {
                    type : 'array',
                    root : 'data'
                }
            },
            sorters : [{
                property : 'label',
                direction : 'ASC'
            }]
        });

        Ext.apply(config, {
            delayedFormLoading: true, //we won't be ready until our commodity store is loaded - therefore we have to fire formloaded when ready
            border: false,
            autoScroll: true,
            hideMode: 'offsets',
            labelAlign: 'right',
            bodyStyle: 'padding:5px',
            autoHeight: true,
            layout: 'anchor',
            items: [{
                xtype: 'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Apply Filter\'">' +
                          'Mineral Occurrence Filter Properties' +
                       '</span>',
                autoHeight: true,
                labelAlign: 'right',
                bodyStyle: 'padding:0px',
                items :[{
                    xtype : 'combo',
                    anchor: '100%',
                    name: 'commodityName',
                    fieldLabel: '<span data-qtip="Please select a commodity from the Commodity Vocabulary. Powered by SISSVoc">' + 'Commodity' + '</span>',
                    labelAlign: 'right',
                    forceSelection: false,
                    queryMode: 'local',
                    store: commodityStore,
                    triggerAction: 'all',
                    typeAhead: true,
                    typeAheadDelay: 500,
                    displayField:'label',   /* change tpl field to this value as well! */
                    valueField:'urn'
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: '<span data-qtip="Minimum Ore Amount">' +
                                'Min Ore Amount' +
                                '</span>',
                    name: 'minOreAmount'
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: '<span data-qtip="Minimum Ore Reserves">' +
                                'Min Ore Reserves' +
                                '</span>',
                    name: 'minReserves'
                },{
                    anchor: '100%',
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: '<span data-qtip="Minimum Ore Resources">' +
                                'Min Ore Resources' +
                                '</span>',
                    name: 'minResources'
                },{
                    xtype: 'combo',
                    anchor: '100%',
                    itemId: 'serviceFilter-field',
                    fieldLabel: 'Provider',
                    name: 'serviceFilter',
                    labelAlign: 'right',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: adminAreasStore,
                    valueField: 'serviceFilter',
                    displayField: 'displayText',
                    hiddenName: 'serviceFilter'
                }]
            }]
        });

        this.callParent(arguments);

        //load our commodity store
        var callingInstance = this;
        commodityStore.load( {
            callback : function() {
                //It's very important that once all of our stores are loaded we fire the formloaded event
                //because we are setting the delayedFormLoading parameter to true in our constructor
                callingInstance.setIsFormLoaded(true);
                callingInstance.fireEvent('formloaded');
            }
        });
    }
});