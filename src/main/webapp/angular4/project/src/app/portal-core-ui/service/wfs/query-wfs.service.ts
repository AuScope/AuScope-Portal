import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import olLayer from 'ol/layer/layer';
import olFeature from 'ol/feature';
import { OlMapObject } from '../../../portal-core-ui/service/openlayermap/ol-map-object';
import {HttpClient, HttpParams} from '@angular/common/http';
import { UtilitiesService } from '../../utility/utilities.service';
import {LayerModel} from '../../model/data/layer.model';
import { OnlineResourceModel } from '../../model/data/onlineresource.model';

@Injectable()
export class QueryWFSService {

    constructor(private http: HttpClient) {
    }
    /**
     * A get feature info request
     * @param layer the wfs layer for the getfeatureinfo request to be made
     * @param onlineresource the wfs online resource
     * @return Observable the observable from the http request
     */
    public getFeatureInfo(layer: LayerModel, onlineResource: OnlineResourceModel, param: any): Observable<any> {
      //
      // TODO: This is copied from elsewhere and will need to be adapted
      //
      let httpParams = Object.getOwnPropertyNames(param).reduce((p, key1) => p.set(key1, param[key1]), new HttpParams());
      httpParams = httpParams.append('serviceUrl', onlineResource.url);
      httpParams = httpParams.append('typeName', onlineResource.name);
      httpParams = UtilitiesService.convertObjectToHttpParam(httpParams, param);

      if (layer.proxyUrl) {
        return this.http.get('../' + layer.proxyUrl, {
          params: httpParams
        }).map(response => {
          return response['data'];
        });
      } else {
        return Observable.create(function () {
              return undefined;
          });
      }
  }
}
