webpackJsonp([1],{

/***/ "../../../../../src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../../../../../src async recursive";

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__appconfig_app_config__ = __webpack_require__("../../../../../src/app/appconfig/app.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__openlayermap_olmap_component__ = __webpack_require__("../../../../../src/app/openlayermap/olmap.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__layerpanel_layerpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/layerpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__layerpanel_filterpanel_filterpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/filterpanel/filterpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_portal_core_module__ = __webpack_require__("../../../../../src/app/portal-core-ui/portal-core.module.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



// Configs

// Components




var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__openlayermap_olmap_component__["a" /* OlMapComponent */],
            __WEBPACK_IMPORTED_MODULE_5__layerpanel_layerpanel_component__["a" /* LayerPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_6__layerpanel_filterpanel_filterpanel_component__["a" /* FilterPanelComponent */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClientModule */],
            __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_portal_core_module__["a" /* PortalCoreModule */],
            __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_portal_core_module__["a" /* PortalCoreModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__appconfig_app_config__["a" /* AuscopeConfiguration */]),
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__openlayermap_olmap_component__["a" /* OlMapComponent */], __WEBPACK_IMPORTED_MODULE_5__layerpanel_layerpanel_component__["a" /* LayerPanelComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/appconfig/app.config.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuscopeConfiguration; });
var AuscopeConfiguration = {
    getCSWRecordUrl: '../getKnownLayers.do'
};
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/filterpanel/filterpanel.component.html":
/***/ (function(module, exports) {

module.exports = "<form>\r\n\t<div class=\"form-group\">\r\n\t\t<label class=\"control-label\">Default <span class=\"text-danger\">*</span></label>\r\n\t\t<select class=\"selectpicker form-control\">\r\n\t\t\t<option>Mustard</option>\r\n\t\t\t<option>Ketchup</option>\r\n\t\t\t<option>Relish</option>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label class=\"control-label\">Multiple SelectBox <span class=\"text-danger\">*</span></label>\r\n\t\t<select class=\"selectpicker form-control\" multiple data-max-options=\"3\">\r\n\t\t\t<optgroup label=\"Picnic\">\r\n\t\t\t\t<option>Mustard</option>\r\n\t\t\t\t<option>Ketchup</option>\r\n\t\t\t\t<option>Relish</option>\r\n\t\t\t</optgroup>\r\n\t\t\t<optgroup label=\"Camping\">\r\n\t\t\t\t<option>Tent</option>\r\n\t\t\t\t<option>Flashlight</option>\r\n\t\t\t\t<option>Toilet Paper</option>\r\n\t\t\t</optgroup>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<label class=\"control-label\">Live Search <span class=\"text-danger\">*</span></label>\r\n\t\t<select class=\"selectpicker form-control\" data-live-search=\"true\">\r\n\t\t\t<option>Mustard</option>\r\n\t\t\t<option>Ketchup</option>\r\n\t\t\t<option>Relish</option>\r\n\t\t\t<option>Tent</option>\r\n\t\t\t<option>Flashlight</option>\r\n\t\t\t<option>Toilet Paper</option>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"form-group m-b-10\">\r\n\t\t<label class=\"control-label\">With Button Class <span class=\"text-danger\">*</span></label>\r\n\t\t<select class=\"selectpicker form-control\" data-style=\"btn-purple\">\r\n\t\t\t<option>Mustard</option>\r\n\t\t\t<option>Ketchup</option>\r\n\t\t\t<option>Relish</option>\r\n\t\t\t<option>Tent</option>\r\n\t\t\t<option>Flashlight</option>\r\n\t\t\t<option>Toilet Paper</option>\r\n\t\t</select>\r\n\t</div>\r\n\t<div class=\"form-group\">\r\n\t\t<button type=\"button\" class=\"btn btn-primary\" (click)='addLayer(layer)'>Add Layer</button>\r\n\t</div>\r\n\t\r\n</form>"

/***/ }),

/***/ "../../../../../src/app/layerpanel/filterpanel/filterpanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_modal_data_layer_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/modal/data/layer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPanelComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FilterPanelComponent = (function () {
    function FilterPanelComponent(olMapService) {
        this.olMapService = olMapService;
    }
    FilterPanelComponent.prototype.addLayer = function (layer) {
        this.olMapService.addLayer(layer);
    };
    return FilterPanelComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_modal_data_layer_model__["a" /* LayerModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_modal_data_layer_model__["a" /* LayerModel */]) === "function" && _a || Object)
], FilterPanelComponent.prototype, "layer", void 0);
FilterPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_0" /* Component */])({
        selector: 'app-filter-panel',
        template: __webpack_require__("../../../../../src/app/layerpanel/filterpanel/filterpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _b || Object])
], FilterPanelComponent);

var _a, _b;
//# sourceMappingURL=filterpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/layerpanel.component.html":
/***/ (function(module, exports) {

module.exports = "\t\r\n\t<li class=\"has-sub\" *ngFor=\"let layerGroup of layerGroups | getKey\">\r\n   \t\t<a href=\"javascript:;\">\r\n            <b class=\"caret caret-right pull-right\"></b>\r\n              {{layerGroup.key}}\r\n        </a>\r\n\t\t<ul class=\"sub-menu\">\t\t\t\t\t\t\t\t\t\r\n\t\t\t<li *ngFor=\"let layer of layerGroup.value\" [ngClass]=\"{'active': layer.expanded}\"><a (click)=\"layer.expanded = !layer.expanded\">{{layer.name}} <span *ngIf=\"layer.expanded\" class=\"fa fa-arrow-circle-down\"></span></a>\r\n\t\t\t\t<div [hidden]=\"!layer.expanded\" class=\"sidebar-panel-menu-show\">\r\n\t\t\t\t\t\r\n\t\t\t\t\t <div class=\"panel panel-inverse panel-info panel-with-tabs layer-panel animated  slideInRight\">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t<div class=\"panel-heading\">\r\n\t\t\t\t\t\t\t<ul id=\"panel-tab\" class=\"nav nav-tabs pull-right\">\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'filterpanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.filterpanel.expanded}\"><a data-toggle=\"tab\"><i class=\"fa fa-filter\"></i> <span class=\"hidden-xs\">Filter</span></a></li>\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'infopanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.infopanel.expanded}\"><a data-toggle=\"tab\"><i class=\"fa fa-info-circle\"></i> <span class=\"hidden-xs\">Info</span></a></li>\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'downloadpanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.downloadpanel.expanded}\" class=\"desktop-only\"><a data-toggle=\"tab\"><i class=\"fa fa-download\"></i> <span class=\"hidden-xs\">Download</span></a></li>\r\n\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t<div id=\"panel-tab-content\" class=\"tab-content\">\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'active in':uiLayerModels[layer.id].tabpanel.filterpanel.expanded}\">\r\n\t\t\t\t\t\t\t\t<app-filter-panel [layer]=layer></app-filter-panel>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'active in': uiLayerModels[layer.id].tabpanel.infopanel.expanded}\">\r\n\t\t\t\t\t\t\t\t<div><img src=\"template/img/demo/minimap.png\" style=\"width: 98%;\"></div>\r\n\t\t\t\t\t\t\t\t<h4><span class=\"text-primary\">Abstract</span></h4>\r\n\t\t\t\t\t\t\t\t<p>ASTER Map AlOH group composition</p>\r\n\t\t\t\t\t\t\t\t<h4><span class=\"text-primary\">Summary</span></h4>\r\n\t\t\t\t\t\t\t\t<p>1. Band ratio: B5/B7Blue is well ordered kaolinite, Al-rich muscovite/illite, paragonite, pyrophyllite Red is Al-poor (Si-rich) muscovite (phengite)/p>\r\n\t\t\t\t\t\t\t\t<h4><span class=\"text-primary\">Details</span></h4>\r\n\t\t\t\t\t\t\t\t<div class=\"panel panel-inverse\">\r\n\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t<div class=\"panel-body\" style=\"padding-left: 0px;padding-right: 0px;\">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"panel-group\" id=\"accordion\">\r\n\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel panel-inverse panel-bordered\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-heading\" id=\"headingOne\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\"panel-title\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#collapseOne\" class=\"accordion-link\" data-toggle=\"collapse\" data-parent=\"#accordion\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tERML- GSWA\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</h4>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div id=\"collapseOne\" class=\"panel-collapse collapse in\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-body\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p><b>Contact org:</b>Geological Survey of New South Whales</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p><b>Description:</b>The locations of Mines and Mining Activities of NSW provided by Geological Survey of NSW from the MINEDEX database. Data presented using the EarthResourceML (version 2.0) data model.</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p><b>Name:</b>Geological Survey of EarthResourceML (2.0) Mining Feature Occurrences</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p><b>Info Url:</b>Link to catalogue</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>WMS Endpoint</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>WFS Endpoint</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p><img src=\"template/img/demo/wmspreview.png\" style=\"width: 96%;\"/></p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel panel-inverse panel-bordered\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-heading\" id=\"headingTwo\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\"panel-title\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#collapseTwo\" class=\"accordion-link collapsed\" data-toggle=\"collapse\" data-parent=\"#accordion\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tERML- NSW\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</h4>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div id=\"collapseTwo\" class=\"panel-collapse collapse\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"list-group\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"list-group-item\">Bootply</li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"list-group-item\">One itmus ac facilin</li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"list-group-item\">Second eros</li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-footer\">Footer</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel panel-inverse panel-bordered\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-heading\" id=\"headingThree\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\"panel-title\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#collapseThree\" class=\"accordion-link collapsed\" data-toggle=\"collapse\" data-parent=\"#accordion\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tERML- Victoria\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</h4>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div id=\"collapseThree\" class=\"panel-collapse collapse\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"panel-body\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tVictor rocks\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'active in': uiLayerModels[layer.id].tabpanel.downloadpanel.expanded}\">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t<form>\r\n\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t\t\t\t\t\t<label class=\"control-label\">Download form <span class=\"text-danger\">*</span></label>\r\n\t\t\t\t\t\t\t\t\t\t<select class=\"selectpicker form-control\">\r\n\t\t\t\t\t\t\t\t\t\t\t<option>download 1</option>\r\n\t\t\t\t\t\t\t\t\t\t\t<option>download 2</option>\r\n\t\t\t\t\t\t\t\t\t\t\t<option>download 3</option>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</form>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</li>\t\t\t\t\t\t\t\t\t\r\n\t\t</ul>\r\n\t</li>\r\n\t\r\n\t\r\n\t\r\n\t\r\n"

/***/ }),

/***/ "../../../../../src/app/layerpanel/layerpanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__("../../../../jquery/dist/jquery.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__template_js_apps_js__ = __webpack_require__("../../../../../src/template/js/apps.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__template_js_apps_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__template_js_apps_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_ui_uilayer_model__ = __webpack_require__("../../../../../src/app/layerpanel/model/ui/uilayer.model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayerPanelComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LayerPanelComponent = (function () {
    function LayerPanelComponent(layerHandlerService) {
        this.layerHandlerService = layerHandlerService;
        this.uiLayerModels = {};
    }
    LayerPanelComponent.prototype.selectTabPanel = function (layerId, panelType) {
        this.uiLayerModels[layerId].tabpanel.setPanelOpen(panelType);
    };
    LayerPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.layerHandlerService.getLayerRecord().subscribe(function (response) {
            _this.layerGroups = response;
            for (var key in _this.layerGroups) {
                for (var i = 0; i < _this.layerGroups[key].length; i++) {
                    var uiLayerModel = new __WEBPACK_IMPORTED_MODULE_4__model_ui_uilayer_model__["a" /* UILayerModel */](_this.layerGroups[key][i].id);
                    _this.uiLayerModels[_this.layerGroups[key][i].id] = uiLayerModel;
                }
            }
            __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
                App.init();
            });
        });
    };
    return LayerPanelComponent;
}());
LayerPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: '[appLayerPanel]',
        template: __webpack_require__("../../../../../src/app/layerpanel/layerpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object])
], LayerPanelComponent);

var _a;
//# sourceMappingURL=layerpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/model/ui/uilayer.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uitabpanel_model__ = __webpack_require__("../../../../../src/app/layerpanel/model/ui/uitabpanel.model.ts");
/* unused harmony export LoadingStatus */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UILayerModel; });

var LoadingStatus;
(function (LoadingStatus) {
    LoadingStatus[LoadingStatus["loading"] = 0] = "loading";
    LoadingStatus[LoadingStatus["complete"] = 1] = "complete";
    LoadingStatus[LoadingStatus["error"] = 2] = "error";
    LoadingStatus[LoadingStatus["none"] = 3] = "none";
})(LoadingStatus || (LoadingStatus = {}));
var UILayerModel = (function () {
    function UILayerModel(id) {
        this.id = id;
        this.tabpanel = new __WEBPACK_IMPORTED_MODULE_0__uitabpanel_model__["a" /* UITabPanel */]();
        this.expanded = false;
        this.loadingStatus = LoadingStatus.none;
    }
    return UILayerModel;
}());

//# sourceMappingURL=uilayer.model.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/model/ui/uitabpanel.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UITabPanel; });
var UITabPanel = (function () {
    function UITabPanel() {
        this.filterpanel = {
            expanded: true
        };
        this.infopanel = {
            expanded: false
        };
        this.downloadpanel = {
            expanded: false
        };
    }
    UITabPanel.prototype.setPanelOpen = function (panelType) {
        if (panelType === 'filterpanel') {
            this.filterpanel.expanded = true;
            this.infopanel.expanded = false;
            this.downloadpanel.expanded = false;
        }
        else if (panelType === 'infopanel') {
            this.filterpanel.expanded = false;
            this.infopanel.expanded = true;
            this.downloadpanel.expanded = false;
        }
        else if (panelType === 'downloadpanel') {
            this.filterpanel.expanded = false;
            this.infopanel.expanded = false;
            this.downloadpanel.expanded = true;
        }
    };
    return UITabPanel;
}());

//# sourceMappingURL=uitabpanel.model.js.map

/***/ }),

/***/ "../../../../../src/app/openlayermap/olmap.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlMapComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OlMapComponent = (function () {
    function OlMapComponent(olMapObject) {
        this.olMapObject = olMapObject;
    }
    // After view init the map target can be set!
    OlMapComponent.prototype.ngAfterViewInit = function () {
        this.olMapObject.getMap().setTarget(this.mapElement.nativeElement.id);
    };
    return OlMapComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_1" /* ViewChild */])('mapElement'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_core__["p" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_core__["p" /* ElementRef */]) === "function" && _a || Object)
], OlMapComponent.prototype, "mapElement", void 0);
OlMapComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_0" /* Component */])({
        selector: 'app-ol-map',
        template: "\n    <div #mapElement id=\"map\" class=\"height-full width-full\"> </div>\n    "
        // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _b || Object])
], OlMapComponent);

var _a, _b;
//# sourceMappingURL=olmap.component.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/appconfig/app.config.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_CONFIG; });

var APP_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* InjectionToken */]('app.config');
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/modal/data/layer.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayerModel; });
var LayerModel = (function () {
    function LayerModel() {
    }
    return LayerModel;
}());

//# sourceMappingURL=layer.model.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/portal-core.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__appconfig_app_config__ = __webpack_require__("../../../../../src/app/portal-core-ui/appconfig/app.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__uiutilities_pipes__ = __webpack_require__("../../../../../src/app/portal-core-ui/uiutilities/pipes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_wms_ol_wms_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_wfs_ol_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utility_gmlparser_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/gmlparser.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PortalCoreModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


// Configs

// Utilities

// Services






var PortalCoreModule = PortalCoreModule_1 = (function () {
    function PortalCoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    PortalCoreModule.forRoot = function (config) {
        return {
            ngModule: PortalCoreModule_1,
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_2__appconfig_app_config__["a" /* APP_CONFIG */], useValue: config }
            ]
        };
    };
    return PortalCoreModule;
}());
PortalCoreModule = PortalCoreModule_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__uiutilities_pipes__["a" /* KeysPipe */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClientModule */]
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__uiutilities_pipes__["a" /* KeysPipe */]],
        providers: [__WEBPACK_IMPORTED_MODULE_4__service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */],
            __WEBPACK_IMPORTED_MODULE_6__service_openlayermap_ol_map_service__["a" /* OlMapService */],
            __WEBPACK_IMPORTED_MODULE_7__service_wms_ol_wms_service__["a" /* OlWMSService */],
            __WEBPACK_IMPORTED_MODULE_5__service_openlayermap_ol_map_object__["a" /* OlMapObject */],
            __WEBPACK_IMPORTED_MODULE_8__service_wfs_ol_wfs_service__["a" /* OlWFSService */],
            __WEBPACK_IMPORTED_MODULE_9__utility_gmlparser_service__["a" /* GMLParserService */]
        ]
    }),
    __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Optional */])()), __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* SkipSelf */])()),
    __metadata("design:paramtypes", [PortalCoreModule])
], PortalCoreModule);

var PortalCoreModule_1;
//# sourceMappingURL=portal-core.module.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__ = __webpack_require__("../../../../../src/app/portal-core-ui/appconfig/app.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayerHandlerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var LayerHandlerService = (function () {
    function LayerHandlerService(http, config) {
        this.http = http;
        this.config = config;
        this.layerRecord = [];
    }
    LayerHandlerService.prototype.getLayerRecord = function () {
        var me = this;
        if (this.layerRecord.length > 0) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(this.layerRecord);
        }
        else {
            return this.http.get(this.config.getCSWRecordUrl)
                .map(function (response) {
                var cswRecord = response['data'];
                cswRecord.forEach(function (item, i, ar) {
                    if (me.layerRecord[item.group] === undefined) {
                        me.layerRecord[item.group] = [];
                    }
                    // VT: attempted to cast the object into a typescript class however it doesn't seem like its possible
                    // all examples points to casting from json to interface but not object to interface.
                    item.expanded = false;
                    me.layerRecord[item.group].push(item);
                });
                return me.layerRecord;
            });
        }
    };
    LayerHandlerService.prototype.containsWMS = function (layer) {
        var cswRecords = layer.cswRecords;
        for (var _i = 0, cswRecords_1 = cswRecords; _i < cswRecords_1.length; _i++) {
            var cswRecord = cswRecords_1[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (onlineResource.type === 'WMS') {
                    return true;
                }
            }
        }
        return false;
    };
    LayerHandlerService.prototype.getWMSResource = function (layer) {
        var cswRecords = layer.cswRecords;
        var wmsOnlineResource = [];
        for (var _i = 0, cswRecords_2 = cswRecords; _i < cswRecords_2.length; _i++) {
            var cswRecord = cswRecords_2[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (onlineResource.type === 'WMS') {
                    wmsOnlineResource.push(onlineResource);
                }
            }
        }
        return wmsOnlineResource;
    };
    LayerHandlerService.prototype.containsWFS = function (layer) {
        var cswRecords = layer.cswRecords;
        for (var _i = 0, cswRecords_3 = cswRecords; _i < cswRecords_3.length; _i++) {
            var cswRecord = cswRecords_3[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (onlineResource.type === 'WFS') {
                    return true;
                }
            }
        }
        return false;
    };
    LayerHandlerService.prototype.getWFSResource = function (layer) {
        var cswRecords = layer.cswRecords;
        var wfsOnlineResource = [];
        for (var _i = 0, cswRecords_4 = cswRecords; _i < cswRecords_4.length; _i++) {
            var cswRecord = cswRecords_4[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (onlineResource.type === 'WFS') {
                    wfsOnlineResource.push(onlineResource);
                }
            }
        }
        return wfsOnlineResource;
    };
    return LayerHandlerService;
}());
LayerHandlerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["e" /* Injectable */])(),
    __param(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["a" /* APP_CONFIG */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpClient */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["AppConfig"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["AppConfig"]) === "function" && _b || Object])
], LayerHandlerService);

var _a, _b;
//# sourceMappingURL=layer-handler.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers__ = __webpack_require__("../../../../openlayers/dist/ol.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_openlayers__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlMapObject; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OlMapObject = (function () {
    function OlMapObject() {
        var osm_layer = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].OSM()
        });
        this.activeLayer = {};
        this.map = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["Map"]({
            layers: [osm_layer],
            view: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["View"]({
                center: [14793316.706200, -2974317.644633],
                zoom: 4
            })
        });
    }
    OlMapObject.prototype.getMap = function () {
        return this.map;
    };
    OlMapObject.prototype.addLayerByName = function (layer, name) {
        this.activeLayer[name] = layer;
        this.map.addLayer(layer);
    };
    OlMapObject.prototype.getLayerByName = function (name) {
        return this.activeLayer[name];
    };
    return OlMapObject;
}());
OlMapObject = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], OlMapObject);

//# sourceMappingURL=ol-map-object.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wms_ol_wms_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlMapService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OlMapService = (function () {
    function OlMapService(layerHandlerService, olWMSService, olWFSService) {
        this.layerHandlerService = layerHandlerService;
        this.olWMSService = olWMSService;
        this.olWFSService = olWFSService;
    }
    OlMapService.prototype.addLayer = function (layer) {
        if (this.layerHandlerService.containsWMS(layer)) {
            this.olWMSService.addLayer(layer);
        }
        else if (this.layerHandlerService.containsWFS(layer)) {
            this.olWFSService.addLayer(layer);
        }
    };
    return OlMapService;
}());
OlMapService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__wms_ol_wms_service__["a" /* OlWMSService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__wms_ol_wms_service__["a" /* OlWMSService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__["a" /* OlWFSService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__["a" /* OlWFSService */]) === "function" && _c || Object])
], OlMapService);

var _a, _b, _c;
//# sourceMappingURL=ol-map.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_openlayers__ = __webpack_require__("../../../../openlayers/dist/ol.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_openlayers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utility_gmlparser_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/gmlparser.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlWFSService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var OlWFSService = (function () {
    function OlWFSService(layerHandlerService, olMapObject, http, gmlParserService) {
        this.layerHandlerService = layerHandlerService;
        this.olMapObject = olMapObject;
        this.http = http;
        this.gmlParserService = gmlParserService;
        this.map = this.olMapObject.getMap();
    }
    OlWFSService.prototype.getFeature = function (layer, onlineResource) {
        var httpParams = new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpParams */]().set('serviceUrl', onlineResource.url);
        httpParams.append('typeName', onlineResource.name);
        if (layer.proxyUrl) {
            return this.http.get(layer.proxyUrl, {
                params: httpParams
            }).map(function (response) {
                return response['data'];
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__["Observable"].create(function () {
                return undefined;
            });
        }
    };
    OlWFSService.prototype.addPoint = function (layer, primitive) {
        var geom = new __WEBPACK_IMPORTED_MODULE_4_openlayers__["geom"].Point(__WEBPACK_IMPORTED_MODULE_4_openlayers__["proj"].transform([primitive.coords.lng, primitive.coords.lat], 'EPSG:4326', 'EPSG:3857'));
        var feature = new __WEBPACK_IMPORTED_MODULE_4_openlayers__["Feature"](geom);
        feature.setStyle([
            new __WEBPACK_IMPORTED_MODULE_4_openlayers__["style"].Style({
                image: new __WEBPACK_IMPORTED_MODULE_4_openlayers__["style"].Icon(({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    // size: [32, 32],
                    scale: 0.5,
                    opacity: 1,
                    src: layer.iconUrl
                }))
            })
        ]);
        if (primitive.name) {
            feature.setId(primitive.name);
        }
        this.olMapObject.getLayerByName(layer.id).getSource().addFeature(feature);
    };
    OlWFSService.prototype.addLine = function (primitive) {
    };
    OlWFSService.prototype.addPoloygon = function (primitive) {
    };
    OlWFSService.prototype.addLayer = function (layer) {
        var _this = this;
        var wfsOnlineResources = this.layerHandlerService.getWFSResource(layer);
        // VT: create the vector on the map if it does not exist.
        if (!this.olMapObject.getLayerByName(layer.id)) {
            var markerLayer = new __WEBPACK_IMPORTED_MODULE_4_openlayers__["layer"].Vector({
                source: new __WEBPACK_IMPORTED_MODULE_4_openlayers__["source"].Vector({ features: [] })
            });
            this.olMapObject.addLayerByName(markerLayer, layer.id);
        }
        for (var _i = 0, wfsOnlineResources_1 = wfsOnlineResources; _i < wfsOnlineResources_1.length; _i++) {
            var onlineResource = wfsOnlineResources_1[_i];
            this.getFeature(layer, onlineResource).subscribe(function (response) {
                var rootNode = _this.gmlParserService.getRootNode(response.gml);
                var primitives = _this.gmlParserService.makePrimitives(rootNode);
                for (var _i = 0, primitives_1 = primitives; _i < primitives_1.length; _i++) {
                    var primitive = primitives_1[_i];
                    switch (primitive.geometryType) {
                        case __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].geometryType.POINT:
                            _this.addPoint(layer, primitive);
                            break;
                        case __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].geometryType.LINESTRING:
                            _this.addLine(primitive);
                            break;
                        case __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].geometryType.POLYGON:
                            _this.addPoloygon(primitive);
                            break;
                    }
                }
            });
        }
    };
    OlWFSService.prototype.addCSWRecord = function (cswRecord) {
    };
    return OlWFSService;
}());
OlWFSService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpClient */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_6__utility_gmlparser_service__["a" /* GMLParserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__utility_gmlparser_service__["a" /* GMLParserService */]) === "function" && _d || Object])
], OlWFSService);

var _a, _b, _c, _d;
//# sourceMappingURL=ol-wfs.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__ = __webpack_require__("../../../../../src/app/portal-core-ui/appconfig/app.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_openlayers__ = __webpack_require__("../../../../openlayers/dist/ol.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_openlayers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlWMSService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








var OlWMSService = (function () {
    function OlWMSService(config, layerHandlerService, olMapObject, http) {
        this.config = config;
        this.layerHandlerService = layerHandlerService;
        this.olMapObject = olMapObject;
        this.http = http;
        this.map = this.olMapObject.getMap();
    }
    OlWMSService.prototype.getWMS1_3_0param = function (layers, sld_body) {
        var params = {
            'LAYERS': layers,
            'TILED': true,
            'DISPLAYOUTSIDEMAXEXTENT': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'VERSION': '1.3.0',
            'WIDTH': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE,
            'HEIGHT': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE
        };
        if (sld_body) {
            params['sld_body'] = sld_body;
        }
        return params;
    };
    OlWMSService.prototype.getWMS1_1param = function (layers, sld_body) {
        var params = {
            'LAYERS': layers,
            'TILED': true,
            'DISPLAYOUTSIDEMAXEXTENT': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'VERSION': '1.1.1',
            'WIDTH': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE,
            'HEIGHT': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE
        };
        if (sld_body) {
            params['sld_body'] = sld_body;
        }
        return params;
    };
    OlWMSService.prototype.getSldBody = function (sldUrl) {
        if (!sldUrl) {
            return __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__["Observable"].create(function (observer) {
                observer.next(null);
                observer.complete();
            });
        }
        return this.http.get(sldUrl, { responseType: 'text' }).map(function (response) {
            return response;
        });
    };
    OlWMSService.prototype.addLayer = function (layer) {
        var _this = this;
        var wmsOnlineResources = this.layerHandlerService.getWMSResource(layer);
        this.getSldBody(layer.proxyStyleUrl).subscribe(function (response) {
            for (var _i = 0, wmsOnlineResources_1 = wmsOnlineResources; _i < wmsOnlineResources_1.length; _i++) {
                var wmsOnlineResource = wmsOnlineResources_1[_i];
                var params = wmsOnlineResource.version.startsWith('1.3') ?
                    _this.getWMS1_3_0param(wmsOnlineResource.name, response) :
                    _this.getWMS1_1param(wmsOnlineResource.name, response);
                var wmsTile = new __WEBPACK_IMPORTED_MODULE_5_openlayers__["layer"].Tile({
                    extent: _this.map.getView().calculateExtent(_this.map.getSize()),
                    source: new __WEBPACK_IMPORTED_MODULE_5_openlayers__["source"].TileWMS({
                        url: wmsOnlineResource.url,
                        params: params,
                        serverType: 'geoserver',
                        projection: 'EPSG:4326'
                    })
                });
                _this.olMapObject.addLayerByName(wmsTile, layer.id);
            }
        });
    };
    OlWMSService.prototype.addCSWRecord = function (cswRecord) {
    };
    return OlWMSService;
}());
OlWMSService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["e" /* Injectable */])(),
    __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["a" /* APP_CONFIG */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["AppConfig"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__appconfig_app_config__["AppConfig"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpClient */]) === "function" && _d || Object])
], OlWMSService);

var _a, _b, _c, _d;
//# sourceMappingURL=ol-wms.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/uiutilities/pipes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeysPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var KeysPipe = (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        var keys = [];
        for (var key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    return KeysPipe;
}());
KeysPipe = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Pipe */])({ name: 'getKey' })
], KeysPipe);

//# sourceMappingURL=pipes.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/utility/constants.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
Constants.resourceType = {
    WMS: 'WMS',
    WFS: 'WFS',
    WCS: 'WCS',
    WWW: 'WWW',
    OPeNDAP: 'OPeNDAP',
    FTP: 'FTP',
    SOS: 'SOS',
    IRIS: 'IRIS',
    CSWService: 'CSWService',
    NCSS: 'NCSS',
    UNSUPPORTED: 'Unsupported',
    OTHERS: 'OTHERS'
};
Constants.WMSVersion = {
    '1.1.1': '1.1.1',
    '1.1.0': '1.1.0',
    '1.3.0': '1.3.0'
};
Constants.geometryType = {
    'POINT': 'POINT',
    'LINESTRING': 'LINESTRING',
    'POLYGON': 'POLYGON'
};
Constants.statusProgress = {
    'RUNNING': 'RUNNING',
    'COMPLETED': 'COMPLETED',
    'SKIPPED': 'SKIPPED',
    'ERROR': 'ERROR'
};
Constants.analyticLoader = {
    'capdf-hydrogeochem': 'views/analytic/capdf-hydrogeochem.htm',
    'pressuredb-borehole': 'views/analytic/pressureDb.htm'
};
Constants.rendererLoader = {
    'nvcl-borehole': 'WFSService',
    'gsml-borehole': 'WFSService',
    'mineral-tenements': 'WMSService'
};
Constants.XPATH_STRING_TYPE = (window.XPathResult ? XPathResult.STRING_TYPE : 0);
Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE = (window.XPathResult ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE : 1);
Constants.smallScreenTest = '(max-width: 658px)';
Constants.TILE_SIZE = 256;
Constants = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])()
], Constants);

//# sourceMappingURL=constants.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/utility/gmlparser.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__simplexml_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/simplexml.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/utilities.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GMLParserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// import { UtilitiesService } from '';
var GMLParserService = (function () {
    function GMLParserService() {
    }
    /**
     * Get rootnode from a gml string
     *
     * @method getRootNode
     * @param gml - GML String
     * @return dom - the root node
     */
    GMLParserService.prototype.getRootNode = function (gml) {
        return __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].parseStringToDOM(gml);
    };
    /**
     * create a point object
     *
     * @method createPoint
     * @param lat - latitude
     * @param lon - longtitude
     * @return point - point object
     */
    GMLParserService.prototype.createPoint = function (lat, lon) {
        return {
            lat: lat,
            lng: lon
        };
    };
    // Given a series of space seperated tuples, return a list of object
    /**
     * Create line string objects in a array
     * @method generateCoordList
     * @param coordsAsString - The coordinates in a string from the feature gml
     * @param srsName - the srs of the feature
     * @return array - an array of points
     */
    GMLParserService.prototype.generateCoordList = function (coordsAsString, srsName) {
        var coordinateList = coordsAsString.split(' ');
        var parsedCoordList = [];
        for (var i = 0; i < coordinateList.length; i += 2) {
            this.forceLonLat(coordinateList, srsName, i);
            parsedCoordList.push(this.createPoint(parseFloat(coordinateList[i + 1]), parseFloat(coordinateList[i])));
        }
        return parsedCoordList;
    };
    /**
     * Get the srs name
     *
     * @method getSrsName
     * @param node - coordinate node
     * @return string - srs name
     */
    GMLParserService.prototype.getSrsName = function (node) {
        var srsName = node.getAttribute('srsName');
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(srsName)) {
            srsName = node.getAttribute('srs');
        }
        if (!srsName) {
            return '';
        }
        return srsName;
    };
    /**
     * Forces lon/lat coords into coords (an array). Swaps coords[offset] and coords[offset + 1] if srsName requires it
     * @method forceLonLat
     * @param coords - the coordinates
     * @param srsName - the srs
     * @param offset - offset the coord if required.
     *
     */
    GMLParserService.prototype.forceLonLat = function (coords, srsName, offset) {
        if (srsName.indexOf('http://www.opengis.net/gml/srs/epsg.xml#4283') === 0 ||
            srsName.indexOf('urn:x-ogc:def:crs:EPSG') === 0) {
            // lat/lon
            var tmp = coords[offset];
            coords[offset] = coords[offset + 1];
            coords[offset + 1] = tmp;
        }
        else if (srsName.indexOf('EPSG') === 0 ||
            srsName.indexOf('http://www.opengis.net/gml/srs/epsg.xml') === 0) {
            // lon/lat (no action required)
        }
        else {
            // fallback to lon/lat
        }
    };
    /**
     * Create line string objects in a array
     * @method parseLineString
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param lineStringNode - the coordinate node containing the linestring
     * @return array - an array of points
     */
    GMLParserService.prototype.parseLineString = function (name, description, lineStringNode, featureNode) {
        var srsName = this.getSrsName(lineStringNode);
        var parsedCoordList = this.generateCoordList(__WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getNodeTextContent(lineStringNode.getElementsByTagNameNS('*', 'posList')[0]), srsName);
        if (parsedCoordList.length === 0) {
            return null;
        }
        // I've seen a few lines come in with start/end points being EXACTLY the same with no other points. These can be ignored
        if (parsedCoordList.length === 2) {
            if (parsedCoordList[0].longitude === parsedCoordList[1].longitude &&
                parsedCoordList[0].latitude === parsedCoordList[1].latitude) {
                return null;
            }
        }
        return {
            name: name,
            description: description,
            srsName: srsName,
            coords: parsedCoordList,
            geometryType: __WEBPACK_IMPORTED_MODULE_2__constants_service__["a" /* Constants */].geometryType.LINESTRING,
            featureNode: featureNode
        };
    };
    /**
     * Given a root placemark node attempt to parse it as a single point and return it. Returns a single portal.map.primitives.Polygon
     * @method parsePolygon
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param polygonNode - the coordinate node containing the polygonNode
     * @return array - an array of points
     */
    GMLParserService.prototype.parsePolygon = function (name, description, polygonNode, featureNode) {
        var srsName = this.getSrsName(polygonNode);
        var parsedCoordList = this.generateCoordList(__WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getNodeTextContent(polygonNode.getElementsByTagNameNS('*', 'posList')[0]), srsName);
        if (parsedCoordList.length === 0) {
            return null;
        }
        // I've seen a few lines come in with start/end points being EXACTLY the same with no other points. These can be ignored
        if (parsedCoordList.length === 2) {
            if (parsedCoordList[0].longitude === parsedCoordList[1].longitude &&
                parsedCoordList[0].latitude === parsedCoordList[1].latitude) {
                return null;
            }
        }
        return {
            name: name,
            description: description,
            srsName: srsName,
            coords: parsedCoordList,
            geometryType: __WEBPACK_IMPORTED_MODULE_2__constants_service__["a" /* Constants */].geometryType.POLYGON,
            featureNode: featureNode
        };
    };
    /**
     * Given a root placemark node attempt to parse it as a single point and return it.Returns a single portal.map.primitives.Marker
     * @method parsePoint
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param pointNode - the coordinate node containing the pointNode
     * @param featureNode - the featureNode of the feature we are parsing
     * @return point - a point
     */
    GMLParserService.prototype.parsePoint = function (name, description, pointNode, featureNode) {
        var rawPoints = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getNodeTextContent(pointNode.getElementsByTagNameNS('*', 'pos')[0]);
        var coordinates = rawPoints.split(' ');
        if (!coordinates || coordinates.length < 2) {
            return null;
        }
        // Workout whether we are lat/lon or lon/lat
        var srsName = this.getSrsName(pointNode);
        this.forceLonLat(coordinates, srsName, 0);
        var lon = coordinates[0];
        var lat = coordinates[1];
        var point = this.createPoint(parseFloat(lat), parseFloat(lon));
        return {
            name: name,
            description: description,
            srsName: srsName,
            coords: point,
            geometryType: __WEBPACK_IMPORTED_MODULE_2__constants_service__["a" /* Constants */].geometryType.POINT,
            featureNode: featureNode
        };
    };
    /**
     * Returns the feature count as reported by the WFS response. Returns null if the count cannot be parsed.
     * @method getFeatureCount
     * @param rootNode - rootNode
     * @return Number - the feature count
     */
    GMLParserService.prototype.getFeatureCount = function (rootNode) {
        var wfsFeatureCollection = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getMatchingChildNodes(rootNode, null, 'FeatureCollection');
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(wfsFeatureCollection)) {
            return null;
        }
        var count = parseInt(wfsFeatureCollection[0].getAttribute('numberOfFeatures'), 10);
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isNumber(count)) {
            return count;
        }
        return null;
    };
    /**
     * Top level function  that organize how the gml should be parsed
     * @method makePrimitives
     * @param rootNode - the root node of the gml
     * @return Array - can be anything from a single point to a array for polygons and line string:{
            name : name,
            description: description,
            srsName:srsName,
            coords: point,
            geometryType : Constants.geometryType.POINT
        }
     */
    GMLParserService.prototype.makePrimitives = function (rootNode) {
        var primitives = [];
        var wfsFeatureCollection = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getMatchingChildNodes(rootNode, null, 'FeatureCollection');
        var features = null;
        // Read through our wfs:FeatureCollection and gml:featureMember(s) elements
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(wfsFeatureCollection)) {
            return primitives;
        }
        var featureMembers = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMembers');
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(featureMembers)) {
            featureMembers = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMember');
            features = featureMembers;
        }
        else {
            features = featureMembers[0].childNodes;
        }
        if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(featureMembers)) {
            return primitives;
        }
        for (var i = 0; i < features.length; i++) {
            // Pull out some general stuff that we expect all features to have
            var featureNode = features[i];
            var name = featureNode.getAttribute('gml:id');
            var description = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].evaluateXPath(rootNode, featureNode, 'gml:description', __WEBPACK_IMPORTED_MODULE_2__constants_service__["a" /* Constants */].XPATH_STRING_TYPE).stringValue;
            if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(description)) {
                description = __WEBPACK_IMPORTED_MODULE_1__simplexml_service__["a" /* SimpleXMLService */].evaluateXPath(rootNode, featureNode, 'gml:name', __WEBPACK_IMPORTED_MODULE_2__constants_service__["a" /* Constants */].XPATH_STRING_TYPE).stringValue;
                if (__WEBPACK_IMPORTED_MODULE_3__utilities_service__["a" /* UtilitiesService */].isEmpty(description)) {
                    description = name; // resort to gml ID if we have to
                }
            }
            // Look for geometry under this feature
            var pointNodes = featureNode.getElementsByTagNameNS('*', 'Point');
            var polygonNodes = featureNode.getElementsByTagNameNS('*', 'Polygon');
            var lineStringNodes = featureNode.getElementsByTagNameNS('*', 'LineString');
            var mapItem = void 0;
            // Parse the geometry we found into map primitives
            for (var geomIndex = 0; geomIndex < polygonNodes.length; geomIndex++) {
                mapItem = this.parsePolygon(name, description, polygonNodes[geomIndex], featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
            for (var geomIndex = 0; geomIndex < pointNodes.length; geomIndex++) {
                mapItem = this.parsePoint(name, description, pointNodes[geomIndex], featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
            for (var geomIndex = 0; geomIndex < lineStringNodes.length; geomIndex++) {
                mapItem = this.parseLineString(name, description, lineStringNodes[geomIndex], featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
        }
        return primitives;
    };
    return GMLParserService;
}());
GMLParserService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])()
], GMLParserService);

//# sourceMappingURL=gmlparser.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/utility/simplexml.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SimpleXMLService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var SimpleXMLService = (function () {
    function SimpleXMLService() {
    }
    // Public Static functions
    SimpleXMLService.evaluateXPathString = function (domNode, xPath) {
        var document = domNode.ownerDocument;
        var xpathResult = this.evaluateXPath(document, domNode, xPath, __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_STRING_TYPE);
        return xpathResult.stringValue;
    };
    /**
     * A wrapper around the DOM defined Document.evaluate function
     * Because not every browser supports document.evaluate we need to have a pure javascript
     * backup in place
     *
     * @method evaluateXPath
     * @param document - document
     * @param domNode - domNode
     * @param xPath - xPath
     * @param resultType - https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate#Result_types
     * @return dom - the dom result
     */
    SimpleXMLService.evaluateXPath = function (document, domNode, xPath, resultType) {
        if (document.evaluate) {
            var result = void 0;
            try {
                result = document.evaluate(xPath, domNode, document.createNSResolver(domNode), resultType, null);
                return result;
            }
            catch (e) {
                // console.error("SimpleXMLService.evaluateXPath() Exception", e);
                // Return empty result
                switch (resultType) {
                    case __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_STRING_TYPE:
                        return {
                            stringValue: ''
                        };
                    case __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_UNORDERED_NODE_ITERATOR_TYPE:
                        return {
                            _arr: [],
                            _i: 0,
                            iterateNext: function () {
                                return null;
                            }
                        };
                    default:
                        throw new Error('Unrecognised resultType');
                }
            }
            ;
        }
        else {
            // This gets us a list of dom nodes
            var matchingNodeArray = XPath.selectNodes(xPath, domNode);
            if (!matchingNodeArray) {
                matchingNodeArray = [];
            }
            // we need to turn that into an XPathResult object (or an emulation of one)
            switch (resultType) {
                case __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_STRING_TYPE:
                    var stringValue = null;
                    if (matchingNodeArray.length > 0) {
                        stringValue = this.getNodeTextContent(matchingNodeArray[0]);
                    }
                    return {
                        stringValue: stringValue
                    };
                case __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_UNORDERED_NODE_ITERATOR_TYPE:
                    return {
                        _arr: matchingNodeArray,
                        _i: 0,
                        iterateNext: function () {
                            if (this._i >= this._arr.length) {
                                return null;
                            }
                            else {
                                return this._arr[this._i++];
                            }
                        }
                    };
            }
            throw new Error('Unrecognised resultType');
        }
    };
    /**
     * Evaluates an XPath which will return an array of W3C DOM nodes
     *
     * @method evaluateXPathNodeArray
     * @param domNode - domNode
     * @param xPath - xPath
     * @return dom - the dom result
     */
    SimpleXMLService.evaluateXPathNodeArray = function (domNode, xPath) {
        var document = domNode.ownerDocument;
        var xpathResult = null;
        try {
            xpathResult = this.evaluateXPath(document, domNode, xPath, __WEBPACK_IMPORTED_MODULE_1__constants_service__["a" /* Constants */].XPATH_UNORDERED_NODE_ITERATOR_TYPE);
        }
        catch (err) {
            return [];
        }
        var matchingNodes = [];
        var matchingNode = xpathResult.iterateNext();
        while (matchingNode) {
            matchingNodes.push(matchingNode);
            matchingNode = xpathResult.iterateNext();
        }
        return matchingNodes;
    };
    /**
     * Utility for retrieving a W3C DOM Node 'localName' attribute across browsers.
     * The localName is the node name without any namespace prefixes
     * @method getNodeLocalName
     * @param domNode - domNode
     * @return String - local name of the node or empty string upon error
     */
    SimpleXMLService.getNodeLocalName = function (domNode) {
        if (domNode) {
            return domNode.localName ? domNode.localName : domNode.baseName;
        }
        return '';
    };
    /**
     * Returns the set of classes this node belongs to as an array of strings
     * @method getClassList
     * @param domNode - domNode
     * @return dom - the dom result
     */
    SimpleXMLService.getClassList = function (domNode) {
        if (domNode.classList) {
            return domNode.classList;
        }
        else if (domNode['class']) {
            return domNode['class'].split(' ');
        }
        else if (domNode.className) {
            return domNode.className.split(' ');
        }
        return [];
    };
    /**
     * Figure out if domNode is a leaf or not
     * (Leaves have no nodes from XML_NODE_ELEMENT)
     * @method isLeafNode
     * @param domNode - domNode
     * @return boolean - is leaf or not
     */
    SimpleXMLService.isLeafNode = function (domNode) {
        var isLeaf = true;
        if (domNode && domNode.childNodes) {
            for (var i = 0; i < domNode.childNodes.length && isLeaf; i++) {
                isLeaf = domNode.childNodes[i].nodeType !== this.XML_NODE.XML_NODE_ELEMENT;
            }
        }
        return isLeaf;
    };
    /**
     * Filters an array of DOM Nodes according to the specified parameters
     * @method filterNodeArray
     * @param nodeArray An Array of DOM Nodes
     * @param nodeType [Optional] An integer node type
     * @param namespaceUri [Optional] String to compare against node namespaceURI
     * @param nodeName [Optional] String to compare against the node localName
     * @return dom - return the result in a dom
     */
    SimpleXMLService.filterNodeArray = function (nodeArray, nodeType, namespaceUri, nodeName) {
        var matchingNodes = [];
        for (var i = 0; i < nodeArray.length; i++) {
            var node = nodeArray[i];
            if (nodeType && node.nodeType !== nodeType) {
                continue;
            }
            if (namespaceUri && namespaceUri !== node.namespaceURI) {
                continue;
            }
            if (nodeName && nodeName !== this.getNodeLocalName(node)) {
                continue;
            }
            matchingNodes.push(node);
        }
        return matchingNodes;
    };
    /**
     * Gets all children of domNode as an Array that match the specified filter parameters
     * @method getMatchingChildNodes
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     * @return dom - return the result in a dom
     */
    SimpleXMLService.getMatchingChildNodes = function (domNode, childNamespaceURI, childNodeName) {
        return this.filterNodeArray(domNode.childNodes, this.XML_NODE.XML_NODE_ELEMENT, childNamespaceURI, childNodeName);
    };
    /**
     * Gets all Attributes of domNode as an Array that match the specified filter parameters
     * @method getMatchingAttributes
     * @param childNamespaceURI [Optional] The URI to lookup as a String
     * @param childNodeName [Optional] The node name to lookup as a String
     * @return dom - return the result in a dom or null upon error
     */
    SimpleXMLService.getMatchingAttributes = function (domNode, attributeNamespaceURI, attributeName) {
        // VT: cannot find the _fitlerNodeArray, suspect bug
        // return this._filterNodeArray(domNode.attributes, XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
        if (domNode.attributes) {
            return this.filterNodeArray(domNode.attributes, this.XML_NODE.XML_NODE_ATTRIBUTE, attributeNamespaceURI, attributeName);
        }
        return null;
    };
    /**
     * Given a DOM node, return its text content (however the browser defines it)
     * @method getNodeTextContent
     * @param domNode - domNode
     * @return string - text content
     */
    SimpleXMLService.getNodeTextContent = function (domNode) {
        if (domNode) {
            return domNode.textContent ? domNode.textContent : domNode.text;
        }
        return '';
    };
    /**
     * Parse string to DOM
     * @method parseStringToDOM
     * @param xmlString - xml string
     * @return dom - return the result in a dom
     */
    SimpleXMLService.parseStringToDOM = function (xmlString) {
        var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
        // Load our xml string into DOM
        var xmlDocument = null;
        if (window.DOMParser) {
            // browser supports DOMParser
            var parser = new DOMParser();
            xmlDocument = parser.parseFromString(xmlString, 'text/xml');
        }
        else if (window.ActiveXObject) {
            // IE
            xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
            xmlDocument.async = 'false';
            xmlDocument.loadXML(xmlString);
        }
        else {
            return null;
        }
        return xmlDocument;
    };
    return SimpleXMLService;
}());
// Constants
SimpleXMLService.XML_NODE = {
    XML_NODE_ELEMENT: 1,
    XML_NODE_ATTRIBUTE: 2,
    XML_NODE_TEXT: 3
};
SimpleXMLService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])()
], SimpleXMLService);

//# sourceMappingURL=simplexml.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/utility/utilities.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilitiesService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var UtilitiesService = (function () {
    function UtilitiesService() {
    }
    /**
   * Test if the object is empty
   * @method isEmpty
   * @param obj - the object to test for emptiness
   * @return boolean - true if object is empty.
   */
    UtilitiesService.isEmpty = function (obj) {
        if (obj instanceof Array || (typeof obj === 'string')) {
            return obj.length === 0;
        }
        else if (typeof obj === 'object') {
            return jQuery.isEmptyObject(obj);
        }
        else {
            if (obj) {
                return false;
            }
            else {
                return true;
            }
        }
    };
    /**
     * Test if string s contains c
     * @method stringContains
     * @param s - the string to check
     * @param c - the string to match
     */
    UtilitiesService.stringContains = function (s, c) {
        return s.indexOf(c) !== -1;
    };
    /**
  * Returns the parameter in a get url request
  * @method getUrlParameters
  * @param url - the get url string to break
  * @param options - splitArgs - {Boolean} Split comma delimited params into arrays? Default is true
  */
    UtilitiesService.getUrlParameters = function (url, options) {
        var localStringContain = function (s, c) {
            return s.indexOf(c) !== -1;
        };
        options = options || {};
        // if no url specified, take it from the location bar
        url = (url === null || url === undefined) ? window.location.href : url;
        // parse out parameters portion of url string
        var paramsString = '';
        if (localStringContain(url, '?')) {
            var start = url.indexOf('?') + 1;
            var end = localStringContain(url, '#') ?
                url.indexOf('#') : url.length;
            paramsString = url.substring(start, end);
        }
        var parameters = {};
        var pairs = paramsString.split(/[&;]/);
        for (var i = 0, len = pairs.length; i < len; ++i) {
            var keyValue = pairs[i].split('=');
            if (keyValue[0]) {
                var key = keyValue[0];
                try {
                    key = decodeURIComponent(key);
                }
                catch (err) {
                    key = unescape(key);
                }
                // being liberal by replacing "+" with " "
                var value = (keyValue[1] || '').replace(/\+/g, ' ');
                try {
                    value = decodeURIComponent(value);
                }
                catch (err) {
                    value = unescape(value);
                }
                // follow OGC convention of comma delimited values
                if (options.splitArgs !== false) {
                    value = value.split(',');
                }
                // if there's only one value, do not return as array
                if (value.length === 1) {
                    value = value[0];
                }
                parameters[key] = value;
            }
        }
        return parameters;
    };
    /**
     * Simply append some parameters to a URL, taking care of the characters of the end of the URL
     * @method addUrlParameters
     * @param url - the url string
     * @param paramStr - parameter string of the form "param1=val1&param2=val2" ...
     */
    UtilitiesService.addUrlParameters = function (url, paramStr) {
        var endChar = url.charAt(url.length - 1);
        if (endChar !== '?' && endChar !== '&') {
            return url + '?' + paramStr;
        }
        return url + paramStr;
    };
    /**
     * Test if the object is a number
     * @method isNumber
     * @param obj - the object to test for numeric value
     * @retun boolean - true if obj is a number
     */
    UtilitiesService.isNumber = function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    };
    /**
     * Extract the domain from any url
     * @method getUrlDomain
     * @param url to extract the domain
     */
    UtilitiesService.getUrlDomain = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    };
    /**
     * Based on the filter parameter, this is a utility to decide if we should skip this provider
     * @method filterProviderSkip
     * @param params - filter parameter
     * @param url - the url of the resource we are matching
     */
    UtilitiesService.filterProviderSkip = function (params, url) {
        var containProviderFilter = false;
        var urlMatch = false;
        var idx;
        var domain;
        for (idx in params) {
            if (params[idx].type === 'OPTIONAL.PROVIDER') {
                containProviderFilter = true;
                for (domain in params[idx].value) {
                    if (params[idx].value[domain] && url.indexOf(domain) !== -1) {
                        urlMatch = true;
                    }
                }
            }
        }
        if (containProviderFilter && !urlMatch) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * count the number of unique urls in onlineResources
     * @method uniqueCountOfResourceByUrl
     * @param onlineResources
     * @return unique count by url
     */
    UtilitiesService.uniqueCountOfResourceByUrl = function (onlineResources) {
        var unique = {};
        for (var key in onlineResources) {
            unique[onlineResources[key].url] = true;
        }
        return Object.keys(unique).length;
    };
    /**
     *
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    // public method for encoding
    UtilitiesService.encode_base64 = function (input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    };
    // public method for decoding
    UtilitiesService.decode_base64 = function (input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    };
    // private method for UTF-8 encoding
    UtilitiesService._utf8_encode = function (in_string) {
        in_string = in_string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < in_string.length; n++) {
            var c = in_string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    // private method for UTF-8 decoding
    UtilitiesService._utf8_decode = function (utftext) {
        var string = '';
        var i = 0;
        var c = 0, c2 = 0, c3 = 0;
        var c1 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
    return UtilitiesService;
}());
// private property
UtilitiesService._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
UtilitiesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])()
], UtilitiesService);

//# sourceMappingURL=utilities.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "../../../../../src/template/js/apps.js":
/***/ (function(module, exports) {

/*
Template Name: Infinite Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7
Version: 1.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/infinite-admin/admin/html/
    ----------------------------
        APPS CONTENT TABLE
    ----------------------------
    
    <!-- ======== GLOBAL SCRIPT SETTING ======== -->
	01. Global Variable
	02. Handle Scrollbar
	03. Handle Header Search Bar
	04. Handle Sidebar Menu
	05. Handle Sidebar Minify Float Menu
	06. Handle Dropdown Close Option
	07. Handle App Notification
	08. Handle Setting Cookie
	09. Handle Panel - Remove / Reload / Collapse / Expand
	10. Handle Tooltip & Popover Activation
	11. Handle Scroll to Top Button Activation
	
    <!-- ======== APPLICATION SETTING ======== -->
    Application Controller
*/



/* 01. Global Variable
------------------------------------------------ */
var MUTED_COLOR   = '#8A8A8F';
var MUTED_TRANSPARENT_1_COLOR   = 'rgba(138, 138, 143, 0.1)';
var MUTED_TRANSPARENT_2_COLOR   = 'rgba(138, 138, 143, 0.2)';
var MUTED_TRANSPARENT_3_COLOR   = 'rgba(138, 138, 143, 0.3)';
var MUTED_TRANSPARENT_4_COLOR   = 'rgba(138, 138, 143, 0.4)';
var MUTED_TRANSPARENT_5_COLOR   = 'rgba(138, 138, 143, 0.5)';
var MUTED_TRANSPARENT_6_COLOR   = 'rgba(138, 138, 143, 0.6)';
var MUTED_TRANSPARENT_7_COLOR   = 'rgba(138, 138, 143, 0.7)';
var MUTED_TRANSPARENT_8_COLOR   = 'rgba(138, 138, 143, 0.8)';
var MUTED_TRANSPARENT_9_COLOR   = 'rgba(138, 138, 143, 0.9)';

var PRIMARY_COLOR = '#007AFF';
var PRIMARY_TRANSPARENT_1_COLOR = 'rgba(0, 122, 255, 0.1)';
var PRIMARY_TRANSPARENT_2_COLOR = 'rgba(0, 122, 255, 0.2)';
var PRIMARY_TRANSPARENT_3_COLOR = 'rgba(0, 122, 255, 0.3)';
var PRIMARY_TRANSPARENT_4_COLOR = 'rgba(0, 122, 255, 0.4)';
var PRIMARY_TRANSPARENT_5_COLOR = 'rgba(0, 122, 255, 0.5)';
var PRIMARY_TRANSPARENT_6_COLOR = 'rgba(0, 122, 255, 0.6)';
var PRIMARY_TRANSPARENT_7_COLOR = 'rgba(0, 122, 255, 0.7)';
var PRIMARY_TRANSPARENT_8_COLOR = 'rgba(0, 122, 255, 0.8)';
var PRIMARY_TRANSPARENT_9_COLOR = 'rgba(0, 122, 255, 0.9)';

var SUCCESS_COLOR = '#4CD964';
var SUCCESS_TRANSPARENT_1_COLOR = 'rgba(76, 217, 100, 0.1)';
var SUCCESS_TRANSPARENT_2_COLOR = 'rgba(76, 217, 100, 0.2)';
var SUCCESS_TRANSPARENT_3_COLOR = 'rgba(76, 217, 100, 0.3)';
var SUCCESS_TRANSPARENT_4_COLOR = 'rgba(76, 217, 100, 0.4)';
var SUCCESS_TRANSPARENT_5_COLOR = 'rgba(76, 217, 100, 0.5)';
var SUCCESS_TRANSPARENT_6_COLOR = 'rgba(76, 217, 100, 0.6)';
var SUCCESS_TRANSPARENT_7_COLOR = 'rgba(76, 217, 100, 0.7)';
var SUCCESS_TRANSPARENT_8_COLOR = 'rgba(76, 217, 100, 0.8)';
var SUCCESS_TRANSPARENT_9_COLOR = 'rgba(76, 217, 100, 0.9)';

var INFO_COLOR    = '#5AC8FA';
var INFO_TRANSPARENT_1_COLOR    = 'rgba(90, 200, 250, 0.1)';
var INFO_TRANSPARENT_2_COLOR    = 'rgba(90, 200, 250, 0.2)';
var INFO_TRANSPARENT_3_COLOR    = 'rgba(90, 200, 250, 0.3)';
var INFO_TRANSPARENT_4_COLOR    = 'rgba(90, 200, 250, 0.4)';
var INFO_TRANSPARENT_5_COLOR    = 'rgba(90, 200, 250, 0.5)';
var INFO_TRANSPARENT_6_COLOR    = 'rgba(90, 200, 250, 0.6)';
var INFO_TRANSPARENT_7_COLOR    = 'rgba(90, 200, 250, 0.7)';
var INFO_TRANSPARENT_8_COLOR    = 'rgba(90, 200, 250, 0.8)';
var INFO_TRANSPARENT_9_COLOR    = 'rgba(90, 200, 250, 0.9)';

var WARNING_COLOR = '#FF9500';
var WARNING_TRANSPARENT_1_COLOR = 'rgba(255, 149, 0, 0.1)';
var WARNING_TRANSPARENT_2_COLOR = 'rgba(255, 149, 0, 0.2)';
var WARNING_TRANSPARENT_3_COLOR = 'rgba(255, 149, 0, 0.3)';
var WARNING_TRANSPARENT_4_COLOR = 'rgba(255, 149, 0, 0.4)';
var WARNING_TRANSPARENT_5_COLOR = 'rgba(255, 149, 0, 0.5)';
var WARNING_TRANSPARENT_6_COLOR = 'rgba(255, 149, 0, 0.6)';
var WARNING_TRANSPARENT_7_COLOR = 'rgba(255, 149, 0, 0.7)';
var WARNING_TRANSPARENT_8_COLOR = 'rgba(255, 149, 0, 0.8)';
var WARNING_TRANSPARENT_9_COLOR = 'rgba(255, 149, 0, 0.9)';

var DANGER_COLOR  = '#FF3B30';
var DANGER_TRANSPARENT_1_COLOR  = 'rgba(255, 59, 48, 0.1)';
var DANGER_TRANSPARENT_2_COLOR  = 'rgba(255, 59, 48, 0.2)';
var DANGER_TRANSPARENT_3_COLOR  = 'rgba(255, 59, 48, 0.3)';
var DANGER_TRANSPARENT_4_COLOR  = 'rgba(255, 59, 48, 0.4)';
var DANGER_TRANSPARENT_5_COLOR  = 'rgba(255, 59, 48, 0.5)';
var DANGER_TRANSPARENT_6_COLOR  = 'rgba(255, 59, 48, 0.6)';
var DANGER_TRANSPARENT_7_COLOR  = 'rgba(255, 59, 48, 0.7)';
var DANGER_TRANSPARENT_8_COLOR  = 'rgba(255, 59, 48, 0.8)';
var DANGER_TRANSPARENT_9_COLOR  = 'rgba(255, 59, 48, 0.9)';

var PINK_COLOR    = '#FF2D55';
var PINK_TRANSPARENT_1_COLOR    = 'rgba(255, 45, 85, 0.1)';
var PINK_TRANSPARENT_2_COLOR    = 'rgba(255, 45, 85, 0.2)';
var PINK_TRANSPARENT_3_COLOR    = 'rgba(255, 45, 85, 0.3)';
var PINK_TRANSPARENT_4_COLOR    = 'rgba(255, 45, 85, 0.4)';
var PINK_TRANSPARENT_5_COLOR    = 'rgba(255, 45, 85, 0.5)';
var PINK_TRANSPARENT_6_COLOR    = 'rgba(255, 45, 85, 0.6)';
var PINK_TRANSPARENT_7_COLOR    = 'rgba(255, 45, 85, 0.7)';
var PINK_TRANSPARENT_8_COLOR    = 'rgba(255, 45, 85, 0.8)';
var PINK_TRANSPARENT_9_COLOR    = 'rgba(255, 45, 85, 0.9)';

var PURPLE_COLOR  = '#5856D6';
var PURPLE_TRANSPARENT_1_COLOR  = 'rgba(88, 86, 214, 0.1)';
var PURPLE_TRANSPARENT_2_COLOR  = 'rgba(88, 86, 214, 0.2)';
var PURPLE_TRANSPARENT_3_COLOR  = 'rgba(88, 86, 214, 0.3)';
var PURPLE_TRANSPARENT_4_COLOR  = 'rgba(88, 86, 214, 0.4)';
var PURPLE_TRANSPARENT_5_COLOR  = 'rgba(88, 86, 214, 0.5)';
var PURPLE_TRANSPARENT_6_COLOR  = 'rgba(88, 86, 214, 0.6)';
var PURPLE_TRANSPARENT_7_COLOR  = 'rgba(88, 86, 214, 0.7)';
var PURPLE_TRANSPARENT_8_COLOR  = 'rgba(88, 86, 214, 0.8)';
var PURPLE_TRANSPARENT_9_COLOR  = 'rgba(88, 86, 214, 0.9)';

var YELLOW_COLOR  = '#FFCC00';
var YELLOW_TRANSPARENT_1_COLOR  = 'rgba(255, 204, 0, 0.1)';
var YELLOW_TRANSPARENT_2_COLOR  = 'rgba(255, 204, 0, 0.2)';
var YELLOW_TRANSPARENT_3_COLOR  = 'rgba(255, 204, 0, 0.3)';
var YELLOW_TRANSPARENT_4_COLOR  = 'rgba(255, 204, 0, 0.4)';
var YELLOW_TRANSPARENT_5_COLOR  = 'rgba(255, 204, 0, 0.5)';
var YELLOW_TRANSPARENT_6_COLOR  = 'rgba(255, 204, 0, 0.6)';
var YELLOW_TRANSPARENT_7_COLOR  = 'rgba(255, 204, 0, 0.7)';
var YELLOW_TRANSPARENT_8_COLOR  = 'rgba(255, 204, 0, 0.8)';
var YELLOW_TRANSPARENT_9_COLOR  = 'rgba(255, 204, 0, 0.9)';

var INVERSE_COLOR = '#000000';
var INVERSE_TRANSPARENT_1_COLOR = 'rgba(0, 0, 0, 0.1)';
var INVERSE_TRANSPARENT_2_COLOR = 'rgba(0, 0, 0, 0.2)';
var INVERSE_TRANSPARENT_3_COLOR = 'rgba(0, 0, 0, 0.3)';
var INVERSE_TRANSPARENT_4_COLOR = 'rgba(0, 0, 0, 0.4)';
var INVERSE_TRANSPARENT_5_COLOR = 'rgba(0, 0, 0, 0.5)';
var INVERSE_TRANSPARENT_6_COLOR = 'rgba(0, 0, 0, 0.6)';
var INVERSE_TRANSPARENT_7_COLOR = 'rgba(0, 0, 0, 0.7)';
var INVERSE_TRANSPARENT_8_COLOR = 'rgba(0, 0, 0, 0.8)';
var INVERSE_TRANSPARENT_9_COLOR = 'rgba(0, 0, 0, 0.9)';

var WHITE_COLOR   = '#FFFFFF';
var WHITE_TRANSPARENT_1_COLOR   = 'rgba(255, 255, 255, 0.1)';
var WHITE_TRANSPARENT_2_COLOR   = 'rgba(255, 255, 255, 0.2)';
var WHITE_TRANSPARENT_3_COLOR   = 'rgba(255, 255, 255, 0.3)';
var WHITE_TRANSPARENT_4_COLOR   = 'rgba(255, 255, 255, 0.4)';
var WHITE_TRANSPARENT_5_COLOR   = 'rgba(255, 255, 255, 0.5)';
var WHITE_TRANSPARENT_6_COLOR   = 'rgba(255, 255, 255, 0.6)';
var WHITE_TRANSPARENT_7_COLOR   = 'rgba(255, 255, 255, 0.7)';
var WHITE_TRANSPARENT_8_COLOR   = 'rgba(255, 255, 255, 0.8)';
var WHITE_TRANSPARENT_9_COLOR   = 'rgba(255, 255, 255, 0.9)';


/* 02. Handle Scrollbar
------------------------------------------------ */
var handleSlimScroll = function() {
	"use strict";
	$('[data-scrollbar=true]').each( function() {
		generateSlimScroll($(this));
	});
};
var generateSlimScroll = function(element) {
	if ($(element).attr('data-init')) {
		return;
	}
	var dataHeight = $(element).attr('data-height');
		dataHeight = (!dataHeight) ? $(element).height() : dataHeight;

	var scrollBarOption = {
		height: dataHeight, 
		alwaysVisible: true
	};
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$(element).css('height', dataHeight);
		$(element).css('overflow-x','scroll');
	} else {
		$(element).slimScroll(scrollBarOption);
	}
	$(element).attr('data-init', true);
};


/* 03. Handle Header Search Bar
------------------------------------------------ */
var handleHeaderSearchBar = function() { 
	$('[data-toggle="search-bar"]').live('click', function(e) {
		e.preventDefault();
		
		$('.header-search-bar').addClass('active');
		$('body').append('<a href="javascript:;" data-dismiss="search-bar" id="search-bar-backdrop" class="search-bar-backdrop"></a>');
		$('#search-bar-backdrop').fadeIn(200);
		setTimeout(function() {
			$('#header-search').focus();
		}, 200);
	});
	$('[data-dismiss="search-bar"]').live('click', function(e) {
		e.preventDefault();
		
		$('.header-search-bar').addClass('inactive');
		setTimeout(function() {
			$('.header-search-bar').removeClass('active inactive');
		}, 200);
		$('#search-bar-backdrop').fadeOut(function() {
			$(this).remove();
		});
	});
	$.widget("custom.autocompletewithheader", $.ui.autocomplete, {
		_renderMenu: function (ul, items) {
			var self = this;
			$.each(items, function (index, item) {
				self._renderItem(ul, item);
				if (index == 0) ul.prepend('<li class="ui-autocomplete-header">Suggested Search:</li>');
			});
		}
	});
	var searchTags = ['Report', 'Analytic', 'Product', 'Project', 'Sales', 'Mobile App Development', 'Build Website', 'Helper', 'Profile', 'Setting'];
	$('#header-search').autocompletewithheader({
		source: searchTags,
		minLength: 0
	}).on('focus', function(){ 
		$(this).autocompletewithheader('search'); 
	});
	$('#header-search').autocompletewithheader( "widget" ).addClass('search-bar-autocomplete animated fadeIn');
};


/* 04. Handle Sidebar Menu
------------------------------------------------ */
var handleSidebarMenu = function() {
	"use strict";
	$('.sidebar .nav > .has-sub > a').click(function() {
		var target = $(this).next('.sub-menu');
		var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';

		if ($('.page-sidebar-minified').length === 0) {
			$(otherMenu).not(target).slideUp(250, function() {
				$(this).closest('li').removeClass('expand');
			});
			$(target).slideToggle(250, function() {
				var targetLi = $(this).closest('li');
				if ($(targetLi).hasClass('expand')) {
					$(targetLi).removeClass('expand');
				} else {
					$(targetLi).addClass('expand');
				}
			});
		}
	});
	$('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function() {
		if ($('.page-sidebar-minified').length === 0) {
			var target = $(this).next('.sub-menu');
			$(target).slideToggle(250);
		}
	});
	$('[data-click="sidebar-toggled"]').live('click', function(e) {
		e.preventDefault();
		
		var targetContainer = '#page-container';
		var targetClass = 'page-sidebar-toggled';
		
		if ($(targetContainer).hasClass(targetClass)) {
			$(targetContainer).removeClass(targetClass);
			$(this).removeClass('active');
		} else {
			$(targetContainer).addClass(targetClass);
			$(this).addClass('active');
		}
	});
};


/* 05. Handle Sidebar Minify Float Menu
------------------------------------------------ */
var floatSubMenuTimeout;
var targetFloatMenu;
var handleMouseoverFloatSubMenu = function(elm) {
	clearTimeout(floatSubMenuTimeout);
};
var handleMouseoutFloatSubMenu = function(elm) {
	floatSubMenuTimeout = setTimeout(function() {
		$('.float-sub-menu').remove();
	}, 250);
};
var handleSidebarMinifyFloatMenu = function() {
	$('.float-sub-menu li.has-sub > a').live('click', function() {
		var target = $(this).next('.sub-menu');
		$(target).slideToggle(250, function() {
			var targetMenu = $('.float-sub-menu');
			var targetHeight = $(targetMenu).height() + 20;
			var targetOffset = $(targetMenu).offset();
			var targetTop = $(targetMenu).attr('data-offset-top');
			var windowHeight = $(window).height();
			if ((windowHeight - targetTop) > targetHeight) {
				$('.float-sub-menu').css({
					'top': targetTop,
					'bottom': 'auto',
					'overflow': 'initial'
				});
			} else {
				$('.float-sub-menu').css({
					'bottom': 0,
					'overflow': 'scroll'
				});
			}
		});
	});
	$('.sidebar .nav > li.has-sub > a').hover(function() {
		if (!$('#page-container').hasClass('page-sidebar-minified')) {
			return;
		}
		clearTimeout(floatSubMenuTimeout);
		
		var targetMenu = $(this).closest('li').find('.sub-menu').first();
		if (targetFloatMenu == this) {
			return false;
		} else {
			targetFloatMenu = this;
		}
		var targetMenuHtml = $(targetMenu).html();
		
		if (targetMenuHtml) {
			var targetHeight = $(targetMenu).height() + 20;
			var targetOffset = $(this).offset();
			var targetTop = targetOffset.top - $(window).scrollTop();
			var targetLeft = (!$('#page-container').hasClass('page-sidebar-right')) ? 60 : 'auto';
			var targetRight = (!$('#page-container').hasClass('page-sidebar-right')) ? 'auto' : 60;
			var windowHeight = $(window).height();
			
			if ($('.float-sub-menu').length == 0) {
				targetMenuHtml = '<ul class="float-sub-menu" data-offset-top="'+ targetTop +'" onmouseover="handleMouseoverFloatSubMenu(this)" onmouseout="handleMouseoutFloatSubMenu(this)">' + targetMenuHtml + '</ul>';
				$('body').append(targetMenuHtml);
			} else {
				$('.float-sub-menu').html(targetMenuHtml);
			}
			if ((windowHeight - targetTop) > targetHeight) {
				$('.float-sub-menu').css({
					'top': targetTop,
					'left': targetLeft,
					'bottom': 'auto',
					'right': targetRight
				});
			} else {
				$('.float-sub-menu').css({
					'bottom': 0,
					'top': 'auto',
					'left': targetLeft,
					'right': targetRight
				});
			}
		} else {
			$('.float-sub-menu').remove();
			targetFloatMenu = '';
		}
	}, function() {
		floatSubMenuTimeout = setTimeout(function() {
			$('.float-sub-menu').remove();
			targetFloatMenu = '';
		}, 250);
	});
}


/* 06. Handle Dropdown Close Option
------------------------------------------------ */
var handleDropdownClose = function() {
	$('[data-dropdown-close="false"]').live('click', function(e) {
		e.stopPropagation();
	});
};


/* 07. Handle App Notification
------------------------------------------------ */
var handleAppNotification = function() {
	$.extend({
		notification: function(data) {
			var title = (data.title) ? data.title : '';
			var content = (data.content) ? data.content : '';
			var icon = (data.icon) ? data.icon : '';
			var iconClass = (data.iconClass) ? data.iconClass : '';
			var img = (data.img) ? data.img : '';
			var imgClass = (data.imgClass) ? data.imgClass : '';
			var closeBtn = (data.closeBtn) ? data.closeBtn : '';
			var closeBtnText = (data.closeBtnText) ? data.closeBtnText : '';
			var btn = (data.btn) ? data.btn : '';
			var btnText = (data.btnText) ? data.btnText : '';
			var btnAttr = (data.btnAttr) ? data.btnAttr : '';
			var btnUrl = (data.btnUrl) ? data.btnUrl : '#';
			var autoclose = (data.autoclose) ? data.autoclose : '';
			var autocloseTime = (data.autocloseTime) ? data.autocloseTime : 5000;
			var customClass = (data.class) ? data.class : '';
			var inverseMode = (data.inverseMode) ? 'page-notification-inverse' : '';
	
			var titleHtml = (title) ? '<h4 class="notification-title">'+ title +'</h4>' : '';
			var contentHtml = (content) ? '<p class="notification-desc">'+ content +'</p>' : '';
			var mediaHtml = (icon) ? '<div class="notification-media"><i class="'+ icon +' '+ iconClass +'"></i></div>' : '';
				mediaHtml = (img) ? '<div class="notification-media"><img src="'+ img +'" class="'+ imgClass +'"></i></div>' : mediaHtml;
			var customBtnHtml = (btn && btnText) ? '<a href="'+ btnUrl +'" '+ btnAttr +'>'+ btnText +'</a>' : '';
			var closeBtnHtml = (closeBtn && closeBtn == 'disabled') ? '' : '<a href="#" data-dismiss="notification">Close</a>';
			var infoHtml = (!titleHtml && !contentHtml) ? '' : '<div class="notification-info">'+ titleHtml + contentHtml +'</div>';
			var btnHtmlClass = (!customBtnHtml && closeBtnHtml || customBtnHtml && !closeBtnHtml) ? 'single-btn' : '';
			var btnHtml = '<div class="notification-btn '+ btnHtmlClass +'">'+ customBtnHtml + closeBtnHtml + '</div>';
			var finalHtml = '<div class="page-notification '+ customClass +' bounceInRight animated '+ inverseMode +'">'+ mediaHtml + infoHtml + btnHtml + '</div>';
	
			if ($('#page-notification-container').length === 0) {
				$('body').append('<div id="page-notification-container" class="page-notification-container"></div>');
			}
			$('#page-notification-container').append(finalHtml);
			if (autoclose) {
				var targetElm = $('#page-notification-container').find('.page-notification').last();
				setTimeout(function() {
					$(targetElm).notification('destroy');
				}, autocloseTime);
			}
		}
	});
	
	$('[data-toggle="notification"]').live('click', function(e) {
		e.preventDefault();
		var data = {
			title: ($(this).attr('data-title')) ? $(this).attr('data-title') : '',
			content: ($(this).attr('data-content')) ? $(this).attr('data-content') : '',
			icon: ($(this).attr('data-icon')) ? $(this).attr('data-icon') : '',
			iconClass: ($(this).attr('data-icon-class')) ? $(this).attr('data-icon-class') : '',
			img: ($(this).attr('data-img')) ? $(this).attr('data-img') : '',
			imgClass: ($(this).attr('data-img-class')) ? $(this).attr('data-img-class') : '',
			btn: ($(this).attr('data-btn')) ? $(this).attr('data-btn') : '',
			btnText: ($(this).attr('data-btn-text')) ? $(this).attr('data-btn-text') : '',
			btnAttr: ($(this).attr('data-btn-attr')) ? $(this).attr('data-btn-attr') : '',
			btnUrl: ($(this).attr('data-btn-url')) ? $(this).attr('data-btn-url') : '',
			autoclose: ($(this).attr('data-autoclose')) ? $(this).attr('data-autoclose') : '',
			autocloseTime: ($(this).attr('data-autoclose-time')) ? $(this).attr('data-autoclose-time') : '',
			customClass: ($(this).attr('data-class')) ? $(this).attr('data-class') : '',
			inverseMode: ($(this).attr('data-inverse-mode')) ? $(this).attr('data-inverse-mode') : '',
		};
		$.notification(data);
	});
	$('[data-dismiss="notification"]').live('click', function(e) {
		e.preventDefault();
		$(this).closest('.page-notification').fadeOut(function() {
			$(this).remove();
		});
	});
}


/* 08. Handle Setting Cookie
------------------------------------------------ */
var handleSettingCookie = function() {
	// Sidebar Inverse Cookie 
	$('#setting_sidebar_inverse').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('sidebar-inverse', 'true');
			$('#sidebar').addClass('sidebar-inverse');
		} else {
			Cookies.set('sidebar-inverse', 'false');
			$('#sidebar').removeClass('sidebar-inverse');
		}
	});
	if (Cookies.get('sidebar-inverse') == 'false') {
		$('#setting_sidebar_inverse').prop('checked', false);
		$('#setting_sidebar_inverse').trigger('change');
	} else {
		$('#setting_sidebar_inverse').prop('checked', true);
		$('#setting_sidebar_inverse').trigger('change');
	}
	
	
	// Sidebar Minify Cookie 
	$('#setting_sidebar_minified').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('sidebar-minified', 'true');
			$('#page-container').addClass('page-sidebar-minified');
		} else {
			Cookies.set('sidebar-minified', 'false');
			$('#page-container').removeClass('page-sidebar-minified');
		}
	});
	if (Cookies.get('sidebar-minified') == 'true') {
		$('#setting_sidebar_minified').prop('checked', true);
		$('#setting_sidebar_minified').trigger('change');
	} else {
		$('#setting_sidebar_minified').prop('checked', false);
		$('#setting_sidebar_minified').trigger('change');
	}
	
	
	// Header Inverse Cookie 
	$('#setting_header_inverse').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('header-inverse', 'true');
			$('#header').removeClass('navbar-default').addClass('navbar-inverse');
		} else {
			Cookies.set('header-inverse', 'false');
			$('#header').removeClass('navbar-inverse').addClass('navbar-default');
		}
	});
	if (Cookies.get('header-inverse') == 'false') {
		$('#setting_header_inverse').prop('checked', false);
		$('#setting_header_inverse').trigger('change');
	} else {
		$('#setting_header_inverse').prop('checked', true);
		$('#setting_header_inverse').trigger('change');
	}
	
	
	// Header Fixed Cookie 
	$('#setting_fixed_header').live('change', function() {
		if ($(this).is(':checked')) {
			Cookies.set('header-fixed', 'true');
			$('#header').addClass('navbar-fixed-top');
			$('#page-container').addClass('page-header-fixed');
		} else {
			if ($('#setting_fixed_sidebar').is(':checked')) {
				alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
				$('#setting_fixed_sidebar').prop('checked', false);
				$('#setting_fixed_sidebar').trigger('change');
			}
			Cookies.set('header-fixed', 'false');
			$('#header').removeClass('navbar-fixed-top');
			$('#page-container').removeClass('page-header-fixed');
		}
	});
	if (Cookies.get('header-fixed') == 'false') {
		$('#setting_fixed_header').prop('checked', false);
		$('#setting_fixed_header').trigger('change');
	} else {
		$('#setting_fixed_header').prop('checked', true);
		$('#setting_fixed_header').trigger('change');
	}
	
	
	// Sidebar Fixed Cookie 
	$('#setting_fixed_sidebar').live('change', function() {
		if ($(this).is(':checked')) {
			if (!$('#setting_fixed_header').is(':checked')) {
				alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
				$('#setting_fixed_header').prop('checked', true);
				$('#setting_fixed_header').trigger('change');
			}
			Cookies.set('sidebar-fixed', 'true');
			$('#page-container').addClass('page-sidebar-fixed');
			$('.sidebar [data-scrollbar="true"]').removeAttr('data-init');
			generateSlimScroll($('.sidebar [data-scrollbar="true"]'));
		} else {
			Cookies.set('sidebar-fixed', 'false');
			$('#page-container').removeClass('page-sidebar-fixed');
			
			$('.sidebar [data-scrollbar="true"]').slimScroll({destroy: true});
			$('.sidebar [data-scrollbar="true"]').removeAttr('style');
		}
	});
	if (Cookies.get('sidebar-fixed') == 'false') {
		$('#setting_fixed_sidebar').prop('checked', false);
		$('#setting_fixed_sidebar').trigger('change');
	} else {
		$('#setting_fixed_sidebar').prop('checked', true);
		$('#setting_fixed_sidebar').trigger('change');
	}
};


/* 09. Handle Panel - Remove / Reload / Collapse / Expand
------------------------------------------------ */
var panelActionRunning = false;
var handlePanelAction = function() {
    "use strict";
    
    if (panelActionRunning) {
        return false;
    }
    panelActionRunning = true;
    
    // remove
    $(document).on('hover', '[data-toggle=panel-remove]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Remove',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-remove]', function(e) {
        e.preventDefault();
        $(this).tooltip('destroy');
        $(this).closest('.panel').remove();
    });
    
    // collapse
    $(document).on('hover', '[data-toggle=panel-collapse]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Collapse / Expand',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-collapse]', function(e) {
        e.preventDefault();
        $(this).closest('.panel').find('.panel-body').slideToggle();
    });
    
    // reload
    $(document).on('hover', '[data-toggle=panel-reload]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Reload',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-reload]', function(e) {
        e.preventDefault();
        var target = $(this).closest('.panel');
        if (!$(target).hasClass('panel-loading')) {
            var targetBody = $(target).find('.panel-body');
            var spinnerHtml = '<div class="panel-loading"><div class="spinner"></div></div>';
            $(target).addClass('panel-loading');
            $(targetBody).prepend(spinnerHtml);
            setTimeout(function() {
                $(target).removeClass('panel-loading');
                $(target).find('.panel-loading').remove();
            }, 2000);
        }
    });
    
    // expand
    $(document).on('hover', '[data-toggle=panel-expand]', function(e) {
        if (!$(this).attr('data-init')) {
            $(this).tooltip({
                title: 'Expand / Compress',
                placement: 'bottom',
                trigger: 'hover',
                container: 'body'
            });
            $(this).tooltip('show');
            $(this).attr('data-init', true);
        }
    });
    $(document).on('click', '[data-toggle=panel-expand]', function(e) {
        e.preventDefault();
        var target = $(this).closest('.panel');
        var targetBody = $(target).find('.panel-body');
        var targetTop = 40;
        if ($(targetBody).length !== 0) {
            var targetOffsetTop = $(target).offset().top;
            var targetBodyOffsetTop = $(targetBody).offset().top;
            targetTop = targetBodyOffsetTop - targetOffsetTop;
        }
        
        if ($('body').hasClass('panel-expand') && $(target).hasClass('panel-expand')) {
            $('body, .panel').removeClass('panel-expand');
            $('.panel').removeAttr('style');
            $(targetBody).removeAttr('style');
        } else {
            $('body').addClass('panel-expand');
            $(this).closest('.panel').addClass('panel-expand');
            
            if ($(targetBody).length !== 0 && targetTop != 40) {
                var finalHeight = 40;
                $(target).find(' > *').each(function() {
                    var targetClass = $(this).attr('class');
                    
                    if (targetClass != 'panel-heading' && targetClass != 'panel-body') {
                        finalHeight += $(this).height() + 30;
                    }
                });
                if (finalHeight != 40) {
                    $(targetBody).css('top', finalHeight + 'px');
                }
            }
        }
        $(window).trigger('resize');
    });
};


/* 10. Handle Tooltip & Popover Activation
------------------------------------------------ */
var handelTooltipPopoverActivation = function() {
    "use strict";
    if ($('[data-toggle="tooltip"]').length !== 0) {
        $('[data-toggle=tooltip]').tooltip();
    }
    if ($('[data-toggle="popover"]').length !== 0) {
        $('[data-toggle=popover]').popover();
    }
};


/* 11. Handle Scroll to Top Button Activation
------------------------------------------------ */
var handleScrollToTopButton = function() {
    "use strict";
    $(document).scroll( function() {
        var totalScroll = $(document).scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass('in');
        } else {
            $('[data-click=scroll-top]').removeClass('in');
        }
    });
    $('.content').scroll( function() {
        var totalScroll = $('.content').scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass('in');
        } else {
            $('[data-click=scroll-top]').removeClass('in');
        }
    });

    $('[data-click=scroll-top]').click(function(e) {
        e.preventDefault();
        $('html, body, .content').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });
};


/* Application Controller
------------------------------------------------ */
var App = function () {
	"use strict";
	
	return {
		//main function
		init: function () {
		    this.initSidebar();
		    this.initHeader();
		    this.initComponent();
		    this.initCookie();
		},
		initSidebar: function() {
			handleSidebarMinifyFloatMenu();
			handleSidebarMenu();
		},
		initHeader: function() {
			handleHeaderSearchBar();
		},
		initComponent: function() {
			handleSlimScroll();
			handlePanelAction();
			handelTooltipPopoverActivation();
			handleScrollToTopButton();
			handleDropdownClose();
			handleAppNotification();
		},
		initCookie: function() {
			handleSettingCookie();
		},
		scrollTop: function() {
            $('html, body, .content').animate({
                scrollTop: $('body').offset().top
            }, 0);
		}
	};
}();

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map