
import { CSWRecordModel } from '../../model/data/cswrecord.model';
import { Injectable, Inject, SkipSelf } from '@angular/core';
import {LayerModel} from '../../model/data/layer.model'
import { OnlineResourceModel } from '../../model/data/onlineresource.model';
import { PrimitiveModel } from '../../model/data/primitive.model';
import { LayerHandlerService } from '../cswrecords/layer-handler.service';
import { OlMapObject } from '../openlayermap/ol-map-object';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import olMap from 'ol/map';
import olPoint from 'ol/geom/point';
import olProj from 'ol/proj';
import olFeature from 'ol/feature';
import olStyle from 'ol/style/style';
import olIcon from 'ol/style/icon';
import olLayerVector from 'ol/layer/vector';
import olSourceVector from 'ol/source/vector';
import { Observable } from 'rxjs/Rx';
import { GMLParserService } from '../../utility/gmlparser.service';
import { Constants } from '../../utility/constants.service';
import { RenderStatusService } from '../openlayermap/renderstatus/render-status.service';

/**
 * Use OlMapService to add layer to map. This service class adds wfs layer to the map
 */
@Injectable()
export class OlWFSService {

  private map: olMap;

  constructor(private layerHandlerService: LayerHandlerService,
                  private olMapObject: OlMapObject,
                  private http: HttpClient,
                  private gmlParserService: GMLParserService,
                  private renderStatusService: RenderStatusService) {
    this.map = this.olMapObject.getMap();
  }

  /**
   * A get feature request
   * @param layer the wfs layer for the getfeature request to be made
   * @param onlineresource the wfs online resource
   * @return Observable the observable from the http request
   */
  public getFeature(layer: LayerModel, onlineResource: OnlineResourceModel): Observable<any> {

    const httpParams = new HttpParams().set('serviceUrl', onlineResource.url);
    httpParams.append('typeName', onlineResource.name);

    if (layer.proxyUrl) {
      return this.http.get('../' + layer.proxyUrl, {
        params: httpParams
      }).map(response => {
        return response['data'];
      });
    }else {
      return Observable.create(function () {
            return undefined;
        });
    }
  }

  /**
   * Add geometry type point to the map
   * @param layer the layer where this point derived from
   * @param primitive the point primitive
   */
  public addPoint(layer: LayerModel, primitive: PrimitiveModel): void {
     const geom = new olPoint(olProj.transform([primitive.coords.lng, primitive.coords.lat], 'EPSG:4326', 'EPSG:3857'));
       const feature = new olFeature(geom);
       feature.setStyle([
          new olStyle({
             image: new olIcon(({
                     anchor: [0.5, 1],
                     anchorXUnits: 'fraction',
                     anchorYUnits: 'fraction',
                     // size: [32, 32],
                     scale: 0.5,
                     opacity: 1,
                     src: layer.iconUrl
           }))
          })
       ]);

       if (primitive.name) {
         feature.setId(primitive.name);
       }
    (<olLayerVector>this.olMapObject.getLayerById(layer.id)).getSource().addFeature(feature);
  }

  public addLine(primitive: PrimitiveModel): void {

  }

  public addPoloygon(primitive: PrimitiveModel): void {

  }

  /**
   * Add the wfs layer
   * @param the wfs layer to be added to the map
   */
  public addLayer(layer: LayerModel): void {
    const wfsOnlineResources = this.layerHandlerService.getWFSResource(layer);

    // VT: create the vector on the map if it does not exist.
    if (!this.olMapObject.getLayerById(layer.id)) {
        const markerLayer = new olLayerVector({
                    source: new olSourceVector({ features: []})
                });

        this.olMapObject.addLayerById(markerLayer, layer.id);
    }


    for (const onlineResource of wfsOnlineResources){
      this.renderStatusService.addResource(layer, onlineResource);
      this.getFeature(layer, onlineResource).subscribe(response => {
        this.renderStatusService.updateComplete(layer, onlineResource);
        const rootNode = this.gmlParserService.getRootNode(response.gml);
        const primitives = this.gmlParserService.makePrimitives(rootNode);
        for (const primitive of primitives){
          switch (primitive.geometryType) {
            case Constants.geometryType.POINT:
               this.addPoint(layer, primitive);
              break
            case Constants.geometryType.LINESTRING:
               this.addLine(primitive);
               break;
            case Constants.geometryType.POLYGON:
               this.addPoloygon(primitive);
               break;
          }
        }

      },
      err =>  {
        this.renderStatusService.updateComplete(layer, onlineResource, true);
      })
    }
  }

  public addCSWRecord(cswRecord: CSWRecordModel) {

  }


}
