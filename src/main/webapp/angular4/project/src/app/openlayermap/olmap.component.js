"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
        var osm_layer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        // note that the target cannot be set here!
        this.map = new ol.Map({
            layers: [osm_layer],
            view: new ol.View({
                center: ol.proj.transform([-12, 133], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4
            })
        });
    }
    // After view init the map target can be set!
    AppComponent.prototype.ngAfterViewInit = function () {
        this.map.setTarget(this.mapElement.nativeElement.id);
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild("mapElement")
], AppComponent.prototype, "mapElement");
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n    <h3> The map </h3>\n    <div #mapElement id=\"map\" class=\"map\"> </div> \n    "
        // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
    })
], AppComponent);
exports.AppComponent = AppComponent;
/*import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}*/
