import { Bbox } from '../../portal-core-ui/model/data/bbox.model';
import {LayerModel} from '../../portal-core-ui/model/data/layer.model';
import {LayerHandlerService} from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { DownloadWfsService } from '../../portal-core-ui/service/wfs/download/download-wfs.service';
import {Component, Input} from '@angular/core';
import {UtilitiesService} from '../../portal-core-ui/utility/utilities.service';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-download-panel',
  templateUrl: './downloadpanel.component.html'
})


export class DownloadPanelComponent {

  @Input() layer: LayerModel;
  bbox: Bbox;

  constructor(private layerHandlerService: LayerHandlerService, private olMapService: OlMapService, private downloadWfsService: DownloadWfsService) {
    this.bbox = null;
  }

  public drawBound(): void {
    this.olMapService.drawBound().subscribe((vector) => {
      const features = vector.getSource().getFeatures();
      const me = this;
      // Go through this array and get coordinates of their geometry.
      features.forEach(function(feature) {
        me.bbox = new Bbox();
        me.bbox.crs = 'EPSG:4326';
        const bbox4326 = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
        me.bbox.eastBoundLongitude = bbox4326.getExtent()[2];
        me.bbox.westBoundLongitude = bbox4326.getExtent()[0];
        me.bbox.northBoundLatitude = bbox4326.getExtent()[3];
        me.bbox.southBoundLatitude = bbox4326.getExtent()[1];
      });

    });
  }

  public clearBound(): void {
    this.bbox = null;
  }

  public download(): void {
    this.downloadWfsService.download(this.layer, this.bbox).subscribe(value => {
       const blob = new Blob([value], {type: 'application/zip'});
        saveAs(blob, 'download.zip');
    });
  }
}
