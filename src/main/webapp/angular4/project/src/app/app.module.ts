import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { NgClass } from '@angular/common';


// Configs
import { AuscopeConfiguration } from './appconfig/app.config';


// Components
import { OlMapComponent } from './openlayermap/olmap.component';
import { LayerPanelComponent } from './layerpanel/layerpanel.component';
import { FilterPanelComponent } from './layerpanel/filterpanel/filterpanel.component'
import { NgbdModalStatusReportComponent } from './modalwindow/renderstatus/renderstatus.component';


import { PortalCoreModule } from './portal-core-ui/portal-core.module'

@NgModule({
  declarations: [
    OlMapComponent,
    LayerPanelComponent,
    FilterPanelComponent,
    NgbdModalStatusReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PortalCoreModule,
    PortalCoreModule.forRoot(AuscopeConfiguration)
  ],
  entryComponents: [NgbdModalStatusReportComponent],
  bootstrap: [OlMapComponent, LayerPanelComponent]
})
export class AppModule { }
