import { AppConfig, APP_CONFIG } from '../../appconfig/app.config';
import { Injectable, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {LayerModel} from '../../modal/data/layer.model'

@Injectable()
export class LayerHandlerService {

  private layerRecord;
  private getCSWUrl;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig ) {
    this.layerRecord = [];

  }


  public getLayerRecord(): Observable<any> {
    const me = this;
    if (this.layerRecord.length > 0) {
        return Observable.of(this.layerRecord);
    }else {
      return this.http.get(this.config.getCSWRecordUrl)
        .map(response => {
            const cswRecord = response['data'];
            cswRecord.forEach(function(item, i, ar){
              if (me.layerRecord[item.group] === undefined) {
                me.layerRecord[item.group] = [];
              }
              // VT: attempted to cast the object into a typescript class however it doesn't seem like its possible
              // all examples points to casting from json to interface but not object to interface.
              item.expanded = false;
              me.layerRecord[item.group].push(item);
            });
            return me.layerRecord;
        });
    }
  }



}
