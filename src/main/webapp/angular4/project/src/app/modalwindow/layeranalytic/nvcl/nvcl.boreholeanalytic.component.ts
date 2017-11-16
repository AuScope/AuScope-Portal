
import { LayerModel } from '../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../portal-core-ui/model/data/onlineresource.model';
import { Component, Input, AfterViewInit } from '@angular/core';


@Component({
  templateUrl: './nvcl.boreholeanalytic.component.html'
})
export class NVCLBoreholeAnalyticComponent implements AfterViewInit {

  @Input() layer: LayerModel;

  constructor() {}


  ngAfterViewInit(): void {

  }


}
