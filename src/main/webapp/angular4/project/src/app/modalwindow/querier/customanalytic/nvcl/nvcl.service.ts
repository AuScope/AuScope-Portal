import { UtilitiesService } from '../../../../portal-core-ui/utility/utilities.service';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NVCLService {


  constructor(private http: HttpClient) {

  }

  public getNVCLDatasets(serviceUrl: string, holeIdentifier: string): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = this.getNVCLDataServiceUrl(serviceUrl);

    httpParams = httpParams.append('serviceUrl', nvclUrl);
    httpParams = httpParams.append('holeIdentifier',  holeIdentifier.replace('gsml.borehole.', ''));
    return this.http.get('../getNVCLDatasets.do', {
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

   public getNVCL2_0_Images(serviceUrl: string, datasetId: string): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = this.getNVCLDataServiceUrl(serviceUrl);
    httpParams = httpParams.append('serviceUrl', nvclUrl);
    httpParams = httpParams.append('datasetId',  datasetId);
    httpParams = httpParams.append('mosaicService',  'true');
    return this.http.get('../getNVCL2_0_Logs.do', {
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

  public getNVCLScalars(serviceUrl: string, datasetId: string): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = this.getNVCLDataServiceUrl(serviceUrl);
    httpParams = httpParams.append('serviceUrl', nvclUrl);
    httpParams = httpParams.append('datasetId',  datasetId);
    return this.http.get('../getNVCLLogs.do', {
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

  public getLogDefinition(logName): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('repository', 'nvcl-scalars');
    httpParams = httpParams.append('label',  logName);
    return this.http.get('../getScalar.do', {
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


  public getNVCLDownloadServiceUrl(serviceUrl: string): string {
    let nvclUrl = UtilitiesService.getBaseUrl(serviceUrl);
    if (nvclUrl.indexOf('pir.sa.gov.au') >= 0) {
      nvclUrl += '/nvcl';
    }
    nvclUrl = nvclUrl + '/NVCLDownloadServices/';
    return nvclUrl;
  }

  public getNVCLDataServiceUrl(serviceUrl: string): string {
    let nvclUrl = UtilitiesService.getBaseUrl(serviceUrl);
    if (nvclUrl.indexOf('pir.sa.gov.au') >= 0) {
      nvclUrl += '/nvcl';
    }
    nvclUrl = nvclUrl + '/NVCLDataServices/';
    return nvclUrl
  }

}

