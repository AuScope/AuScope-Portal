import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { OlMapComponent } from './openlayermap/olmap.component';
import { LayerPanelComponent } from './layerpanel/layer-panel.component';
import { LayerHandlerService } from './portal-core-ag/service/CSWRecords/layer-handler.service';
import { AppConfig } from './portal-core-ag/appconfig/app.config';
import { APP_CONFIG } from './portal-core-ag/appconfig/app.config';
import { AuscopeConfiguration } from './appconfig/app.config';
import {KeysPipe} from './portal-core-ag/UIUtilities/pipes';
import { NgClass } from '@angular/common';





@NgModule({
  declarations: [
    OlMapComponent,
    LayerPanelComponent,
    KeysPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [LayerHandlerService,
              {
                provide: APP_CONFIG,
                useValue: AuscopeConfiguration
               }
              ],
  bootstrap: [OlMapComponent, LayerPanelComponent]
})
export class AppModule { }