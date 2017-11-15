import { UtilitiesService } from '../../../../portal-core-ui/utility/utilities.service';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
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


  public getNVCL2_0_JSONDataBinned(serviceUrl: string, logIds: string[]): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = this.getNVCLDataServiceUrl(serviceUrl);
    httpParams = httpParams.append('serviceUrl', nvclUrl);
    for (const logId of logIds) {
      httpParams = httpParams.append('logIds', logId);
    }
    return this.http.post('../getNVCL2_0_JSONDataBinned.do', httpParams.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).map(response => {
      return response;
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }

  public getNVCL2_0_CSVDownload(serviceUrl: string, logIds: string[]): Observable<any> {
    let httpParams = new HttpParams();
    const nvclUrl = this.getNVCLDataServiceUrl(serviceUrl);
    httpParams = httpParams.append('serviceUrl', nvclUrl);
    for (const logId of logIds) {
      httpParams = httpParams.append('logIds', logId);
    }
    return this.http.post('../getNVCL2_0_CSVDownload.do', httpParams.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'blob'
    }).map(response => {
      return response;
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }

  public _findLogName(bvLogId, logIds, logNames) {
    let logIdx = 0;
    while (logIdx < logIds.length) {
      if (logIds[logIdx] === bvLogId) {
        return logNames[logIdx];
      }
      logIdx++;
    }
    return '';
  }

  public _colourConvert(BGRColorNumber) {
    return '#' + UtilitiesService.leftPad((BGRColorNumber & 255).toString(16), 2, '0') +
      UtilitiesService.leftPad(((BGRColorNumber & 65280) >> 8).toString(16), 2, '0') +
      UtilitiesService.leftPad((BGRColorNumber >> 16).toString(16), 2, '0');
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

