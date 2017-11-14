import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Utilities
import {KeysPipe, QuerierFeatureSearchPipe, TrustResourceUrlPipe} from './uiutilities/pipes';


// Services
import { LayerHandlerService } from './service/cswrecords/layer-handler.service';
import { FilterPanelService } from './service/filterpanel/filterpanel-service';
import { OlMapObject } from './service/openlayermap/ol-map-object';
import { OlMapService } from './service/openlayermap/ol-map.service';
import { RenderStatusService } from './service/openlayermap/renderstatus/render-status.service';
import { DownloadWfsService } from './service/wfs/download/download-wfs.service';
import { OlWMSService } from './service/wms/ol-wms.service';
import { OlWFSService } from './service/wfs/ol-wfs.service';
import { GMLParserService } from './utility/gmlparser.service';
import { LegendService } from './service/wms/legend.service';
import { NotificationService } from './service/toppanel/notification.service';
import { QueryWMSService} from './service/wms/query-wms.service';
import { QueryWFSService} from './service/wfs/query-wfs.service';



// Directives
import { ImgLoadingDirective } from './uiutilities/imgloading.directive';

@NgModule({
  declarations: [
    KeysPipe,
    QuerierFeatureSearchPipe,
    TrustResourceUrlPipe,
    ImgLoadingDirective
  ],
  imports: [
    HttpClientModule
  ],
  exports: [KeysPipe, QuerierFeatureSearchPipe, TrustResourceUrlPipe, ImgLoadingDirective],
  providers: [LayerHandlerService,
    OlMapService,
    OlWMSService,
    OlMapObject,
    OlWFSService,
    DownloadWfsService,
    GMLParserService,
    RenderStatusService,
    FilterPanelService,
    LegendService,
    ImgLoadingDirective,
    NotificationService,
    QueryWMSService,
    QueryWFSService
  ]
})

export class PortalCoreModule {


  constructor (@Optional() @SkipSelf() parentModule: PortalCoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }



}
