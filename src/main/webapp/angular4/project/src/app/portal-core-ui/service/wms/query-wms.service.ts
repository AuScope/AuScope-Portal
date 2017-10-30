import { CSWRecordModel } from '../../model/data/cswrecord.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {UtilitiesService} from '../../utility/utilities.service';
import {LayerModel} from '../../model/data/layer.model';
import {OnlineResourceModel} from '../../model/data/onlineresource.model';
import { OlMapObject } from '../openlayermap/ol-map-object';
import { Constants } from '../../utility/constants.service';

@Injectable()
export class QueryWMSService {

  constructor(private http: HttpClient, private olMapObject: OlMapObject) {
  }

  /**
  * A get feature info request
  * @param layer the wfs layer for the getfeatureinfo request to be made
  * @param onlineresource the wfs online resource
  * @return Observable the observable from the http request
   */
  public getFeatureInfo(onlineResource: OnlineResourceModel, sldBody: string, pixel: any, clickCoord: any): Observable<any> {

    const bounds = this.olMapObject.getMap().getView().calculateExtent();
    const bbox = [bounds[2].toString(), bounds[3].toString(), bounds[0].toString(), bounds[1].toString()].toString();

    const size = this.olMapObject.getMap().getSize();

    let formdata = new HttpParams();
    formdata = formdata.append('serviceUrl', onlineResource.url);
    formdata = formdata.append('lat', clickCoord[1]);
    formdata = formdata.append('lng', clickCoord[0]);
    formdata = formdata.append('QUERY_LAYERS', onlineResource.name);
    formdata = formdata.append('x', pixel[0]);
    formdata = formdata.append('y', pixel[1]);
    formdata = formdata.append('BBOX', bbox);
    formdata = formdata.append('WIDTH', size[0]);
    formdata = formdata.append('HEIGHT', size[1]);
    formdata = formdata.append('version', onlineResource.version);


    if (sldBody) {
      formdata = formdata.append('SLD_BODY', sldBody);
      formdata = formdata.append('postMethod', 'true');
    } else {
      formdata = formdata.append('SLD_BODY', '');
    }


    formdata = formdata.append('INFO_FORMAT', 'application/vnd.ogc.gml/3.1.1');
    if (onlineResource.applicationProfile && onlineResource.applicationProfile.indexOf('Esri:ArcGIS Server') > -1) {
      formdata = formdata.append('INFO_FORMAT', 'text/xml');
    }

    return this.http.post('../wmsMarkerPopup.do', formdata.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).map(response => {
      return response;
    });


  }
}
