import {LayerModel} from '../../portal-core-ui/model/data/layer.model';
import {LayerHandlerService} from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import {FilterPanelService} from '../../portal-core-ui/service/filterpanel/filterpanel-service';
import {OlMapService} from '../../portal-core-ui/service/openlayermap/ol-map.service';
import {UtilitiesService} from '../../portal-core-ui/utility/utilities.service';
import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filterpanel.component.html'
})


export class FilterPanelComponent implements OnInit {




  @Input() layer: LayerModel;
  private providers: Array<Object>;
  public optionalFilters: Array<Object>;
  private selectedFilter;

  constructor(private olMapService: OlMapService, private layerHandlerService: LayerHandlerService,
    private filterPanelService: FilterPanelService) {
    this.providers = [];
    this.optionalFilters = [];
  }

  ngOnInit(): void {
    if (this.layer.filterCollection && this.layer.filterCollection['mandatoryFilters']) {
      const mandatoryFilters = this.layer.filterCollection['mandatoryFilters'];

      for (const mandatoryFilter of mandatoryFilters) {
        if (mandatoryFilter['type'] === 'MANDATORY.CHECKBOX') {
          mandatoryFilter['value'] = (mandatoryFilter['type'] === 'true')
        }
      }
    }
  }

  public addLayer(layer): void {
    const param = {
      optionalFilters: _.cloneDeep(this.optionalFilters)
    };

    for (const optFilter of param.optionalFilters) {
      if (optFilter['options']) {
        optFilter['options'] = [];
      }
    }
    this.olMapService.addLayer(layer, param);
  }

  public getKey(options: Object): string {
    return UtilitiesService.getKey(options);
  }

  public getValue(options: Object): string {
    return UtilitiesService.getValue(options);
  }



  /**
    * Adds a new filter to be displayed in the panel
    * @method addFilter
    * @param filter filter object to be added to the panel
    * @param addEmpty if true, set filter value to be empty.
    */
  public addFilter(filter, addEmpty?: boolean): void {
    if (filter == null) {
      return;
    }
    for (const filterobject of this.optionalFilters) {
      if (filterobject['label'] === filter['label']) {
        return;
      }
    }
    if (UtilitiesService.isEmpty(this.providers) && filter.type === 'OPTIONAL.PROVIDER') {
      this.getProvider();
      filter.value = {};
      for (const provider of this.providers) {
        filter.value[provider['value']] = true;
      }


    }
    if (UtilitiesService.isEmpty(filter.options) && filter.type === 'OPTIONAL.DROPDOWNREMOTE') {
      this.filterPanelService.getFilterRemoteParam(filter.url).subscribe(response => {
        filter.options = response;
        this.optionalFilters.push(filter);
      });
      return;
    }
    this.optionalFilters.push(filter);

  };

  /**
     * Assembles a list of providers, which will be displayed in the panel
     * @method getProvider
     */
  private getProvider(): void {
    const cswRecords = this.layer.cswRecords;

    // Set up a map of admin areas + URL's that belong to each
    const adminAreasMap = {};
    for (let i = 0; i < cswRecords.length; i++) {
      const adminArea = cswRecords[i].adminArea;
      const allOnlineResources = this.layerHandlerService.getOnlineResourcesFromCSW(cswRecords[i]);
      adminAreasMap[adminArea] = UtilitiesService.getUrlDomain(allOnlineResources[0].url);
    }

    // Set up a list of each unique admin area
    for (const key in adminAreasMap) {
      this.providers.push({
        label: key,
        value: adminAreasMap[key]
      });
    }

  };

  /**
   * refresh and clear the filters;
   */
  public refreshFilter(): void {
    this.optionalFilters = [];
    this.selectedFilter = {};
  }
}
