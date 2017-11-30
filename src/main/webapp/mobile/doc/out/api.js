YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CapdfWMSService",
        "D3PlotService",
        "FilterStateService",
        "GMLParserService",
        "GetCSWRecordService",
        "GetFilterParamService",
        "GetWFSRelatedService",
        "GetWMSRelatedService",
        "GoogleMapService",
        "LayerManagerService",
        "NVCLService",
        "PreviewMapService",
        "QuerierPanelService",
        "RenderHandlerService",
        "RenderStatusService",
        "SimpleXPathService",
        "StyleService",
        "WFSService",
        "WMSService",
        "WMS_1_1_0_Service",
        "WMS_1_3_0_Service",
        "capdfHydrogeochemCtrl",
        "collapseInfoPanelCtrl",
        "defaultAnalyticCtrl",
        "googleMapCtrl",
        "infoPanelCtrl",
        "layerPanelCtrl",
        "layerSearchCtrl",
        "loadAnalyticCtrl",
        "loadFilterCtrl",
        "pressureDbCtrl"
    ],
    "modules": [
        "analytic",
        "controllers",
        "http",
        "layer",
        "map",
        "utility"
    ],
    "allModules": [
        {
            "displayName": "analytic",
            "name": "analytic",
            "description": "Service class related to handling all things related to making http cswrecords"
        },
        {
            "displayName": "controllers",
            "name": "controllers",
            "description": "capdfHydrogeochemCtrl class used for capdf hydrogeochem controller. This controller sits under loadAnalyticCtrl"
        },
        {
            "displayName": "http",
            "name": "http",
            "description": "Service class related to handling all things related to making http cswrecords"
        },
        {
            "displayName": "layer",
            "name": "layer",
            "description": "FilterStateService user to store and extract the state of the filters and change the state of the filters"
        },
        {
            "displayName": "map",
            "name": "map",
            "description": "Service class related to handling all things related to google map."
        },
        {
            "displayName": "utility",
            "name": "utility",
            "description": "GMLParserService handles the parsing of GML documents"
        }
    ],
    "elements": []
} };
});