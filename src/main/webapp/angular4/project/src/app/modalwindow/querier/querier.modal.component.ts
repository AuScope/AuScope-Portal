
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
        value: 'Programming languages by programming paradigm',
        children: []
      }
      tree['children'] = [
      {
        value: 'Object-oriented programming',
        children: [
          {value: 'Java'},
          {value: 'C++'},
          {value: 'C#'}
        ]
      },
      {
        value: 'Prototype-based programming',
        children: [
          {value: 'JavaScript'},
          {value: 'CoffeeScript'},
          {value: 'Lua'}
        ]
      }
    ]

      this.JSONTreeStruct[name] = tree;
    }

//    public parseTreeCollection(rootNode: Document, onlineResource: OnlineResourceModel) {
//
//      let displayable = false;
//
//      if (rootNode) {
//        let features = null;
//        const wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'FeatureCollection');
//        if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
//          // Check for error reports - some WMS servers mark their error reports with <ServiceExceptionReport>, some with <html>
//          const exceptionNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'ServiceExceptionReport');
//          const serviceErrorNode = SimpleXMLService.evaluateXPath(rootNode, rootNode, 'html', Constants.XPATH_UNORDERED_NODE_ITERATOR_TYPE);
//          const nextNode = serviceErrorNode.iterateNext();
//          if (!UtilitiesService.isEmpty(exceptionNode) || nextNode != null) {
//            // There is an error report from the server;
//            this.docs['Server Error'] = document.createTextNode('Sorry - server has returned an error message. See browser console for more information');
//            return true;
//          }
//          const featureInfoNode = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'FeatureInfoResponse');
//          if (UtilitiesService.isEmpty(featureInfoNode)) {
//            // Assume the node to be a feature node.
//            features = [rootNode];
//          } else {
//            // 'text/xml'
//            const fieldNodes = SimpleXMLService.getMatchingChildNodes(featureInfoNode[0], null, 'FIELDS');
//            if (UtilitiesService.isEmpty(fieldNodes)) {
//              features = featureInfoNode;
//            } else {
//              features = fieldNodes;
//              for (let i = 0; i < features.length; i++) {
//                let name = features[i].getAttribute('identifier');
//                if (!name) {
//                  name = onlineResource.name;
//                }
//                this.docs[name] = features[i];
//                const displayStr = ' ';
//                displayable = true;
//              }
//              return displayable;
//            }
//          }
//        } else {
//          let featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMembers');
//          if (UtilitiesService.isEmpty(featureMembers)) {
//            featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMember');
//            features = featureMembers;
//          } else {
//            features = featureMembers[0].childNodes;
//          }
//
//        }
//        for (let i = 0; i < features.length; i++) {
//          const featureNode = features[i];
//          let name = featureNode.getAttribute('gml:id');
//          if (UtilitiesService.isEmpty(name)) {
//            name = SimpleXMLService.evaluateXPath(rootNode, featureNode, 'gml:name', Constants.XPATH_STRING_TYPE).stringValue;
//            if (UtilitiesService.isEmpty(name)) {
//              name = onlineResource.name;
//            }
//          }
//          if (typeof name === 'string' || name.length > 0) {
//            this.docs[name] = featureNode;
//            displayable = true;
//          }
//        }
//      }
//
//      return displayable;
//    }

    public updateView() {
      this.changeDetectorRef.detectChanges();
    }

}
