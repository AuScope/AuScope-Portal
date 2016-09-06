YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "GMLParserService",
        "GetCSWRecordService",
        "GetWFSRelatedService",
        "GetWMSRelatedService",
        "GoogleMapService",
        "LayerManagerService",
        "RenderHandlerService",
        "SimpleXPathService",
        "WFSService",
        "WMSService"
    ],
    "modules": [
        "http",
        "layer",
        "map",
        "utility"
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