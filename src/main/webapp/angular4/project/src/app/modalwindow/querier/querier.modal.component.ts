
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { SimpleXMLService } from '../../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Constants } from '../../portal-core-ui/utility/constants.service';
import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TreeModel } from 'ng2-tree';
import {environment} from '../../../environments/environment';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { NVCLService } from './customanalytic/nvcl/nvcl.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import * as $ from 'jquery'


@Component({
  selector: 'app-querier-modal-window',
  templateUrl: './querier.modal.component.html',
  providers: [NVCLService]
})

export class QuerierModalComponent {
  public downloading: boolean;
  public docs: any[] = [];
  public collapse: any[] = [];
  public JSONTreeStruct: TreeModel[] = [];
  public uniqueLayerNames: string[] = [];
  public selectLayerNameFilter = 'ALL';
  public analyticMap;
  public tab: {};


  constructor(public bsModalRef: BsModalRef, private nvclService: NVCLService) {
    this.analyticMap = environment.analytic;
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
