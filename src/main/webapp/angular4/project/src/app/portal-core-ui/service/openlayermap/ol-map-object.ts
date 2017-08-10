import { OnlineResourceModel } from '../../model/data/onlineresource.model';
import { Injectable, Inject } from '@angular/core';
import * as ol from 'openlayers';

/**
 * A wrapper around the openlayer object for use in the portal.
 */
@Injectable()
export class OlMapObject {

  private map: ol.Map;
  private activeLayer: {};

  constructor() {
    const osm_layer: any = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    this.activeLayer = {};
    this.map = new ol.Map({
        layers: [osm_layer],
        view: new ol.View({
            center: [14793316.706200, -2974317.644633],
            zoom: 4
        })
    });

  }

  /**
   * returns an instance of the ol map
   */
  public getMap(): ol.Map {
    return this.map;
  }

  /**
   * Add a ol layer to the ol map. At the same time keep a reference map of the layers
   * @param layer: the ol layer to add to map
   * @param name normally the layer id is used
   */
  public addLayerByName(layer: ol.layer.Layer, name: string): void {
    this.activeLayer[name] = layer
    this.map.addLayer(layer);
  }


  /**
   * retrieve references to the layer by layer name.
   * @param name normally the layer id is used
   * @return the ol layer
   */
  public getLayerByName(name: string): ol.layer.Layer {
    return this.activeLayer[name];
  }


}
