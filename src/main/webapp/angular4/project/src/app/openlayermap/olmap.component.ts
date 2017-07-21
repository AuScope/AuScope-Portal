import { OlMapService } from '../portal-core-ag/service/openlayermap/ol-map.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as ol from 'openlayers';



@Component({
    selector: 'app-ol-map',
    template: `
    <div #mapElement id="map" class="height-full width-full"> </div>
    `
    // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
})

export class OlMapComponent implements AfterViewInit {
    // This is necessary to access the html element to set the map target (after view init)!
    @ViewChild('mapElement') mapElement: ElementRef;

    public map: any;

    constructor(public olMapService: OlMapService) { }

    // After view init the map target can be set!
    ngAfterViewInit() {
        this.olMapService.getMap().setTarget(this.mapElement.nativeElement.id);
    }
}
