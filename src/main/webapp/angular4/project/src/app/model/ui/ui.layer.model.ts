import { UITabPanel } from './ui.tabpanel.model';

export enum LoadingStatus {
    loading = 0 ,
    complete = 1,
    error = 2,
    none = 3
}

export class UILayerModel {
    expanded: boolean;
    loadingStatus: LoadingStatus;
    tabpanel: UITabPanel;

   constructor(public id: string) {
    this.tabpanel = new UITabPanel();
    this.expanded = false;
    this.loadingStatus = LoadingStatus.none;
   }


}
