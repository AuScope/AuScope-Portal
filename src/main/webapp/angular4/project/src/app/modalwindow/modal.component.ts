
import { AfterViewInit, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'app-modal-window',
    templateUrl: './modal.component.html'
})

export class ModalComponent implements AfterViewInit {

    // At the moment these are just basic placeholder strings - fancy stuff will come later
    public analyticsContent: string;
    public detailsContent: string;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngAfterViewInit() {

    }

}
