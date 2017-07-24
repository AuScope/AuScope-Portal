import { Injectable, Inject } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model'
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from './ol-map-object';
import { OlWMSService } from './ol-wms.service';
import * as ol from 'openlayers';

@Injectable()
export class OlMapService {

  constructor(private layerHandlerService: LayerHandlerService, private olWMSService: OlWMSService) {}

  public addLayer(layer: LayerModel): void {
    if (this.layerHandlerService.containsWMS(layer)) {
      this.olWMSService.addLayer(layer);
    }
  }


}
