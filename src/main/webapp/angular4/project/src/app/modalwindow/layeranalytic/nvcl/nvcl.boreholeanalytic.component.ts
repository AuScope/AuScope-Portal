
import { LayerModel } from '../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../portal-core-ui/model/data/onlineresource.model';
import { NVCLBoreholeAnalyticService } from './nvcl.boreholeanalytic.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  templateUrl: './nvcl.boreholeanalytic.component.html',
  providers : [NVCLBoreholeAnalyticService]
})
export class NVCLBoreholeAnalyticComponent implements AfterViewInit {

  @Input() layer: LayerModel;
  public nvclform;
  public algorithms;
  public selectedAlgorithm;
  public selectedVersion;
  public classifications;

  constructor(public nvclBoreholeAnalyticService: NVCLBoreholeAnalyticService) {
    this.nvclform = {};
  }


  ngAfterViewInit(): void {
    this.nvclBoreholeAnalyticService.getNVCLAlgorithms().subscribe(results => {
      this.algorithms = results;
    });
  }


  public changeAlgorithm() {

  }

  public changeVersion() {

    this.nvclBoreholeAnalyticService.getNVCLClassifications([this.selectedVersion.algorithmOutputId]).subscribe(classifications => {
      this.classifications = classifications
    })
  }


}
