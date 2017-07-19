import { Component, OnInit } from '@angular/core';
import { LayerHandlerService } from '../portal-core-ag/service/CSWRecords/layer-handler.service';


// This is necessary to access ol3!
declare var ol: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layer-panel.component.html'
})

export class LayerPanelComponent implements OnInit {

    layerGroups: {};

    constructor(public layerHandlerService: LayerHandlerService) {}

   ngOnInit(): void {
    this.layerHandlerService.getLayerRecord().subscribe(response => this.layerGroups = response);
  }
}
