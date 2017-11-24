import {ManageStateService} from '../../portal-core-ui/service/permanentlink/manage-state.service';
import { UtilitiesService } from '../../portal-core-ui/utility/utilities.service';
import { environment } from '../../../environments/environment';
import {Component} from '@angular/core';

declare var LZMA: any;

@Component({
  selector: '[appPermanentLink]',
  templateUrl: './permanentlink.component.html'
})

export class PermanentLinkComponent {

  public permanentlink = '';

  constructor(private manageStateService: ManageStateService) {}

  public generatePermanentLink() {


    const uncompStateStr = JSON.stringify(this.manageStateService.getState());
    const me = this;
    LZMA.compress(uncompStateStr, 1, function on_compress_complete(result) {

      // Encode state in base64 so it can be used in a URL
      const stateStr = UtilitiesService.encode_base64(String.fromCharCode.apply(String, result));
      me.permanentlink = environment.portalBaseUrl + '?state=' + stateStr
    });

  }

}
