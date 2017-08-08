import {LayerModel} from '../../../modal/data/layer.model';
import {OnlineResourceModel} from '../../../modal/data/onlineresource.model';
import {StatusMapModel} from '../../../modal/data/statusmap.model';
import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

/**
 * Service class to query for current layer loading status
 */
@Injectable()
export class RenderStatusService {

  private statusmaps;

  constructor() {
    this.statusmaps = {};
  }

  /**
   * Increment the counter when a layer is added. This will also add meta information about the resource to the
   * status map. This should automatically be called from the wfs and wms render service and there should be no reason for user
   * to call this function directly under normal circumstances
   * @param layer the layer that is being render
   * @param resource the resource from the layer that is being added.
   */
  public addResource(layer: LayerModel, resource: OnlineResourceModel) {
    if (!this.statusmaps[layer.id]) {
      this.statusmaps[layer.id] = new StatusMapModel(layer.id);
    }
    (<StatusMapModel>this.statusmaps[layer.id]).addResource(resource);
  }

  /**
   * update the counter when a resource is complete. This will also add meta information about the resource to the
   * status map. This should automatically be called from the wfs and wms render service and there should be no reason for user
   * to call this function directly under normal circumstances
   * @param layer the layer that is being render
   * @param resource the resource from the layer that is being added.
   */
  public updateComplete(layer: LayerModel, resource: OnlineResourceModel, error?: boolean) {
    (<StatusMapModel>this.statusmaps[layer.id]).updateComplete(resource, error);
  }


  /**
   * This is the only function required to get updates on the status. simply subscribe to this and any changes will trigger an event.
   * @param layer the layer that is being render
   * @return BehaviorSubject this can then be subscribed to and any updates will trigger a notification.
   */
  public getStatusBSubject(layer: LayerModel): BehaviorSubject<StatusMapModel> {
    if (!this.statusmaps[layer.id]) {
      this.statusmaps[layer.id] = new StatusMapModel(layer.id);
    }
    return (<StatusMapModel>this.statusmaps[layer.id]).getStatusBSubject();
  }


}
