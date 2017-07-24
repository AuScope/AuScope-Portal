import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { NgClass } from '@angular/common';

// Configs
import { AppConfig } from './portal-core-ag/appconfig/app.config';
import { APP_CONFIG } from './portal-core-ag/appconfig/app.config';
import { AuscopeConfiguration } from './appconfig/app.config';


// Utilities
import {KeysPipe} from './portal-core-ag/uiutilities/pipes';

// Components
import { OlMapComponent } from './openlayermap/olmap.component';
import { LayerPanelComponent } from './layerpanel/layerpanel.component';
import { FilterPanelComponent } from './layerpanel/filterpanel/filterpanel.component'

// Services
import { LayerHandlerService } from './portal-core-ag/service/cswrecords/layer-handler.service';
import { OlMapObject } from './portal-core-ag/service/openlayermap/ol-map-object';
import { OlMapService } from './portal-core-ag/service/openlayermap/ol-map.service';
import { OlWMSService } from './portal-core-ag/service/openlayermap/ol-wms.service';

@NgModule({
  declarations: [
    OlMapComponent,
    LayerPanelComponent,
    FilterPanelComponent,
    KeysPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [LayerHandlerService,
              OlMapService,
              OlWMSService,
              OlMapObject,
              {
                provide: APP_CONFIG,
                useValue: AuscopeConfiguration
               }
              ],
  bootstrap: [OlMapComponent, LayerPanelComponent]
})
export class AppModule { }
