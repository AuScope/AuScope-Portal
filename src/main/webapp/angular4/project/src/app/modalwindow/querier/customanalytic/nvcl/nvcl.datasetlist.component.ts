import { LayerModel } from '../../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../../portal-core-ui/model/data/onlineresource.model';
import { NVCLService } from './nvcl.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery'

declare var Rickshaw: any;

@Component({
  templateUrl: './nvcl.datasetlist.component.html',
  providers: [NVCLService]
})
export class NVCLDatasetListComponent implements AfterViewInit {

  @Input() layer: LayerModel;
  @Input() onlineResource: OnlineResourceModel;
  @Input() featureId: string;
  public nvclDatasets: any[];
  public collapse: any[] = [];
  public datasetImages: any[] = [];
  public datasetScalars: any[] = [];
  public datasetScalarDefinition: string[] = [];

  constructor(public nvclService: NVCLService, public domSanitizer: DomSanitizer) {}


  ngAfterViewInit(): void {

    this.nvclService.getNVCLDatasets(this.onlineResource.url, this.featureId).subscribe(result => {
      this.nvclDatasets = result;
      for (const nvclDataset of this.nvclDatasets) {
        nvclDataset.image = true;
        nvclDataset.scalar = false;
        nvclDataset.download = false;
        this._getNVCLImage(this.onlineResource.url, nvclDataset.datasetId);
        this._getNVCLScalar(this.onlineResource.url, nvclDataset.datasetId);
      }
    })
  }

  public drawGraph() {
    const graph = new Rickshaw.Graph({
      element: $('#graph123')[0],
      series: [
        {
          color: 'steelblue',
          data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}]
        }, {
          color: 'lightblue',
          data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}]
        }
      ]
    });

    graph.render();
  }

  public getDefinition(logName: string): void {
    this.datasetScalarDefinition[logName] = {
      definition: 'Loading ...'
    }
    this.nvclService.getLogDefinition(logName).subscribe(result => {
      this.datasetScalarDefinition[logName] = result;
    })
  }

  private _getNVCLImage(url: string, datasetId: string) {
    if (this.datasetImages[datasetId]) {
      return;
    }
    this.nvclService.getNVCL2_0_Images(url, datasetId).subscribe(trayImages => {
      for (const trayImage of trayImages) {
        if (trayImage.logName === 'Tray Thumbnail Images') {
          this.datasetImages[datasetId] = []
          let httpParams = new HttpParams();
          httpParams = httpParams.append('serviceUrl', this.nvclService.getNVCLDataServiceUrl(this.onlineResource.url));
          httpParams = httpParams.append('logId', trayImage.logId);
          httpParams = httpParams.append('dataSetId', datasetId);
          httpParams = httpParams.append('width', '3');
          this.datasetImages[datasetId].push('getNVCL2_0_Thumbnail.do?' + httpParams.toString());
        }
      }
    })
  }

  private _getNVCLScalar(url: string, datasetId: string) {
    if (this.datasetScalars[datasetId]) {
      return;
    }
    this.nvclService.getNVCLScalars(url, datasetId).subscribe(scalars => {
      this.datasetScalars[datasetId] = scalars;
    })
  }
}
