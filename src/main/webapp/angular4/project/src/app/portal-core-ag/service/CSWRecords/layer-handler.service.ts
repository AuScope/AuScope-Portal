import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LayerHandlerService {

  private layerRecord;

  constructor(private http: HttpClient) {
    this.layerRecord = [];
  }


  getLayerRecord(): any {
    const me = this;
    if (this.layerRecord) {
       // return Observable.of(this.layerRecord);
    }else {
      return this.http.get('../getKnownLayers.do')
        .subscribe(response => {
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
