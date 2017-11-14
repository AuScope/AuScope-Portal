import { RickshawService } from './rickshaw.service';
import { LayerModel } from '../../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../../portal-core-ui/model/data/onlineresource.model';
import { NVCLService } from './nvcl.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery'

declare var Rickshaw: any;
declare var d3: any;


@Component({
  templateUrl: './nvcl.datasetlist.component.html',
  providers: [NVCLService, RickshawService]
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
  public drawGraphMode = false;
  public selectedLogNames = [];
  public processingGraph = false;

  constructor(public nvclService: NVCLService, public domSanitizer: DomSanitizer, private rickshawService: RickshawService) {}


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

  public drawGraph(logIds: Array<string>, logNames: Array<string>) {

    this.nvclService.getNVCL2_0_JSONDataBinned(this.onlineResource.url, logIds).
      subscribe(response => {
        this._drawNVCLDataGraph(response.data, response.success, logIds, logNames);
      })

  }

  private _drawNVCLDataGraph(response, success, logIds, logNames) {
    const this_ptr = this;
    if (success) {
      // Once we have received the plot data, reformat it into (x,y) values and create colour table
      const metric_colours = new Object;
      const data_bin = new Object;
      let has_data = false;
      const yaxis_labels = new Object;
      const yaxis_keys = [];
      const jsonObj = JSON.parse(response);
      // {"success":true, "data":[{ "logId":"logid_1", "stringValues":[{"roundedDepth":170.5,"classCount":1,"classText":"Alunite-K","colour":4351080},
      if (success) {
        const dataObj = jsonObj;
        for (let i = 0; i < dataObj.length; i++) {
          const bv = dataObj[i];
          ['stringValues', 'numericValues'].forEach(function(dataType) {
            if (bv.hasOwnProperty(dataType) && bv[dataType].length > 0) {
              // Find the log name for our log id, this will be our 'metric_name'
              const metric_name = this_ptr.nvclService._findLogName(bv.logId, logIds, logNames);
              if (metric_name.length > 0) {
                if (!(metric_name in data_bin)) {
                  data_bin[metric_name] = new Object;
                }
                bv[dataType].forEach(function(val) {

                  // "stringValues" ==> units are called "Sample Count" and "numericValues" ==> "Meter Average"
                  if (dataType === 'stringValues') {
                    const key = val.classText;
                    // Use the supplied colour for each metric
                    if (!(key in metric_colours)) {
                      metric_colours[key] = this_ptr.nvclService._colourConvert(val.colour);
                    }

                    // Start to create graphing data
                    if (!(key in data_bin[metric_name])) {
                      data_bin[metric_name][key] = [];
                      if (!(metric_name in yaxis_labels)) {
                        yaxis_labels[metric_name] = 'Sample Count';
                        yaxis_keys.push(metric_name);
                      }
                    }

                    // Depth is 'x' and 'y' is our measured value
                    data_bin[metric_name][key].push({'x': parseFloat(val.roundedDepth), 'y': parseFloat(val.classCount)});
                    has_data = true;

                  } else if (dataType === 'numericValues') {
                    // Start to create graphing data
                    if (!(metric_name in data_bin[metric_name])) {
                      data_bin[metric_name][metric_name] = [];
                      if (!(metric_name in yaxis_labels)) {
                        yaxis_labels[metric_name] = 'Meter Average';
                        yaxis_keys.push(metric_name);
                      }
                    }
                    // Depth is 'x' and 'y' is our measured value
                    data_bin[metric_name][metric_name].push({'x': parseFloat(val.roundedDepth), 'y': parseFloat(val.averageValue)});
                    has_data = true;
                  } // if
                }); // for each
              } // if
            } // if
          }); // for each
        } // for
      } // if

      // Call 'genericPlot()'
      if (has_data) {
        this.processingGraph = false;
        this.rickshawService.plot(data_bin, 'Depth', yaxis_labels, yaxis_keys, metric_colours);
      } else {
        alert('Sorry, the selected dataset has no data. Please select a different dataset');
      }

    } else {
      alert('Failed to load resources');

    } // if success
  }

  private _drawNVCLJobsGraph(response, success, logid_colour_table, logIds, logNames) {
    if (success) {
      // Once we have received the plot data, reformat it into (x,y) values and create colour table
      const metric_colours = new Object;
      const data_bin = new Object;
      let has_data = false;
      const yaxis_labels = new Object;
      const yaxis_keys = [];
      const re = new RegExp('[^A-Za-z0-9]', 'g');
      const jsonObj = JSON.parse(response);
      if ('success' in jsonObj && jsonObj.success === true && jsonObj.data.length > 0) {
        jsonObj.data[0].binnedValues.forEach(function(bv) {
          ['stringValues', 'numericValues'].forEach(function(dataType) {
            if (bv.startDepths.length === bv[dataType].length && bv[dataType].length > 0) {
              const metric_name = bv.name;
              if (!(metric_name in data_bin)) {
                data_bin[metric_name] = new Object;
              }

              bv[dataType].forEach(function(val, idx, arr) {

                // "stringValues" ==> units are called "Sample Count" and "numericValues" ==> "Meter Average"
                if (dataType === 'stringValues') {

                  // Using entries(), make a name,value list, then use that to add to 'data_bin[metric_name]'
                  d3.entries(val).forEach(function(meas) {
                    const key = meas.key;
                    if (!(key in metric_colours)) {
                      let logIdIdx = 999999;
                      // First, find the logid for the metric returned from the graph data so that mineral colours can be found for graph data
                      for (let j = 0; j < logNames.length; j++) {
                        // Unfortunately the metric names from the two services do not correspond exactly
                        if (metric_name.replace(re, '').toUpperCase() === logNames[j].replace(re, '').toUpperCase()) {
                          logIdIdx = j;
                          break;
                        }
                      }
                      // If mineral name can be found in 'logid_colour_table' put the appropriate colour in the 'metric_colours' table
                      if ((logIds.length > logIdIdx) && (logIds[logIdIdx] in logid_colour_table) && (meas.key in logid_colour_table[logIds[logIdIdx]])) {
                        metric_colours[key] = logid_colour_table[logIds[logIdIdx]][meas.key];
                      }
                    }
                    // Start to create graphing data
                    if (!(key in data_bin[metric_name])) {
                      data_bin[metric_name][key] = [];
                      if (!(metric_name in yaxis_labels)) {
                        yaxis_labels[metric_name] = 'Sample Count';
                        yaxis_keys.push(metric_name);
                      }
                    }

                    // Depth is 'x' and 'y' is our measured value
                    data_bin[metric_name][key].push({'x': parseFloat(bv.startDepths[idx]), 'y': parseFloat(meas.value)});
                    has_data = true;

                  });
                } else if (dataType === 'numericValues') {
                  // Start to create graphing data
                  if (!(metric_name in data_bin[metric_name])) {
                    data_bin[metric_name][metric_name] = [];
                    if (!(metric_name in yaxis_labels)) {
                      yaxis_labels[metric_name] = 'Meter Average';
                      yaxis_keys.push(metric_name);
                    }
                  }
                  // Depth is 'x' and 'y' is our measured value
                  data_bin[metric_name][metric_name].push({'x': parseFloat(bv.startDepths[idx]), 'y': parseFloat(val)});
                  has_data = true;
                } // if
              }); // for each
            } // if
          }); // for each
        }); // for each
      } // if

      // Call 'genericPlot()'
      if (has_data) {
        this.rickshawService.plot(data_bin, 'Depth', yaxis_labels, yaxis_keys, metric_colours);
      } else {
        alert('Sorry, the selected dataset has no data. Please select a different dataset');
      }

    } else {
      alert('Failed to load resources');
    } // if success
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

  public changeDrawGraphMode(mode: boolean, datasetId: string) {
    this.drawGraphMode = mode;
    if (mode) {
      const logs = this.datasetScalars[datasetId];
      const logIds = [];
      const logNames = [];

      for (const log of logs) {
        if (log.value) {
          logIds.push(log.logId);
          logNames.push(log.logName);
        }
      }
      this.selectedLogNames[datasetId] = logNames;
      if (logIds.length <= 0) {
        alert('no logs selected');
      }
      const me = this;
      setTimeout(() => {
        me.processingGraph = true;
        me.drawGraph(logIds, logNames);

      }, 0);
    } else {
      this.selectedLogNames = [];
    }
  }

  public clearCheckBox(datasetId: string) {
     const logs = this.datasetScalars[datasetId];
      for (const log of logs) {
        if (log.value) {
         log.value = false;
        }
      }
  }
}
