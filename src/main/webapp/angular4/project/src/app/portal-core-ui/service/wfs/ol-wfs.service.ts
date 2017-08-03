
import { CSWRecordModel } from '../../modal/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model'
import { OnlineResourceModel } from '../../modal/data/onlineresource.model';
import { PrimitiveModel } from '../../modal/data/primitive.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from '../openlayermap/ol-map-object';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import * as ol from 'openlayers';
import { Observable } from 'rxjs/Rx';
import { GMLParserService } from '../../utility/gmlparser.service';
import { Constants } from '../../utility/constants.service';

@Injectable()
export class OlWFSService {

  private map: ol.Map;

  constructor(private layerHandlerService: LayerHandlerService,
                  private olMapObject: OlMapObject,
                  private http: HttpClient,
                  private gmlParserService: GMLParserService) {
    this.map = this.olMapObject.getMap();
  }


  public getFeature(layer: LayerModel, onlineResource: OnlineResourceModel): Observable<any> {

    const httpParams = new HttpParams().set('serviceUrl', onlineResource.url);
    httpParams.append('typeName', onlineResource.name);

    if (layer.proxyUrl) {
      return this.http.get(layer.proxyUrl, {
        params: httpParams
      }).map(response => {
        return response['data'];
      });
    }else {
      return Observable.create(function () {
            return undefined;
        });
    }
  }

  public addPoint(layer: LayerModel, primitive: PrimitiveModel): void {
     const geom = new ol.geom.Point(ol.proj.transform([primitive.coords.lng, primitive.coords.lat], 'EPSG:4326', 'EPSG:3857'));
       const feature = new ol.Feature(geom);
       feature.setStyle([
          new ol.style.Style({
             image: new ol.style.Icon(({
                     anchor: [0.5, 1],
                     anchorXUnits: 'fraction',
                     anchorYUnits: 'fraction',
                     // size: [32, 32],
                     scale: 0.5,
                     opacity: 1,
                     src: layer.iconUrl
           }))
          })
       ]);

       if (primitive.name) {
         feature.setId(primitive.name);
       }
    (<ol.layer.Vector>this.olMapObject.getLayerByName(layer.id)).getSource().addFeature(feature);
  }

  public addLine(primitive: PrimitiveModel): void {

  }

  public addPoloygon(primitive: PrimitiveModel): void {

  }

  public addLayer(layer: LayerModel): void {
    const wfsOnlineResources = this.layerHandlerService.getWFSResource(layer);

    // VT: create the vector on the map if it does not exist.
    if (!this.olMapObject.getLayerByName(layer.id)) {
        const markerLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({ features: []})
                });

        this.olMapObject.addLayerByName(markerLayer, layer.id);
    }


    for (const onlineResource of wfsOnlineResources){
      this.getFeature(layer, onlineResource).subscribe(response => {
        const rootNode = this.gmlParserService.getRootNode(response.gml);
        const primitives = this.gmlParserService.makePrimitives(rootNode);
        for (const primitive of primitives){
          switch (primitive.geometryType) {
            case Constants.geometryType.POINT:
               this.addPoint(layer, primitive);
              break
            case Constants.geometryType.LINESTRING:
               this.addLine(primitive);
               break;
            case Constants.geometryType.POLYGON:
               this.addPoloygon(primitive);
               break;
          }
        }

      })
    }
  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
