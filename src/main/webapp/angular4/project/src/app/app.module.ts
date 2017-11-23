import { NgModule } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';


// Components
import { OlMapComponent } from './openlayermap/olmap.component';
import { OlMapPreviewComponent } from './menupanel/common/infopanel/openlayermappreview/olmap.preview.component';
import { LayerPanelComponent } from './menupanel/layerpanel/layerpanel.component';
import { CustomPanelComponent } from './menupanel/custompanel/custompanel.component';
import { FilterPanelComponent } from './menupanel/common/filterpanel/filterpanel.component';
import { DownloadPanelComponent } from './menupanel/common/downloadpanel/downloadpanel.component';
import { InfoPanelComponent} from './menupanel/common/infopanel/infopanel.component';
import { InfoPanelSubComponent } from './menupanel/common/infopanel/subpanel/subpanel.component';
import { DynamicLayerAnalyticComponent } from './modalwindow/layeranalytic/dynamic.layer.analytic.component';
import { LayerAnalyticModalComponent } from './modalwindow/layeranalytic/layer.analytic.modal.component';
import { NVCLBoreholeAnalyticComponent } from './modalwindow/layeranalytic/nvcl/nvcl.boreholeanalytic.component';
import { DynamicAnalyticComponent } from './modalwindow/querier/dynamic.analytic.component';
import { NVCLDatasetListComponent } from './modalwindow/querier/customanalytic/nvcl/nvcl.datasetlist.component';
import { OlMapZoomComponent } from './openlayermap/olmap.zoom.component';
import { NgbdModalStatusReportComponent } from './toppanel/renderstatus/renderstatus.component';
import { NotificationComponent } from './toppanel/notification/notification.component';
import { QuerierModalComponent } from './modalwindow/querier/querier.modal.component';
import { TreeModule } from 'ng2-tree';



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
    OlMapZoomComponent,
    QuerierModalComponent,
    DynamicAnalyticComponent,
    NVCLDatasetListComponent,
    LayerAnalyticModalComponent,
    DynamicLayerAnalyticComponent,
    NVCLBoreholeAnalyticComponent
  ],
  providers: [CookieService],
  imports: [
    PortalCoreModule,
    TreeModule,
    ModalModule.forRoot()
  ],
  entryComponents: [NgbdModalStatusReportComponent, QuerierModalComponent, NVCLDatasetListComponent, LayerAnalyticModalComponent, NVCLBoreholeAnalyticComponent],
  bootstrap: [OlMapComponent, LayerPanelComponent, CustomPanelComponent, NotificationComponent, OlMapZoomComponent]
})
export class AppModule { }
