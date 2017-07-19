import { CSWRecordModel } from './cswrecord.model';

export class LayerModel {
  constructor(
  cswRecords: CSWRecordModel[],
  description: string,
  feature_count: number,
  group: string,
  hidden: boolean,
  id: string,
  layerMode: string,
  name: string,
  order: string,
  proxyCountUrl: string,
  proxyDownloadUrl: string,
  proxyGetFeatureInfoUrl: string,
  proxyStyleUrl: string,
  proxyUrl: string,
  relatedRecords: any,
  singleTile: boolean,
  staticLegendUrl: true) {}
}
