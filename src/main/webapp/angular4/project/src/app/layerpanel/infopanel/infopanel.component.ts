import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { point, featureCollection, polygon } from '@turf/helpers';
import * as center from '@turf/center';
import * as envelope from '@turf/envelope';
import { CSWRecordModel } from '../../portal-core-ui/model/data/cswrecord.model';
import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { LegendService } from '../../portal-core-ui/service/wms/legend.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { OlMapPreviewComponent } from '../../openlayermap/olmap.preview.component';
import olProj from 'ol/proj';



@Component({
    selector: 'info-panel',
    templateUrl: './infopanel.component.html'
})

export class InfoPanelComponent implements OnChanges {
    @Input() cswRecords: CSWRecordModel[];
    @Input() layer: LayerModel;
    @Input() expanded: boolean;
    @ViewChild(OlMapPreviewComponent) private previewMap: OlMapPreviewComponent;
    legends: any = {};
    wmsUrls: any = {};
    featureArr: any = [];

    constructor(public legendService: LegendService) {
    }

    /**
     * Creates a string key for use with storing bounding box details within an associative array,
       given layer name and administrative area strings
     * @param layerName name of layer
     * @param adminArea administrative area
     */
    private makeKey(layerName: string, adminArea: string): string {
        return layerName + '#' + adminArea;
    }

    /**
     * Gets called by Angular framework upon any changes
     * @param changes object which holds the changes
     */
    ngOnChanges(changes: SimpleChanges) {
        // If this panel becomes expanded, then load up the legend and preview map
        if (changes.expanded.currentValue === true && changes.expanded.previousValue === false) {
            const me = this;
            if (this.layer.proxyStyleUrl && this.layer.proxyStyleUrl.length > 0) {
                this.legendService.getLegendStyle(this.layer.proxyStyleUrl).subscribe(
                    response => {
                        if (response) {
                            const sldBody = encodeURIComponent(response);
                            // Gather up lists of legend URLs
                            for (let i = 0; i < me.cswRecords.length; i++) {
                                const onlineResources = me.cswRecords[i].onlineResources;
                                for (let j = 0; j < onlineResources.length; j++) {
                                    if (onlineResources[j].type === 'WMS') {
                                        let params = 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                                        + '&LAYER=' + onlineResources[j].name + '&LAYERS=' + onlineResources[j].name;
                                        // If there is a style, then use it
                                        if (sldBody.length > 0) {
                                            params += '&SLD_BODY=' + sldBody + '&LEGEND_OPTIONS=forceLabels:on;minSymbolSize:16';
                                        }
                                        me.legends[me.cswRecords[i].adminArea] = UtilitiesService.addUrlParameters(onlineResources[j].url, params);
                                    }
                                }
                            }
                        }
                    });
                } else {
                    for (let i = 0; i < this.cswRecords.length; i++) {
                        const onlineResources = this.cswRecords[i].onlineResources;
                        for (let j = 0; j < onlineResources.length; j++) {
                            if (onlineResources[j].type === 'WMS') {
                                const params = 'REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&HEIGHT=25&BGCOLOR=0xFFFFFF'
                                + '&LAYER=' + onlineResources[j].name + '&LAYERS=' + onlineResources[j].name + '&WIDTH=188';
                                this.legends[this.cswRecords[i].adminArea] = UtilitiesService.addUrlParameters(onlineResources[j].url, params);
                            }
                        }
                    }
                }

                // Gather up BBOX coordinates to calculate the centre and envelope
                const bboxArr = [];
                const bboxPolygonArr = {};
                for (let i = 0; i < this.cswRecords.length; i++) {
                    const bbox = this.cswRecords[i].geographicElements[0];
                    if (bbox !== undefined && (bbox.westBoundLongitude !== 0 || bbox.northBoundLatitude !== 0 || bbox.eastBoundLongitude !== 0 || bbox.southBoundLatitude !== 0)
                    && (bbox.eastBoundLongitude !== 180 || bbox.westBoundLongitude !== 180 || bbox.northBoundLatitude !== 90 || bbox.southBoundLatitude !== -90)) {
                        this.featureArr.push(point([bbox.westBoundLongitude, bbox.northBoundLatitude]));
                        this.featureArr.push(point([bbox.westBoundLongitude, bbox.southBoundLatitude]));
                        this.featureArr.push(point([bbox.eastBoundLongitude, bbox.southBoundLatitude]));
                        this.featureArr.push(point([bbox.eastBoundLongitude, bbox.northBoundLatitude]));
                        bboxArr.push(bbox);

                        // Create a GeoJSON polgon object array to pass to the preview map component
                        const key = this.makeKey(this.layer.name, this.cswRecords[i].adminArea);
                        bboxPolygonArr[key] = featureCollection([polygon([[
                            olProj.fromLonLat([bbox.westBoundLongitude, bbox.northBoundLatitude ]),
                            olProj.fromLonLat([bbox.westBoundLongitude, bbox.southBoundLatitude ]),
                            olProj.fromLonLat([bbox.eastBoundLongitude, bbox.southBoundLatitude ]),
                            olProj.fromLonLat([bbox.eastBoundLongitude, bbox.northBoundLatitude ]),
                            olProj.fromLonLat([bbox.westBoundLongitude, bbox.northBoundLatitude ])
                        ]])]);
                        bboxPolygonArr[key].crs = {
                            'type': 'name',
                            'properties': {
                                'name': 'EPSG:3857'
                            }
                        };
                    }

                    // Gather up lists of information URLs
                    const onlineResources = this.cswRecords[i].onlineResources;
                    for (let j = 0; j < onlineResources.length; j++) {
                        if (onlineResources[j].type === 'WMS') {
                            const params = 'SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYERS='
                            + encodeURIComponent(onlineResources[j].name) + '&SRS=EPSG:4326&BBOX=' + bbox.westBoundLongitude + ',' + bbox.southBoundLatitude
                            + ',' + bbox.eastBoundLongitude + ',' + bbox.northBoundLatitude
                            + '&WIDTH=400&HEIGHT=400';
                            this.wmsUrls[this.cswRecords[i].adminArea] = UtilitiesService.addUrlParameters(onlineResources[j].url, params);
                        }
                    }
                }

                // Use 'turf' to calculate the centre point of the BBOXES, use this to re-centre the map
                // Only calculate centre if the coords are not dispersed over the globe
                let reCentrePt: any = {};
                if (this.featureArr.length > 0) {
                    // Calculate the envelope, if not too big then re-centred map can be calculated
                    const featureColl = featureCollection(this.featureArr);
                    const envelopePoly = envelope(featureColl);

                    if (envelopePoly.geometry.coordinates[0][1][0] - envelopePoly.geometry.coordinates[0][0][0] < 30
                        && envelopePoly.geometry.coordinates[0][2][1] - envelopePoly.geometry.coordinates[0][0][1] < 30) {
                            // Calculate centre so we can re-centre the map
                            const centerPt = center(featureColl);
                            if (centerPt.geometry.coordinates !== undefined && centerPt.geometry.coordinates.length === 2
                                && !isNaN(centerPt.geometry.coordinates[0]) && !isNaN(centerPt.geometry.coordinates[1])) {
                                    reCentrePt = { latitude: centerPt.geometry.coordinates[1], longitude: centerPt.geometry.coordinates[0] };
                            }
                    }
                }
                if (reCentrePt !== {}) {
                    // Ask preview map component to draw bounding boxes and recentre the map
                    this.previewMap.setupBBoxes(olProj.fromLonLat([reCentrePt.longitude, reCentrePt.latitude]), bboxPolygonArr);
                }
        }
    }

    /**
     * Highlights a bounding box on the preview map
     * @param layerName name of layerName
     * @param adminArea name of administrative area
     */
    highlightOnPreviewMap(layerName: string, adminArea: string): void {
        const key = this.makeKey(layerName, adminArea);
        this.previewMap.setBBoxHighlight(true, key);
    }

    /**
     * Unhighlights a bounding box on the preview map
     * @param layerName name of layerName
     * @param adminArea name of administrative area
     */
    lowlightOnPreviewMap(layerName: string, adminArea: string): void {
        const key = this.makeKey(layerName, adminArea);
        this.previewMap.setBBoxHighlight(false, key);
    }

}
