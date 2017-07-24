import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {LayerModel} from '../../modal/data/layer.model'
import * as ol from 'openlayers';

@Injectable()
export class OlMapService {

  map: any;

  constructor() {
    const osm_layer: any = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    this.map = new ol.Map({
        layers: [osm_layer],
        view: new ol.View({
            center: [14793316.706200, -2974317.644633],
            zoom: 4
        })
    });

  }


  public getMap(): any {
    return this.map;
  }

  public addLayer(layer: LayerModel): void {
    console.log(layer.name)
  }


}
