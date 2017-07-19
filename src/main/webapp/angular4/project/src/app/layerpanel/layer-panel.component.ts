import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LayerHandlerService } from '../portal-core-ag/service/CSWRecords/layer-handler.service';
import * as $ from 'jquery'
import '../../template/js/apps.js'

// This is necessary to access ol3!
declare var ol: any;
declare var App: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layer-panel.component.html'
})

export class LayerPanelComponent implements OnInit, AfterViewInit {


    layerGroups: {};

    constructor(public layerHandlerService: LayerHandlerService) {}

   ngOnInit(): void {
    this.layerHandlerService.getLayerRecord().subscribe(response => this.layerGroups = response);
  }

  ngAfterViewInit(): void {
    $(document).ready(function() {
      App.init();
    });
  }
}
