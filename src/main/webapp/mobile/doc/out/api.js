YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CollapseDemoCtrl",
        "GMLParserService",
        "GetCSWRecordService",
        "GetWFSRelatedService",
        "GetWMSRelatedService",
        "GoogleMapService",
        "LayerManagerService",
        "PreviewMapService",
        "RenderHandlerService",
        "SimpleXPathService",
        "WFSService",
        "WMSService",
        "defaultFilterCtrl",
        "googleMapCtrl",
        "infoPanelCtrl",
        "layerPanelCtrl",
        "loadFilterCtrl"
    ],
    "modules": [
        "controllers",
        "http",
        "layer",
        "map",
        "utility"
    ],
    "allModules": [
        {
            "displayName": "controllers",
            "name": "controllers",
            "description": "defaultFilterCtrl class used to add layers to the main map"
        },
        {
            "displayName": "http",
            "name": "http",
            "description": "Service class related to handling all things related to making http cswrecords"
        },
        {
            "displayName": "layer",
            "name": "layer",
            "description": "LayerManagerService handles layer manipulation and extraction of information from the layer/csw records"
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