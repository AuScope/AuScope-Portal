import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { NgClass, DecimalPipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

// Components
import { OlMapComponent } from './openlayermap/olmap.component';
import { OlMapPreviewComponent } from './menupanel/common/infopanel/openlayermappreview/olmap.preview.component';
import { LayerPanelComponent } from './menupanel/layerpanel/layerpanel.component';
import { CustomPanelComponent } from './menupanel/custompanel/custompanel.component';
import { FilterPanelComponent } from './menupanel/common/filterpanel/filterpanel.component';
import { DownloadPanelComponent } from './menupanel/common/downloadpanel/downloadpanel.component';
import { InfoPanelComponent} from './menupanel/common/infopanel/infopanel.component';
import { InfoPanelSubComponent } from './menupanel/common/infopanel/subpanel/subpanel.component';
import { OlMapZoomComponent } from './openlayermap/olmap.zoom.component';
import { NgbdModalStatusReportComponent } from './toppanel/renderstatus/renderstatus.component';
import { NotificationComponent } from './toppanel/notification/notification.component';

import { PortalCoreModule } from './portal-core-ui/portal-core.module';
@NgModule({
  declarations: [
    OlMapComponent,
    OlMapPreviewComponent,
    LayerPanelComponent,
    CustomPanelComponent,
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
  bootstrap: [OlMapComponent, LayerPanelComponent, CustomPanelComponent, NotificationComponent, OlMapZoomComponent]
})
export class AppModule { }
