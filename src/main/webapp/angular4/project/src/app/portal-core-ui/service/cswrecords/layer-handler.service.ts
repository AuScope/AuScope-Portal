import { AppConfig, APP_CONFIG } from '../../appconfig/app.config';
import { CSWRecordModel } from '../../modal/data/cswrecord.model';
import { Injectable, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {LayerModel} from '../../modal/data/layer.model'
import { OnlineResourceModel } from '../../modal/data/onlineresource.model';

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

  public containsWMS(layer: LayerModel): boolean {
     const cswRecords: CSWRecordModel[] = layer.cswRecords;
      for (const cswRecord of cswRecords) {
         for (const onlineResource of cswRecord.onlineResources){
           if (onlineResource.type === 'WMS') {
             return true;
           }
         }
      }
      return false;
  }

  public getWMSResource (layer: LayerModel): OnlineResourceModel[] {
      const cswRecords: CSWRecordModel[] = layer.cswRecords;
      const wmsOnlineResource = [];
      for (const cswRecord of cswRecords) {
         for (const onlineResource of cswRecord.onlineResources){
           if (onlineResource.type === 'WMS') {
             wmsOnlineResource.push(onlineResource);
           }
         }
      }
      return wmsOnlineResource;
  }

  public containsWFS(layer: LayerModel): boolean {
     const cswRecords: CSWRecordModel[] = layer.cswRecords;
      for (const cswRecord of cswRecords) {
         for (const onlineResource of cswRecord.onlineResources){
           if (onlineResource.type === 'WFS') {
             return true;
           }
         }
      }
      return false;
  }

  public getWFSResource (layer: LayerModel): OnlineResourceModel[] {
      const cswRecords: CSWRecordModel[] = layer.cswRecords;
      const wfsOnlineResource = [];
      for (const cswRecord of cswRecords) {
         for (const onlineResource of cswRecord.onlineResources){
           if (onlineResource.type === 'WFS') {
             wfsOnlineResource.push(onlineResource);
           }
         }
      }
      return wfsOnlineResource;
  }



}
