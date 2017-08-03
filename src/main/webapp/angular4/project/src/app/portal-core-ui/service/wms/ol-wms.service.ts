import { APP_CONFIG, AppConfig } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../modal/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../modal/data/layer.model'
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from '../openlayermap/ol-map-object';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import * as ol from 'openlayers';
import { Observable } from 'rxjs/Rx';
import { Constants } from '../../utility/constants.service';

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
       'DISPLAYOUTSIDEMAXEXTENT': true,
       'FORMAT': 'image/png',
       'TRANSPARENT': true,
       'VERSION': '1.3.0',
       'WIDTH' : Constants.TILE_SIZE,
       'HEIGHT' : Constants.TILE_SIZE
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
       'DISPLAYOUTSIDEMAXEXTENT': true,
       'FORMAT': 'image/png',
       'TRANSPARENT': true,
       'VERSION': '1.1.1',
       'WIDTH' : Constants.TILE_SIZE,
       'HEIGHT' : Constants.TILE_SIZE
     }
    if (sld_body) {
      params['sld_body'] = sld_body;
    }
    return params;

  }

  public getSldBody(sldUrl: string): Observable<any> {
    if (!sldUrl) {
       return Observable.create(observer => {
         observer.next(null);
         observer.complete();
       })
    }

    return this.http.get('../' + sldUrl, {responseType: 'text'}).map(response => {
      return response;
    });
  }


  public addLayer(layer: LayerModel): void {
    const wmsOnlineResources = this.layerHandlerService.getWMSResource(layer);
     this.getSldBody(layer.proxyStyleUrl).subscribe(response => {
        for (const wmsOnlineResource of wmsOnlineResources){
          const params = wmsOnlineResource.version.startsWith('1.3') ?
            this.getWMS1_3_0param(wmsOnlineResource.name, response) :
            this.getWMS1_1param(wmsOnlineResource.name, response);

          const wmsTile =  new ol.layer.Tile({
              extent: this.map.getView().calculateExtent(this.map.getSize()),
              source: new ol.source.TileWMS({
                url: wmsOnlineResource.url,
                params: params,
                serverType: 'geoserver',
                projection: 'EPSG:4326'
              })
            })
          this.olMapObject.addLayerByName(wmsTile, layer.id);
        }
     })

  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
