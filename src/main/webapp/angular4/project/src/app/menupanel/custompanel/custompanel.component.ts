import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { LayerHandlerService } from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import * as $ from 'jquery'
import '../../../template/js/apps'
import { NgbdModalStatusReportComponent } from '../../toppanel/renderstatus/renderstatus.component';
import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { RenderStatusService } from '../../portal-core-ui/service/openlayermap/renderstatus/render-status.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { InfoPanelComponent } from '../common/infopanel/infopanel.component';
import { UILayerModel } from '../common/model/ui/uilayer.model';



declare var App: any;

@Component({
    selector: '[appCustomPanel]',
    templateUrl: './custompanel.component.html'
})


export class CustomPanelComponent {

   private searchUrl: string;
   private loading: boolean;

   layerGroups: {};
    uiLayerModels: {};
    bsModalRef: BsModalRef;
    @ViewChild(InfoPanelComponent) private infoPanel: InfoPanelComponent;
    @Output() expanded: EventEmitter<any> = new EventEmitter();

    constructor(private layerHandlerService: LayerHandlerService, private renderStatusService: RenderStatusService,
      private modalService: BsModalService, private olMapService: OlMapService) {
      this.uiLayerModels = {};
      this.loading = false;
    }

    public selectTabPanel(layerId, panelType) {
      (<UILayerModel>this.uiLayerModels[layerId]).tabpanel.setPanelOpen(panelType);
    }

    public search() {
      this.loading = true;
      this.layerHandlerService.getCustomLayerRecord(this.searchUrl).subscribe(
        response => {
          this.layerGroups = response;
          this.loading = false;
          for (const key in this.layerGroups) {
            for (let i = 0; i < this.layerGroups[key].length; i++) {
              const uiLayerModel = new UILayerModel(this.layerGroups[key][i].id, this.renderStatusService.getStatusBSubject(this.layerGroups[key][i]));
              this.uiLayerModels[this.layerGroups[key][i].id] = uiLayerModel;
            }
          }
        });
    }

    public openStatusReport(uiLayerModel: UILayerModel) {
      this.bsModalRef = this.modalService.show(NgbdModalStatusReportComponent, {class: 'modal-lg'});
      uiLayerModel.statusMap.getStatusBSubject().subscribe((value) => {
        this.bsModalRef.content.resourceMap = value.resourceMap;
      });
    }

    public removeLayer(layer: LayerModel) {
      this.olMapService.removeLayer(layer);
    }

}
