import { APP_CONFIG, AppConfig } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../model/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../model/data/layer.model'
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from '../openlayermap/ol-map-object';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import olMap from 'ol/map';
import olTile from 'ol/layer/tile';
import olTileWMS from 'ol/source/tilewms';
import { Observable } from 'rxjs/Rx';
import { Constants } from '../../utility/constants.service';
import { UtilitiesService } from '../../utility/utilities.service';
import { RenderStatusService } from '../openlayermap/renderstatus/render-status.service';

/**
 * Use OlMapService to add layer to map. This service class adds wms layer to the map
 */
@Injectable()
export class OlWMSService {

  private map: olMap;

  constructor( @Inject(APP_CONFIG) private config: AppConfig,
                                      private layerHandlerService: LayerHandlerService,
                                      private olMapObject: OlMapObject,
                                      private http: HttpClient,
                                      private renderStatusService: RenderStatusService) {
    this.map = this.olMapObject.getMap();
  }


  /**
   * get wms 1.3.0 related parameter
   * @param layers the wms layer
   * @param sld_body associated sld_body
   */
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

  /**
   * get wms 1.1.0 related parameter
   * @param layers the wms layer
   * @param sld_body associated sld_body
   */
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



  /**
   * get the sld from the url
   * @param sldUrl the url containing the sld
   * @return a observable of the http request
   */
  public getSldBody(sldUrl: string, param?: any): Observable<any> {
    if (!sldUrl) {
       return Observable.create(observer => {
         observer.next(null);
         observer.complete();
       })
    }

    return this.http.get('../' + sldUrl, {
      responseType: 'text',
      params: param
    }).map(response => {
      return response;
    });
  }

  /**
   * Add a wms layer to the map
   * @param layer the wms layer to add to the map.
   */
  public addLayer(layer: LayerModel, param?: any): void {
    if (!param) {
      param = {};
    }



    const wmsOnlineResources = this.layerHandlerService.getWMSResource(layer);

    for (const wmsOnlineResource of wmsOnlineResources) {
      if (UtilitiesService.filterProviderSkip(param.optionalFilters, wmsOnlineResource.url)) {
        this.renderStatusService.skip(layer, wmsOnlineResource);
        continue;
      }

      this.getSldBody(layer.proxyStyleUrl, param).subscribe(response => {
        const collatedParam = UtilitiesService.collateParam(layer, wmsOnlineResource, param);
        const params = wmsOnlineResource.version.startsWith('1.3') ?
          this.getWMS1_3_0param(wmsOnlineResource.name, response) :
          this.getWMS1_1param(wmsOnlineResource.name, response);

        const wmsTile = new olTile({
          extent: this.map.getView().calculateExtent(this.map.getSize()),
          source: new olTileWMS({
            url: wmsOnlineResource.url,
            params: params,
            serverType: 'geoserver',
            projection: 'EPSG:4326'
          })
        })

        const me = this;
        wmsTile.getSource().on('tileloadstart', function(event) {
          me.renderStatusService.addResource(layer, wmsOnlineResource);
        });

        wmsTile.getSource().on('tileloadend', function(event) {
          me.renderStatusService.updateComplete(layer, wmsOnlineResource);
        });

        wmsTile.getSource().on('tileloaderror', function(event) {
          me.renderStatusService.updateComplete(layer, wmsOnlineResource, true);
        })

        this.olMapObject.addLayerById(wmsTile, layer.id);
      })
    }
  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
