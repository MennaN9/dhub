import { Component, OnInit } from '@angular/core';
import { FacadeService } from '@dms/services/facade.service';
import { NotificationVM } from '@dms/services/settings/notifications.service';
import { MatSelectionListChange } from '@angular/material';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { SignalRNotificationService } from '@dms/app/services/state-management/signal-rnotification.service';
import { FilterService } from '../../../services/state-management/filter.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationVM[] = [];
  selectedNotifications: any[] = [];

  total: number;
  UnReadCount: number;
  pageIndex: number = 0;
  pageSize: number = 20;

  /**
   * 
   * @param facadeService 
   */
  constructor(
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    private signalRNotificationService: SignalRNotificationService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.getUnReadCount();
    this.getAllNotifications();
  }

  /**
   * notifications list
   * 
   * 
   */
  getAllNotifications() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    }

    this.facadeService.notificationsService.listByPagination(body).subscribe((notifications: any) => {
      this.notifications = notifications.result;
      this.total = notifications.totalCount;
    });
  }

  /**
   * count readed notifications
   * 
   * 
   */
  getUnReadCount() {
    this.facadeService.notificationsService.unReadCount.subscribe((count: any) => {
      this.UnReadCount = count;
    });
  }

  /**
   * mark selected as read
   * 
   * 
   */
  markThemAsRead() {
    this.facadeService.notificationsService.markAsRead().subscribe(res => {
      this.snackBar.openSnackBar({
        message: this.translateService.instant('Success read'),
        action: this.translateService.instant('Okay'),
        duration: 2500
      });

      this.signalRNotificationService.resetNotificationsCount(true);
      this.filterService.NotificationisRead({});
      this.getUnReadCount();
    });
  }

  /**
   * select one or more to make thme read
   * 
   * 
   * @param event 
   */
  onSelection(event: MatSelectionListChange) {
    this.selectedNotifications = event.source._value;
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getAllNotifications()
  }


}
