import { Injectable, Inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import olLayerVector from 'ol/layer/vector';
import olLayer from 'ol/layer/layer';
import olFeature from 'ol/feature';
import olRenderFeature from 'ol/render/feature';
import olProj from 'ol/proj';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { point, polygon } from '@turf/helpers';
import * as inside from '@turf/inside';
import * as bbox from '@turf/bbox';
import * as bboxPolygon from '@turf/bbox-polygon';

import {LayerModel} from '../../model/data/layer.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlWFSService } from '../wfs/ol-wfs.service';
import { OlMapObject } from './ol-map-object';
import { OlWMSService } from '../wms/ol-wms.service';
import { RenderStatusService } from './renderstatus/render-status.service';
import { QuerierModalComponent } from '../../../modalwindow/querier/querier.modal.component';
import { OnlineResourceModel } from '../../model/data/onlineresource.model';
import { GMLParserService } from '../../utility/gmlparser.service';
import { SimpleXMLService } from '../../utility/simplexml.service';
import { UtilitiesService } from '../../utility/utilities.service';
import { QueryWMSService } from '../wms/query-wms.service';
import { QueryWFSService } from '../wfs/query-wfs.service';
import { Constants } from '../../..//portal-core-ui/utility/constants.service';

/**
 * Wrapper class to provide all things related to the ol map such as adding layer or removing layer.
 */
@Injectable()
export class OlMapService {

   private layerModelList: { [key: string]: LayerModel; } = {};

   private bsModalRef: BsModalRef;

   constructor(private layerHandlerService: LayerHandlerService, private olWMSService: OlWMSService,
     private olWFSService: OlWFSService, private olMapObject: OlMapObject, private modalService: BsModalService,
     private queryWFSService: QueryWFSService, private queryWMSService: QueryWMSService,  private gmlParserService: GMLParserService) {

     this.olMapObject.registerClickHandler(this.mapClickHandler.bind(this));
   }

   /**
    *  Gets called when a map click event is recognised
    * @param pixel coordinates of clicked on pixel (units: pixels)
   */
   public mapClickHandler(pixel: number[]) {
           // Convert pixel coords to map coords
           const map = this.olMapObject.getMap();
           const clickCoord = map.getCoordinateFromPixel(pixel);
           const lonlat = olProj.transform(clickCoord, 'EPSG:3857', 'EPSG:4326');
           const clickPoint = point(lonlat);

           // Compile a list of clicked on layers
           // NOTO BENE: forEachLayerAtPixel() cannot be used because it causes CORS problems
           const activeLayers = this.olMapObject.getLayers();
           const clickedLayerList: olLayer[] = [];
           const layerColl = map.getLayers();
           const me = this;
           let found = false;
           layerColl.forEach(function(layer) {
               for (const layerId in activeLayers) {
                   for (const activeLayer of activeLayers[layerId]) {
                       if (layer === activeLayer) {
                           const layerModel = me.getLayerModel(layerId);
                           if (!this.layerHandlerService.containsWMS(layerModel)) {
                             continue;
                           }
                           for (const cswRecord of layerModel.cswRecords) {
                               for (const bbox of cswRecord.geographicElements) {
                                   const tBbox = [bbox.eastBoundLongitude, bbox.southBoundLatitude, bbox.westBoundLongitude, bbox.northBoundLatitude];
                                   const poly = bboxPolygon(tBbox);
                                   if (inside(clickPoint, poly)) {
                                     // Add to list of clicked layers
                                     clickedLayerList.push(activeLayer);
                                     found = true;
                                     break;
                                   }
                               }
                               if (found) {
                                   break;
                               }
                           }
                       }
                       if (found) {
                           break;
                       }
                   }
               }
           }, me);

           // Compile a list of clicked on features
           const clickedFeatureList: olFeature[] = [];
           const featureHit = map.forEachFeatureAtPixel(pixel, function(feature) {
               clickedFeatureList.push(feature);
           });

           // Process lists of features
           const modalDisplayed = {value: false}
           for (const feature of clickedFeatureList) {
             // NB: This is just testing that the popup window does display
             this.displayModal(modalDisplayed, clickCoord);

             this.queryWFSService.getFeatureInfo(feature.onlineResource, feature.id_).subscribe(result => {
               this.setModal(result, feature, this.bsModalRef);
             },
              err => {
                this.bsModalRef.content.downloading = false;
              });
           }
           for (const layer of clickedLayerList) {
             // NB: This is just testing that the popup window does display
              this.displayModal(modalDisplayed, clickCoord);
             // TODO: Get the feature info and display in popup
             if (layer.onlineResource) {
               this.bsModalRef.content.downloading = true;
               this.queryWMSService.getFeatureInfo(layer.onlineResource, layer.sldBody, pixel, clickCoord).subscribe(result => {
                this.setModal(result, layer, this.bsModalRef);
               },
                 err => {
                   this.bsModalRef.content.downloading = false;
                 });
             }
           }


   }

   private displayModal(modalDisplayed, clickCoord) {
     if (modalDisplayed.value === false) {
       this.bsModalRef  = this.modalService.show(QuerierModalComponent, {class: 'modal-lg'});
       modalDisplayed.value = true;
       this.bsModalRef.content.downloading = true;
       const vector = this.drawDot(clickCoord);
       this.modalService.onHide.subscribe(reason => {
         this.removeVector(vector);
       })
     }
   }

   private setModal(result: string, layer: any, bsModalRef: BsModalRef) {
     const treeCollections = SimpleXMLService.parseTreeCollection(this.gmlParserService.getRootNode(result), layer.onlineResource, layer.layerName);
     for (const treeCollection of treeCollections) {
       bsModalRef.content.docs.push(treeCollection);
       if (bsModalRef.content.uniqueLayerNames.indexOf(layer.layerName) === -1) {
         bsModalRef.content.uniqueLayerNames.push(layer.layerName)
       }
     }
     this.bsModalRef.content.downloading = false;
   }



  /**
   * Add layer to the wms
   * @param layer the layer to add to the map
   */
   public addLayer(layer: LayerModel, param: any): void {
       this.olMapObject.removeLayerById(layer.id);
       delete this.layerModelList[layer.id];
       if (this.layerHandlerService.containsWMS(layer)) {
           this.olWMSService.addLayer(layer, param);
           this.layerModelList[layer.id] = layer;
       } else if (this.layerHandlerService.containsWFS(layer)) {
           this.olWFSService.addLayer(layer, param);
           this.layerModelList[layer.id] = layer;
       }
   }

  /**
   * Remove layer from map
   * @param layer the layer to remove from the map
   */
  public removeLayer(layer: LayerModel): void {
      this.olMapObject.removeLayerById(layer.id);
      delete this.layerModelList[layer.id];
  }

  /**
   * Retrieve the layer model given an id string
   * @param layerId layer's id string
   */
  public getLayerModel(layerId: string): LayerModel {
      if (this.layerModelList.hasOwnProperty(layerId)) {
          return this.layerModelList[layerId];
      }
      return null;
  }

  /**
   * Fit the map to the extent that is provided
   * @param extent An array of numbers representing an extent: [minx, miny, maxx, maxy]
   */
  public fitView(extent: [number, number, number, number]): void {
      this.olMapObject.getMap().getView().fit(extent);
  }

  /**
   * DrawBound
   */
  public drawBound(): BehaviorSubject<olLayerVector> {
    return this.olMapObject.drawBox();
  }

  public drawDot(coord): olLayerVector {
    return this.olMapObject.drawDot(coord);
  }

  public removeVector(vector: olLayerVector) {
    this.olMapObject.removeVector(vector);
  }


}
