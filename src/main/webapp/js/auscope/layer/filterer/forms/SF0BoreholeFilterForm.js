/**
 * Builds a form panel for generic gsmlp:BoreholeView filters
 * @param {number} id of this formpanel instance
 * @param {string} the service url for submit
 */
Ext.define('auscope.layer.filterer.forms.SF0BoreholeFilterForm', {
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
            var bhOnlineResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS, 'gsmlp:BoreholeView');

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

        Ext.apply(config, {
            delayedFormLoading: false, //we don't need to use a delayed load as all of our info is ready now
            border: false,
            autoScroll: true,
            hideMode: 'offsets',
            width:'100%',
            buttonAlign: 'right',
            labelAlign: 'right',
            labelWidth: 70,
            bodyStyle: 'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                itemId: 'borehole-fieldset',
                title: 'Borehole View Filter Properties',
                autoHeight : true,
                items: [{
                    xtype: 'textfield',
                    anchor: '95%',
                    itemId: 'name-field',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' + 'Name',
                    name: 'boreholeName'
                },{
                    xtype: 'datefield',
                    anchor: '95%',
                    itemId: 'drillingdatestart-field',
                    fieldLabel: 'Drill Date Start',
                    format: "Y-m-d",
                    value: '',
                    name: 'dateOfDrillingStart'
                },{
                    xtype: 'datefield',
                    anchor: '95%',
                    itemId: 'drillingdateend-field',
                    fieldLabel: 'Drill Date End',
                    format: "Y-m-d",
                    value: '',
                    name: 'dateOfDrillingEnd'
                },{
                    xtype: 'combo',
                    anchor: '95%',
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
                	name: 'postMethod',
                	value: 'true'              	                
                }]
            }]
        });

        this.callParent(arguments);
    }
});
