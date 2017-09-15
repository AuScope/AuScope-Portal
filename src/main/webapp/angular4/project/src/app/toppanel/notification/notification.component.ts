import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../portal-core-ui/service/toppanel/notification.service';


@Component({
  selector: '[app-notification]',
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[];
  result: String;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {

  }

  onGetNotifications() {
    this.notificationService.getNotifications()
      .subscribe(
      (data: any[]) => {this.notifications = data['data']; },
      (error) => {console.log('Something went wrong!'); }
      );
  }
}

interface Notification {
  content: string,
  author: string,
  time: string
}
