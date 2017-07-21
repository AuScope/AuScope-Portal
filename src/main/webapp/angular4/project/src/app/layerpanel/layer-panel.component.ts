import { Component, OnInit} from '@angular/core';
import { LayerHandlerService } from '../portal-core-ag/service/CSWRecords/layer-handler.service';
import * as $ from 'jquery'
import '../../template/js/apps.js'
import { UILayerModel } from '../model/ui/ui.layer.model';
import { UITabPanel } from '../model/ui/ui.tabpanel.model'


// This is necessary to access ol3!
declare var ol: any;
declare var App: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layer-panel.component.html'
})


export class LayerPanelComponent implements OnInit {

    layerGroups: {};
    uiLayerModels: {}

    constructor(public layerHandlerService: LayerHandlerService) {
      this.uiLayerModels = {};
    }




    public selectTabPanel(layerId, panelType) {
//       for (const key in this.uiLayerModels[layerId].tabpanel) {
//         if (key === panelType) {
//          (<UILayerModel>this.uiLayerModels[layerId]).tabpanel[panelType].expanded = true;
//         }else {
//           (<UILayerModel>this.uiLayerModels[layerId]).tabpanel[panelType].expanded = false;
//         }
//       }
      (<UILayerModel>this.uiLayerModels[layerId]).tabpanel.setPanelOpen(panelType);
     }

     ngOnInit(): void {
      this.layerHandlerService.getLayerRecord().subscribe(
        response => {this.layerGroups = response;
          for (const key in this.layerGroups) {
             for (let i = 0; i < this.layerGroups[key].length; i++) {
               const uiLayerModel = new UILayerModel(this.layerGroups[key][i].id);
               this.uiLayerModels[this.layerGroups[key][i].id] = uiLayerModel;
             }
          }
          $(document).ready(function() {
            App.init();
          });
        });
     }




}
