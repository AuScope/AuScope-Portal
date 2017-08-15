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
export class LayerHandlerService {

  private layerRecord;
  private getCSWUrl;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig ) {
    this.layerRecord = [];

  }

  /**
   * Retrive csw records from the service and organize them by group
   */
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

  /**
   * Check if layer contains wms records
   * @param layer the layer to query for wms records
   * @return true if wms resource exists
   */
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

 /**
   * Search and retrieve only wms records
   * @param layer the layer to query for wms records
   */
  public getWMSResource (layer: LayerModel): OnlineResourceModel[] {
       return this.getOnlineResources(layer, 'WMS')
  }

  /**
   * Check if layer contains wfs records
   * @param layer the layer to query for wfs records
   * @return true if wfs resource exists
   */
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

  /**
   * Search and retrieve only wfs records
   * @param layer the layer to query for wfs records
   */
  public getWFSResource (layer: LayerModel): OnlineResourceModel[] {
    return this.getOnlineResources(layer, 'WFS')
  }

  /**
    * Extract resources based on the type. If type is not defined, return all the resource
    * @method getOnlineResources
    * @param layer - the layer we would like to extract onlineResource from
    * @param resourceType - OPTIONAL a enum of the resource type. The ENUM constant is defined on app.js
    * @return resources - an array of the resource. empty array if none is found
    */
  public getOnlineResources(layer: LayerModel, resourceType?: string): OnlineResourceModel[] {
    const cswRecords: CSWRecordModel[] = layer.cswRecords;
    const onlineResourceResult = [];
    const uniqueURLSet = new Set<string>();
    for (const cswRecord of cswRecords) {
      for (const onlineResource of cswRecord.onlineResources) {
        if (resourceType && onlineResource.type === resourceType) {
          if (!uniqueURLSet.has(onlineResource.url)) {
            onlineResourceResult.push(onlineResource);
            uniqueURLSet.add(onlineResource.url);
          }
        }else if (!resourceType) {
          if (!uniqueURLSet.has(onlineResource.url)) {
            onlineResourceResult.push(onlineResource);
            uniqueURLSet.add(onlineResource.url);
          }
        }
      }
    }
    return onlineResourceResult;
  }

  /**
    * Extract resources based on the type. If type is not defined, return all the resource
    * @method getOnlineResources
    * @param layer - the layer we would like to extract onlineResource from
    * @param resourceType - OPTIONAL a enum of the resource type. The ENUM constant is defined on app.js
    * @return resources - an array of the resource. empty array if none is found
    */
  public getOnlineResourcesFromCSW(cswRecord: CSWRecordModel, resourceType?: string): OnlineResourceModel[] {

    const onlineResourceResult = [];
    const uniqueURLSet = new Set<string>();

      for (const onlineResource of cswRecord.onlineResources) {
        if (resourceType && onlineResource.type === resourceType) {
          if (!uniqueURLSet.has(onlineResource.url)) {
            onlineResourceResult.push(onlineResource);
            uniqueURLSet.add(onlineResource.url);
          }
        }else if (!resourceType) {
          if (!uniqueURLSet.has(onlineResource.url)) {
            onlineResourceResult.push(onlineResource);
            uniqueURLSet.add(onlineResource.url);
          }
        }
      }

    return onlineResourceResult;
  }



}
