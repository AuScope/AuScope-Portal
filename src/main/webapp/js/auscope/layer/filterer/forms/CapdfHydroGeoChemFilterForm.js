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
        if (wfsresource.length == 0) {
            wfsresource = null;
            this.serviceUrl = null;
        } else {
            this.serviceUrl = wfsresource[0].get('url');
        }
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

        // 'Group of Interest' selector
        this.groupCombo = Ext.create('Ext.form.ComboBox', {
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
                                if (window.sessionStorage) {
                                    sessionStorage.setItem('capdfHydroGeoChemFilterForm_upc',record.get('groupValue'));
                                }
                            }
                        }
                    });
        
        // 'Parameter of Interest' selector
         this.parameterCombo = Ext.create('Ext.form.ComboBox', {
            anchor: '100%',
            itemId: 'aoiParam',
            disabled : false,
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
                itemTpl:  Ext.create('Ext.XTemplate',
                        '<tpl if="pref_name == null || pref_name == \'\'">',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b></div>',
                        '<tpl else>',
                        '<div data-qtip="{pref_name}"><b>{classifier}</b> ({pref_name})</div>',
                        '</tpl>'
                )
            },
            listeners: {
                select : function(combo, record, eOpts){
                    // When selector changes, set slider below to max/min
                    me.setSliderToRecord(record, true);
                },
                // When selector changes remember the setting
                change : function(combo, newValue, oldValue, eOpts){
                    if (window.sessionStorage && newValue != null) {
                        sessionStorage.setItem('capdfHydroGeoChemFilterForm_poi', newValue);
                    }
                }

            }
        });

         
         // 'Min/Max Color Code' slider
         this.minMaxSlider = Ext.create('Ext.slider.Multi', {
             anchor: '100%',
             itemId: 'minMaxSlider',
             disabled: false,
             fieldLabel: '<span data-qtip="Select the min and max value for color coding">' + 'Min/Max Color Code' + '</span>',
             labelAlign: 'left',
             name: 'minMax',
             decimalPrecision : 3,
             values: [0, 100],
             minValue:0,
             maxValue:100,
             listeners: {
                 beforerender: function(slider, eOpts) {
                     // Set up stored slider values
                     if (window.sessionStorage) {
                         var min = sessionStorage.getItem('capdfHydroGeoChemFilterForm_min');
                         var max = sessionStorage.getItem('capdfHydroGeoChemFilterForm_max');
                         var minV = sessionStorage.getItem('capdfHydroGeoChemFilterForm_minV');
                         var maxV = sessionStorage.getItem('capdfHydroGeoChemFilterForm_maxV');
                         if (min != null && max != null && me.parameterCombo.getRawValue()!=null && me.parameterCombo.getRawValue()!="") {
                             me.updateMinMaxSlider(min,max,minV,maxV);
                         }
                     }
                 },

                 // When slider is changed, remember the settings
                 changecomplete: function(slider, newValue, thumb, eOpts ) {
                     if (window.sessionStorage) {
                         sessionStorage.setItem('capdfHydroGeoChemFilterForm_minV', slider.getValue(0));
                         sessionStorage.setItem('capdfHydroGeoChemFilterForm_maxV', slider.getValue(1));
                     }
                 }
            }
                               
         });

        // Apply configuration
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
                    items:[this.groupCombo,this.parameterCombo, this.minMaxSlider]
                }]
            }]
        });




        Ext.tip.QuickTipManager.init();
        this.callParent(arguments);

        // Load "Group of interest" selector, and update "Parameter of Interest" selector below
        var callingInstance = this;
        groupStore.load( {
            callback : function(records, operation, success) {                
                var combo=me.groupCombo;
                if (combo.getStore()!=null && combo.getStore().getCount()>0) {
                    var selectedVal = combo.getValue();
                    if (selectedVal!=null && selectedVal != "") {
                        me.updateParameterCombo(selectedVal);
                    } else if (window.sessionStorage) {
                        var upcVal = sessionStorage.getItem('capdfHydroGeoChemFilterForm_upc');
                        if (upcVal != null) {
                            // IE does not remember selected value when "Add to Layer" button is hit, so must restore it
                            if (Ext.isIE) {
                                combo.setValue(upcVal);
                                me.updateParameterCombo(upcVal);
                            }
                        }
                    } 
                }

                //It's very important that once all of our stores are loaded we fire the formloaded event
                //because we are setting the delayedFormLoading parameter to true in our constructor
                callingInstance.setIsFormLoaded(true);
                callingInstance.fireEvent('formloaded');
            }
        });
    }, // End of constructor

    // This loads up 'Parameter of Interest', sets displayed value, updates the slider
    // It uses 'setRawValue()' to avoid triggering extra callbacks
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
        var me = this;

        var myMask;
        
        // Sometimes the upper fieldset component is not defined yet.
        if (!Ext.isIE) {
            if (this.parameterCombo.up('fieldset')!=undefined) {
                var fieldSet = this.parameterCombo.up('fieldset');
                myMask = new Ext.LoadMask({
                    msg    : 'Please wait...',
                    target : fieldSet
                });

                myMask.show();
            }
        }

        aoiParamStore.on('load',function(store, records, successful, eOpts ){
            if (!Ext.isIE && myMask!=undefined)
                myMask.hide();
            
            // If there are no 'Parameters of Interest'
            if (store.getCount()==0) {
                me.parameterCombo.setRawValue("");
                if (window.sessionStorage) {
                    sessionStorage.removeItem('capdfHydroGeoChemFilterForm_poi');
                    sessionStorage.removeItem('capdfHydroGeoChemFilterForm_max');
                    sessionStorage.removeItem('capdfHydroGeoChemFilterForm_min');
                    sessionStorage.removeItem('capdfHydroGeoChemFilterForm_maxV');
                    sessionStorage.removeItem('capdfHydroGeoChemFilterForm_minV');
                }
                me.updateMinMaxSlider('0','100','0','100');
                return;
            }
        
            if (successful) {
                // Select the stored value, if possible
                if (window.sessionStorage) {
                    var poi = sessionStorage.getItem('capdfHydroGeoChemFilterForm_poi');
                    if (poi != null && store.getCount()>0) {
                        var selectedRecord = store.findRecord("classifier", poi);
                        if (selectedRecord!=null) {
                            me.parameterCombo.setRawValue(poi);
                            var maxV = sessionStorage.getItem('capdfHydroGeoChemFilterForm_maxV');
                            var minV = sessionStorage.getItem('capdfHydroGeoChemFilterForm_minV');
                            me.updateMinMaxSlider(selectedRecord.get('min'),selectedRecord.get('max'), minV, maxV);
                            return;
                        }
                    }
                }
                // Else select the first value
                if (me.parameterCombo.getStore() != null) {
                    if (records != null) {
                        me.parameterCombo.setSelection(records[0]);
                        me.setSliderToRecord(records[0], true);
                    }
                }
            }
        });
    }, // End of updateParameterCombo
    
    //  Set the min, max and both slider thumb values using the input 'record'
    //  If resetVals is not 'true', then will not change the thumb values    
    setSliderToRecord: function(record, resetVals) {
        if (resetVals===true) {
            this.updateMinMaxSlider(record.get('min'),record.get('max'), record.get('min'),record.get('max'));
        } else {
            this.updateMinMaxSlider(record.get('min'),record.get('max'), null, null);
        }
        if (window.sessionStorage) {
           sessionStorage.setItem('capdfHydroGeoChemFilterForm_max', record.get('max'));
           sessionStorage.setItem('capdfHydroGeoChemFilterForm_min', record.get('min'));
           if (resetVals===true) {
               sessionStorage.setItem('capdfHydroGeoChemFilterForm_maxV', record.get('max'));
               sessionStorage.setItem('capdfHydroGeoChemFilterForm_minV', record.get('min'));
           }
        }
    },

    // Updates slider max, min and thumb values
    updateMinMaxSlider : function(min,max,minV,maxV){
        var minLimit=parseFloat(min),
            maxLimit=parseFloat(max);
      
        // Set the slider limits
        this.minMaxSlider.setMinValue(minLimit);
        this.minMaxSlider.setMaxValue(maxLimit);
        // Set the slider values
        if (minV != null && maxV != null) {
            var minValue=parseFloat(minV),
                maxValue=parseFloat(maxV);
            if (minValue<minLimit)
                minValue=minLimit;
            if (maxValue>maxLimit)
                maxValue=maxLimit;
            this.minMaxSlider.setValue([minValue,maxValue],false);
        }
    }
});

