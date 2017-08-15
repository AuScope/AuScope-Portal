import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Component, Input} from '@angular/core';


@Component({
    selector: 'app-filter-panel',
    templateUrl: './filterpanel.component.html'
})


export class FilterPanelComponent {


  @Input() layer: LayerModel;

  constructor(private olMapService: OlMapService) {}

  public addLayer(layer): void {
    this.olMapService.addLayer(layer);
  }

  public getKey(options: Object): string {
    return UtilitiesService.getKey(options);
  }

}
