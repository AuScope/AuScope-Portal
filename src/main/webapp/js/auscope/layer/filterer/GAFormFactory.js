/**
 * Geoscience Australia implementation of the core portal FormFactory
 */
Ext.define('auscope.layer.filterer.GAFormFactory', {
    extend : 'portal.layer.filterer.FormFactory',

    // only the active layer panel should display the opacity for WMS layers 
    showWMSFilter : false,
    
    /**
     * map : [Required] an instance of portal.map.BaseMap
     */
    constructor : function(config) {
        
        this.showWMSFilter = config.showWMSFilter ? config.showWMSFilter : false;
        
        this.callParent(arguments);
    },

    /**
     * Given an portal.layer.Layer, work out whether there is an appropriate portal.layer.filterer.BaseFilterForm to show
     *
     * Returns a response in the form
     * {
     *    form : Ext.FormPanel - the formpanel to be displayed when this layer is selected (can be EmptyFilterForm)
     *    supportsFiltering : boolean - whether this formpanel supports the usage of the filter button
     *    layer : portal.layer.Layer that was used to generate this object
     * }
     *
     */
    getFilterForm : function(layer) {
        var baseFilterForm = null;
        var baseFilterFormCfg = {
            layer : layer,
            map : this.map,
            showWMSFilter : this.showWMSFilter
        };

        //A number of known layer's have specific filter forms
        if (layer.get('sourceType') === portal.layer.Layer.KNOWN_LAYER) {
            switch (layer.get('source').get('id')) {
            case 'pressuredb-borehole':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.PressureDBFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'nvcl-borehole':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.NvclFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'mineral-tenements':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.MineralTenementFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'mineral-occ-view':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.MineralOccurrenceFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'erml-mine':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.MineFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'erml-miningactivity':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.MiningActivityFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'yilgarn-geochem':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.YilgarnGeochemistryFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'gsml-borehole':
            case 'mscl-borehole':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.BoreholeFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'portal-reports':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.ReportFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'sf0-borehole-nvcl' :
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.SF0BoreholeFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'remanent-anomalies':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.RemanentAnomaliesFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'remanent-anomalies-EMAG':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.RemanentAnomaliesFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            case 'capdf-hydrogeochem':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.CapdfHydroGeoChemFilterForm', baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true); 

            case 'tima-geosample':
                baseFilterForm = Ext.create('auscope.layer.filterer.forms.TimaGeoSampleFilterForm',baseFilterFormCfg);
                return this._generateResult(baseFilterForm, true);
            
            }
        }
        
        if (layer.get('sourceType') === portal.layer.Layer.KML_RECORD){
            return this._generateResult(Ext.create('portal.layer.filterer.forms.EmptyFilterForm', baseFilterFormCfg), false);
        }
                
        if (layer.get('renderer') instanceof portal.layer.renderer.wms.LayerRenderer) {
            
            //VT: Filtering is support but for WMS, we want the image to be displayed immediately after it has been added and
            //the opacity can be adjusted from there on
            baseFilterForm = Ext.create('portal.layer.filterer.forms.WMSLayerFilterForm', baseFilterFormCfg);

            // if we don't want to display the filter form (eg in the known layers panel) 
            // then just make it invisible. Otherwise we end up with issues with portal-core logic 
            // ignoring our filter in the active layers panel and so on
            if (!this.showWMSFilter) {
                baseFilterForm.cls = 'displayNone';
            }
            
            return this._generateResult(baseFilterForm, false);
        }                          
        
        if (layer.get('renderer') instanceof portal.layer.renderer.wfs.FeatureWithMapRenderer) {
            baseFilterForm = Ext.create('portal.layer.filterer.forms.WMSLayerFilterForm', baseFilterFormCfg);

            return this._generateResult(baseFilterForm, false);
        }  

        // TODO: Can I get rid of containsCSWService and make this check the renderer like the example above?
        // don't forget this method is used in AuScopeRendererFactory.js, too.
        // Once you work out what the renderer will be called you CAN change this to make it like the one above
        // and then remove the containsCSWService method from Layer.js
        if (layer.containsCSWService()) {
            baseFilterForm = Ext.create('auscope.layer.filterer.forms.CSWServiceFilterForm', baseFilterFormCfg);
            return this._generateResult(baseFilterForm, true);
        }


        //And otherwise we just show the empty filter form
        return this._generateResult(Ext.create('portal.layer.filterer.forms.EmptyFilterForm', baseFilterFormCfg), false);
    }
});