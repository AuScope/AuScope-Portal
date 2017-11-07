import { NVCLDatasetListComponent } from '../app/modalwindow/querier/customanalytic/nvcl/nvcl.datasetlist.component';

export const environment = {
  production: true,
  getCSWRecordUrl: '../getKnownLayers.do',
  getCustomLayers: '../getCustomLayers.do',
  portalBaseUrl: 'http://portal.auscope.org/portal/',
  csvSupportedLayer: [
    'mineral-tenements',
    'tima-geosample',
    'nvcl-v2-borehole',
    'tima-shrimp-geosample'],
  analytic: {
      'nvcl-borehole': NVCLDatasetListComponent,
  }

};
