import { AppConfig, APP_CONFIG } from '../../appconfig/app.config';
import { Injectable, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LayerHandlerService {

  private layerRecord;
  private getCSWUrl;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig ) {
    this.layerRecord = [];

  }


  public getLayerRecord(): any {
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
              me.layerRecord[item.group].push(item);
            });
            return me.layerRecord;
        });
    }
  }



}
