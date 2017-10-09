import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { NgClass, DecimalPipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

// Components
import { OlMapComponent } from './openlayermap/olmap.component';
import { OlMapPreviewComponent } from './menupanel/layerpanel/infopanel/openlayermappreview/olmap.preview.component';
import { LayerPanelComponent } from './menupanel/layerpanel/layerpanel.component';
import { FilterPanelComponent } from './menupanel/layerpanel/filterpanel/filterpanel.component';
import { DownloadPanelComponent } from './menupanel/layerpanel/downloadpanel/downloadpanel.component';
import { InfoPanelComponent} from './menupanel/layerpanel/infopanel/infopanel.component';
import { InfoPanelSubComponent } from './menupanel/layerpanel/infopanel/subpanel/subpanel.component';
import { OlMapZoomComponent } from './openlayermap/olmap.zoom.component';
import { NgbdModalStatusReportComponent } from './toppanel/renderstatus/renderstatus.component';
import { NotificationComponent } from './toppanel/notification/notification.component';

import { PortalCoreModule } from './portal-core-ui/portal-core.module';
@NgModule({
  declarations: [
    OlMapComponent,
    OlMapPreviewComponent,
    LayerPanelComponent,
    FilterPanelComponent,
    DownloadPanelComponent,
    NgbdModalStatusReportComponent,
    InfoPanelComponent,
    NotificationComponent,
    InfoPanelSubComponent,
    OlMapZoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    PortalCoreModule,
    ModalModule.forRoot()
  ],
  entryComponents: [NgbdModalStatusReportComponent],
  bootstrap: [OlMapComponent, LayerPanelComponent, NotificationComponent, OlMapZoomComponent]
})
export class AppModule { }
