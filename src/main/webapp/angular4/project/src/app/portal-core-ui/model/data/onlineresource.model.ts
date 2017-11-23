/**
 * A representation of a online resource
 */
import { CSWRecordModel } from './cswrecord.model';
export class OnlineResourceModel {
  applicationProfile: string;
  description: string;
  name: string;
  type: string;
  url: string;
  version: string;
  cswRecord: CSWRecordModel;
}
