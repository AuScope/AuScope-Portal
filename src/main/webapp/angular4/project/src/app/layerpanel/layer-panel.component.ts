import { Component, OnInit} from '@angular/core';
import { LayerHandlerService } from '../portal-core-ag/service/CSWRecords/layer-handler.service';
import * as $ from 'jquery'
import '../../template/js/apps.js'
import { UITabPanel } from '../portal-core-ag/modal/ui/ui.tabpanel.model'

// This is necessary to access ol3!
declare var ol: any;
declare var App: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layer-panel.component.html'
})


export class LayerPanelComponent implements OnInit {

    layerGroups: {};
    uiTabPanels;

    constructor(public layerHandlerService: LayerHandlerService) {
      this.uiTabPanels = {};
    }

  public expandLayer(layer) {
    layer.expanded = !layer.expanded;
    if (!this.uiTabPanels[layer.id]) {
      const uipanel = new UITabPanel();
      uipanel.id = layer.id;
      uipanel.panelstatus = [true, false, false]
      this.uiTabPanels[layer.id] = uipanel
    }
  }


  public selectTabPanel(layerId, panelOrder) {
    const panelstatusArray = (<UITabPanel>this.uiTabPanels[layerId]).panelstatus;
    for (let i = 0; i <  panelstatusArray.length; i++) {
      if (i === panelOrder) {
        (<UITabPanel>this.uiTabPanels[layerId]).panelstatus[i] = true;
      }else {
        (<UITabPanel>this.uiTabPanels[layerId]).panelstatus[i] = false;
      }


    }
  }

   ngOnInit(): void {
    this.layerHandlerService.getLayerRecord().subscribe(
      response => {this.layerGroups = response;
        $(document).ready(function() {
          App.init();
        });
      });
  }




}
