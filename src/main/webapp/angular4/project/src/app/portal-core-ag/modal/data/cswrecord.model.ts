import { OnlineResourceModel } from './onlineresource.model';

export class CSWRecordModel {
  adminArea: string;
  childRecords: any;
  constraints: any;
  contactOrg: string;
  datasetURIs: any;
  date: string;
  description: string;
  descriptiveKeywords: any;
  geographicElements: any;
  id: string;
  name: string;
  noCache: boolean;
  onlineResources: OnlineResourceModel[];
  recordInfoUrl: string;
  resourceProvider: string;
  service: boolean

}
