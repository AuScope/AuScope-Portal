import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NVCLBoreholeAnalyticService {


  constructor(private http: HttpClient) {

  }

  public getNVCLAlgorithms(): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = 'http://nvclwebservices.vm.csiro.au/NVCLDataServices'

    httpParams = httpParams.append('serviceUrl', nvclUrl);
    return this.http.get('../getNVCLAlgorithms.do', {
      params: httpParams
    }).map(response => {
      if (response['success'] === true) {
        return response['data'];
      } else {
        return Observable.throw(response['msg']);
      }
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }

  public getNVCLClassifications(algorithmOutputIds: string[]): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = 'http://nvclwebservices.vm.csiro.au/NVCLDataServices'

    for (const algorithmOutputId of algorithmOutputIds) {
      httpParams = httpParams.append('algorithmOutputId', algorithmOutputId);
    }

    httpParams = httpParams.append('serviceUrl', nvclUrl);
    return this.http.get('../getNVCLClassifications.do', {
      params: httpParams
    }).map(response => {
      if (response['success'] === true) {
        return response['data'];
      } else {
        return Observable.throw(response['msg']);
      }
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }


}

