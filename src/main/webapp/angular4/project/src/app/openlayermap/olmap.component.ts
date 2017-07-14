import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

// This is necessary to access ol3!
declare var ol: any;

@Component({
    selector: 'olmap',
    template: `
    <h3> The map </h3>
    <div #mapElement id="map" class="map"> </div> 
    `
    // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
})

export class AppComponent implements AfterViewInit {
    // This is necessary to access the html element to set the map target (after view init)!
    @ViewChild("mapElement") mapElement: ElementRef;

    public map: any;

    constructor(){
        var osm_layer: any = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        
        // note that the target cannot be set here!
        this.map = new ol.Map({
            layers: [osm_layer],
            view: new ol.View({
                center: [14793316.706200,	-2974317.644633],
                zoom: 4
            })
        });
    }

    // After view init the map target can be set!
    ngAfterViewInit() {
        this.map.setTarget(this.mapElement.nativeElement.id);
    }
}
