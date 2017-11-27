import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LayerHandlerService } from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import * as $ from 'jquery'
import '../../../template/js/apps'
import { LayerAnalyticModalComponent } from '../../modalwindow/layeranalytic/layer.analytic.modal.component';
import { NgbdModalStatusReportComponent } from '../../toppanel/renderstatus/renderstatus.component';
import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { UILayerModel } from '../common/model/ui/uilayer.model';
import { UITabPanel } from '../common/model/ui/uitabpanel.model';
import { RenderStatusService } from '../../portal-core-ui/service/openlayermap/renderstatus/render-status.service';
import { ManageStateService } from '../../portal-core-ui/service/permanentlink/manage-state.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { InfoPanelComponent } from '../common/infopanel/infopanel.component';




declare var App: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layerpanel.component.html'
})


export class LayerPanelComponent implements OnInit {

  layerGroups: {};
  uiLayerModels: {};
  bsModalRef: BsModalRef;
  @ViewChild(InfoPanelComponent) private infoPanel: InfoPanelComponent;
  @Output() expanded: EventEmitter<any> = new EventEmitter();
  searchText: string
  searchMode: boolean;


  constructor(private layerHandlerService: LayerHandlerService, private renderStatusService: RenderStatusService,
    private modalService: BsModalService, private olMapService: OlMapService, private changeDetectorRef: ChangeDetectorRef,
    private manageStateService: ManageStateService) {
    this.uiLayerModels = {};
    this.searchMode = false;
   }

    public selectTabPanel(layerId, panelType) {
      (<UILayerModel>this.uiLayerModels[layerId]).tabpanel.setPanelOpen(panelType);
    }

    public search() {
      if (this.searchText.trim() === '') {
        this.searchMode = false;
      } else {
        this.searchMode = true;
      }

      for (const layerGroupKey in this.layerGroups) {
        this.layerGroups[layerGroupKey].hide = true;
        for (const layer of this.layerGroups[layerGroupKey]) {
          if (layerGroupKey.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
            || layer.description.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
            || layer.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
            layer.hide = false;
            this.layerGroups[layerGroupKey].hide = false;
          } else {
            layer.hide = true;
          }
        }
      }
    }

    public clearSearch() {
      setTimeout(() => {
        this.searchMode = false;
        this.searchText = '';
        this.search();
      }, 0);
    }

    public ngOnInit() {

        const state = UtilitiesService.getUrlParameterByName('state');
        const me = this;
        this.manageStateService.getUnCompressedString(state, function(result) {
          const layerStateObj = JSON.parse(result);
          me.layerHandlerService.getLayerRecord().subscribe(
            response => {
              me.layerGroups = response;
              for (const key in me.layerGroups) {
                for (let i = 0; i < me.layerGroups[key].length; i++) {
                  const uiLayerModel = new UILayerModel(me.layerGroups[key][i].id, me.renderStatusService.getStatusBSubject(me.layerGroups[key][i]));
                  // VT: permanent link
                  if (layerStateObj && layerStateObj[uiLayerModel.id]) {
                    me.layerGroups[key].expanded = true;
                    me.layerGroups[key][i].expanded = true;
                    me.layerGroups[key][i].filterCollection.hiddenParams = layerStateObj[uiLayerModel.id].filterCollection.hiddenParams
                    me.layerGroups[key][i].filterCollection.mandatoryFilters = layerStateObj[uiLayerModel.id].filterCollection.mandatoryFilters
                  }
                  me.uiLayerModels[me.layerGroups[key][i].id] = uiLayerModel;

                }
              }
              $(document).ready(function() {
                App.init();
              });
            });
        })

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
