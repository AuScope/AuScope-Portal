YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CollapseDemoCtrl",
        "GetCSWRecordService",
        "GetWFSRelatedService",
        "GetWMSRelatedService",
        "GoogleMapService",
        "LayerManagerService",
        "RenderHandlerService",
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
        "map"
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
        }
    ],
    "elements": []
} };
});