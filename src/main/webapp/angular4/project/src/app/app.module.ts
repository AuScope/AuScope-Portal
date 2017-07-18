import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';


import { OlMapComponent } from './openlayermap/olmap.component';
import { LayerPanelComponent } from './layerpanel/layer-panel.component';



@NgModule({
  declarations: [
    OlMapComponent,
    LayerPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [OlMapComponent, LayerPanelComponent]
})
export class AppModule { }
