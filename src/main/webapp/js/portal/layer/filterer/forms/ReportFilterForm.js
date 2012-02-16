/**
 * Builds a form panel for Report filters
 */
Ext.define('portal.layer.filterer.forms.ReportFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {
        //First build our keyword/resource data from our list of CSWRecords
        var cswRecords = config.layer.get('cswRecords');;
        var keywordData = {}; //store the counts of keywords keyed by the keyword name
        var resourceData = {}; //sotre the counts of providers keyed by provider names
        for (var i = 0; i < cswRecords.length; i++) {
            //Add keywords
            var keywordArray = cswRecords[i].get('keywords');
            for (var j = 0; j < keywordArray.length; j++) {
                var keyword = keywordArray[j];
                if (keywordData[keyword]) {
                    keywordData[keyword]++;
                } else {
                    keywordData[keyword] = 1;
                }
            }

            //Add resource providers
            var resourceProvider = cswRecords[i].get('resourceProvider');
            if (resourceData[resourceProvider]) {
                resourceData[resourceProvider]++;
            } else {
                resourceData[resourceProvider] = 1;
            }
        }

        //Turn that keyword data into something we can plug into a store
        var keywordList = [];
        for (var keyword in keywordData) {
            keywordList.push([keyword, keywordData[keyword]]);
        }
        var keywordStore = Ext.create('Ext.data.Store', {
            fields   : ['keyword', 'count'],
            data: keywordList
        });

        //Do the same for our resource data
        var providerList = [];
        for (var provider in resourceData) {
            providerList.push([provider, resourceData[provider]]);
        }
        var resourceProviderStore = Ext.create('Ext.data.Store', {
            fields   : ['resourceProvider', 'count'],
            data: providerList
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
            bodyStyle:'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                title: 'Report Filter Properties',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    xtype: 'textfield',
                    fieldLabel: 'Title',
                    name: 'title'
                },{
                    xtype: 'combo',
                    tpl: '<tpl for="."><div style="word-wrap" ext:qtip="{keyword} - {count} record(s)" class="x-combo-list-item">{keyword}</div></tpl>',
                    anchor: '100%',
                    name: 'keyword',
                    hiddenName: 'keyword',
                    fieldLabel: 'Keyword',
                    labelAlign: 'right',
                    forceSelection: true,
                    mode: 'local',
                    store: keywordStore,
                    triggerAction: 'all',
                    typeAhead: true,
                    displayField:'keyword',
                    valueField:'keyword',
                    autoScroll: true
                },{
                    xtype: 'combo',
                    tpl: '<tpl for="."><div style="word-wrap" ext:qtip="{resourceProvider} - {count} record(s)" class="x-combo-list-item">{resourceProvider}</div></tpl>',
                    anchor: '100%',
                    name: 'resourceProvider',
                    hiddenName: 'resourceProvider',
                    fieldLabel: 'Resource Provider',
                    labelAlign: 'right',
                    forceSelection: true,
                    mode: 'local',
                    store: resourceProviderStore,
                    triggerAction: 'all',
                    typeAhead: true,
                    displayField:'resourceProvider',
                    valueField:'resourceProvider',
                    autoScroll: true
                }]
            }]
        });

        this.callParent(arguments);
    }
});
