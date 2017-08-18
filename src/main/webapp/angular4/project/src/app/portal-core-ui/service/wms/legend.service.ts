import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LegendService {

  private layerRecord;
  private getCSWUrl;

  constructor(private http: HttpClient) {
  }

  /**
   * Fetches legend given url
   * @param styleUrl URL string to get legend from local server
   */
  public getLegendStyle(styleUrl: string): Observable<any> {
    const me = this;
    return this.http.get('../' + styleUrl, {responseType: 'text'})
      .do(result => result);
  }
}
