// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { NVCLBoreholeAnalyticComponent } from '../app/modalwindow/layeranalytic/nvcl/nvcl.boreholeanalytic.component';
import { NVCLDatasetListComponent } from '../app/modalwindow/querier/customanalytic/nvcl/nvcl.datasetlist.component';
export const environment = {
  production: false,
  getCSWRecordUrl: '../getKnownLayers.do',
  getCustomLayers: '../getCustomLayers.do',
  portalBaseUrl: 'http://localhost:8080/AuScope-Portal/',
  hostUrl: 'http://localhost:4200/index.htm',
  csvSupportedLayer: [
    'mineral-tenements',
    'tima-geosample',
    'nvcl-v2-borehole',
    'tima-shrimp-geosample'],
  analytic: {
      'nvcl-borehole': NVCLDatasetListComponent,
  },
  layeranalytic: {
      'nvcl-v2-borehole': NVCLBoreholeAnalyticComponent,
  }
};
