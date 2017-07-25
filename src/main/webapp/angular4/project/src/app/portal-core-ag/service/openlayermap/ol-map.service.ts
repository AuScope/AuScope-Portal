import { Injectable, Inject } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlWFSService } from '../wfs/ol-wfs.service';
import { OlMapObject } from './ol-map-object';
import { OlWMSService } from '../wms/ol-wms.service';
import * as ol from 'openlayers';

@Injectable()
export class OlMapService {

  constructor(private layerHandlerService: LayerHandlerService, private olWMSService: OlWMSService, private olWFSService: OlWFSService) {}

  public addLayer(layer: LayerModel): void {
    if (this.layerHandlerService.containsWMS(layer)) {
      this.olWMSService.addLayer(layer);
    }else if (this.layerHandlerService.containsWFS(layer)) {
      this.olWFSService.addLayer(layer);
    }
  }


}

