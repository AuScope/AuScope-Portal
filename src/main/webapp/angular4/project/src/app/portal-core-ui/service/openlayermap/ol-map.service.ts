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

           // Process lists of layers and features
           for (const feature of clickedFeatureList) {
               // NB: This is just testing that the popup window does display
               this.bsModalRef = this.modalService.show(QuerierModalComponent, {class: 'modal-lg'});
               this.bsModalRef.content.analyticsContent = 'Analytics Content!';
                this.queryWFSService.getFeatureInfo(feature.onlineResource, feature.id_).subscribe(result => {
                  this.bsModalRef.content.parseTreeCollection(this.gmlParserService.getRootNode(result), feature.onlineResource);
                  this.bsModalRef.content.updateView();
                });
           }
           for (const layer of clickedLayerList) {
             // NB: This is just testing that the popup window does display
             this.bsModalRef = this.modalService.show(QuerierModalComponent, {class: 'modal-lg'});
             this.bsModalRef.content.analyticsContent = 'Analytics Content!';
             // TODO: Get the feature info and display in popup
             this.queryWMSService.getFeatureInfo(layer.onlineResource, layer.sldBody, pixel, clickCoord).subscribe(result => {
               this.bsModalRef.content.docs = this.parseTreeCollection(this.gmlParserService.getRootNode(result), layer.onlineResource);

             });
           }

   }

   public parseTreeCollection(rootNode: Document, onlineResource: OnlineResourceModel) {


     const docs: any[] = [];
     if (rootNode) {
       let features = null;
       const wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'FeatureCollection');
       if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
         // Check for error reports - some WMS servers mark their error reports with <ServiceExceptionReport>, some with <html>
         const exceptionNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'ServiceExceptionReport');
         const serviceErrorNode = SimpleXMLService.evaluateXPath(rootNode, rootNode, 'html', Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE);
         const nextNode = serviceErrorNode.iterateNext();
         if (!UtilitiesService.isEmpty(exceptionNode) || nextNode != null) {
           // There is an error report from the server;
           docs['Server Error'] = document.createTextNode('Sorry - server has returned an error message. See browser console for more information');
           return docs;
         }
         const featureInfoNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'FeatureInfoResponse');
         if (UtilitiesService.isEmpty(featureInfoNode)) {
           // Assume the node to be a feature node.
           features = [rootNode];
         } else {
           // 'text/xml'
           const fieldNodes = SimpleXMLService.getMatchingChildNodes(featureInfoNode[0], null, 'FIELDS');
           if (UtilitiesService.isEmpty(fieldNodes)) {
             features = featureInfoNode;
           } else {
             features = fieldNodes;
             for (let i = 0; i < features.length; i++) {
               let name = features[i].getAttribute('identifier');
               if (!name) {
                 name = onlineResource.name;
               }
               docs[name] = features[i];
               const displayStr = ' ';

             }
             return docs
           }
         }
       } else {
         let featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMembers');
         if (UtilitiesService.isEmpty(featureMembers)) {
           featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMember');
           features = featureMembers;
         } else {
           features = featureMembers[0].childNodes;
         }

       }
       for (let i = 0; i < features.length; i++) {
         const featureNode = features[i];
         let name = featureNode.getAttribute('gml:id');
         if (UtilitiesService.isEmpty(name)) {
           name = SimpleXMLService.evaluateXPath(rootNode, featureNode, 'gml:name', Constants.XPATH_STRING_TYPE).stringValue;
           if (UtilitiesService.isEmpty(name)) {
             name = onlineResource.name;
           }
         }
         if (typeof name === 'string' || name.length > 0) {
           docs[name] = featureNode;
         }
       }
     }

     return docs;
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


}
