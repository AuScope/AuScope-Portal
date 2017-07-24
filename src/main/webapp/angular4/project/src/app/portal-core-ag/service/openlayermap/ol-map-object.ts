import { Injectable, Inject } from '@angular/core';
import * as ol from 'openlayers';

@Injectable()
export class OlMapObject {

  private map: ol.Map;

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


  public getMap(): ol.Map {
    return this.map;
  }




}
