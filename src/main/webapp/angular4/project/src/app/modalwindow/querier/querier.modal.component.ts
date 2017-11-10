
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { SimpleXMLService } from '../../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Constants } from '../../portal-core-ui/utility/constants.service';
import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { TreeModel } from 'ng2-tree';
import {environment} from '../../../environments/environment';
import { RickshawService } from '../../portal-core-ui/chart/rickshaw.service';
import { NVCLService } from './customanalytic/nvcl/nvcl.service';
import * as $ from 'jquery'

declare var Rickshaw: any;
declare var d3: any;

@Component({
  selector: 'app-querier-modal-window',
  templateUrl: './querier.modal.component.html',
  providers: [NVCLService]
})

export class QuerierModalComponent implements AfterViewInit {
  public downloading: boolean;
  public docs: any[] = [];
  public collapse: any[] = [];
  public JSONTreeStruct: TreeModel[] = [];
  public uniqueLayerNames: string[] = [];
  public selectLayerNameFilter = 'ALL';
  public analyticMap;
  public tab: {};


    constructor(public bsModalRef: BsModalRef, private changeDetectorRef: ChangeDetectorRef, private nvclService: NVCLService, private rickshawService: RickshawService) {
      this.analyticMap = environment.analytic;
    }

    ngAfterViewInit() {
      this.drawGraph();
    }

    public drawGraph() {
      const logIds =  ['365006af-af17-429e-a577-a62ba1d6d1d', '108eb1af-6de2-45cf-a7d8-023b18fd571'];
      const logNames =  ['Grp1 uTSAT', 'Grp1 uTSAV'];
      this.nvclService.getNVCL2_0_JSONDataBinned('http://geology.data.nt.gov.au:80/wfs',
        logIds).
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
            if ('success' in jsonObj && jsonObj.success === true && jsonObj.data.length > 0 ) {
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

    public parseTree(document): void {
      const name = document.key;
      const doc = document.value;
      if (!document.home) {
        document.home = true;
      }

      if (!document.loadSubComponent) {
        document.loadSubComponent = true;
      }

      if (this.JSONTreeStruct[name]) {
        return;
      }

      const tree: TreeModel = {
        id: 'root' + name,
        value: name,
        children: []
      }

      const parseNodeToJson = function(node, tier, child): any{
            const attrArr = SimpleXMLService.getMatchingAttributes(node);
            const attrChildren = [];
            if (attrArr) {
                for (let i = 0; i < attrArr.length; i++) {
                    if (attrArr[i].name && attrArr[i].value) {
                        attrChildren.push({value: attrArr[i].name + ': ' + attrArr[i].value});
                    }
                }
            }
            if (SimpleXMLService.isLeafNode(node)) {
                return ({
                    value : SimpleXMLService.getNodeLocalName(node),
                    id: 'id' + tier + child,
                    children : [{
                        value : SimpleXMLService.getNodeTextContent(node),
                        id: 'id' + (tier + 1) + child
                        // children : attrChildren
                    }]
                });

            }else {
                const nodeObj =  {
                        value : SimpleXMLService.getNodeLocalName(node),
                        id: 'id' + tier,
                        children : attrChildren
                };

                const child = SimpleXMLService.getMatchingChildNodes(node);
                for (let i = 0; i < child.length; i++) {
                    nodeObj.children.push(parseNodeToJson(child[i], tier + 1, i));
                }
                return nodeObj
            }

        };
        tree['children'].push(parseNodeToJson(doc, 0, 0));

      this.JSONTreeStruct[name] = tree;
    }



}
