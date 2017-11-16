
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { SimpleXMLService } from '../../portal-core-ui/utility/simplexml.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Constants } from '../../portal-core-ui/utility/constants.service';
import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {environment} from '../../../environments/environment';
import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';

import * as $ from 'jquery'


@Component({
  selector: 'app-layer-modal-window',
  templateUrl: './layer.analytic.modal.component.html'
})

export class LayerAnalyticModalComponent implements AfterViewInit {
  public analyticMap;
  public layer: LayerModel;


  constructor(public bsModalRef: BsModalRef) {

  }

    ngAfterViewInit() {

    }


}
