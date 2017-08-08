import {LayerModel} from '../../../modal/data/layer.model';
import {OnlineResourceModel} from '../../../modal/data/onlineresource.model';
import {StatusMapModel} from '../../../modal/data/statusmap.model';
import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class RenderStatusService {

  private statusmaps;

  constructor() {
    this.statusmaps = {};
  }

  public addResource(layer: LayerModel, resource: OnlineResourceModel) {
    if (!this.statusmaps[layer.id]) {
      this.statusmaps[layer.id] = new StatusMapModel(layer.id);
    }
    (<StatusMapModel>this.statusmaps[layer.id]).addResource(resource);
  }

  public updateComplete(layer: LayerModel, resource: OnlineResourceModel, error?: boolean) {
    (<StatusMapModel>this.statusmaps[layer.id]).updateComplete(resource, error);
  }

  // VT: This is the only function required to get updates on the status. simply subscribe to this and any changes will trigger an event.
  public getStatusBSubject(layer: LayerModel): BehaviorSubject<StatusMapModel> {
    if (!this.statusmaps[layer.id]) {
      this.statusmaps[layer.id] = new StatusMapModel(layer.id);
    }
    return (<StatusMapModel>this.statusmaps[layer.id]).getStatusBSubject();
  }


}

