import { LayerModel } from '../../../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../../../portal-core-ui/model/data/onlineresource.model';
import { Component, Input } from '@angular/core';

@Component({
  template: `
    <div>
      <h4>{{featureId}}</h4>
    </div>
  `
})
export class NVCLDatasetListComponent {
  @Input() layer: LayerModel;
  @Input() onlineResource: OnlineResourceModel;
  @Input() featureId: string;
}
