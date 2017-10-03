import {OnlineResourceModel} from '../../model/data/onlineresource.model';
import {RenderStatusService} from './renderstatus/render-status.service';
import {Constants} from '../../utility/constants.service';
import {Injectable, Inject} from '@angular/core';
import olMap from 'ol/map';
import olTile from 'ol/layer/tile';
import olOSM from 'ol/source/osm';
import olView from 'ol/view';
import olLayer from 'ol/layer/layer';
import olSourceVector from 'ol/source/vector';
import olLayerVector from 'ol/layer/vector';
import olControlMousePosition from 'ol/control/MousePosition';
import olCoordinate from 'ol/coordinate';
import olDraw from 'ol/interaction/draw';
import olControl from 'ol/control';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';



/**
 * A wrapper around the openlayer object for use in the portal.
 */
@Injectable()
export class OlMapObject {

  private map: olMap;
  private activeLayer: {};

  constructor(private renderStatusService: RenderStatusService) {

    const mousePositionControl = new olControlMousePosition({
      coordinateFormat: olCoordinate.createStringXY(4),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });

    const osm_layer: any = new olTile({
      source: new olOSM()
    });
    this.activeLayer = {};
    this.map = new olMap({
      controls: olControl.defaults({
          attributionOptions: ({
            collapsible: false
          })
        }).extend([mousePositionControl]),
      layers: [osm_layer],
      view: new olView({
        center: Constants.CENTRE_COORD,
        zoom: 4
      })
    })
  }

  /**
   * returns an instance of the ol map
   */
  public getMap(): olMap {
    return this.map;
  }

  /**
   * Add a ol layer to the ol map. At the same time keep a reference map of the layers
   * @param layer: the ol layer to add to map
   * @param id the layer id is used
   */
  public addLayerById(layer: olLayer, id: string): void {
    if (!this.activeLayer[id]) {
      this.activeLayer[id] = [];
    }
    this.activeLayer[id].push(layer);

    this.map.addLayer(layer);
  }


  /**
   * retrieve references to the layer by layer name.
   * @param id the layer id is used
   * @return the ol layer
   */
  public getLayerById(id: string): [olLayer] {
    return this.activeLayer[id];
  }

  /**
   * remove references to the layer by layer id.
   * @param id the layer id is used
   */
  public removeLayerById(id: string) {
    const activelayers = this.getLayerById(id);
    if (activelayers) {
      activelayers.forEach(layer => {
        this.map.removeLayer(layer);
      })

      this.renderStatusService.resetLayer(id);
    }

  }


  public drawBox(): BehaviorSubject<olLayerVector> {
    const source = new olSourceVector({wrapX: false});

    const vector = new olLayerVector({
      source: source
    });

    const vectorBS = new BehaviorSubject<olLayerVector>(vector);


    this.map.addLayer(vector);
    const draw = new olDraw({
      source: source,
      type: /** @type {ol.geom.GeometryType} */ ('Circle'),
      geometryFunction: olDraw.createBox()
    });
    const me = this;
    draw.on('drawend', function() {
      me.map.removeInteraction(draw);
      setTimeout(function() {
        me.map.removeLayer(vector);
        vectorBS.next(vector);
      }, 500);
    })
    this.map.addInteraction(draw);
    return vectorBS
  }

}
