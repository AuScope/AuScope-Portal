import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ManageStateService {

  private state: any = [];
  private compressedLink: string;

  constructor() {
  }

  public addLayer(layerid: string, filterCollection: any, optionalFilter: any) {
    this.state[layerid] = {
      filterCollection: filterCollection,
      optionalFilter: optionalFilter
    }
  }

  public removeLayer(layerid: string) {
    this.state[layerid] = null;
  }

  public getState(): any {
    return this.state;
  }

  public setLink(compressed: string) {
    this.compressedLink = compressed;
  }

}
