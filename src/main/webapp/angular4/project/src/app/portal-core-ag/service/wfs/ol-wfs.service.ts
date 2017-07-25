import { APP_CONFIG, AppConfig } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../modal/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model'
import { OnlineResourceModel } from '../../modal/data/onlineresource.model';
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

  constructor( @Inject(APP_CONFIG) private config: AppConfig,
                                    private layerHandlerService: LayerHandlerService,
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

  public addPoint(): void {

  }

  public addLayer(layer: LayerModel): void {
    const wfsOnlineResources = this.layerHandlerService.getWFSResource(layer);
    for (const onlineResource of wfsOnlineResources){
      this.getFeature(layer, onlineResource).subscribe(response => {
        const rootNode = this.gmlParserService.getRootNode(response.gml);
        const primitives = this.gmlParserService.makePrimitives(rootNode);
        for (const primitive of primitives){
          switch (primitive.geometryType) {
            case Constants.geometryType.POINT:
               this.addPoint();
              break
            case Constants.geometryType.LINESTRING:
               this.addPoint();
               break;
            case Constants.geometryType.POLYGON:
               this.addPoint();
               break;
          }
        }

      })
    }
  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
