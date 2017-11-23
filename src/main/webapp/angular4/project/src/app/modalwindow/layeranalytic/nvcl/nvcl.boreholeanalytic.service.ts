import { LayerModel } from '../../../portal-core-ui/model/data/layer.model';
import { LayerHandlerService } from '../../../portal-core-ui/service/cswrecords/layer-handler.service';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NVCLBoreholeAnalyticService {


  constructor(private http: HttpClient, private layerHandlerService: LayerHandlerService) {

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
    if (algorithmOutputIds.length <= 0) {
      return Observable.throw('No algorithmOUtputId specified');
    }
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

  public getTSGAlgorithm(tsgAlgName: string): Observable<any> {

    let httpParams = new HttpParams();
    httpParams = httpParams.append('tsgAlgName', tsgAlgName);
    return this.http.get('../getTsgAlgorithms.do', {
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


  public submitSF0NVCLProcessingJob(parameters: any, layer: LayerModel): Observable<any> {
    let httpParams = new HttpParams();

    const wfsResources = this.layerHandlerService.getWFSResource(layer);
    for (const wfsResource of wfsResources) {
      httpParams = httpParams.append('wfsUrl', wfsResource.url);
    }

    httpParams = httpParams.append('email', parameters.email);
    httpParams = httpParams.append('jobName', parameters.jobName);
    httpParams = httpParams.append('existingAlg', 'existingAlg');
    httpParams = httpParams.append('algorithm', parameters.algorithm);

    for (const algorithmOutputId of parameters.algorithmOutputIds) {
      httpParams = httpParams.append('algorithmOutputId', algorithmOutputId);
    }

    httpParams = httpParams.append('classification', parameters.classification);
    httpParams = httpParams.append('logName', parameters.logName);
    httpParams = httpParams.append('startDepth', parameters.startDepth);
    httpParams = httpParams.append('endDepth', parameters.endDepth);
    httpParams = httpParams.append('operator', parameters.operator);
    httpParams = httpParams.append('value', parameters.value);
    httpParams = httpParams.append('units', parameters.units);
    httpParams = httpParams.append('span', parameters.span);


    return this.http.get('../submitSF0NVCLProcessingJob.do', {
      params: httpParams
    }).map(response => {
      if (response['success'] === true) {
        return response['success'];
      } else {
        return Observable.throw(response['msg']);
      }
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }

  public submitSF0NVCLProcessingTsgJob(parameters: any, layer: LayerModel): Observable<any> {
    let httpParams = new HttpParams();

    const wfsResources = this.layerHandlerService.getWFSResource(layer);
    for (const wfsResource of wfsResources) {
      httpParams = httpParams.append('wfsUrl', wfsResource.url);
    }

    httpParams = httpParams.append('email', parameters.email);
    httpParams = httpParams.append('jobName', parameters.jobName);
    httpParams = httpParams.append('existingAlg', 'existingAlg');

    httpParams = httpParams.append('tsgAlgName', parameters.tsgAlgName);
    httpParams = httpParams.append('tsgAlgorithm', parameters.tsgAlgorithm);

    httpParams = httpParams.append('startDepth', parameters.startDepth);
    httpParams = httpParams.append('endDepth', parameters.endDepth);
    httpParams = httpParams.append('operator', parameters.operator);
    httpParams = httpParams.append('value', parameters.value);
    httpParams = httpParams.append('units', parameters.units);
    httpParams = httpParams.append('span', parameters.span);


    return this.http.get('../submitSF0NVCLProcessingTsgJob.do', {
      params: httpParams
    }).map(response => {
      if (response['success'] === true) {
        return response['success'];
      } else {
        return Observable.throw(response['msg']);
      }
    }).catch(
      (error: Response) => {
        return Observable.throw(error);
      }
      );
  }

  public checkNVCLProcessingJob(email: string): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('email', email);


    return this.http.get('../checkNVCLProcessingJob.do', {
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

