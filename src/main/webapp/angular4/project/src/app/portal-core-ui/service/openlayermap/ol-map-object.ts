import { OnlineResourceModel } from '../../model/data/onlineresource.model';
import { RenderStatusService } from './renderstatus/render-status.service';
import { Injectable, Inject } from '@angular/core';
import olMap from 'ol/map';
import olTile from 'ol/layer/tile';
import olOSM from 'ol/source/osm';
import olView from 'ol/view';
import olLayer from 'ol/layer/layer';


/**
 * A wrapper around the openlayer object for use in the portal.
 */
@Injectable()
export class OlMapObject {

  private map: olMap;
  private activeLayer: {};

  constructor(private renderStatusService: RenderStatusService) {
    const osm_layer: any = new olTile({
        source: new olOSM()
    });
    this.activeLayer = {};
    this.map = new olMap({
        layers: [osm_layer],
        view: new olView({
            center: [14793316.706200, -2974317.644633],
            zoom: 4
        })
    });

  }

  /**
   * returns an instance of the ol map
   */
  public getMap(): olMap {
    return this.map;
  }

  /**
   * Add a ol layer to the ol map. At the same time keep a reference map of the layers
   * @param layer: the ol layer to add to map
   * @param id the layer id is used
   */
  public addLayerById(layer: olLayer, id: string): void {
    if (!this.activeLayer[id]) {
      this.activeLayer[id] = [];
    }
    this.activeLayer[id].push(layer);

    this.map.addLayer(layer);
  }


  /**
   * retrieve references to the layer by layer name.
   * @param id the layer id is used
   * @return the ol layer
   */
  public getLayerById(id: string): [olLayer] {
    return this.activeLayer[id];
  }

  public removeLayerById(id: string) {
    const activelayers  = this.getLayerById(id);
    activelayers.forEach(layer => {
      this.map.removeLayer(layer);
    })

    this.renderStatusService.resetLayer(id);

  }



}
