import { StatusMapModel } from '../../../../portal-core-ui/model/data/statusmap.model';
import { UITabPanel } from './uitabpanel.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


export class UILayerModel {
    expanded: boolean;
    tabpanel: UITabPanel;
    statusMap: StatusMapModel;

   constructor(public id: string, public loadingSubject: BehaviorSubject<StatusMapModel>) {
    this.tabpanel = new UITabPanel();
    this.expanded = false;
    loadingSubject.subscribe((value) => {
      this.statusMap = value;
    });

   }



}
