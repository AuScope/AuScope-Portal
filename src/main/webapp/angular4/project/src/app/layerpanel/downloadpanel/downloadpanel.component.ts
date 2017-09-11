import {LayerModel} from '../../portal-core-ui/model/data/layer.model';
import {LayerHandlerService} from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import {Component, Input} from '@angular/core';
import {UtilitiesService} from '../../portal-core-ui/utility/utilities.service';

@Component({
  selector: 'app-download-panel',
  templateUrl: './downloadpanel.component.html'
})


export class DownloadPanelComponent {

  @Input() layer: LayerModel;


  constructor(private layerHandlerService: LayerHandlerService, ) {

  }

  public drawBound(): void {

  }

}
