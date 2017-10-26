
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { SimpleXMLService } from '../../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Constants } from '../../portal-core-ui/utility/constants.service';
import { AfterViewInit, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { TreeModel } from 'ng2-tree';

@Component({
    selector: 'app-querier-modal-window',
    templateUrl: './querier.modal.component.html'
})

export class QuerierModalComponent implements AfterViewInit {

    // At the moment these are just basic placeholder strings - fancy stuff will come later
    public analyticsContent: string;
    public docs: Array<any>;

    public tree: TreeModel = {
      value: 'Programming languages by programming paradigm',
      children: [
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
    };

    constructor(private bsModalRef: BsModalRef) {
      this.docs = [];
    }

    ngAfterViewInit() {

    }

    public parseTreeCollection(doc: Document, onlineResource: OnlineResourceModel) {
      const rootNode = doc
      let features = null;
      const wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, 'FeatureCollection');
      let featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMembers');
      if (UtilitiesService.isEmpty(featureMembers)) {
        featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, 'featureMember');
        features = featureMembers;
      } else {
        features = featureMembers[0].childNodes;
      }
      for (let i = 0; i < features.length; i++) {
        const featureNode = features[i];
        let name = featureNode.getAttribute('gml:id');
        if (UtilitiesService.isEmpty(name)) {
          name = SimpleXMLService.evaluateXPath(rootNode, featureNode, 'gml:name', Constants.XPATH_STRING_TYPE).stringValue;
          if (UtilitiesService.isEmpty(name)) {
            name = onlineResource.name;
          }
        }
        if (typeof name === 'string' || name.length > 0) {
          this.docs[name] = featureNode;
        }
      }
    }

}
