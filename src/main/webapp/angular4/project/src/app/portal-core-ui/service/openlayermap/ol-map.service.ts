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
   public addLayer(layer: LayerModel, param: any): void {
       this.olMapObject.removeLayerById(layer.id);
       if (this.layerHandlerService.containsWMS(layer)) {
           this.olWMSService.addLayer(layer, param);
       }else if (this.layerHandlerService.containsWFS(layer)) {
           this.olWFSService.addLayer(layer, param);
       }
   }

  /**
   * Remove layer from map
   * @param layer the layer to remove from the map
   */
  public removeLayer(layer: LayerModel): void {
      this.olMapObject.removeLayerById(layer.id);
  }

  /**
   * Fit the map to the extent that is provided
   * @param extent An array of numbers representing an extent: [minx, miny, maxx, maxy]
   */
  public fitView(extent: [number, number, number, number]): void {
      this.olMapObject.getMap().getView().fit(extent);
  }


}
