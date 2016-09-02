YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "GetCSWRecordService",
        "GetWFSRelatedService",
        "GetWMSRelatedService",
        "GoogleMapService",
        "LayerManagerService",
        "RenderHandlerService",
        "WFSService",
        "WMSService"
    ],
    "modules": [
        "http",
        "layer",
        "map"
    ],
    "allModules": [
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