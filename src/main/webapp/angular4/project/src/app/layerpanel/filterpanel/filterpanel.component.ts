import { LayerModel } from '../../portal-core-ui/model/data/layer.model';
import { LayerHandlerService } from '../../portal-core-ui/service/cswrecords/layer-handler.service';
import { FilterPanelService } from '../../portal-core-ui/service/filterpanel/filterpanel-service';
import { OlMapService } from '../../portal-core-ui/service/openlayermap/ol-map.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { Component, Input} from '@angular/core';


@Component({
    selector: 'app-filter-panel',
    templateUrl: './filterpanel.component.html'
})


export class FilterPanelComponent {


  @Input() layer: LayerModel;
  private providers: Array<Object>;
  public optionalFilters: Array<Object>;

  constructor(private olMapService: OlMapService, private layerHandlerService: LayerHandlerService,
    private filterPanelService: FilterPanelService) {
    this.providers = [];
    this.optionalFilters = [];
  }

  public addLayer(layer): void {
    this.olMapService.addLayer(layer);
  }

  public getKey(options: Object): string {
    return UtilitiesService.getKey(options);
  }

   /**
     * Adds a new filter to be displayed in the panel
     * @method addFilter
     * @param filter filter object to be added to the panel
     * @param addEmpty if true, set filter value to be empty.
     */
    public addFilter(filter, addEmpty): void {
        if (filter == null) {
            return;
        }
        if (UtilitiesService.isEmpty(this.providers) && filter.type === 'OPTIONAL.PROVIDER') {
            this.getProvider();
            if (addEmpty) {
                filter.value =  {};
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
                label : key,
                value : adminAreasMap[key]
            });
        }

    };
}
