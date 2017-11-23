import {QuerierModalComponent} from '../modalwindow/querier/querier.modal.component';
import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import olFeature from 'ol/feature';
import olLayer from 'ol/layer/layer';
import {OlMapObject} from '../portal-core-ui/service/openlayermap/ol-map-object';
import {OlMapService} from '../portal-core-ui/service/openlayermap/ol-map.service';
import {OlWFSService} from '../portal-core-ui/service/wfs/ol-wfs.service';
import {QueryWFSService} from '../portal-core-ui/service/wfs/query-wfs.service';
import {OlWMSService} from '../portal-core-ui/service/wms/ol-wms.service';
import {QueryWMSService} from '../portal-core-ui/service/wms/query-wms.service';
import {GMLParserService} from '../portal-core-ui/utility/gmlparser.service';
import {SimpleXMLService} from '../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../portal-core-ui/utility/utilities.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';


@Component({
  selector: 'app-ol-map',
  template: `
    <div #mapElement id="map" class="height-full width-full"> </div>
    `
  // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
})

export class OlMapComponent implements AfterViewInit {
  // This is necessary to access the html element to set the map target (after view init)!
  @ViewChild('mapElement') mapElement: ElementRef;

  private bsModalRef: BsModalRef;

  constructor(public olMapObject: OlMapObject, private olMapService: OlMapService, private olWMSService: OlWMSService,
    private olWFSService: OlWFSService, private modalService: BsModalService,
    private queryWFSService: QueryWFSService, private queryWMSService: QueryWMSService, private gmlParserService: GMLParserService) {
    this.olMapService.getClickedLayerListBS().subscribe(mapClickInfo => {
      this.handleLayerClick(mapClickInfo);
    })
  }


  // After view init the map target can be set!
  ngAfterViewInit() {
    this.olMapObject.getMap().setTarget(this.mapElement.nativeElement.id);
  }

  private handleLayerClick(mapClickInfo) {
    if (UtilitiesService.isEmpty(mapClickInfo)) {
      return;
    }
    // Process lists of features
    const modalDisplayed = {value: false}
    for (const feature of mapClickInfo.clickedFeatureList) {
      // NB: This is just testing that the popup window does display
      this.displayModal(modalDisplayed, mapClickInfo.clickCoord);

      this.queryWFSService.getFeatureInfo(feature.onlineResource, feature.id_).subscribe(result => {
        this.setModal(result, feature, this.bsModalRef);
      },
        err => {
          this.bsModalRef.content.downloading = false;
        });
    }
    // TODO: observer pattern or a callback to return the clicked layer list instead of handling it in map server class.
    for (const layer of mapClickInfo.clickedLayerList) {
      // NB: This is just testing that the popup window does display
      this.displayModal(modalDisplayed, mapClickInfo.clickCoord);
      // TODO: Get the feature info and display in popup
      if (layer.onlineResource) {
        this.bsModalRef.content.downloading = true;
        this.queryWMSService.getFeatureInfo(layer.onlineResource, layer.sldBody, mapClickInfo.pixel, mapClickInfo.clickCoord).subscribe(result => {
          this.setModal(result, layer, this.bsModalRef);
        },
          err => {
            this.bsModalRef.content.downloading = false;
          });
      }
    }
  }

  private displayModal(modalDisplayed, clickCoord) {
    if (modalDisplayed.value === false) {
      this.bsModalRef = this.modalService.show(QuerierModalComponent, {class: 'modal-lg'});
      modalDisplayed.value = true;
      this.bsModalRef.content.downloading = true;
      const vector = this.olMapService.drawDot(clickCoord);
      this.modalService.onHide.subscribe(reason => {
        this.olMapService.removeVector(vector);
      })
    }
  }

  private setModal(result: string, layer: any, bsModalRef: BsModalRef) {
    const treeCollections = SimpleXMLService.parseTreeCollection(this.gmlParserService.getRootNode(result), layer);
    for (const treeCollection of treeCollections) {
      bsModalRef.content.docs.push(treeCollection);
      if (bsModalRef.content.uniqueLayerNames.indexOf(layer.layer.name) === -1) {
        bsModalRef.content.uniqueLayerNames.push(layer.layer.name)
      }
    }
    this.bsModalRef.content.downloading = false;
  }




}
