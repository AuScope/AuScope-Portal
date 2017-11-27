import { UtilitiesService } from '../../utility/utilities.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var LZMA: any;

@Injectable()
export class ManageStateService {

  private state: any = {}
  private compressedLink: string;
  private unCompressedStringCache: any;


  constructor() {
  }

  public addLayer(layerid: string, filterCollection: any, optionalFilters: any) {
    filterCollection['optionalFilters'] = [];
    this.state[layerid] = {
      filterCollection: filterCollection,
      optionalFilters: optionalFilters
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

  public getCompressedString(toBeCompressed: string, callback): void {
    LZMA.compress(toBeCompressed, 1, callback);
  }

  public getUnCompressedString(toBeUnCompressed: string, callback): void {
    if (!toBeUnCompressed) {
      callback(null);
      return;
    }

    if (!UtilitiesService.isEmpty(this.unCompressedStringCache)) {
      callback(this.unCompressedStringCache);
      return;
    }

    const stateStr = UtilitiesService.decode_base64(toBeUnCompressed);
    const compressedByteArray = [];
    for (let i = 0; i < stateStr.length; i++) {
      compressedByteArray.push(stateStr.charCodeAt(i));
    }
    const me = this;
    LZMA.decompress(compressedByteArray, function(result) {
      me.unCompressedStringCache = result;
      callback(result);
    });
  }

}
