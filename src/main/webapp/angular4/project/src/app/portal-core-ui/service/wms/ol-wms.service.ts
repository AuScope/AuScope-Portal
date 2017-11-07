import { CSWRecordModel } from '../../model/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../model/data/layer.model';
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

  constructor(private layerHandlerService: LayerHandlerService,
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
      params['sldUrl'] = this.getSldUrl(layer, onlineResource, param);
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
      params['sldUrl'] = this.getSldUrl(layer, onlineResource, param);
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

    let httpParams = Object.getOwnPropertyNames(param).reduce((p, key1) => p.set(key1, param[key1]), new HttpParams());
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
      return '/' + layer.proxyStyleUrl + '?' + $.param(param);
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
        const me = this;
        const params = wmsOnlineResource.version.startsWith('1.3') ?
          this.getWMS1_3_0param(layer, wmsOnlineResource, collatedParam, response) :
          this.getWMS1_1param(layer, wmsOnlineResource, collatedParam, response);

        let wmsTile;
        if (this.wmsUrlTooLong(response)) {
          wmsTile = new olTile({
            extent: this.map.getView().calculateExtent(this.map.getSize()),
            source: new olTileWMS({
              url: wmsOnlineResource.url,
              params: params,
              serverType: 'geoserver',
              projection: 'EPSG:4326',
              tileLoadFunction: function(image, src) {
                me.imagePostFunction(image, src);
              }
            })
          })
        } else {
          wmsTile = new olTile({
            extent: this.map.getView().calculateExtent(this.map.getSize()),
            source: new olTileWMS({
              url: wmsOnlineResource.url,
              params: params,
              serverType: 'geoserver',
              projection: 'EPSG:4326'
            })
          })
        }

        wmsTile.sldBody = response;
        wmsTile.onlineResource = wmsOnlineResource;
        wmsTile.layer = layer;

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

  public imagePostFunction(image, src) {
    const img = image.getImage();
      const dataEntries = src.split('&');
      const url = '../getWMSMapViaProxy.do?';
      const params = {};
      for (let i = 0; i < dataEntries.length; i++) {
        if (i === 0) {
          params['url'] = dataEntries[i];
        } else {
          if (dataEntries[i].toLowerCase().indexOf('layers') >= 0) {
            params['layer'] = decodeURIComponent(dataEntries[i].split('=')[1]);
          }
          if (dataEntries[i].toLowerCase().indexOf('bbox') >= 0) {
            params['bbox'] = decodeURIComponent(dataEntries[i].split('=')[1]);
          }
          if (dataEntries[i].toLowerCase().indexOf('sldurl') >= 0) {
            params['sldUrl'] = decodeURIComponent(dataEntries[i].split('=')[1]);
          }
          if (dataEntries[i].toLowerCase().indexOf('version') >= 0) {
            params['version'] = decodeURIComponent(dataEntries[i].split('=')[1]);
          }
          if (dataEntries[i].toLowerCase().indexOf('crs') === 0 || dataEntries[i].toLowerCase().indexOf('srs')  === 0) {
            params['crs'] = decodeURIComponent(dataEntries[i].split('=')[1]);
          }
        }
      }
      img.src = url + $.param(params);

  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
