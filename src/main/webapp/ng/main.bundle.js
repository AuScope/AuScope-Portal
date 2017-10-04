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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ngx_bootstrap_modal__ = __webpack_require__("../../../../ngx-bootstrap/modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__openlayermap_olmap_component__ = __webpack_require__("../../../../../src/app/openlayermap/olmap.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__layerpanel_infopanel_openlayermappreview_olmap_preview_component__ = __webpack_require__("../../../../../src/app/layerpanel/infopanel/openlayermappreview/olmap.preview.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__layerpanel_layerpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/layerpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__layerpanel_filterpanel_filterpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/filterpanel/filterpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__layerpanel_downloadpanel_downloadpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/downloadpanel/downloadpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__layerpanel_infopanel_infopanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/infopanel/infopanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__layerpanel_infopanel_subpanel_subpanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/infopanel/subpanel/subpanel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__openlayermap_olmap_zoom_component__ = __webpack_require__("../../../../../src/app/openlayermap/olmap.zoom.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__toppanel_renderstatus_renderstatus_component__ = __webpack_require__("../../../../../src/app/toppanel/renderstatus/renderstatus.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__toppanel_notification_notification_component__ = __webpack_require__("../../../../../src/app/toppanel/notification/notification.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__portal_core_ui_portal_core_module__ = __webpack_require__("../../../../../src/app/portal-core-ui/portal-core.module.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






// Components











var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_6__openlayermap_olmap_component__["a" /* OlMapComponent */],
            __WEBPACK_IMPORTED_MODULE_7__layerpanel_infopanel_openlayermappreview_olmap_preview_component__["a" /* OlMapPreviewComponent */],
            __WEBPACK_IMPORTED_MODULE_8__layerpanel_layerpanel_component__["a" /* LayerPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_9__layerpanel_filterpanel_filterpanel_component__["a" /* FilterPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_10__layerpanel_downloadpanel_downloadpanel_component__["a" /* DownloadPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_14__toppanel_renderstatus_renderstatus_component__["a" /* NgbdModalStatusReportComponent */],
            __WEBPACK_IMPORTED_MODULE_11__layerpanel_infopanel_infopanel_component__["a" /* InfoPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_15__toppanel_notification_notification_component__["a" /* NotificationComponent */],
            __WEBPACK_IMPORTED_MODULE_12__layerpanel_infopanel_subpanel_subpanel_component__["a" /* InfoPanelSubComponent */],
            __WEBPACK_IMPORTED_MODULE_13__openlayermap_olmap_zoom_component__["a" /* OlMapZoomComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClientModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_16__portal_core_ui_portal_core_module__["a" /* PortalCoreModule */],
            __WEBPACK_IMPORTED_MODULE_4_ngx_bootstrap_modal__["a" /* ModalModule */].forRoot()
        ],
        entryComponents: [__WEBPACK_IMPORTED_MODULE_14__toppanel_renderstatus_renderstatus_component__["a" /* NgbdModalStatusReportComponent */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_6__openlayermap_olmap_component__["a" /* OlMapComponent */], __WEBPACK_IMPORTED_MODULE_8__layerpanel_layerpanel_component__["a" /* LayerPanelComponent */], __WEBPACK_IMPORTED_MODULE_15__toppanel_notification_notification_component__["a" /* NotificationComponent */], __WEBPACK_IMPORTED_MODULE_13__openlayermap_olmap_zoom_component__["a" /* OlMapZoomComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/downloadpanel/downloadpanel.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"filter-form\">\r\n\t<div [hidden]=\"isCsvSupportedLayer\">\r\n\t\t<div class=\"alert alert-danger fade in\">\r\n\t\t\t<i class=\"fa fa-bell-o fa-3x fa-pull-left\" aria-hidden=\"true\"></i>\r\n\t\t\t<p>CSV download are not supported by the portal for WMS and complex WFS layers. You may wish to download directly from the server by referring to the documentation on Geoserver\r\n\t\t\tfor <a href=\"http://docs.geoserver.org/stable/en/user/services/wms/reference.html#getmap\">getMap</a> and <a href=\"http://docs.geoserver.org/stable/en/user/services/wfs/reference.html#getfeature\">getFeature</a>. \r\n\t\t\tThe service endpoint can be found on the infopanel beside the download tab.</p>\r\n\t\t</div>\r\n\t</div>\r\n\t<div [hidden]='!isCsvSupportedLayer' class=\"form-group\">\r\n\t\t<div *ngIf=\"!bbox&&drawStarted==false\">\r\n\t\t\t <div class=\"alert alert-warning fade in\">               \r\n                <i class=\"ti-bell f-s-20 pull-left m-r-10 m-b-10  m-t-10\"></i>\r\n                <p>Selecting the appropriate area of your interest will reduce the time it requires to download.</p>\r\n            </div>\r\n\t\t</div>\t\t\r\n\t\t<div *ngIf=\"drawStarted==true\">\r\n\t\t\t <div class=\"alert alert-success fade in\">               \r\n                <i class=\"ti-bell f-s-20 pull-left m-r-10 m-b-10\"></i>\r\n                <p>Click on the map to select bounding box</p>\r\n            </div>\r\n\t\t</div>\t\t\r\n\t\t<div *ngIf=\"bbox\">\r\n\t\t\t<div class='standard-title'>\r\n\t\t\t\t<h4 class=\"m-b-20\"><span>Bounding Box</span></h4>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<span class=\"label label-default col-xs-4 col-xs-offset-4 line-height-1-8\">North: {{bbox.northBoundLatitude | number:'1.0-4'}}</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<span class=\"label label-default col-xs-3 line-height-1-8\">West: {{bbox.westBoundLongitude | number:'1.0-4'}}</span> \r\n\t\t\t\t<span class=\"label label-default col-xs-3 col-xs-offset-6 line-height-1-8\">East: {{bbox.eastBoundLongitude | number:'1.0-4'}}</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<span class=\"label label-default col-xs-4 col-xs-offset-4 line-height-1-8\">South: {{bbox.southBoundLatitude | number:'1.0-4'}}</span>\r\n\t\t\t</div>\r\n\t\t\t<hr>\r\n\t\t</div>\r\n\t\t\r\n\t\t<button *ngIf=\"!bbox\" type=\"button\" class=\"btn btn-info btn-xs\" (click)=\"drawBound()\"><i class=\"fa fa-object-ungroup\"></i> Select Bounds</button>\r\n\t\t<button *ngIf=\"bbox\" type=\"button\" class=\"btn btn-danger btn-xs\" (click)=\"clearBound()\"><i class=\"fa fa-refresh\"></i> Clear Bounds</button>\r\n\t\t<button type=\"button\" class=\"btn btn-info btn-xs pull-right\" (click)=\"download()\"><i *ngIf=\"downloadStarted\" class=\"fa fa-spinner fa-spin fa-fw\"></i><i *ngIf=\"!downloadStarted\" class=\"fa fa-cloud-download\"></i> Download</button>\r\n\t</div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/layerpanel/downloadpanel/downloadpanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_model_data_bbox_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/bbox.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_layer_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/layer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_service_wfs_download_download_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/download/download-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_file_saver_FileSaver__ = __webpack_require__("../../../../file-saver/FileSaver.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_file_saver_FileSaver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_file_saver_FileSaver__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DownloadPanelComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var DownloadPanelComponent = (function () {
    function DownloadPanelComponent(layerHandlerService, olMapService, downloadWfsService) {
        this.layerHandlerService = layerHandlerService;
        this.olMapService = olMapService;
        this.downloadWfsService = downloadWfsService;
        this.bbox = null;
        this.drawStarted = false;
        this.downloadStarted = false;
    }
    DownloadPanelComponent.prototype.ngOnInit = function () {
        if (this.layer) {
            this.isCsvSupportedLayer = __WEBPACK_IMPORTED_MODULE_7__environments_environment__["a" /* environment */].csvSupportedLayer.indexOf(this.layer.id) >= 0;
        }
        else {
            this.isCsvSupportedLayer = false;
        }
    };
    DownloadPanelComponent.prototype.drawBound = function () {
        var _this = this;
        setTimeout(function () { return _this.drawStarted = true; }, 0);
        this.olMapService.drawBound().subscribe(function (vector) {
            _this.drawStarted = false;
            var features = vector.getSource().getFeatures();
            var me = _this;
            // Go through this array and get coordinates of their geometry.
            features.forEach(function (feature) {
                me.bbox = new __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_model_data_bbox_model__["a" /* Bbox */]();
                me.bbox.crs = 'EPSG:4326';
                var bbox4326 = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
                me.bbox.eastBoundLongitude = bbox4326.getExtent()[2];
                me.bbox.westBoundLongitude = bbox4326.getExtent()[0];
                me.bbox.northBoundLatitude = bbox4326.getExtent()[3];
                me.bbox.southBoundLatitude = bbox4326.getExtent()[1];
            });
        });
    };
    DownloadPanelComponent.prototype.clearBound = function () {
        this.bbox = null;
    };
    DownloadPanelComponent.prototype.download = function () {
        var _this = this;
        this.downloadStarted = true;
        this.downloadWfsService.download(this.layer, this.bbox).subscribe(function (value) {
            _this.downloadStarted = false;
            var blob = new Blob([value], { type: 'application/zip' });
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_file_saver_FileSaver__["saveAs"])(blob, 'download.zip');
        });
    };
    return DownloadPanelComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__angular_core__["q" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_layer_model__["a" /* LayerModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_layer_model__["a" /* LayerModel */]) === "function" && _a || Object)
], DownloadPanelComponent.prototype, "layer", void 0);
DownloadPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__angular_core__["l" /* Component */])({
        selector: 'app-download-panel',
        template: __webpack_require__("../../../../../src/app/layerpanel/downloadpanel/downloadpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_service_wfs_download_download_wfs_service__["a" /* DownloadWfsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_service_wfs_download_download_wfs_service__["a" /* DownloadWfsService */]) === "function" && _d || Object])
], DownloadPanelComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=downloadpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/filterpanel/filterpanel.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"filter-form\">\r\n    \r\n    \t<div *ngIf=\"layer.filterCollection\">\r\n\t        <div  *ngFor=\"let mandatoryFilter of layer.filterCollection.mandatoryFilters\">\r\n\t            <div *ngIf=\"mandatoryFilter.type == 'MANDATORY.CHECKBOX'\">\r\n\t                <div class=\"form-group  form-group-sm\">\r\n\t                \t<div class=\"checkbox\">\r\n\t\t\t\t\t\t\t<input id=\"{{ 'filter-MANDATORY.CHECKBOX-' + mandatoryFilter.label }}\" type=\"checkbox\" [(ngModel)]=\"mandatoryFilter.value\"/>\r\n\t\t\t\t\t\t\t<label for=\"{{ 'filter-MANDATORY.CHECKBOX-' + mandatoryFilter.label }}\">\r\n\t\t\t\t\t\t\t\t{{mandatoryFilter.label}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\r\n\t                                                       \r\n\t                </div>\r\n\t            </div> \r\n\t            <div *ngIf=\"mandatoryFilter.type == 'MANDATORY.DROPDOWNSELECTLIST'\">\r\n\t                <div class=\"form-group  form-group-sm\">\r\n\t                    <label>{{mandatoryFilter.label}}</label>\t                    \r\n\t\t\t\t\t\t<select class=\"form-control\" [(ngModel)]=\"mandatoryFilter.value\">\r\n\t\t\t\t\t\t\t<option value=\"\" selected=\"selected\">-- choose a {{mandatoryFilter.label}} --</option>\r\n\t\t\t\t\t\t\t<option *ngFor=\"let option of mandatoryFilter.options\" [ngValue]=\"getValue(option)\">{{getKey(option)}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t                </div>\r\n\t            </div>                        \r\n\t        </div>\r\n\t        \r\n        </div>\r\n        \r\n        <div *ngIf=\"!layer.filterCollection\">\r\n\t        <div class=\"alert alert-warning fade in\">\r\n                \r\n                <i class=\"ti-bell f-s-20 pull-left m-r-10\"></i>\r\n                <p>There are no filters associated with this layer</p>\r\n            </div>\r\n           \r\n    \t</div>\r\n    \t\r\n    \t<fieldset *ngIf=\"layer.filterCollection && layer.filterCollection.optionalFilters\" class=\"show-fieldset-borders\">\r\n        \t<legend><h5>Optional Filters</h5></legend>\r\n        \t<div class=\"form-group  form-group-sm\">\r\n\t            <label><i class=\"fa fa-refresh hasEvent light-blue\" (click)=\"refreshFilter()\"></i> Select Filter:</label>        \t\t\t  \r\n                <select class=\"form-control\" [ngModel]=\"selectedFilter\" (ngModelChange)=\"addFilter($event)\">\t\t\t\t\r\n\t\t\t\t\t<option [ngValue]=\"filt\" *ngFor=\"let filt of layer.filterCollection.optionalFilters\">{{filt.label}}</option>\r\n\t\t\t\t</select>\t\t\t   \r\n\t\t    </div>\r\n\t\t    <hr class=\"nav-divider\">\r\n\t\t    \r\n\t\t    <div *ngFor=\"let optionalFilter of optionalFilters\">\r\n\t            <div *ngIf=\"optionalFilter.type=='OPTIONAL.TEXT'\">\r\n\t                <div class=\"form-group  form-group-sm\">\r\n\t\t\t\t\t    <label>{{optionalFilter.label}}:</label>\r\n\t\t\t\t\t    <input type=\"text\" class=\"form-control\"  [(ngModel)]=\"optionalFilter.value\">\t\t\t\t   \r\n\t\t\t\t\t</div>\r\n\t            </div> \r\n\t            <div *ngIf=\"optionalFilter.type=='OPTIONAL.DATE'\">\r\n\t                <div class=\"form-group\">\r\n\t\t\t\t\t\t<label class=\"control-label\">{{optionalFilter.label}}:</label>\r\n\t\t\t\t\t\t<input type=\"date\" class=\"form-control\" [(ngModel)]=\"optionalFilter.value\"/>\r\n\t\t\t\t\t</div>\r\n\t            </div> \r\n\t            <div *ngIf=\"optionalFilter.type=='OPTIONAL.DROPDOWNSELECTLIST'\">\t                \r\n                    <div class=\"form-group  form-group-sm\">\r\n\t                    <label>{{optionalFilter.label}}</label>\t                    \r\n\t\t\t\t\t\t<select class=\"form-control\" [(ngModel)]=\"optionalFilter.value\">\r\n\t\t\t\t\t\t\t<option value=\"\" selected=\"selected\">-- choose a {{optionalFilter.label}} --</option>\r\n\t\t\t\t\t\t\t<option *ngFor=\"let option of optionalFilter.options\">{{getKey(option)}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t                </div>\r\n\t            </div>\r\n\t            <div *ngIf=\"optionalFilter.type=='OPTIONAL.DROPDOWNREMOTE'\">\t                \r\n\t                <div class=\"form-group  form-group-sm\">\r\n\t                    <label>{{optionalFilter.label}}</label>\t                    \r\n\t\t\t\t\t\t<select class=\"form-control\" [(ngModel)]=\"optionalFilter.value\">\r\n\t\t\t\t\t\t\t<option value=\"\" selected=\"selected\">-- choose a {{optionalFilter.label}} --</option>\r\n\t\t\t\t\t\t\t<option *ngFor=\"let option of optionalFilter.options\" [ngValue]=\"option.value\">{{option.key}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t                </div>\r\n\t            </div>\r\n\t            <div *ngIf=\"optionalFilter.type=='OPTIONAL.PROVIDER'\">\t               \r\n\t                <div class=\"form-group\">\t\t\t\t\t\t\r\n\t\t\t\t\t\t<div class=\"checkbox\" *ngFor=\"let provider of providers;let idx = index\">\r\n\t\t\t\t\t\t\t<input id=\"{{ 'filter-OPTIONAL.PROVIDER-' + idx }}\" type=\"checkbox\" [(ngModel)]=\"optionalFilter.value[provider.value]\"/>\r\n\t\t\t\t\t\t\t<label for=\"{{ 'filter-OPTIONAL.PROVIDER-' + idx }}\">\r\n\t\t\t\t\t\t\t\t{{provider.label}}\r\n\t\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t</div>\t\t\t\t\t\t\r\n\t\t\t\t\t</div>\r\n\t            </div>\t            \r\n\t        </div>\r\n\t\t   \r\n\t    </fieldset>\r\n    \t<button type=\"button\" class=\"btn btn-info btn-sm\" (click)=\"addLayer(layer)\">Add Layer</button>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/layerpanel/filterpanel/filterpanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_model_data_layer_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/layer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_filterpanel_filterpanel_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/filterpanel/filterpanel-service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/utilities.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
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
    function FilterPanelComponent(olMapService, layerHandlerService, filterPanelService) {
        this.olMapService = olMapService;
        this.layerHandlerService = layerHandlerService;
        this.filterPanelService = filterPanelService;
        this.providers = [];
        this.optionalFilters = [];
    }
    FilterPanelComponent.prototype.ngOnInit = function () {
        if (this.layer.filterCollection && this.layer.filterCollection['mandatoryFilters']) {
            var mandatoryFilters = this.layer.filterCollection['mandatoryFilters'];
            for (var _i = 0, mandatoryFilters_1 = mandatoryFilters; _i < mandatoryFilters_1.length; _i++) {
                var mandatoryFilter = mandatoryFilters_1[_i];
                if (mandatoryFilter['type'] === 'MANDATORY.CHECKBOX') {
                    mandatoryFilter['value'] = (mandatoryFilter['type'] === 'true');
                }
            }
        }
    };
    FilterPanelComponent.prototype.addLayer = function (layer) {
        var param = {
            optionalFilters: __WEBPACK_IMPORTED_MODULE_6_lodash__["cloneDeep"](this.optionalFilters)
        };
        for (var _i = 0, _a = param.optionalFilters; _i < _a.length; _i++) {
            var optFilter = _a[_i];
            if (optFilter['options']) {
                optFilter['options'] = [];
            }
        }
        this.olMapService.addLayer(layer, param);
    };
    FilterPanelComponent.prototype.getKey = function (options) {
        return __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].getKey(options);
    };
    FilterPanelComponent.prototype.getValue = function (options) {
        return __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].getValue(options);
    };
    /**
      * Adds a new filter to be displayed in the panel
      * @method addFilter
      * @param filter filter object to be added to the panel
      * @param addEmpty if true, set filter value to be empty.
      */
    FilterPanelComponent.prototype.addFilter = function (filter, addEmpty) {
        var _this = this;
        if (filter == null) {
            return;
        }
        for (var _i = 0, _a = this.optionalFilters; _i < _a.length; _i++) {
            var filterobject = _a[_i];
            if (filterobject['label'] === filter['label']) {
                return;
            }
        }
        if (__WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].isEmpty(this.providers) && filter.type === 'OPTIONAL.PROVIDER') {
            this.getProvider();
            filter.value = {};
            for (var _b = 0, _c = this.providers; _b < _c.length; _b++) {
                var provider = _c[_b];
                filter.value[provider['value']] = false;
            }
        }
        if (__WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].isEmpty(filter.options) && filter.type === 'OPTIONAL.DROPDOWNREMOTE') {
            this.filterPanelService.getFilterRemoteParam(filter.url).subscribe(function (response) {
                filter.options = response;
                _this.optionalFilters.push(filter);
            });
            return;
        }
        this.optionalFilters.push(filter);
    };
    ;
    /**
       * Assembles a list of providers, which will be displayed in the panel
       * @method getProvider
       */
    FilterPanelComponent.prototype.getProvider = function () {
        var cswRecords = this.layer.cswRecords;
        // Set up a map of admin areas + URL's that belong to each
        var adminAreasMap = {};
        for (var i = 0; i < cswRecords.length; i++) {
            var adminArea = cswRecords[i].adminArea;
            var allOnlineResources = this.layerHandlerService.getOnlineResourcesFromCSW(cswRecords[i]);
            adminAreasMap[adminArea] = __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].getUrlDomain(allOnlineResources[0].url);
        }
        // Set up a list of each unique admin area
        for (var key in adminAreasMap) {
            this.providers.push({
                label: key,
                value: adminAreasMap[key]
            });
        }
    };
    ;
    /**
     * refresh and clear the filters;
     */
    FilterPanelComponent.prototype.refreshFilter = function () {
        this.optionalFilters = [];
        this.selectedFilter = {};
    };
    return FilterPanelComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__angular_core__["q" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_model_data_layer_model__["a" /* LayerModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_model_data_layer_model__["a" /* LayerModel */]) === "function" && _a || Object)
], FilterPanelComponent.prototype, "layer", void 0);
FilterPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__angular_core__["l" /* Component */])({
        selector: 'app-filter-panel',
        template: __webpack_require__("../../../../../src/app/layerpanel/filterpanel/filterpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_filterpanel_filterpanel_service__["a" /* FilterPanelService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_filterpanel_filterpanel_service__["a" /* FilterPanelService */]) === "function" && _d || Object])
], FilterPanelComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=filterpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/infopanel/infopanel.component.html":
/***/ (function(module, exports) {

module.exports = "\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t        <app-ol-preview-map></app-ol-preview-map>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div *ngIf=\"layer.name != undefined\">\r\n\t\t\t\t\t\t\t\t    <h4><span class=\"text-primary\">Abstract</span></h4>\r\n\t\t\t\t\t\t\t\t    <p>{{layer.name}}</p>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div *ngIf=\"layer.description != undefined\">\r\n\t\t\t\t\t\t\t\t    <h4><span class=\"text-primary\">Summary</span></h4>\r\n\t\t\t\t\t\t\t\t    <p>{{layer.description}}</p>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div *ngIf=\"layer.iconUrl != undefined\">\r\n\t\t\t\t\t\t\t\t    <h4><span class=\"text-primary\">Icon</span></h4>\r\n\t\t\t\t\t\t\t\t    <img src=\"{{layer.iconUrl}}\" width=\"20\" height=\"20\">\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div *ngIf=\"cswRecords.length > 0\">\r\n\t\t\t\t\t\t\t\t    <h4><span class=\"text-primary\">Details</span></h4>\r\n\t\t\t\t\t\t\t\t    <div class=\"panel panel-inverse\">\r\n\t\t\t\t\t\t\t\t\t    <div class=\"panel-body\" style=\"padding-left: 0px;padding-right: 0px;\">\r\n\t\t\t\t\t\t\t\t\t\t    <div class=\"panel-group\" id=\"accordion\">\r\n\t\t\t\t\t\t\t\t\t\t       <div *ngFor=\"let cswRecord of cswRecords.slice(0,10)\" class=\"panel panel-inverse panel-bordered\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t   <div class=\"panel-heading\" id=\"headingOne\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t    <h4 class=\"panel-title\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t    <a class=\"accordion-link\" data-parent=\"#accordion\" (click)=\"cswRecord.expanded = !cswRecord.expanded\" (mouseenter)=\"highlightOnPreviewMap(layer.name, cswRecord.adminArea)\" (mouseleave)=\"lowlightOnPreviewMap(layer.name, cswRecord.adminArea)\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{cswRecord.adminArea !='' && cswRecord.adminArea!=null ? cswRecord.adminArea : 'More Information'}}\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t    </h4>\r\n\t\t\t\t\t\t\t\t\t\t\t\t   </div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t   <div class=\"panel-collapse collapse\" [ngClass]=\"{'in': cswRecord.expanded}\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t    <div *ngIf=\"cswRecord.expanded\" class=\"panel-body\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t    <info-sub-panel [cswRecord]=cswRecord [layer]=layer [expanded]=cswRecord.expanded ></info-sub-panel>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t\t\t   </div>\r\n"

/***/ }),

/***/ "../../../../../src/app/layerpanel/infopanel/infopanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__turf_helpers__ = __webpack_require__("../../../../@turf/helpers/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__turf_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__turf_center__ = __webpack_require__("../../../../@turf/center/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__turf_center___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__turf_center__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__turf_envelope__ = __webpack_require__("../../../../@turf/envelope/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__turf_envelope___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__turf_envelope__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_model_data_layer_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/layer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__openlayermappreview_olmap_preview_component__ = __webpack_require__("../../../../../src/app/layerpanel/infopanel/openlayermappreview/olmap.preview.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ol_proj__ = __webpack_require__("../../../../ol/proj.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPanelComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var InfoPanelComponent = (function () {
    function InfoPanelComponent() {
        // legends: any = {};
        this.featureArr = [];
    }
    /**
     * Creates a string key for use with storing bounding box details within an associative array,
       given layer name and administrative area strings
     * @param layerName name of layer
     * @param adminArea administrative area
     */
    InfoPanelComponent.prototype.makeKey = function (layerName, adminArea) {
        return layerName + '#' + adminArea;
    };
    /**
     * Gets called by Angular framework upon any changes
     * @param changes object which holds the changes
     */
    InfoPanelComponent.prototype.ngOnChanges = function (changes) {
        // If this panel becomes expanded, then load up the legend and preview map
        if (changes.expanded.currentValue === true && !changes.expanded.previousValue) {
            // Gather up BBOX coordinates to calculate the centre and envelope
            var bboxArr = [];
            var bboxPolygonArr = {};
            for (var i = 0; i < this.cswRecords.length; i++) {
                var bbox = this.cswRecords[i].geographicElements[0];
                if (bbox !== undefined && (bbox.westBoundLongitude !== 0 || bbox.northBoundLatitude !== 0 || bbox.eastBoundLongitude !== 0 || bbox.southBoundLatitude !== 0)
                    && (bbox.eastBoundLongitude !== 180 || bbox.westBoundLongitude !== 180 || bbox.northBoundLatitude !== 90 || bbox.southBoundLatitude !== -90)) {
                    this.featureArr.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["point"])([bbox.westBoundLongitude, bbox.northBoundLatitude]));
                    this.featureArr.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["point"])([bbox.westBoundLongitude, bbox.southBoundLatitude]));
                    this.featureArr.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["point"])([bbox.eastBoundLongitude, bbox.southBoundLatitude]));
                    this.featureArr.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["point"])([bbox.eastBoundLongitude, bbox.northBoundLatitude]));
                    bboxArr.push(bbox);
                    // Create a GeoJSON polgon object array to pass to the preview map component
                    var key = this.makeKey(this.layer.name, this.cswRecords[i].adminArea);
                    bboxPolygonArr[key] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["featureCollection"])([__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["polygon"])([[
                                __WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([bbox.westBoundLongitude, bbox.northBoundLatitude]),
                                __WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([bbox.westBoundLongitude, bbox.southBoundLatitude]),
                                __WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([bbox.eastBoundLongitude, bbox.southBoundLatitude]),
                                __WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([bbox.eastBoundLongitude, bbox.northBoundLatitude]),
                                __WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([bbox.westBoundLongitude, bbox.northBoundLatitude])
                            ]])]);
                    bboxPolygonArr[key].crs = {
                        'type': 'name',
                        'properties': {
                            'name': 'EPSG:3857'
                        }
                    };
                }
            }
            // Use 'turf' to calculate the centre point of the BBOXES, use this to re-centre the map
            // Only calculate centre if the coords are not dispersed over the globe
            var reCentrePt = {};
            if (this.featureArr.length > 0) {
                // Calculate the envelope, if not too big then re-centred map can be calculated
                var featureColl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__turf_helpers__["featureCollection"])(this.featureArr);
                var envelopePoly = __WEBPACK_IMPORTED_MODULE_3__turf_envelope__(featureColl);
                if (envelopePoly.geometry.coordinates[0][1][0] - envelopePoly.geometry.coordinates[0][0][0] < 30
                    && envelopePoly.geometry.coordinates[0][2][1] - envelopePoly.geometry.coordinates[0][0][1] < 30) {
                    // Calculate centre so we can re-centre the map
                    var centerPt = __WEBPACK_IMPORTED_MODULE_2__turf_center__(featureColl);
                    if (centerPt.geometry.coordinates !== undefined && centerPt.geometry.coordinates.length === 2
                        && !isNaN(centerPt.geometry.coordinates[0]) && !isNaN(centerPt.geometry.coordinates[1])) {
                        reCentrePt = { latitude: centerPt.geometry.coordinates[1], longitude: centerPt.geometry.coordinates[0] };
                    }
                }
                if (reCentrePt !== {}) {
                    // Ask preview map component to draw bounding boxes and recentre the map
                    this.previewMap.setupBBoxes(__WEBPACK_IMPORTED_MODULE_6_ol_proj__["a" /* default */].fromLonLat([reCentrePt.longitude, reCentrePt.latitude]), bboxPolygonArr);
                }
            }
        }
    };
    /**
     * Highlights a bounding box on the preview map
     * @param layerName name of layerName
     * @param adminArea name of administrative area
     */
    InfoPanelComponent.prototype.highlightOnPreviewMap = function (layerName, adminArea) {
        var key = this.makeKey(layerName, adminArea);
        this.previewMap.setBBoxHighlight(true, key);
    };
    /**
     * Unhighlights a bounding box on the preview map
     * @param layerName name of layerName
     * @param adminArea name of administrative area
     */
    InfoPanelComponent.prototype.lowlightOnPreviewMap = function (layerName, adminArea) {
        var key = this.makeKey(layerName, adminArea);
        this.previewMap.setBBoxHighlight(false, key);
    };
    return InfoPanelComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", Array)
], InfoPanelComponent.prototype, "cswRecords", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_model_data_layer_model__["a" /* LayerModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_model_data_layer_model__["a" /* LayerModel */]) === "function" && _a || Object)
], InfoPanelComponent.prototype, "layer", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", Boolean)
], InfoPanelComponent.prototype, "expanded", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_5__openlayermappreview_olmap_preview_component__["a" /* OlMapPreviewComponent */]),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__openlayermappreview_olmap_preview_component__["a" /* OlMapPreviewComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__openlayermappreview_olmap_preview_component__["a" /* OlMapPreviewComponent */]) === "function" && _b || Object)
], InfoPanelComponent.prototype, "previewMap", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('subPanelElement'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ElementRef */]) === "function" && _c || Object)
], InfoPanelComponent.prototype, "subPanelElement", void 0);
InfoPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
        selector: 'info-panel',
        template: __webpack_require__("../../../../../src/app/layerpanel/infopanel/infopanel.component.html")
    }),
    __metadata("design:paramtypes", [])
], InfoPanelComponent);

var _a, _b, _c;
//# sourceMappingURL=infopanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/infopanel/openlayermappreview/olmap.preview.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_openlayermap_renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__turf_helpers__ = __webpack_require__("../../../../@turf/helpers/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__turf_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__turf_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__turf_inside__ = __webpack_require__("../../../../@turf/inside/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__turf_inside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__turf_inside__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__turf_bbox__ = __webpack_require__("../../../../@turf/bbox/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__turf_bbox___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__turf_bbox__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ol_style_style__ = __webpack_require__("../../../../ol/style/style.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ol_view__ = __webpack_require__("../../../../ol/view.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ol_style_stroke__ = __webpack_require__("../../../../ol/style/stroke.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ol_style_fill__ = __webpack_require__("../../../../ol/style/fill.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ol_format_geojson__ = __webpack_require__("../../../../ol/format/geojson.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ol_source_vector__ = __webpack_require__("../../../../ol/source/vector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_ol_layer_vector__ = __webpack_require__("../../../../ol/layer/vector.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlMapPreviewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var OlMapPreviewComponent = (function () {
    /**
     * This constructor creates the preview map
     */
    function OlMapPreviewComponent(olMapService) {
        this.olMapService = olMapService;
        this.iDiv = null;
        this.new_id = null;
        this.olMapObject = null;
        this.bboxGeojsonObjectArr = [];
        this.BBOX_LOW_STROKE_COLOUR = 'black';
        this.BBOX_HIGH_STROKE_COLOUR = '#ff33cc';
        this.BBOX_LOW_FILL_COLOUR = 'rgba(128,128,128,0.25)';
        this.BBOX_HIGH_FILL_COLOUR = 'rgba(255,179,236,0.4)';
        this.layerVectorArr = {};
        this.olMapObject = new __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__["a" /* OlMapObject */](new __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_service_openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */]());
        var map = this.olMapObject.getMap();
        var me = this;
        // When the user clicks on a rectangle in the preview, the main map zooms to the same area
        map.on('singleclick', function (event) {
            for (var _i = 0, _a = me.bboxGeojsonObjectArr; _i < _a.length; _i++) {
                var featureColl = _a[_i];
                for (var _b = 0, _c = featureColl.features; _b < _c.length; _b++) {
                    var feat = _c[_b];
                    var poly = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__turf_helpers__["polygon"])([[feat.geometry.coordinates[0][0],
                            feat.geometry.coordinates[0][1], feat.geometry.coordinates[0][2],
                            feat.geometry.coordinates[0][3], feat.geometry.coordinates[0][4]]]);
                    if (__WEBPACK_IMPORTED_MODULE_6__turf_inside__(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__turf_helpers__["point"])(event.coordinate), poly)) {
                        var bboxX = __WEBPACK_IMPORTED_MODULE_7__turf_bbox__(poly);
                        olMapService.fitView(bboxX);
                    }
                }
            }
        });
    }
    /**
     * Set the map target, refresh the map, disable map controls
     */
    OlMapPreviewComponent.prototype.ngAfterViewInit = function () {
        // After view init the map target can be set!
        var map = this.olMapObject.getMap();
        map.setTarget(this.mapElement.nativeElement);
        // Remove controls
        var contrColl = map.getControls();
        for (var i = 0; i < contrColl.getLength(); i++) {
            map.removeControl(contrColl.item(i));
        }
        // Disable pan and zoom via keyboard & mouse
        var actionColl = map.getInteractions();
        for (var i = 0; i < actionColl.getLength(); i++) {
            var action = actionColl.item(i);
            action.setActive(false);
        }
    };
    /**
    * Adds bounding boxes to the preview map, recentres the map to the middle of the bounding boxes
    * @param reCentrePt  Point to re-centre map
    * @param bboxGeojsonObj  Bounding boxes in GeoJSON format
    */
    OlMapPreviewComponent.prototype.setupBBoxes = function (reCentrePt, bboxGeojsonObj) {
        for (var key in bboxGeojsonObj) {
            // Store the BBOXes for making the main map's view fit to the BBOX when BBOX is clicked on in preview map
            this.bboxGeojsonObjectArr.push(bboxGeojsonObj[key]);
            // Set up bounding box style
            var rectStyle = new __WEBPACK_IMPORTED_MODULE_8_ol_style_style__["a" /* default */]({
                stroke: new __WEBPACK_IMPORTED_MODULE_10_ol_style_stroke__["a" /* default */]({
                    color: this.BBOX_LOW_STROKE_COLOUR,
                    width: 2
                }),
                fill: new __WEBPACK_IMPORTED_MODULE_11_ol_style_fill__["a" /* default */]({
                    color: this.BBOX_LOW_FILL_COLOUR
                })
            });
            var source = new __WEBPACK_IMPORTED_MODULE_13_ol_source_vector__["a" /* default */]({
                features: (new __WEBPACK_IMPORTED_MODULE_12_ol_format_geojson__["a" /* default */]()).readFeatures(bboxGeojsonObj[key])
            });
            var layerVector = new __WEBPACK_IMPORTED_MODULE_14_ol_layer_vector__["a" /* default */]({
                source: source,
                style: [rectStyle]
            });
            // Keep a record of layers for bbox highlighting function
            this.layerVectorArr[key] = layerVector;
            // Add bounding boxes to map
            this.olMapObject.getMap().addLayer(layerVector);
        }
        // Only re-centre and zoom using valid coordinates, otherwise just recentre to middle of Australia
        var newView;
        if (isNaN(reCentrePt[0]) || isNaN(reCentrePt[1])) {
            newView = new __WEBPACK_IMPORTED_MODULE_9_ol_view__["a" /* default */]({ center: __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_utility_constants_service__["a" /* Constants */].CENTRE_COORD, zoom: 3 });
        }
        else {
            newView = new __WEBPACK_IMPORTED_MODULE_9_ol_view__["a" /* default */]({ center: reCentrePt, zoom: 3 });
        }
        this.olMapObject.getMap().setView(newView);
    };
    /**
     * Highlights or unhighlights a bounding box in the preview map
     * @param state if true will highlight bounding box, else will unhighlight it
     * @param key used for selecting which bounding box to (un)highlight
     */
    OlMapPreviewComponent.prototype.setBBoxHighlight = function (state, key) {
        var map = this.olMapObject.getMap();
        var strokeColour = this.BBOX_LOW_STROKE_COLOUR;
        var fillColour = this.BBOX_LOW_FILL_COLOUR;
        if (state) {
            strokeColour = this.BBOX_HIGH_STROKE_COLOUR;
            fillColour = this.BBOX_HIGH_FILL_COLOUR;
        }
        var layers = map.getLayers();
        // Find the selected layer using the 'layerVectorArry'
        for (var _i = 0, _a = layers.getArray(); _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer === this.layerVectorArr[key]) {
                // Renew the layer but with a new colour
                map.removeLayer(layer);
                var rectStyle = new __WEBPACK_IMPORTED_MODULE_8_ol_style_style__["a" /* default */]({
                    stroke: new __WEBPACK_IMPORTED_MODULE_10_ol_style_stroke__["a" /* default */]({
                        color: strokeColour,
                        width: 2
                    }),
                    fill: new __WEBPACK_IMPORTED_MODULE_11_ol_style_fill__["a" /* default */]({
                        color: fillColour
                    })
                });
                layer.setStyle(rectStyle);
                map.addLayer(layer);
                break;
            }
        }
    };
    return OlMapPreviewComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_core__["_8" /* ViewChild */])('previewMapElement'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__angular_core__["i" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_core__["i" /* ElementRef */]) === "function" && _a || Object)
], OlMapPreviewComponent.prototype, "mapElement", void 0);
OlMapPreviewComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_core__["l" /* Component */])({
        selector: 'app-ol-preview-map',
        template: "\n    <div #previewMapElement style=\"display: block; height: 300px; width: 300px\" > </div>\n    <div style=\"margin-top: -165px; margin-left: 130px; z-index: -2; position: relative; padding-bottom: 10px; margin-bottom: 134px;\">\n    <img src=\"template/framework/slick/ajax-loader.gif\"></div>\n    "
        // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _b || Object])
], OlMapPreviewComponent);

var _a, _b;
//# sourceMappingURL=olmap.preview.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/infopanel/subpanel/subpanel.component.html":
/***/ (function(module, exports) {

module.exports = "<p><b>Contact org: </b>{{cswRecord.contactOrg}}</p>\r\n<p><b>Description: </b>{{cswRecord.description}}</p>\r\n<p><b>Name: </b>{{cswRecord.name}}</p>\r\n<p><b>Info Url: </b><a target=\"_blank\" href=\"{{cswRecord.recordInfoUrl}}\">Link to Geonetwork Record</a></p>\r\n<div *ngFor=\"let onlineResource of cswRecord.onlineResources\">\r\n\t<p *ngIf=\"onlineResource.type!='Unsupported'\"><a target=\"_blank\" href=\"{{onlineResource.url}}\">{{onlineResource.type}} endpoint url</a>\r\n\t\t<span class=\"label label-default\">{{onlineResource.type}} </span>\r\n\t</p>\r\n</div>\r\n<p *ngIf=\"wmsUrl!=undefined\">\r\n\t<b>WMS Preview: </b><img appImgLoading src=\"{{wmsUrl}}\" height=\"100\" width=\"100\"/>\r\n</p>\r\n<p *ngIf=\"legendUrl!=undefined\">\r\n\t<b>Legend: </b><img appImgLoading src=\"{{legendUrl}}\" class=\"infopanel-legend\"/>\r\n</p>\r\n"

/***/ }),

/***/ "../../../../../src/app/layerpanel/infopanel/subpanel/subpanel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_cswrecord_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/cswrecord.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_model_data_layer_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/layer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_wms_legend_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/legend.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/utilities.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPanelSubComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InfoPanelSubComponent = (function () {
    function InfoPanelSubComponent(legendService, ref) {
        this.legendService = legendService;
        this.ref = ref;
    }
    /**
     * Gets called by Angular framework upon any changes
     * @param changes object which holds the changes
     */
    InfoPanelSubComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        // If this subpanel becomes expanded, then load up the legend and preview map
        if (changes.expanded.currentValue === true && !changes.expanded.previousValue) {
            var me_1 = this;
            if (this.layer.proxyStyleUrl && this.layer.proxyStyleUrl.length > 0) {
                this.legendService.getLegendStyle(this.layer.proxyStyleUrl).subscribe(function (response) {
                    if (response) {
                        var sldBody = encodeURIComponent(response);
                        // Gather up lists of legend URLs
                        var onlineResources_1 = me_1.cswRecord.onlineResources;
                        for (var j = 0; j < onlineResources_1.length; j++) {
                            if (onlineResources_1[j].type === 'WMS') {
                                var params = 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                                    + '&LAYER=' + onlineResources_1[j].name + '&LAYERS=' + onlineResources_1[j].name;
                                // If there is a style, then use it
                                if (sldBody.length > 0) {
                                    params += '&SLD_BODY=' + sldBody + '&LEGEND_OPTIONS=forceLabels:on;minSymbolSize:16';
                                }
                                _this.legendUrl = __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].addUrlParameters(onlineResources_1[j].url, params);
                            }
                        }
                    }
                });
            }
            else {
                var onlineResources_2 = this.cswRecord.onlineResources;
                for (var j = 0; j < onlineResources_2.length; j++) {
                    if (onlineResources_2[j].type === 'WMS') {
                        var params = 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                            + '&LAYER=' + onlineResources_2[j].name + '&LAYERS=' + onlineResources_2[j].name + '&WIDTH=188';
                        this.legendUrl = __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].addUrlParameters(onlineResources_2[j].url, params);
                    }
                }
            }
            // Gather up BBOX coordinates to calculate the centre and envelope
            var bbox = this.cswRecord.geographicElements[0];
            // Gather up lists of information URLs
            var onlineResources = this.cswRecord.onlineResources;
            for (var j = 0; j < onlineResources.length; j++) {
                if (onlineResources[j].type === 'WMS') {
                    var params = 'SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYERS='
                        + encodeURIComponent(onlineResources[j].name) + '&SRS=EPSG:4326&BBOX=' + bbox.westBoundLongitude + ',' + bbox.southBoundLatitude
                        + ',' + bbox.eastBoundLongitude + ',' + bbox.northBoundLatitude
                        + '&WIDTH=400&HEIGHT=400';
                    this.wmsUrl = __WEBPACK_IMPORTED_MODULE_4__portal_core_ui_utility_utilities_service__["a" /* UtilitiesService */].addUrlParameters(onlineResources[j].url, params);
                }
            }
        }
    };
    return InfoPanelSubComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_cswrecord_model__["a" /* CSWRecordModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_model_data_cswrecord_model__["a" /* CSWRecordModel */]) === "function" && _a || Object)
], InfoPanelSubComponent.prototype, "cswRecord", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_model_data_layer_model__["a" /* LayerModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__portal_core_ui_model_data_layer_model__["a" /* LayerModel */]) === "function" && _b || Object)
], InfoPanelSubComponent.prototype, "layer", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["q" /* Input */])(),
    __metadata("design:type", Boolean)
], InfoPanelSubComponent.prototype, "expanded", void 0);
InfoPanelSubComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
        selector: 'info-sub-panel',
        template: __webpack_require__("../../../../../src/app/layerpanel/infopanel/subpanel/subpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_wms_legend_service__["a" /* LegendService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__portal_core_ui_service_wms_legend_service__["a" /* LegendService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* ChangeDetectorRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* ChangeDetectorRef */]) === "function" && _d || Object])
], InfoPanelSubComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=subpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/layerpanel.component.html":
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\t<li class=\"has-sub\" *ngFor=\"let layerGroup of layerGroups | getKey\">\r\n   \t\t<a href=\"javascript:;\">\r\n            <b class=\"caret caret-right pull-right\"></b>\r\n              {{layerGroup.key}}\r\n        </a>\r\n\t\t<ul class=\"sub-menu\">\r\n\t\t\t<li *ngFor=\"let layer of layerGroup.value\" [ngClass]=\"{'active': layer.expanded}\">\r\n\t\t\t\t<a (click)=\"layer.expanded = !layer.expanded\">\r\n\t\t\t\t\t<div class=\"project-info\">\r\n\t\t\t\t\t\t<span *ngIf=\"uiLayerModels[layer.id].statusMap.renderStarted\" class=\"pull-right project-percentage hasEvent light-blue\"><u (click)=\"openStatusReport(uiLayerModels[layer.id]); $event.stopPropagation();\">{{uiLayerModels[layer.id].statusMap.completePercentage}}<i *ngIf=\"!uiLayerModels[layer.id].statusMap.containsError\" class=\"fa fa-warning text-warning\"></i></u></span>\r\n\t\t\t\t\t\t<div class=\"project-title\">\r\n\t\t\t\t\t\t\t<i *ngIf=\"uiLayerModels[layer.id].statusMap.renderStarted\" class=\"fa fa-ban text-danger\" (click) = \"removeLayer(layer);$event.stopPropagation();\"></i>\r\n\t\t\t\t\t\t\t\t{{layer.name}}\r\n\t\t\t\t\t\t\t\t<span *ngIf=\"layer.expanded && !uiLayerModels[layer.id].statusMap.renderStarted\" class=\"fa fa-arrow-circle-down\"></span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div *ngIf=\"uiLayerModels[layer.id].statusMap.renderStarted\" class=\"progress progress-xs\">\r\n\t\t\t\t\t\t\t<div class=\"progress-bar bg-gradient-blue-purple\" [style.width]=\"uiLayerModels[layer.id].statusMap.completePercentage\" role=\"progressbar\"></div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t</a>\r\n\t\t\t\t<div [hidden]=\"!layer.expanded\" class=\"sidebar-panel-menu-show\">\r\n\r\n\t\t\t\t\t <div class=\"panel panel-inverse panel-info panel-with-tabs layer-panel animated  slideInRight\">\r\n\r\n\t\t\t\t\t\t<div class=\"panel-heading\">\r\n\t\t\t\t\t\t\t<ul id=\"panel-tab\" class=\"nav nav-tabs pull-right\">\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'filterpanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.filterpanel.expanded}\"><a data-toggle=\"tab\"><i class=\"fa fa-filter\"></i> <span class=\"hidden-xs\">Filter</span></a></li>\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'infopanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.infopanel.expanded}\"><a data-toggle=\"tab\"><i class=\"fa fa-info-circle\"></i> <span class=\"hidden-xs\">Info</span></a></li>\r\n\t\t\t\t\t\t\t\t<li (click)=\"selectTabPanel(layer.id,'downloadpanel')\" [ngClass]=\"{'active': uiLayerModels[layer.id].tabpanel.downloadpanel.expanded}\" class=\"desktop-only\"><a data-toggle=\"tab\"><i class=\"fa fa-download\"></i> <span class=\"hidden-xs\">Download</span></a></li>\r\n\t\t\t\t\t\t\t</ul>\r\n\r\n\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t<div id=\"panel-tab-content\" class=\"tab-content\">\r\n\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'in active': uiLayerModels[layer.id].tabpanel.filterpanel.expanded}\">\r\n\t\t\t\t\t\t\t\t<app-filter-panel *ngIf=\"uiLayerModels[layer.id].tabpanel.filterpanel.expanded \"[layer]=layer></app-filter-panel>\r\n\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'in active': uiLayerModels[layer.id].tabpanel.infopanel.expanded}\">\r\n\t\t\t\t\t\t\t\t<info-panel *ngIf=\"uiLayerModels[layer.id].tabpanel.infopanel.expanded\" [expanded]=\"uiLayerModels[layer.id].tabpanel.infopanel.expanded\" [cswRecords]=layer.cswRecords [layer]=layer ></info-panel>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div class=\"tab-pane fade\" [ngClass]=\"{'in active': uiLayerModels[layer.id].tabpanel.downloadpanel.expanded}\">\r\n\t\t\t\t\t\t\t\t<app-download-panel *ngIf=\"uiLayerModels[layer.id].tabpanel.downloadpanel.expanded\" [layer]=layer></app-download-panel>\r\n\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t</li>\r\n"

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__toppanel_renderstatus_renderstatus_component__ = __webpack_require__("../../../../../src/app/toppanel/renderstatus/renderstatus.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_ui_uilayer_model__ = __webpack_require__("../../../../../src/app/layerpanel/model/ui/uilayer.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_service_openlayermap_renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ngx_bootstrap_modal__ = __webpack_require__("../../../../ngx-bootstrap/modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__layerpanel_infopanel_infopanel_component__ = __webpack_require__("../../../../../src/app/layerpanel/infopanel/infopanel.component.ts");
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
    function LayerPanelComponent(layerHandlerService, renderStatusService, modalService, olMapService) {
        this.layerHandlerService = layerHandlerService;
        this.renderStatusService = renderStatusService;
        this.modalService = modalService;
        this.olMapService = olMapService;
        this.expanded = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* EventEmitter */]();
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
                    var uiLayerModel = new __WEBPACK_IMPORTED_MODULE_6__model_ui_uilayer_model__["a" /* UILayerModel */](_this.layerGroups[key][i].id, _this.renderStatusService.getStatusBSubject(_this.layerGroups[key][i]));
                    _this.uiLayerModels[_this.layerGroups[key][i].id] = uiLayerModel;
                }
            }
            __WEBPACK_IMPORTED_MODULE_2_jquery__(document).ready(function () {
                App.init();
            });
        });
    };
    LayerPanelComponent.prototype.openStatusReport = function (uiLayerModel) {
        var _this = this;
        this.bsModalRef = this.modalService.show(__WEBPACK_IMPORTED_MODULE_4__toppanel_renderstatus_renderstatus_component__["a" /* NgbdModalStatusReportComponent */], { class: 'modal-lg' });
        uiLayerModel.statusMap.getStatusBSubject().subscribe(function (value) {
            _this.bsModalRef.content.resourceMap = value.resourceMap;
        });
    };
    LayerPanelComponent.prototype.removeLayer = function (layer) {
        this.olMapService.removeLayer(layer);
    };
    return LayerPanelComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_9__layerpanel_infopanel_infopanel_component__["a" /* InfoPanelComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_9__layerpanel_infopanel_infopanel_component__["a" /* InfoPanelComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_9__layerpanel_infopanel_infopanel_component__["a" /* InfoPanelComponent */]) === "function" && _a || Object)
], LayerPanelComponent.prototype, "infoPanel", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Output */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* EventEmitter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* EventEmitter */]) === "function" && _b || Object)
], LayerPanelComponent.prototype, "expanded", void 0);
LayerPanelComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
        selector: '[appLayerPanel]',
        template: __webpack_require__("../../../../../src/app/layerpanel/layerpanel.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_service_openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__portal_core_ui_service_openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_8_ngx_bootstrap_modal__["b" /* BsModalService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8_ngx_bootstrap_modal__["b" /* BsModalService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_5__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _f || Object])
], LayerPanelComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=layerpanel.component.js.map

/***/ }),

/***/ "../../../../../src/app/layerpanel/model/ui/uilayer.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uitabpanel_model__ = __webpack_require__("../../../../../src/app/layerpanel/model/ui/uitabpanel.model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UILayerModel; });

var UILayerModel = (function () {
    function UILayerModel(id, loadingSubject) {
        var _this = this;
        this.id = id;
        this.loadingSubject = loadingSubject;
        this.tabpanel = new __WEBPACK_IMPORTED_MODULE_0__uitabpanel_model__["a" /* UITabPanel */]();
        this.expanded = false;
        loadingSubject.subscribe(function (value) {
            _this.statusMap = value;
        });
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('mapElement'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_core__["i" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_core__["i" /* ElementRef */]) === "function" && _a || Object)
], OlMapComponent.prototype, "mapElement", void 0);
OlMapComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["l" /* Component */])({
        selector: 'app-ol-map',
        template: "\n    <div #mapElement id=\"map\" class=\"height-full width-full\"> </div>\n    "
        // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _b || Object])
], OlMapComponent);

var _a, _b;
//# sourceMappingURL=olmap.component.js.map

/***/ }),

/***/ "../../../../../src/app/openlayermap/olmap.zoom.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OlMapZoomComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OlMapZoomComponent = (function () {
    function OlMapZoomComponent(olMapService) {
        this.olMapService = olMapService;
        this.buttonText = 'Magnify';
    }
    OlMapZoomComponent.prototype.zoomClick = function () {
        var _this = this;
        this.buttonText = 'Click on Map';
        this.olMapService.drawBound().subscribe(function (vector) {
            var features = vector.getSource().getFeatures();
            var me = _this;
            // Go through this array and get coordinates of their geometry.
            features.forEach(function (feature) {
                me.buttonText = 'Magnify';
                me.olMapService.fitView(feature.getGeometry().getExtent());
            });
        });
    };
    return OlMapZoomComponent;
}());
OlMapZoomComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["l" /* Component */])({
        selector: 'app-ol-map-zoom',
        template: "\n    <button type=\"button\" class=\"btn btn-sm btn-inverse active\" id=\"map-theme-text\" (click)='zoomClick()'>\n      <span class=\"fa fa-search-plus fa-fw\" aria-hidden=\"true\"></span> {{buttonText}}</button>\n    "
        // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__portal_core_ui_service_openlayermap_ol_map_service__["a" /* OlMapService */]) === "function" && _a || Object])
], OlMapZoomComponent);

var _a;
//# sourceMappingURL=olmap.zoom.component.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/model/data/bbox.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Bbox; });
/**
 * A representation of a bbox
 */
var Bbox = (function () {
    function Bbox() {
    }
    return Bbox;
}());

//# sourceMappingURL=bbox.model.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/model/data/cswrecord.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CSWRecordModel; });
/**
 * A representation of a csw record
 */
var CSWRecordModel = (function () {
    function CSWRecordModel() {
        this.expanded = false;
    }
    return CSWRecordModel;
}());

//# sourceMappingURL=cswrecord.model.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/model/data/layer.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayerModel; });
/**
 * A representation of a layer
 */
var LayerModel = (function () {
    function LayerModel() {
    }
    return LayerModel;
}());

//# sourceMappingURL=layer.model.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/model/data/statusmap.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_BehaviorSubject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatusMapModel; });

/**
 * A representation of the current rendering status of a layer. User should not be directly accessing these under
 * normal circumstances. Use RenderStatusService instead which provides a wrapper to get these updates
 */
var StatusMapModel = (function () {
    function StatusMapModel(layerid) {
        this._statusMap = new __WEBPACK_IMPORTED_MODULE_0_rxjs_BehaviorSubject__["BehaviorSubject"](this);
        this.layerid = layerid;
        this.completed = 0;
        this.total = 0;
        this.resourceMap = {};
        this.renderComplete = false;
        this.renderStarted = false;
        this.containsError = false;
    }
    /**
     * Add resource to the counter and update its status
     * @param onlineresource  online resource that is being loaded now
     */
    StatusMapModel.prototype.updateTotal = function (onlineresource) {
        if (!this.resourceMap[onlineresource.url]) {
            this.resourceMap[onlineresource.url] = {};
        }
        this.resourceMap[onlineresource.url].status = 'Loading...';
        if (!this.resourceMap[onlineresource.url].total) {
            this.resourceMap[onlineresource.url].total = 0;
        }
        this.resourceMap[onlineresource.url].total += 1;
        this.total += 1;
        this.renderStarted = true;
        this._statusMap.next(this);
    };
    /**
    * Add resource to the counter and update its status
    * @param onlineresource  online resource that is being loaded now
    */
    StatusMapModel.prototype.skip = function (onlineresource) {
        if (!this.resourceMap[onlineresource.url]) {
            this.resourceMap[onlineresource.url] = {};
        }
        this.resourceMap[onlineresource.url].status = 'Skipped';
        this._statusMap.next(this);
    };
    /**
     * update the counter for each completed job
     * @param onlineresource  online resource that is being updated
     * @param error? a optional parameter to flag there was an error in the download of the resource.
     */
    StatusMapModel.prototype.updateComplete = function (onlineresource, error) {
        this.completed += 1;
        if (!this.resourceMap[onlineresource.url].completed) {
            this.resourceMap[onlineresource.url].completed = 0;
        }
        this.resourceMap[onlineresource.url].completed += 1;
        this.completePercentage = Math.floor(this.completed / this.total * 100) + '%';
        if (error) {
            this.resourceMap[onlineresource.url].status = 'Error';
            this.containsError = true;
        }
        if (this.resourceMap[onlineresource.url].total === this.resourceMap[onlineresource.url].completed) {
            if (this.resourceMap[onlineresource.url].status !== 'Error') {
                this.resourceMap[onlineresource.url].status = 'Complete';
            }
        }
        if (this.completed === this.total) {
            this.renderComplete = true;
            this._statusMap.next(this);
        }
    };
    StatusMapModel.prototype.getStatusBSubject = function () {
        return this._statusMap;
    };
    StatusMapModel.prototype.resetStatus = function () {
        this.completed = 0;
        this.total = 0;
        this.resourceMap = {};
        this.renderComplete = false;
        this.renderStarted = false;
        this.containsError = false;
        this._statusMap.next(this);
    };
    return StatusMapModel;
}());

//# sourceMappingURL=statusmap.model.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/portal-core.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__uiutilities_pipes__ = __webpack_require__("../../../../../src/app/portal-core-ui/uiutilities/pipes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_filterpanel_filterpanel_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/filterpanel/filterpanel-service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_openlayermap_ol_map_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_openlayermap_renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_wfs_download_download_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/download/download-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_wms_ol_wms_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_wfs_ol_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utility_gmlparser_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/gmlparser.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_wms_legend_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/legend.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_toppanel_notification_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/toppanel/notification.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__uiutilities_imgloading_directive__ = __webpack_require__("../../../../../src/app/portal-core-ui/uiutilities/imgloading.directive.ts");
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


// Utilities

// Services











// Directives

var PortalCoreModule = (function () {
    function PortalCoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    return PortalCoreModule;
}());
PortalCoreModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__uiutilities_pipes__["a" /* KeysPipe */],
            __WEBPACK_IMPORTED_MODULE_14__uiutilities_imgloading_directive__["a" /* ImgLoadingDirective */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClientModule */]
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_2__uiutilities_pipes__["a" /* KeysPipe */], __WEBPACK_IMPORTED_MODULE_14__uiutilities_imgloading_directive__["a" /* ImgLoadingDirective */]],
        providers: [__WEBPACK_IMPORTED_MODULE_3__service_cswrecords_layer_handler_service__["a" /* LayerHandlerService */],
            __WEBPACK_IMPORTED_MODULE_6__service_openlayermap_ol_map_service__["a" /* OlMapService */],
            __WEBPACK_IMPORTED_MODULE_9__service_wms_ol_wms_service__["a" /* OlWMSService */],
            __WEBPACK_IMPORTED_MODULE_5__service_openlayermap_ol_map_object__["a" /* OlMapObject */],
            __WEBPACK_IMPORTED_MODULE_10__service_wfs_ol_wfs_service__["a" /* OlWFSService */],
            __WEBPACK_IMPORTED_MODULE_8__service_wfs_download_download_wfs_service__["a" /* DownloadWfsService */],
            __WEBPACK_IMPORTED_MODULE_11__utility_gmlparser_service__["a" /* GMLParserService */],
            __WEBPACK_IMPORTED_MODULE_7__service_openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */],
            __WEBPACK_IMPORTED_MODULE_4__service_filterpanel_filterpanel_service__["a" /* FilterPanelService */],
            __WEBPACK_IMPORTED_MODULE_12__service_wms_legend_service__["a" /* LegendService */],
            __WEBPACK_IMPORTED_MODULE_14__uiutilities_imgloading_directive__["a" /* ImgLoadingDirective */],
            __WEBPACK_IMPORTED_MODULE_13__service_toppanel_notification_service__["a" /* NotificationService */]
        ]
    }),
    __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["s" /* Optional */])()), __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* SkipSelf */])()),
    __metadata("design:paramtypes", [PortalCoreModule])
], PortalCoreModule);

//# sourceMappingURL=portal-core.module.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
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





/**
 * Service class to handle jobs relating to getting csw records from the server
 *
 */
var LayerHandlerService = (function () {
    function LayerHandlerService(http) {
        this.http = http;
        this.layerRecord = [];
    }
    /**
     * Retrive csw records from the service and organize them by group
     */
    LayerHandlerService.prototype.getLayerRecord = function () {
        var me = this;
        if (this.layerRecord.length > 0) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.layerRecord);
        }
        else {
            return this.http.get(__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].getCSWRecordUrl)
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
    /**
     * Check if layer contains wms records
     * @param layer the layer to query for wms records
     * @return true if wms resource exists
     */
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
    /**
      * Search and retrieve only wms records
      * @param layer the layer to query for wms records
      */
    LayerHandlerService.prototype.getWMSResource = function (layer) {
        return this.getOnlineResources(layer, 'WMS');
    };
    /**
     * Check if layer contains wfs records
     * @param layer the layer to query for wfs records
     * @return true if wfs resource exists
     */
    LayerHandlerService.prototype.containsWFS = function (layer) {
        var cswRecords = layer.cswRecords;
        for (var _i = 0, cswRecords_2 = cswRecords; _i < cswRecords_2.length; _i++) {
            var cswRecord = cswRecords_2[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (onlineResource.type === 'WFS') {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Search and retrieve only wfs records
     * @param layer the layer to query for wfs records
     */
    LayerHandlerService.prototype.getWFSResource = function (layer) {
        return this.getOnlineResources(layer, 'WFS');
    };
    /**
      * Extract resources based on the type. If type is not defined, return all the resource
      * @method getOnlineResources
      * @param layer - the layer we would like to extract onlineResource from
      * @param resourceType - OPTIONAL a enum of the resource type. The ENUM constant is defined on app.js
      * @return resources - an array of the resource. empty array if none is found
      */
    LayerHandlerService.prototype.getOnlineResources = function (layer, resourceType) {
        var cswRecords = layer.cswRecords;
        var onlineResourceResult = [];
        var uniqueURLSet = new Set();
        for (var _i = 0, cswRecords_3 = cswRecords; _i < cswRecords_3.length; _i++) {
            var cswRecord = cswRecords_3[_i];
            for (var _a = 0, _b = cswRecord.onlineResources; _a < _b.length; _a++) {
                var onlineResource = _b[_a];
                if (resourceType && onlineResource.type === resourceType) {
                    if (!uniqueURLSet.has(onlineResource.url)) {
                        onlineResourceResult.push(onlineResource);
                        uniqueURLSet.add(onlineResource.url);
                    }
                }
                else if (!resourceType) {
                    if (!uniqueURLSet.has(onlineResource.url)) {
                        onlineResourceResult.push(onlineResource);
                        uniqueURLSet.add(onlineResource.url);
                    }
                }
            }
        }
        return onlineResourceResult;
    };
    /**
      * Extract resources based on the type. If type is not defined, return all the resource
      * @method getOnlineResources
      * @param layer - the layer we would like to extract onlineResource from
      * @param resourceType - OPTIONAL a enum of the resource type. The ENUM constant is defined on app.js
      * @return resources - an array of the resource. empty array if none is found
      */
    LayerHandlerService.prototype.getOnlineResourcesFromCSW = function (cswRecord, resourceType) {
        var onlineResourceResult = [];
        var uniqueURLSet = new Set();
        for (var _i = 0, _a = cswRecord.onlineResources; _i < _a.length; _i++) {
            var onlineResource = _a[_i];
            if (resourceType && onlineResource.type === resourceType) {
                if (!uniqueURLSet.has(onlineResource.url)) {
                    onlineResourceResult.push(onlineResource);
                    uniqueURLSet.add(onlineResource.url);
                }
            }
            else if (!resourceType) {
                if (!uniqueURLSet.has(onlineResource.url)) {
                    onlineResourceResult.push(onlineResource);
                    uniqueURLSet.add(onlineResource.url);
                }
            }
        }
        return onlineResourceResult;
    };
    return LayerHandlerService;
}());
LayerHandlerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], LayerHandlerService);

var _a;
//# sourceMappingURL=layer-handler.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/filterpanel/filterpanel-service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPanelService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Service class to handle jobs relating to getting csw records from the server
 *
 */
var FilterPanelService = (function () {
    function FilterPanelService(http) {
        this.http = http;
    }
    /**
     * Helper service to retrieve remote options for the filter options
     */
    FilterPanelService.prototype.getFilterRemoteParam = function (url) {
        switch (url) {
            case '../getAllCommodities.do':
                return this.getCommodity(url);
            default:
                return null;
        }
    };
    /**
     * Helper service to retrieve commodities options for the filter panel
     */
    FilterPanelService.prototype.getCommodity = function (url) {
        return this.http.get(url)
            .map(function (response) {
            var data = response['data'];
            var result = [];
            data.forEach(function (item, i, ar) {
                result.push({
                    key: item[1],
                    value: item[0]
                });
            });
            return result;
        });
    };
    return FilterPanelService;
}());
FilterPanelService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], FilterPanelService);

var _a;
//# sourceMappingURL=filterpanel-service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ol_map__ = __webpack_require__("../../../../ol/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ol_layer_tile__ = __webpack_require__("../../../../ol/layer/tile.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ol_source_osm__ = __webpack_require__("../../../../ol/source/osm.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ol_view__ = __webpack_require__("../../../../ol/view.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ol_source_vector__ = __webpack_require__("../../../../ol/source/vector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ol_layer_vector__ = __webpack_require__("../../../../ol/layer/vector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ol_control_MousePosition__ = __webpack_require__("../../../../ol/control/MousePosition.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ol_coordinate__ = __webpack_require__("../../../../ol/coordinate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ol_interaction_draw__ = __webpack_require__("../../../../ol/interaction/draw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ol_control__ = __webpack_require__("../../../../ol/control.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_rxjs_BehaviorSubject__);
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














/**
 * A wrapper around the openlayer object for use in the portal.
 */
var OlMapObject = (function () {
    function OlMapObject(renderStatusService) {
        this.renderStatusService = renderStatusService;
        var mousePositionControl = new __WEBPACK_IMPORTED_MODULE_9_ol_control_MousePosition__["a" /* default */]({
            coordinateFormat: __WEBPACK_IMPORTED_MODULE_10_ol_coordinate__["a" /* default */].createStringXY(4),
            projection: 'EPSG:4326',
            target: document.getElementById('mouse-position'),
            undefinedHTML: 'Mouse out of range'
        });
        var osm_layer = new __WEBPACK_IMPORTED_MODULE_4_ol_layer_tile__["a" /* default */]({
            source: new __WEBPACK_IMPORTED_MODULE_5_ol_source_osm__["a" /* default */]()
        });
        this.activeLayer = {};
        this.map = new __WEBPACK_IMPORTED_MODULE_3_ol_map__["a" /* default */]({
            controls: __WEBPACK_IMPORTED_MODULE_12_ol_control__["a" /* default */].defaults({
                attributionOptions: ({
                    collapsible: false
                })
            }).extend([mousePositionControl]),
            layers: [osm_layer],
            view: new __WEBPACK_IMPORTED_MODULE_6_ol_view__["a" /* default */]({
                center: __WEBPACK_IMPORTED_MODULE_1__utility_constants_service__["a" /* Constants */].CENTRE_COORD,
                zoom: 4
            })
        });
    }
    /**
     * returns an instance of the ol map
     */
    OlMapObject.prototype.getMap = function () {
        return this.map;
    };
    /**
     * Add a ol layer to the ol map. At the same time keep a reference map of the layers
     * @param layer: the ol layer to add to map
     * @param id the layer id is used
     */
    OlMapObject.prototype.addLayerById = function (layer, id) {
        if (!this.activeLayer[id]) {
            this.activeLayer[id] = [];
        }
        this.activeLayer[id].push(layer);
        this.map.addLayer(layer);
    };
    /**
     * retrieve references to the layer by layer name.
     * @param id the layer id is used
     * @return the ol layer
     */
    OlMapObject.prototype.getLayerById = function (id) {
        return this.activeLayer[id];
    };
    /**
     * remove references to the layer by layer id.
     * @param id the layer id is used
     */
    OlMapObject.prototype.removeLayerById = function (id) {
        var _this = this;
        var activelayers = this.getLayerById(id);
        if (activelayers) {
            activelayers.forEach(function (layer) {
                _this.map.removeLayer(layer);
            });
            this.renderStatusService.resetLayer(id);
        }
    };
    OlMapObject.prototype.drawBox = function () {
        var source = new __WEBPACK_IMPORTED_MODULE_7_ol_source_vector__["a" /* default */]({ wrapX: false });
        var vector = new __WEBPACK_IMPORTED_MODULE_8_ol_layer_vector__["a" /* default */]({
            source: source
        });
        var vectorBS = new __WEBPACK_IMPORTED_MODULE_13_rxjs_BehaviorSubject__["BehaviorSubject"](vector);
        this.map.addLayer(vector);
        var draw = new __WEBPACK_IMPORTED_MODULE_11_ol_interaction_draw__["a" /* default */]({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ ('Circle'),
            geometryFunction: __WEBPACK_IMPORTED_MODULE_11_ol_interaction_draw__["a" /* default */].createBox()
        });
        var me = this;
        draw.on('drawend', function () {
            me.map.removeInteraction(draw);
            setTimeout(function () {
                me.map.removeLayer(vector);
                vectorBS.next(vector);
            }, 500);
        });
        this.map.addInteraction(draw);
        return vectorBS;
    };
    return OlMapObject;
}());
OlMapObject = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__renderstatus_render_status_service__["a" /* RenderStatusService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__renderstatus_render_status_service__["a" /* RenderStatusService */]) === "function" && _a || Object])
], OlMapObject);

var _a;
//# sourceMappingURL=ol-map-object.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/openlayermap/ol-map.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__wms_ol_wms_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts");
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





/**
 * Wrapper class to provide all things related to the ol map such as adding layer or removing layer.
 */
var OlMapService = (function () {
    function OlMapService(layerHandlerService, olWMSService, olWFSService, olMapObject) {
        this.layerHandlerService = layerHandlerService;
        this.olWMSService = olWMSService;
        this.olWFSService = olWFSService;
        this.olMapObject = olMapObject;
    }
    /**
     * Add layer to the wms
     * @param layer the layer to add to the map
     */
    OlMapService.prototype.addLayer = function (layer, param) {
        this.olMapObject.removeLayerById(layer.id);
        if (this.layerHandlerService.containsWMS(layer)) {
            this.olWMSService.addLayer(layer, param);
        }
        else if (this.layerHandlerService.containsWFS(layer)) {
            this.olWFSService.addLayer(layer, param);
        }
    };
    /**
     * Remove layer from map
     * @param layer the layer to remove from the map
     */
    OlMapService.prototype.removeLayer = function (layer) {
        this.olMapObject.removeLayerById(layer.id);
    };
    /**
     * Fit the map to the extent that is provided
     * @param extent An array of numbers representing an extent: [minx, miny, maxx, maxy]
     */
    OlMapService.prototype.fitView = function (extent) {
        this.olMapObject.getMap().getView().fit(extent);
    };
    /**
     * DrawBound
     */
    OlMapService.prototype.drawBound = function () {
        return this.olMapObject.drawBox();
    };
    return OlMapService;
}());
OlMapService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__wms_ol_wms_service__["a" /* OlWMSService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__wms_ol_wms_service__["a" /* OlWMSService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__["a" /* OlWFSService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__wfs_ol_wfs_service__["a" /* OlWFSService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ol_map_object__["a" /* OlMapObject */]) === "function" && _d || Object])
], OlMapService);

var _a, _b, _c, _d;
//# sourceMappingURL=ol-map.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_data_statusmap_model__ = __webpack_require__("../../../../../src/app/portal-core-ui/model/data/statusmap.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderStatusService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Service class to query for current layer loading status
 */
var RenderStatusService = (function () {
    function RenderStatusService() {
        this.statusmaps = {};
    }
    /**
     * Increment the counter when a layer is added. This will also add meta information about the resource to the
     * status map. This should automatically be called from the wfs and wms render service and there should be no reason for user
     * to call this function directly under normal circumstances
     * @param layer the layer that is being render
     * @param resource the resource from the layer that is being added.
     */
    RenderStatusService.prototype.addResource = function (layer, resource) {
        if (!this.statusmaps[layer.id]) {
            this.statusmaps[layer.id] = new __WEBPACK_IMPORTED_MODULE_0__model_data_statusmap_model__["a" /* StatusMapModel */](layer.id);
        }
        this.statusmaps[layer.id].updateTotal(resource);
    };
    /**
     * Mark the resource to as skip
     * @param layer the layer that to be skipped
     * @param resource the resource from the layer to be skipped
     */
    RenderStatusService.prototype.skip = function (layer, resource) {
        if (!this.statusmaps[layer.id]) {
            this.statusmaps[layer.id] = new __WEBPACK_IMPORTED_MODULE_0__model_data_statusmap_model__["a" /* StatusMapModel */](layer.id);
        }
        this.statusmaps[layer.id].skip(resource);
    };
    /**
     * update the counter when a resource is complete. This will also add meta information about the resource to the
     * status map. This should automatically be called from the wfs and wms render service and there should be no reason for user
     * to call this function directly under normal circumstances
     * @param layer the layer that is being render
     * @param resource the resource from the layer that is being added.
     */
    RenderStatusService.prototype.updateComplete = function (layer, resource, error) {
        this.statusmaps[layer.id].updateComplete(resource, error);
    };
    /**
     * This is the only function required to get updates on the status. simply subscribe to this and any changes will trigger an event.
     * @param layer the layer that is being render
     * @return BehaviorSubject this can then be subscribed to and any updates will trigger a notification.
     */
    RenderStatusService.prototype.getStatusBSubject = function (layer) {
        if (!this.statusmaps[layer.id]) {
            this.statusmaps[layer.id] = new __WEBPACK_IMPORTED_MODULE_0__model_data_statusmap_model__["a" /* StatusMapModel */](layer.id);
        }
        return this.statusmaps[layer.id].getStatusBSubject();
    };
    /**
     * Reset the rendering status of the layer
     * @param layer the layer that is being reset
     */
    RenderStatusService.prototype.resetLayer = function (layerId) {
        this.statusmaps[layerId].resetStatus();
    };
    return RenderStatusService;
}());
RenderStatusService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], RenderStatusService);

//# sourceMappingURL=render-status.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/toppanel/notification.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotificationService = (function () {
    function NotificationService(http) {
        this.http = http;
    }
    NotificationService.prototype.getNotifications = function () {
        return this.http.get('/getNotifications.do')
            .map(function (response) {
            var data = response.json();
            return data;
        })
            .catch(function (error) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error);
        });
    };
    return NotificationService;
}());
NotificationService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], NotificationService);

var _a;
//# sourceMappingURL=notification.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wfs/download/download-wfs.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery__ = __webpack_require__("../../../../jquery/dist/jquery.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DownloadWfsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Use OlMapService to add layer to map. This service class adds wfs layer to the map
 */
var DownloadWfsService = (function () {
    function DownloadWfsService(layerHandlerService, http) {
        this.layerHandlerService = layerHandlerService;
        this.http = http;
    }
    DownloadWfsService.prototype.download = function (layer, bbox) {
        var wfsResources = this.layerHandlerService.getWFSResource(layer);
        var downloadUrl = 'getAllFeaturesInCSV.do';
        if (layer.proxyDownloadUrl && layer.proxyDownloadUrl.length > 0) {
            downloadUrl = layer.proxyDownloadUrl;
        }
        else if (layer.proxyUrl && layer.proxyUrl.length > 0) {
            downloadUrl = layer.proxyUrl;
        }
        var httpParams = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpParams */]();
        httpParams = httpParams.set('outputFormat', 'csv');
        for (var i = 0; i < wfsResources.length; i++) {
            var filterParameters = {
                serviceUrl: wfsResources[i].url,
                typeName: wfsResources[i].name,
                maxFeatures: 5000,
                outputFormat: 'csv',
                bbox: JSON.stringify(bbox)
            };
            var serviceUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].portalBaseUrl + downloadUrl + '?';
            httpParams = httpParams.append('serviceUrls', serviceUrl + __WEBPACK_IMPORTED_MODULE_4_jquery__["param"](filterParameters));
        }
        return this.http.get('../downloadGMLAsZip.do', {
            params: httpParams,
            responseType: 'blob'
        }).map(function (response) {
            return response;
        }).catch(function (error) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].throw(error);
        });
    };
    return DownloadWfsService;
}());
DownloadWfsService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _b || Object])
], DownloadWfsService);

var _a, _b;
//# sourceMappingURL=download-wfs.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wfs/ol-wfs.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ol_geom_point__ = __webpack_require__("../../../../ol/geom/point.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ol_proj__ = __webpack_require__("../../../../ol/proj.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ol_feature__ = __webpack_require__("../../../../ol/feature.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ol_style_style__ = __webpack_require__("../../../../ol/style/style.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ol_style_icon__ = __webpack_require__("../../../../ol/style/icon.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ol_layer_vector__ = __webpack_require__("../../../../ol/layer/vector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ol_source_vector__ = __webpack_require__("../../../../ol/source/vector.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utility_gmlparser_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/gmlparser.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utility_utilities_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/utilities.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__openlayermap_renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
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
















/**
 * Use OlMapService to add layer to map. This service class adds wfs layer to the map
 */
var OlWFSService = (function () {
    function OlWFSService(layerHandlerService, olMapObject, http, gmlParserService, renderStatusService) {
        this.layerHandlerService = layerHandlerService;
        this.olMapObject = olMapObject;
        this.http = http;
        this.gmlParserService = gmlParserService;
        this.renderStatusService = renderStatusService;
        this.map = this.olMapObject.getMap();
    }
    /**
     * A get feature request
     * @param layer the wfs layer for the getfeature request to be made
     * @param onlineresource the wfs online resource
     * @return Observable the observable from the http request
     */
    OlWFSService.prototype.getFeature = function (layer, onlineResource, param) {
        var httpParams = Object.getOwnPropertyNames(param).reduce(function (p, key1) { return p.set(key1, param[key1]); }, new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpParams */]());
        httpParams = httpParams.append('serviceUrl', onlineResource.url);
        httpParams = httpParams.append('typeName', onlineResource.name);
        httpParams = __WEBPACK_IMPORTED_MODULE_14__utility_utilities_service__["a" /* UtilitiesService */].convertObjectToHttpParam(httpParams, param);
        if (layer.proxyUrl) {
            return this.http.get('../' + layer.proxyUrl, {
                params: httpParams
            }).map(function (response) {
                return response['data'];
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_11_rxjs_Rx__["Observable"].create(function () {
                return undefined;
            });
        }
    };
    /**
     * Add geometry type point to the map
     * @param layer the layer where this point derived from
     * @param primitive the point primitive
     */
    OlWFSService.prototype.addPoint = function (layer, primitive) {
        var geom = new __WEBPACK_IMPORTED_MODULE_4_ol_geom_point__["a" /* default */](__WEBPACK_IMPORTED_MODULE_5_ol_proj__["a" /* default */].transform([primitive.coords.lng, primitive.coords.lat], 'EPSG:4326', 'EPSG:3857'));
        var feature = new __WEBPACK_IMPORTED_MODULE_6_ol_feature__["a" /* default */](geom);
        feature.setStyle([
            new __WEBPACK_IMPORTED_MODULE_7_ol_style_style__["a" /* default */]({
                image: new __WEBPACK_IMPORTED_MODULE_8_ol_style_icon__["a" /* default */](({
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
        // VT: we chose the first layer in the array based on the assumption that we only create a single vector
        // layer for each wfs layer. WMS may potentially contain more than 1 layer in the array. note the difference
        this.olMapObject.getLayerById(layer.id)[0].getSource().addFeature(feature);
    };
    OlWFSService.prototype.addLine = function (primitive) {
    };
    OlWFSService.prototype.addPoloygon = function (primitive) {
    };
    /**
     * Add the wfs layer
     * @param the wfs layer to be added to the map
     */
    OlWFSService.prototype.addLayer = function (layer, param) {
        var _this = this;
        var wfsOnlineResources = this.layerHandlerService.getWFSResource(layer);
        // VT: create the vector on the map if it does not exist.
        if (!this.olMapObject.getLayerById(layer.id)) {
            var markerLayer = new __WEBPACK_IMPORTED_MODULE_9_ol_layer_vector__["a" /* default */]({
                source: new __WEBPACK_IMPORTED_MODULE_10_ol_source_vector__["a" /* default */]({ features: [] })
            });
            this.olMapObject.addLayerById(markerLayer, layer.id);
        }
        var _loop_1 = function (onlineResource) {
            if (__WEBPACK_IMPORTED_MODULE_14__utility_utilities_service__["a" /* UtilitiesService */].filterProviderSkip(param.optionalFilters, onlineResource.url)) {
                this_1.renderStatusService.skip(layer, onlineResource);
                return "continue";
            }
            this_1.renderStatusService.addResource(layer, onlineResource);
            var collatedParam = __WEBPACK_IMPORTED_MODULE_14__utility_utilities_service__["a" /* UtilitiesService */].collateParam(layer, onlineResource, param);
            this_1.getFeature(layer, onlineResource, collatedParam).subscribe(function (response) {
                _this.renderStatusService.updateComplete(layer, onlineResource);
                var rootNode = _this.gmlParserService.getRootNode(response.gml);
                var primitives = _this.gmlParserService.makePrimitives(rootNode);
                for (var _i = 0, primitives_1 = primitives; _i < primitives_1.length; _i++) {
                    var primitive = primitives_1[_i];
                    switch (primitive.geometryType) {
                        case __WEBPACK_IMPORTED_MODULE_13__utility_constants_service__["a" /* Constants */].geometryType.POINT:
                            _this.addPoint(layer, primitive);
                            break;
                        case __WEBPACK_IMPORTED_MODULE_13__utility_constants_service__["a" /* Constants */].geometryType.LINESTRING:
                            _this.addLine(primitive);
                            break;
                        case __WEBPACK_IMPORTED_MODULE_13__utility_constants_service__["a" /* Constants */].geometryType.POLYGON:
                            _this.addPoloygon(primitive);
                            break;
                    }
                }
            }, function (err) {
                _this.renderStatusService.updateComplete(layer, onlineResource, true);
            });
        };
        var this_1 = this;
        for (var _i = 0, wfsOnlineResources_1 = wfsOnlineResources; _i < wfsOnlineResources_1.length; _i++) {
            var onlineResource = wfsOnlineResources_1[_i];
            _loop_1(onlineResource);
        }
    };
    OlWFSService.prototype.addCSWRecord = function (cswRecord) {
    };
    return OlWFSService;
}());
OlWFSService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_12__utility_gmlparser_service__["a" /* GMLParserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__utility_gmlparser_service__["a" /* GMLParserService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_15__openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_15__openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */]) === "function" && _e || Object])
], OlWFSService);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=ol-wfs.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wms/legend.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LegendService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LegendService = (function () {
    function LegendService(http) {
        this.http = http;
    }
    /**
     * Fetches legend given url
     * @param styleUrl URL string to get legend from local server
     */
    LegendService.prototype.getLegendStyle = function (styleUrl) {
        var me = this;
        return this.http.get('../' + styleUrl, { responseType: 'text' })
            .do(function (result) { return result; });
    };
    return LegendService;
}());
LegendService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], LegendService);

var _a;
//# sourceMappingURL=legend.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/service/wms/ol-wms.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/cswrecords/layer-handler.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/ol-map-object.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ol_layer_tile__ = __webpack_require__("../../../../ol/layer/tile.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ol_source_tilewms__ = __webpack_require__("../../../../ol/source/tilewms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/constants.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utility_utilities_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/utility/utilities.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__openlayermap_renderstatus_render_status_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/openlayermap/renderstatus/render-status.service.ts");
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










/**
 * Use OlMapService to add layer to map. This service class adds wms layer to the map
 */
var OlWMSService = (function () {
    function OlWMSService(layerHandlerService, olMapObject, http, renderStatusService) {
        this.layerHandlerService = layerHandlerService;
        this.olMapObject = olMapObject;
        this.http = http;
        this.renderStatusService = renderStatusService;
        this.map = this.olMapObject.getMap();
    }
    OlWMSService.prototype.wmsUrlTooLong = function (sldBody) {
        return encodeURIComponent(sldBody).length > __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].WMSMAXURLGET;
    };
    /**
     * get wms 1.3.0 related parameter
     * @param layers the wms layer
     * @param sld_body associated sld_body
     */
    OlWMSService.prototype.getWMS1_3_0param = function (layer, onlineResource, param, sld_body) {
        var params = {
            'LAYERS': onlineResource.name,
            'TILED': true,
            'DISPLAYOUTSIDEMAXEXTENT': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'VERSION': '1.3.0',
            'WIDTH': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE,
            'HEIGHT': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE
        };
        if (sld_body && !this.wmsUrlTooLong(sld_body)) {
            params['sld_body'] = sld_body;
        }
        else if (sld_body && this.wmsUrlTooLong(sld_body)) {
            params['sldUrl'] = this.getSldUrl(layer, onlineResource, param);
        }
        return params;
    };
    /**
     * get wms 1.1.0 related parameter
     * @param layers the wms layer
     * @param sld_body associated sld_body
     */
    OlWMSService.prototype.getWMS1_1param = function (layer, onlineResource, param, sld_body) {
        var params = {
            'LAYERS': onlineResource.name,
            'TILED': true,
            'DISPLAYOUTSIDEMAXEXTENT': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'VERSION': '1.1.1',
            'WIDTH': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE,
            'HEIGHT': __WEBPACK_IMPORTED_MODULE_7__utility_constants_service__["a" /* Constants */].TILE_SIZE
        };
        if (sld_body && !this.wmsUrlTooLong(sld_body)) {
            params['sld_body'] = sld_body;
        }
        else if (sld_body && this.wmsUrlTooLong(sld_body)) {
            params['sldUrl'] = this.getSldUrl(layer, onlineResource, param);
        }
        return params;
    };
    /**
     * get the sld from the url
     * @param sldUrl the url containing the sld
     * @return a observable of the http request
     */
    OlWMSService.prototype.getSldBody = function (sldUrl, param) {
        if (!sldUrl) {
            return __WEBPACK_IMPORTED_MODULE_6_rxjs_Rx__["Observable"].create(function (observer) {
                observer.next(null);
                observer.complete();
            });
        }
        var httpParams = Object.getOwnPropertyNames(param).reduce(function (p, key1) { return p.set(key1, param[key1]); }, new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpParams */]());
        httpParams = __WEBPACK_IMPORTED_MODULE_8__utility_utilities_service__["a" /* UtilitiesService */].convertObjectToHttpParam(httpParams, param);
        return this.http.get('../' + sldUrl, {
            responseType: 'text',
            params: httpParams
        }).map(function (response) {
            return response;
        });
    };
    /**
       * Get the wms style url if proxyStyleUrl is valid
       * @method getWMSStyleUrl
       * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
       * @param onlineResource - the onlineResource of the layer we are rendering
       * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.Used in capdf
       * @return url - getUrl to retrieve sld
       */
    OlWMSService.prototype.getSldUrl = function (layer, onlineResource, param) {
        if (layer.proxyStyleUrl) {
            return '/' + layer.proxyStyleUrl + '?' + $.param(param);
        }
        else {
            return null;
        }
    };
    ;
    /**
     * Add a wms layer to the map
     * @param layer the wms layer to add to the map.
     */
    OlWMSService.prototype.addLayer = function (layer, param) {
        var _this = this;
        if (!param) {
            param = {};
        }
        var wmsOnlineResources = this.layerHandlerService.getWMSResource(layer);
        var _loop_1 = function (wmsOnlineResource) {
            if (__WEBPACK_IMPORTED_MODULE_8__utility_utilities_service__["a" /* UtilitiesService */].filterProviderSkip(param.optionalFilters, wmsOnlineResource.url)) {
                this_1.renderStatusService.skip(layer, wmsOnlineResource);
                return "continue";
            }
            var collatedParam = __WEBPACK_IMPORTED_MODULE_8__utility_utilities_service__["a" /* UtilitiesService */].collateParam(layer, wmsOnlineResource, param);
            this_1.getSldBody(layer.proxyStyleUrl, collatedParam).subscribe(function (response) {
                var me = _this;
                var params = wmsOnlineResource.version.startsWith('1.3') ?
                    _this.getWMS1_3_0param(layer, wmsOnlineResource, collatedParam, response) :
                    _this.getWMS1_1param(layer, wmsOnlineResource, collatedParam, response);
                var wmsTile;
                if (_this.wmsUrlTooLong(response)) {
                    wmsTile = new __WEBPACK_IMPORTED_MODULE_4_ol_layer_tile__["a" /* default */]({
                        extent: _this.map.getView().calculateExtent(_this.map.getSize()),
                        source: new __WEBPACK_IMPORTED_MODULE_5_ol_source_tilewms__["a" /* default */]({
                            url: wmsOnlineResource.url,
                            params: params,
                            serverType: 'geoserver',
                            projection: 'EPSG:4326',
                            tileLoadFunction: function (image, src) {
                                me.imagePostFunction(image, src);
                            }
                        })
                    });
                }
                else {
                    wmsTile = new __WEBPACK_IMPORTED_MODULE_4_ol_layer_tile__["a" /* default */]({
                        extent: _this.map.getView().calculateExtent(_this.map.getSize()),
                        source: new __WEBPACK_IMPORTED_MODULE_5_ol_source_tilewms__["a" /* default */]({
                            url: wmsOnlineResource.url,
                            params: params,
                            serverType: 'geoserver',
                            projection: 'EPSG:4326'
                        })
                    });
                }
                wmsTile.getSource().on('tileloadstart', function (event) {
                    me.renderStatusService.addResource(layer, wmsOnlineResource);
                });
                wmsTile.getSource().on('tileloadend', function (event) {
                    me.renderStatusService.updateComplete(layer, wmsOnlineResource);
                });
                wmsTile.getSource().on('tileloaderror', function (event) {
                    me.renderStatusService.updateComplete(layer, wmsOnlineResource, true);
                });
                _this.olMapObject.addLayerById(wmsTile, layer.id);
            });
        };
        var this_1 = this;
        for (var _i = 0, wmsOnlineResources_1 = wmsOnlineResources; _i < wmsOnlineResources_1.length; _i++) {
            var wmsOnlineResource = wmsOnlineResources_1[_i];
            _loop_1(wmsOnlineResource);
        }
    };
    OlWMSService.prototype.imagePostFunction = function (image, src) {
        var img = image.getImage();
        var dataEntries = src.split('&');
        var url = '../getWMSMapViaProxy.do?';
        var params = {};
        for (var i = 0; i < dataEntries.length; i++) {
            if (i === 0) {
                params['url'] = dataEntries[i];
            }
            else {
                if (dataEntries[i].toLowerCase().indexOf('layers') >= 0) {
                    params['layer'] = decodeURIComponent(dataEntries[i].split('=')[1]);
                }
                if (dataEntries[i].toLowerCase().indexOf('bbox') >= 0) {
                    params['bbox'] = decodeURIComponent(dataEntries[i].split('=')[1]);
                }
                if (dataEntries[i].toLowerCase().indexOf('sldurl') >= 0) {
                    params['sldUrl'] = decodeURIComponent(dataEntries[i].split('=')[1]);
                }
                if (dataEntries[i].toLowerCase().indexOf('version') >= 0) {
                    params['version'] = decodeURIComponent(dataEntries[i].split('=')[1]);
                }
                if (dataEntries[i].toLowerCase().indexOf('crs') === 0 || dataEntries[i].toLowerCase().indexOf('srs') === 0) {
                    params['crs'] = decodeURIComponent(dataEntries[i].split('=')[1]);
                }
            }
        }
        img.src = url + $.param(params);
    };
    OlWMSService.prototype.addCSWRecord = function (cswRecord) {
    };
    return OlWMSService;
}());
OlWMSService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__cswrecords_layer_handler_service__["a" /* LayerHandlerService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__openlayermap_ol_map_object__["a" /* OlMapObject */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_9__openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_9__openlayermap_renderstatus_render_status_service__["a" /* RenderStatusService */]) === "function" && _d || Object])
], OlWMSService);

var _a, _b, _c, _d;
//# sourceMappingURL=ol-wms.service.js.map

/***/ }),

/***/ "../../../../../src/app/portal-core-ui/uiutilities/imgloading.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImgLoadingDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/** This directive adds a spinner image to the background of an <img> tag.
 The spinner will disappear once the image is loaded or an error occurs.
 NOTO BENE: This directive modifies the 'style' attribute of the <img>.
 */
var ImgLoadingDirective = (function () {
    /**
      * Gets called at the start, adds a spinner to the loading image
      */
    function ImgLoadingDirective(el) {
        this.el = el;
        el.nativeElement.setAttribute('style', 'background: transparent url(template/framework/slick/ajax-loader.gif) no-repeat scroll center');
    }
    /**
     * Gets called when image has loaded, it removes the spinner
     */
    ImgLoadingDirective.prototype.onImageLoad = function () {
        this.el.nativeElement.removeAttribute('style');
    };
    /**
     * Gets called when image fails to load, it removes the spinner and adds a brief error message
     */
    ImgLoadingDirective.prototype.onImageError = function () {
        this.el.nativeElement.removeAttribute('style');
        this.el.nativeElement.setAttribute('alt', 'Image not found');
    };
    return ImgLoadingDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* HostListener */])('load'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImgLoadingDirective.prototype, "onImageLoad", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* HostListener */])('error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImgLoadingDirective.prototype, "onImageError", null);
ImgLoadingDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Directive */])({ selector: '[appImgLoading]' }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ElementRef */]) === "function" && _a || Object])
], ImgLoadingDirective);

var _a;
//# sourceMappingURL=imgloading.directive.js.map

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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Pipe */])({ name: 'getKey' })
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

/**
 * Constances
 */
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
Constants.WMSMAXURLGET = 2000;
Constants.SLDURL = 'http://portal.auscope.org/portal/';
// Centre of Australia in EPSG:3857
Constants.CENTRE_COORD = [14793316.706200, -2974317.644633];
Constants = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])()
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
/**
 * Port over from old portal-core extjs for dealing with xml in wfs
 */
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])()
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


/**
 * Port over from old portal-core extjs for dealing with xml in wfs
 */
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])()
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

/**
 * Port over from old portal-core extjs for dealing with xml in wfs
 */
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
     * Retrieve the key of a object
     * @method getKey
     * @param obj - the object to query
     * @return string - the key of the object
     */
    UtilitiesService.getKey = function (options) {
        return Object.keys(options)[0];
    };
    ;
    /**
     * Retrieve the first value of a object
     * @method getValue
     * @param obj - the object to query
     * @return string - the key of the object
     */
    UtilitiesService.getValue = function (options) {
        for (var key in options) {
            return options[key];
        }
    };
    ;
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
    /**
     * This utility will collate the different type of filter into a single parameter object
     */
    UtilitiesService.collateParam = function (layer, onlineResource, param) {
        if (!param) {
            param = {};
        }
        // VT: hiddenParams- this is to append any fix parameter mainly for legacy reason in NVCL layer to set onlyHylogger to true
        if (layer.filterCollection) {
            var hiddenParams = [];
            if (layer.filterCollection.hiddenParams) {
                hiddenParams = layer.filterCollection.hiddenParams;
            }
            for (var idx in hiddenParams) {
                if (hiddenParams[idx].type === 'MANDATORY.UIHiddenResourceAttribute') {
                    param[hiddenParams[idx].parameter] = onlineResource[hiddenParams[idx].attribute];
                }
                else {
                    param[hiddenParams[idx].parameter] = hiddenParams[idx].value;
                }
            }
            // VT: mandatoryFilters
            var mandatoryFilters = [];
            if (layer.filterCollection.mandatoryFilters) {
                mandatoryFilters = layer.filterCollection.mandatoryFilters;
            }
            for (var idx in mandatoryFilters) {
                param[mandatoryFilters[idx].parameter] = mandatoryFilters[idx].value;
            }
        }
        return param;
    };
    ;
    UtilitiesService.convertObjectToHttpParam = function (httpParam, paramObject, mykey) {
        // https://github.com/angular/angular/pull/18490 (this is needed to parse object into parameter
        for (var i = 0; i < paramObject['optionalFilters'].length; i++) {
            if (i === 0) {
                httpParam = httpParam.set('optionalFilters', JSON.stringify(paramObject['optionalFilters'][i]));
            }
            else {
                httpParam = httpParam.set('optionalFilters', JSON.stringify(paramObject['optionalFilters'][i]));
            }
        }
        return httpParam;
    };
    return UtilitiesService;
}());
// private property
UtilitiesService._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
UtilitiesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])()
], UtilitiesService);

//# sourceMappingURL=utilities.service.js.map

/***/ }),

/***/ "../../../../../src/app/toppanel/notification/notification.component.html":
/***/ (function(module, exports) {

module.exports = "\r\n<a href=\"javascript:;\" data-toggle=\"dropdown\" class=\"dropdown-toggle navbar-icon with-label\">\r\n    <i class=\"ti-bell\"></i>\r\n  </a>\r\n<div class=\"dropdown-menu dropdown-lg no-padding\">\r\n  <a class=\"twitter-timeline\" href=\"https://twitter.com/Lingbo_Jiang\">Tweets by Auscope-maintennace</a>\r\n</div>\r\n\r\n<!--\r\n<a href=\"javascript:;\" data-toggle=\"dropdown\" class=\"dropdown-toggle navbar-icon with-label\" (click)=\"onGetNotifications()\">\r\n    <i class=\"ti-bell\"></i>\r\n  </a>\r\n<ul class=\"dropdown-menu dropdown-lg no-padding\">\r\n  <li class=\"notification\" *ngFor=\"let  notification of notifications; let i = index\">\r\n    <a href=\"#\">\r\n      <div class=\"notification-icon bg-primary\">\r\n        <i class=\"ti-apple\"></i>\r\n      </div>\r\n      <div class=\"notification-info\">\r\n        <h4 class=\"notification-title\">{{notification.author}}\r\n          <span class=\"notification-time\">{{notification.time | date:'medium'}}</span>\r\n        </h4>\r\n        <p class=\"notification-desc\">{{notification.content}} </p>\r\n      </div>\r\n    </a>\r\n  </li>\r\n</ul>\r\n-->\r\n"

/***/ }),

/***/ "../../../../../src/app/toppanel/notification/notification.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_toppanel_notification_service__ = __webpack_require__("../../../../../src/app/portal-core-ui/service/toppanel/notification.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NotificationComponent = (function () {
    function NotificationComponent(notificationService) {
        this.notificationService = notificationService;
    }
    NotificationComponent.prototype.onGetNotifications = function () {
        var _this = this;
        this.notificationService.getNotifications()
            .subscribe(function (data) { _this.notifications = data['data']; }, function (error) { console.log('Error with retrieving notification!'); });
    };
    return NotificationComponent;
}());
NotificationComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
        selector: '[app-notification]',
        template: __webpack_require__("../../../../../src/app/toppanel/notification/notification.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_toppanel_notification_service__["a" /* NotificationService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__portal_core_ui_service_toppanel_notification_service__["a" /* NotificationService */]) === "function" && _a || Object])
], NotificationComponent);

var _a;
//# sourceMappingURL=notification.component.js.map

/***/ }),

/***/ "../../../../../src/app/toppanel/renderstatus/renderstatus.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-body\">      \r\n  <div class=\"panel panel-default panel-with-tabs\">\r\n      <!-- BEGIN panel-heading -->\r\n      <div class=\"panel-heading\">         \r\n          <h4 class=\"panel-title\">Status report</h4>\r\n      </div>\r\n     \t<div class=\"panel-body\">  \t\t\t\r\n\t\t\t<table class=\"table m-b-0\">\r\n\t\t\t\t<thead>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<th>URL</th>\r\n\t\t\t\t\t\t<th>Status</th>\t\t\t\t\t\t\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t\t<tr *ngFor=\"let resourceStatus of resourceMap | getKey\">\r\n\t\t\t\t\t\t<td class=\"content-break-word\">{{resourceStatus.key}}</td>\r\n\t\t\t\t\t\t<td>{{resourceStatus.value.status}}</td>\t\t\t\t\t\t\r\n\t\t\t\t\t</tr>\t\t\t\t\t\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n  </div>\r\n</div>\r\n<div class=\"modal-footer\">\r\n  <button type=\"button\" class=\"btn btn-default\" (click)=\"bsModalRef.hide()\">Close</button>\r\n  <button type=\"button\" class=\"btn btn-primary\">Save changes</button>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/toppanel/renderstatus/renderstatus.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ngx_bootstrap_modal_modal_options_class__ = __webpack_require__("../../../../ngx-bootstrap/modal/modal-options.class.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NgbdModalStatusReportComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NgbdModalStatusReportComponent = (function () {
    function NgbdModalStatusReportComponent(bsModalRef) {
        this.bsModalRef = bsModalRef;
    }
    return NgbdModalStatusReportComponent;
}());
NgbdModalStatusReportComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
        selector: 'ngbd-modal-status-report',
        template: __webpack_require__("../../../../../src/app/toppanel/renderstatus/renderstatus.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ngx_bootstrap_modal_modal_options_class__["c" /* BsModalRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ngx_bootstrap_modal_modal_options_class__["c" /* BsModalRef */]) === "function" && _a || Object])
], NgbdModalStatusReportComponent);

var _a;
//# sourceMappingURL=renderstatus.component.js.map

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
    production: false,
    getCSWRecordUrl: '../getKnownLayers.do',
    portalBaseUrl: 'http://localhost:8080/AuScope-Portal/',
    csvSupportedLayer: [
        'mineral-tenements',
        'tima-geosample',
        'nvcl-v2-borehole',
        'tima-shrimp-geosample'
    ]
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