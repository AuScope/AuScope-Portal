/**
 * Builds a form panel for Mining Activity filters
 */
Ext.define('auscope.layer.filterer.forms.MiningActivityFilterForm', {
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
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'er:MiningFeatureOccurrence');

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
            autoLoad : true
        });

        Ext.apply(config, {
            delayedFormLoading: true, //we won't be ready until our commodity store is loaded - therefore we have to fire formloaded when ready
            border: false,
            autoScroll: true,
            hideMode: 'offsets',
            width: '100%',
            labelAlign: 'right',
            labelWidth: 130,
            bodyStyle: 'padding:5px',
            items: [{
                xtype:'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Apply Filter\'">' +
                       'Mining Activity Filter Properties' +
                       '</span>',
                defaultType: 'textfield',
                defaults: {anchor: '100%'},
                items :[{
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                'Associated Mine' +
                                '</span>',
                    name: 'mineName'
                },{
                    xtype : 'combo',
                    anchor: '100%',
                    name: 'producedMaterial', /* this just returns the values from displayField! */
                    hiddenName: 'producedMaterial',    /* this returns the values from valueField! */
                    fieldLabel: 'Produced Material',
                    forceSelection: true,
                    queryMode: 'local',
                    store: commodityStore,
                    triggerAction: 'all',
                    typeAhead: true,
                    typeAheadDelay: 500,
                    displayField:'label',   /* change tpl field to this value as well! */
                    valueField:'urn'
                },{
                    xtype: 'datefield',
                    fieldLabel: '<span data-qtip="Activity which start AFTER this date">' +
                                'Activity Start Date' +
                                '</span>',
                    name: 'startDate',
                    format: "Y-m-d",
                    value: ''
                },{
                    xtype: 'datefield',
                    fieldLabel: '<span data-qtip="Activity which end BEFORE this date">' +
                                'Activity End Date' +
                                '</span>',

                    name: 'endDate',
                    format: "Y-m-d",
                    value: ''
                },{
                    fieldLabel: '<span data-qtip="Minimum Amount of Ore Processed">' +
                                'Min. Ore Processed' +
                                '</span>',
                    name: 'oreProcessed'
                },{
                    fieldLabel: '<span data-qtip="Minimum Amount of Product Produced">' +
                                'Min. Prod. Amount' +
                                '</span>',
                    name: 'production'
                },{
                    fieldLabel: 'Grade',
                    name: 'cutOffGrade',
                    hidden: true,
                    hideLabel: true
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
