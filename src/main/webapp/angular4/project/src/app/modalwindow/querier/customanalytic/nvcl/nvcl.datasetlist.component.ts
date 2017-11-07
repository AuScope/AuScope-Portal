import { LayerModel } from '../../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../../portal-core-ui/model/data/onlineresource.model';
import { NVCLService } from './nvcl.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(public nvclService: NVCLService, public domSanitizer: DomSanitizer) {}


  ngAfterViewInit(): void {
    this.nvclService.getNVCLDatasets(this.onlineResource.url, this.featureId).subscribe(result => {
      this.nvclDatasets = result;
      for (const nvclDataset of this.nvclDatasets) {
        nvclDataset.image = true;
        nvclDataset.scalar = false;
        nvclDataset.download = false;
        this._getNVCLLogs(nvclDataset.datasetId);
      }
    })
  }

  private _getNVCLLogs(datasetId: string) {
    if (this.datasetImages[datasetId]) {
      return;
    }
    this.nvclService.getNVCL2_0_Logs(this.onlineResource.url, datasetId).subscribe(trayImages => {
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
}
