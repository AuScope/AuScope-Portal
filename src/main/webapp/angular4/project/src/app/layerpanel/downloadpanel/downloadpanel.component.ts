import {Bbox} from '../../portal-core-ui/model/data/bbox.model';
import {LayerModel} from '../../portal-core-ui/model/data/layer.model';
import {LayerHandlerService} from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import {OlMapService} from '../../portal-core-ui/service/openlayermap/ol-map.service';
import {DownloadWfsService} from '../../portal-core-ui/service/wfs/download/download-wfs.service';
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../portal-core-ui/utility/utilities.service';
import {saveAs} from 'file-saver/FileSaver';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-download-panel',
  templateUrl: './downloadpanel.component.html'
})


export class DownloadPanelComponent implements OnInit {


  @Input() layer: LayerModel;
  bbox: Bbox;
  drawStarted: boolean;
  downloadStarted: boolean;
  isCsvSupportedLayer: boolean;

  constructor(private layerHandlerService: LayerHandlerService, private olMapService: OlMapService, private downloadWfsService: DownloadWfsService) {
    this.bbox = null;
    this.drawStarted = false;
    this.downloadStarted = false;

  }

  ngOnInit(): void {
    if (this.layer) {
      this.isCsvSupportedLayer = environment.csvSupportedLayer.indexOf(this.layer.id) >= 0;
    } else {
      this.isCsvSupportedLayer = false;
    }
  }

  public drawBound(): void {
    setTimeout(() => this.drawStarted = true, 0);

    this.olMapService.drawBound().subscribe((vector) => {
      this.drawStarted = false;
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
    this.downloadStarted = true;
    this.downloadWfsService.download(this.layer, this.bbox).subscribe(value => {
      this.downloadStarted = false;
      const blob = new Blob([value], {type: 'application/zip'});
      saveAs(blob, 'download.zip');
    });
  }
}
