import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { OlMapComponent } from './openlayermap/olmap.component';
import { LayerPanelComponent } from './layerpanel/layer-panel.component';
import { LayerHandlerService } from './portal-core-ag/service/CSWRecords/layer-handler.service';
import { AppConfig } from './portal-core-ag/appconfig/app.config';
import { APP_CONFIG } from './portal-core-ag/appconfig/app.config';
import { AuscopeConfiguration } from './appconfig/app.config';
import {KeysPipe} from './portal-core-ag/service/UIUtilities/pipes';
import { NgClass } from '@angular/common';


import {UtilitiesService } from './core/utility/utilities.service';
import {GMLParserService } from './core/utility/gmlparser.service';
import {SimpleXMLService } from './core/utility/simplexml.service';



@NgModule({
  declarations: [
    OlMapComponent,
    LayerPanelComponent,
    KeysPipe,
    // AppComponent,
    UtilitiesService,
    SimpleXMLService,
    GMLParserService
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
