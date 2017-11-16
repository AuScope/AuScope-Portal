import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { OnlineResourceModel } from '../../portal-core-ui/model/data/onlineresource.model';
import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import {environment} from '../../../environments/environment';
import { NVCLBoreholeAnalyticComponent } from './nvcl/nvcl.boreholeanalytic.component';

@Component({
  selector: 'app-dynamic-layer-analytic',
   template: `<div #dynamicLayerContentAnalyticPlaceholder></div>`
})


export class DynamicLayerAnalyticComponent {
  private _layer: LayerModel;
  @ViewChild('dynamicLayerContentAnalyticPlaceholder', {read: ViewContainerRef})
  dyanmicAnalyticHost: ViewContainerRef;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef ) { }


  @Input()
  set layer(layer: LayerModel) {
    this._layer = layer;
    if (this._layer) {
      this.loadComponent();
    }
  }

  loadComponent() {


    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(environment.layeranalytic[this._layer.id]);

    const viewContainerRef = this.dyanmicAnalyticHost
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    (<NVCLBoreholeAnalyticComponent>componentRef.instance).layer = this._layer;

    this.changeDetectorRef.detectChanges();

  }

}
