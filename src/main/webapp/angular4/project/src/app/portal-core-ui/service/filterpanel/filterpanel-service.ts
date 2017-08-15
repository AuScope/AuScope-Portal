import { AppConfig, APP_CONFIG } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../model/data/cswrecord.model';
import { Injectable, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {LayerModel} from '../../model/data/layer.model'
import { OnlineResourceModel } from '../../model/data/onlineresource.model';
/**
 * Service class to handle jobs relating to getting csw records from the server
 *
 */
@Injectable()
export class FilterPanelService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig ) {}

  /**
   * Helper service to retrieve remote options for the filter options
   */
  public getFilterRemoteParam(url: string): Observable<any> {
    switch (url) {
      case '../getAllCommodities.do':
        return this.getCommodity(url);
      default:
        return null;
    }
  }

  /**
   * Helper service to retrieve commodities options for the filter panel
   */
  public getCommodity(url: string): Observable<any> {
    return this.http.get(url)
      .map(response => {
        const data = response['data'].data;
        const result = [];
        data.forEach(function(item, i, ar) {
          result.push({
            key: item[1],
            value: item[0]
          });
        });
        return result;
      });
  }


}
