import {UILayerModel} from '../../layerpanel/model/ui/uilayer.model';
import {Component, OnInit, Input} from '@angular/core';


@Component({
  selector: 'ngbd-modal-status-report',
  templateUrl: './renderstatus.component.html'
})


export class NgbdModalStatusReportComponent implements OnInit {

  @Input() uiLayerModel: UILayerModel;
  private resourceMap: Object;

  constructor() {}

  ngOnInit(): void {
    this.uiLayerModel.statusMap.getStatusBSubject().subscribe((value) => {
      this.resourceMap = value.resourceMap;
    });
  }


}
