import { APP_CONFIG, AppConfig } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../model/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../model/data/layer.model'
import { OnlineResourceModel } from '../../model/data/onlineresource.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from '../openlayermap/ol-map-object';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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
                                      private renderStatusService: RenderStatusService
                                      ) {
    this.map = this.olMapObject.getMap();
  }

  private wmsUrlTooLong(sldBody: string): boolean {
    return encodeURIComponent(sldBody).length > Constants.WMSMAXURLGET;
  }


  /**
   * get wms 1.3.0 related parameter
   * @param layers the wms layer
   * @param sld_body associated sld_body
   */
  public getWMS1_3_0param(layer: LayerModel, onlineResource: OnlineResourceModel, param, sld_body?: string): any {
    const params = {
      'LAYERS': onlineResource.name,
      'TILED': true,
      'DISPLAYOUTSIDEMAXEXTENT': true,
      'FORMAT': 'image/png',
      'TRANSPARENT': true,
      'VERSION': '1.3.0',
      'WIDTH': Constants.TILE_SIZE,
      'HEIGHT': Constants.TILE_SIZE
    }

    if (sld_body && !this.wmsUrlTooLong(sld_body)) {
      params['sld_body'] = sld_body;
    } else if (sld_body && this.wmsUrlTooLong(sld_body)) {
      params['sld'] = this.getSldUrl(layer, onlineResource, param);
    }
    return params;

  }

  /**
   * get wms 1.1.0 related parameter
   * @param layers the wms layer
   * @param sld_body associated sld_body
   */
  public getWMS1_1param(layer: LayerModel, onlineResource: OnlineResourceModel, param, sld_body?: string): any {
    const params = {
      'LAYERS': onlineResource.name,
      'TILED': true,
      'DISPLAYOUTSIDEMAXEXTENT': true,
      'FORMAT': 'image/png',
      'TRANSPARENT': true,
      'VERSION': '1.1.1',
      'WIDTH': Constants.TILE_SIZE,
      'HEIGHT': Constants.TILE_SIZE
    }
    if (sld_body && !this.wmsUrlTooLong(sld_body)) {
      params['sld_body'] = sld_body;
    } else if (sld_body && this.wmsUrlTooLong(sld_body)) {
      params['sld'] = this.getSldUrl(layer, onlineResource, param);
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

    let httpParams = new HttpParams();
    httpParams = UtilitiesService.convertObjectToHttpParam(httpParams, param);

    return this.http.get('../' + sldUrl, {
      responseType: 'text',
      params: httpParams
    }).map(response => {
      return response;
    });
  }

  /**
     * Get the wms style url if proxyStyleUrl is valid
     * @method getWMSStyleUrl
     * @param layer - the layer we would like to retrieve the sld for if proxyStyleUrl is defined
     * @param onlineResource - the onlineResource of the layer we are rendering
     * @param param - OPTIONAL - parameter to be passed into retrieving the SLD.Used in capdf
     * @return url - getUrl to retrieve sld
     */
  public getSldUrl(layer: LayerModel, onlineResource: OnlineResourceModel, param) {
    if (layer.proxyStyleUrl) {
      return Constants.SLDURL + layer.proxyStyleUrl + '?' + $.param(param);
    } else {
      return null;
    }
  };

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
      const collatedParam = UtilitiesService.collateParam(layer, wmsOnlineResource, param);
      this.getSldBody(layer.proxyStyleUrl, collatedParam).subscribe(response => {

        const params = wmsOnlineResource.version.startsWith('1.3') ?
          this.getWMS1_3_0param(layer, wmsOnlineResource, collatedParam, response) :
          this.getWMS1_1param(layer, wmsOnlineResource, collatedParam, response);

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
