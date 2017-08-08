import { OnlineResourceModel } from './onlineresource.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

/**
 * A representation of the current rendering status of a layer. User should not be directly accessing these under
 * normal circumstances. Use RenderStatusService instead which provides a wrapper to get these updates
 */
export class StatusMapModel {
  private layerid: string;
  private total: number;
  private completed: number;
  private completePercentage: string;
  private resourceMap: Object;
  private renderComplete: boolean;
  private renderStarted: boolean;
  private _statusMap = new BehaviorSubject<StatusMapModel>(this);

  constructor(layerid: string) {
    this.layerid = layerid;
    this.completed = 0;
    this.total = 0;
    this.resourceMap = {};
    this.renderComplete = false;
    this.renderStarted = false;
  }

  /**
   * Add resource to the counter and update its status
   * @param onlineresource  online resource that is being loaded now
   */
  public addResource(onlineresource: OnlineResourceModel) {
    this.resourceMap[onlineresource.url] = 'Loading...';
    this.total += 1;
    this.renderStarted = true;
    this._statusMap.next(this);
  }

  /**
   * update the counter for each completed job
   * @param onlineresource  online resource that is being updated
   * @param error? a optional parameter to flag there was an error in the download of the resource.
   */
  public updateComplete(onlineresource: OnlineResourceModel, error?: boolean) {
    this.completed += 1;
    this.completePercentage = Math.floor(this.completed / this.total * 100) + '%';
    if (error) {
      this.resourceMap[onlineresource.url] = 'Error';
    }else {
      this.resourceMap[onlineresource.url] = 'Complete';
    }
    if (this.completed === this.total) {
      this.renderComplete = true;
      this._statusMap.next(this);
    }
  }

  public getStatusBSubject() {
    return this._statusMap;
  }
}
