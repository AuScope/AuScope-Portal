import { LayerModel } from './layer.model';
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
  public resourceMap: Object;
  private renderComplete: boolean;
  private renderStarted: boolean;
  private containsError: boolean;
  private _statusMap = new BehaviorSubject<StatusMapModel>(this);


  constructor(layerid: string) {
    this.layerid = layerid;
    this.completed = 0;
    this.total = 0;
    this.resourceMap = {};
    this.renderComplete = false;
    this.renderStarted = false;
    this.containsError = false;
  }

  /**
   * Add resource to the counter and update its status
   * @param onlineresource  online resource that is being loaded now
   */
  public updateTotal(onlineresource: OnlineResourceModel) {
    if (!this.resourceMap[onlineresource.url]) {
      this.resourceMap[onlineresource.url] = {};
    }
    this.resourceMap[onlineresource.url].status = 'Loading...';
    if (!this.resourceMap[onlineresource.url].total) {
      this.resourceMap[onlineresource.url].total = 0;
    }
    this.resourceMap[onlineresource.url].total += 1;
    this.total += 1;
    this.renderStarted = true;
    this._statusMap.next(this);
  }

   /**
   * Add resource to the counter and update its status
   * @param onlineresource  online resource that is being loaded now
   */
  public skip(onlineresource: OnlineResourceModel) {
    if (!this.resourceMap[onlineresource.url]) {
      this.resourceMap[onlineresource.url] = {};
    }
    this.resourceMap[onlineresource.url].status = 'Skipped';
    this._statusMap.next(this);
  }

  /**
   * update the counter for each completed job
   * @param onlineresource  online resource that is being updated
   * @param error? a optional parameter to flag there was an error in the download of the resource.
   */
  public updateComplete(onlineresource: OnlineResourceModel, error?: boolean) {
    this.completed += 1;
    if (!this.resourceMap[onlineresource.url].completed) {
      this.resourceMap[onlineresource.url].completed = 0;
    }
    this.resourceMap[onlineresource.url].completed += 1;

    this.completePercentage = Math.floor(this.completed / this.total * 100) + '%';
    if (error) {
      this.resourceMap[onlineresource.url].status = 'Error';
      this.containsError = true;
    }
    if (this.resourceMap[onlineresource.url].total ===  this.resourceMap[onlineresource.url].completed) {
      if (this.resourceMap[onlineresource.url].status !== 'Error') {
        this.resourceMap[onlineresource.url].status = 'Complete';
      }
    }
    if (this.completed === this.total) {
      this.renderComplete = true;
      this._statusMap.next(this);
    }
  }

  public getStatusBSubject() {
    return this._statusMap;
  }

  public resetStatus() {
    this.completed = 0;
    this.total = 0;
    this.resourceMap = {};
    this.renderComplete = false;
    this.renderStarted = false;
    this.containsError = false;
    this._statusMap.next(this);
  }

}
