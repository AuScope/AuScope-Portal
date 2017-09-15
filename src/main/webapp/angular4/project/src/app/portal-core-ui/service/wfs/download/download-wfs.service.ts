import { Bbox } from '../../../model/data/bbox.model';
import { LayerModel } from '../../../model/data/layer.model';
import { LayerHandlerService } from '../../cswrecords/layer-handler.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import { environment } from '../../../../../environments/environment';
import * as $ from 'jquery'


/**
 * Use OlMapService to add layer to map. This service class adds wfs layer to the map
 */
@Injectable()
export class DownloadWfsService {



  constructor(private layerHandlerService: LayerHandlerService, private http: HttpClient) {

  }

  public download(layer: LayerModel, bbox: Bbox) {

    const wfsResources = this.layerHandlerService.getWFSResource(layer);

    let downloadUrl = 'getAllFeaturesInCSV.do';
    if (layer.proxyDownloadUrl && layer.proxyDownloadUrl.length > 0) {
      downloadUrl =  layer.proxyDownloadUrl
    } else if (layer.proxyUrl && layer.proxyUrl.length > 0) {
      downloadUrl =  layer.proxyUrl
    }

    let httpParams = new HttpParams();
    httpParams = httpParams.set('outputFormat', 'csv');

    for (let i = 0; i < wfsResources.length; i++) {
      const filterParameters = {
        serviceUrl: wfsResources[i].url,
        typeName: wfsResources[i].name,
        maxFeatures: 5000,
        outputFormat: 'csv',
        bbox: JSON.stringify(bbox)
      }

      const serviceUrl = environment.portalBaseUrl + downloadUrl + '?'


      httpParams = httpParams.append('serviceUrls', serviceUrl + $.param(filterParameters));
    }

    return this.http.get('../downloadGMLAsZip.do', {
      params: httpParams,
      responseType: 'blob'
    }).map((response) => { // download file
      return response;
    })

  }
}
