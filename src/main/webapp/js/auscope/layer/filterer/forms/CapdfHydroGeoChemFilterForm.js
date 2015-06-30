/**
 * Builds a form panel for Mine filters
 */
Ext.define('auscope.layer.filterer.forms.CapdfHydroGeoChemFilterForm', {
    extend: 'portal.layer.filterer.BaseFilterForm',

    /**
     * Accepts a config for portal.layer.filterer.BaseFilterForm
     */
    constructor : function(config) {      
        
        var wfsresource = portal.csw.OnlineResource.getFilteredFromArray(config.layer.getAllOnlineResources(), portal.csw.OnlineResource.WFS);
        //VT: for the time being we assumed that is only one service endpoint.
        wfsresource = wfsresource[0];
        this.serviceUrl = wfsresource.get('url');
        var me = this;
      
        var groupStore = Ext.create('Ext.data.Store', {
            fields : ['groupName', 'groupValue'],
            proxy : {
                type : 'ajax',
                url : 'doGetGroupOfInterest.do',
                extraParams: {
                    serviceUrl: this.serviceUrl
                },
                reader : {
                    type : 'array',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });  
        
         this.parameterCombo = Ext.create('Ext.form.ComboBox', {           
            anchor: '100%',
            itemId: 'aoiParam',
            disabled :  true,
            fieldLabel: '<span data-qtip="Select the parameter of interest">' + 'Parameter of Interest' + '</span>',
            labelAlign: 'left',
            name: 'poi',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            queryMode: 'local',
            typeAheadDelay: 500,            
            valueField: 'classifier',
            displayField: 'classifier', 
            listConfig: {
                itemTpl: [
                    '<div data-qtip="{pref_name}">{classifier}-({pref_name})</div>'
                ]
            },
            listeners: {
                select : function(combo, record, eOpts){
                    me.updateMinMaxSlider(record.get('min'),record.get('max'));
                }
            }
        });
         
         this.minMaxSlider = Ext.create('Ext.slider.Multi', {           
             anchor: '100%',
             itemId: 'minMaxSlider',
             disabled :  true,
             fieldLabel: '<span data-qtip="Select the min and max value for color coding">' + 'Min/Max Color Code' + '</span>',
             labelAlign: 'left',
             name: 'minMax',
             decimalPrecision : 3,
             values: [25, 50],
             minValue:0,
             maxValue:100,
             
                               
         });
            

        Ext.apply(config, {
            delayedFormLoading: true,
            border: false,
            autoScroll: true,
            hideMode:'offsets',
            width:'100%',
            buttonAlign:'right',
            labelAlign:'left',
            labelWidth: 70,
            timeout: 180, //should not time out before the server does
            bodyStyle:'padding:5px',
            autoHeight: true,
            items: [{
                xtype:'fieldset',
                title: '<span data-qtip="Please enter the filter constraints then hit \'Show Results\'">' +
                           'Geochemistry Filter Properties' +
                       '</span>',
                autoHeight: true,
                items: [{
                    anchor: '100%',
                    labelAlign: 'left',
                    xtype: 'textfield',
                    fieldLabel: '<span data-qtip="Wildcards: \'!\' escape character; \'*\' zero or more, \'#\' just one character.">' +
                                    'Batch Id' +
                                '</span>',
                    name: 'batchid'
                },{
                    xtype:'fieldset',
                    title: '<span data-qtip="Please enter your color coding selection">' +
                        'Color Coding Filter' +
                        '</span>',
                    autoHeight:true,                   
                    collapsible:true,
                    items:[{
                        xtype: 'combo',
                        anchor: '100%',
                        itemId: 'aoi',
                        fieldLabel: '<span data-qtip="Select the group of interest">' + 'Group of Interest' + '</span>',
                        labelAlign: 'left',
                        name: 'featureType',
                        typeAhead: true,
                        triggerAction: 'all',
                        lazyRender:true,
                        queryMode: 'local',
                        typeAheadDelay: 500,
                        store: groupStore,
                        valueField: 'groupValue',
                        displayField: 'groupName',                    
                        listeners : {
                            select : function(combo, record, eOpts){
                                me.updateParameterCombo(record.get('groupValue'));
                                
                            }
                        }
                    },this.parameterCombo, this.minMaxSlider]
                }]
            }]
        });
        
       
     

        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);
        
        //load our commodity store
        var callingInstance = this;
        groupStore.load( {
            callback : function() {
                //It's very important that once all of our stores are loaded we fire the formloaded event
                //because we are setting the delayedFormLoading parameter to true in our constructor
                callingInstance.setIsFormLoaded(true);
                callingInstance.fireEvent('formloaded');
            }
        });
    },
    
    
    updateParameterCombo : function(featureType){
        var aoiParamStore = Ext.create('Ext.data.Store', {
            fields : ['classifier', 'pref_name','min','max'],
            proxy : {
                type : 'ajax',
                url : 'doGetAOIParam.do',
                extraParams: {
                    serviceUrl: this.serviceUrl,
                    featureType : featureType
                },
                reader : {
                    type : 'array',
                    rootProperty : 'data'
                }
            },
            autoLoad : true
        });
        
        this.parameterCombo.setStore(aoiParamStore);
        this.parameterCombo.setDisabled(false);
        var me = this;
        
        var myMask = new Ext.LoadMask({
            msg    : 'Please wait...',
            target : this.parameterCombo.up('fieldset')
        });

        myMask.show();
        
        aoiParamStore.on('load',function(store, records, successful, eOpts ){
            myMask.hide();
            if(successful){
                me.parameterCombo.setSelection(records[0]);
            }
        })
    },
    
    updateMinMaxSlider : function(min,max){
      var min=parseFloat(min),
          max=parseFloat(max)
      this.minMaxSlider.setMinValue(min);
      this.minMaxSlider.setMaxValue(max);
      this.minMaxSlider.setValue([min,max],true);
      this.minMaxSlider.setDisabled(false);
    }
});

