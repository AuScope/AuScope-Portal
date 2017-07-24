import { APP_CONFIG, AppConfig } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../modal/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model'
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from './ol-map-object';
import {HttpClient} from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import * as ol from 'openlayers';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OlWMSService {

  private map: ol.Map;

  constructor( @Inject(APP_CONFIG) private config: AppConfig,
                                      private layerHandlerService: LayerHandlerService,
                                      private olMapObject: OlMapObject,
                                      private http: HttpClient) {
    this.map = this.olMapObject.getMap();
  }



  public getWMS1_3_0param(layers: string, sld_body?: string): any {
     const params = {
       'LAYERS': layers,
       'TILED': true,
       // 'sld_body': sld_body,
       'DISPLAYOUTSIDEMAXEXTENT': true,
       'FORMAT': 'image/png',
       'TRANSPARENT': true,
       'VERSION': '1.3.0',
       'WIDTH' : this.config.TILE_SIZE,
       'HEIGHT' : this.config.TILE_SIZE
     }

    if (sld_body) {
      params['sld_body'] = sld_body;
    }
    return params;

  }

  public getWMS1_1param(layers: string, sld_body?: string): any {
     const params = {
       'LAYERS': layers,
       'TILED': true,
       // 'sld_body': sld_body,
       'DISPLAYOUTSIDEMAXEXTENT': true,
       'FORMAT': 'image/png',
       'TRANSPARENT': true,
       'VERSION': '1.1.1',
       'WIDTH' : this.config.TILE_SIZE,
       'HEIGHT' : this.config.TILE_SIZE
     }
    if (sld_body) {
      params['sld_body'] = sld_body;
    }
    return params;

  }

  public getSldBody(sldUrl: string): void {
    if (!sldUrl) {
      return Observable.create(function () {
            return undefined;
        });
    }


const headers = new Headers({ 'Content-Type': 'application/xml' });


    this.http.get('../' + sldUrl, headers).subscribe(response => {
      return '1234';
    });
  }


  public addLayer(layer: LayerModel): void {
    const wmsOnlineResources = this.layerHandlerService.getWMSResource(layer);
     this.getSldBody(layer.proxyStyleUrl);
//     this.getSldBody(layer.proxyStyleUrl).subscribe(response => {
//        for (const wmsOnlineResource of wmsOnlineResources){
//          const params = wmsOnlineResource.version.startsWith('1.3') ?
//            this.getWMS1_3_0param(wmsOnlineResource.name, response) :
//            this.getWMS1_1param(wmsOnlineResource.name, response);
//
//          const wmsTile =  new ol.layer.Tile({
//              // extent: this.map.getView().calculateExtent(this.map.getSize()),
//              source: new ol.source.TileWMS({
//                url: wmsOnlineResource.url,
//                params: params,
//                serverType: 'geoserver',
//                projection: 'EPSG:4326'
//              })
//            })
//          this.map.addLayer(wmsTile);
//        }
//     })

  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
