import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { NVCLDatasetListComponent } from './customanalytic/nvcl/nvcl.datasetlist.component';
import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-custom-analytic',
  // template: `<div><ng-template appDynamicAnalyticHost></ng-template></div>`
   template: `<div #parent></div>`
})


export class DynamicAnalyticComponent implements AfterViewInit {
  @Input() layer: LayerModel;
  @Input() onlineResource: OnlineResourceModel;
  @Input() featureId: string;
  // @ViewChild(CustomAnalyticDirective) customAnalyticHost: CustomAnalyticDirective;
  @ViewChild('parent', {read: ViewContainerRef})
  customAnalyticHost: ViewContainerRef;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef ) { }

  ngAfterViewInit() {
    this.loadComponent();
  }


  loadComponent() {


    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NVCLDatasetListComponent);

    const viewContainerRef = this.customAnalyticHost
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    (<NVCLDatasetListComponent>componentRef.instance).layer = this.layer;
    (<NVCLDatasetListComponent>componentRef.instance).onlineResource = this.onlineResource;
    (<NVCLDatasetListComponent>componentRef.instance).featureId = this.featureId;

    this.changeDetectorRef.detectChanges();


  }

}
