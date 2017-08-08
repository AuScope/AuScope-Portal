import { OnlineResourceModel } from './onlineresource.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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

  public addResource(onlineresource: OnlineResourceModel) {
    this.resourceMap[onlineresource.url] = 'Loading...';
    this.total += 1;
    this.renderStarted = true;
    this._statusMap.next(this);
  }

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
