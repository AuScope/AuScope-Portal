import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Utilities
import {KeysPipe} from './uiutilities/pipes';


// Services
import { LayerHandlerService } from './service/cswrecords/layer-handler.service';
import { FilterPanelService } from './service/filterpanel/filterpanel-service';
import { OlMapObject } from './service/openlayermap/ol-map-object';
import { OlMapService } from './service/openlayermap/ol-map.service';
import { RenderStatusService } from './service/openlayermap/renderstatus/render-status.service';
import { OlWMSService } from './service/wms/ol-wms.service';
import { OlWFSService } from './service/wfs/ol-wfs.service';
import { GMLParserService } from './utility/gmlparser.service';
import { LegendService } from './service/wms/legend.service';



@NgModule({
  declarations: [
    KeysPipe

  ],
  imports: [
    HttpClientModule
  ],
  exports: [KeysPipe],
  providers: [LayerHandlerService,
              OlMapService,
              OlWMSService,
              OlMapObject,
              OlWFSService,
              GMLParserService,
              RenderStatusService,
              FilterPanelService,
              LegendService
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
