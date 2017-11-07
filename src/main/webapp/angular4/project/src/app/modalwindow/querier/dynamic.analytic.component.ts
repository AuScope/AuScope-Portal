import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { NVCLDatasetListComponent } from './customanalytic/nvcl/nvcl.datasetlist.component';
import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-custom-analytic',
   template: `<div #dynamicContentAnalyticPlaceholder></div>`
})


export class DynamicAnalyticComponent {
  @Input() layer: LayerModel;
  @Input() onlineResource: OnlineResourceModel;
  @Input() featureId: string;
  private _load: boolean;
  @ViewChild('dynamicContentAnalyticPlaceholder', {read: ViewContainerRef})
  dyanmicAnalyticHost: ViewContainerRef;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef ) { }

  @Input()
  set load(load: boolean) {
    this._load = load;
    if (this._load) {
      this.loadComponent();
    }
  }

  loadComponent() {


    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(environment.analytic[this.layer.id]);

    const viewContainerRef = this.dyanmicAnalyticHost
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    (<NVCLDatasetListComponent>componentRef.instance).layer = this.layer;
    (<NVCLDatasetListComponent>componentRef.instance).onlineResource = this.onlineResource;
    (<NVCLDatasetListComponent>componentRef.instance).featureId = this.featureId;

    this.changeDetectorRef.detectChanges();


  }

}
