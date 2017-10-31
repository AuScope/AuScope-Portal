
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { SimpleXMLService } from '../../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Constants } from '../../portal-core-ui/utility/constants.service';
import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { TreeModel } from 'ng2-tree';

@Component({
    selector: 'app-querier-modal-window',
    templateUrl: './querier.modal.component.html'
})

export class QuerierModalComponent implements AfterViewInit {
  public downloading: boolean;
  public docs: any[] = [];
  public collapse: any[] = [];
  public JSONTreeStruct: TreeModel[] = [];


    constructor(public bsModalRef: BsModalRef, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngAfterViewInit() {

    }


    public parseTree(name, doc): void {
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
        tree['children'].push(parseNodeToJson(this.docs[name], 0, 0));

      this.JSONTreeStruct[name] = tree;
    }


}
