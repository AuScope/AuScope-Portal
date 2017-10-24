import { OlMapService } from '../portal-core-ui/service/openlayermap/ol-map.service';
import { Component } from '@angular/core';




@Component({
  selector: 'app-ol-map-zoom',
  template: `
    <button type="button" class="btn btn-sm btn-inverse active" id="map-theme-text" (click)='zoomClick()'>
      <span class="fa fa-search-plus fa-fw" aria-hidden="true"></span> {{buttonText}}</button>
    `
  // The "#" (template reference variable) matters to access the map element with the ViewChild decorator!
})

export class OlMapZoomComponent {

  buttonText = 'Magnify';

  constructor(private olMapService: OlMapService) {}

  public zoomClick() {
    this.buttonText = 'Click on Map';
    this.olMapService.drawBound().subscribe((vector) => {
      const features = vector.getSource().getFeatures();
      const me = this;
      // Go through this array and get coordinates of their geometry.
      features.forEach(function(feature) {
        me.buttonText = 'Magnify';
        me.olMapService.fitView(feature.getGeometry().getExtent());
      });

    });
  }
}
