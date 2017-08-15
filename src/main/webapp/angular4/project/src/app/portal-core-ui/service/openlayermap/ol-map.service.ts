import { Injectable, Inject } from '@angular/core';
import {LayerModel} from '../../model/data/layer.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlWFSService } from '../wfs/ol-wfs.service';
import { OlMapObject } from './ol-map-object';
import { OlWMSService } from '../wms/ol-wms.service';
import { RenderStatusService } from './renderstatus/render-status.service';


/**
 * Wrapper class to provide all things related to the ol map such as adding layer or removing layer.
 */
@Injectable()
export class OlMapService {

  constructor(private layerHandlerService: LayerHandlerService, private olWMSService: OlWMSService,
    private olWFSService: OlWFSService, private olMapObject: OlMapObject) {}

  /**
   * Add layer to the wms
   * @param layer the layer to add to the map
   */
  public addLayer(layer: LayerModel): void {
    if (this.layerHandlerService.containsWMS(layer)) {
      this.olWMSService.addLayer(layer);
    }else if (this.layerHandlerService.containsWFS(layer)) {
      this.olWFSService.addLayer(layer);
    }
  }

  public removeLayer(layer: LayerModel): void {
    this.olMapObject.removeLayerById(layer.id);
  }


}

