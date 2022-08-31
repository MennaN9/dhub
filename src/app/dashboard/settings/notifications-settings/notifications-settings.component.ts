import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationSetting, NotificationSettingLookup, Event } from '@dms/app/models/settings/notifications-settings';
import { NotificationsSettingsService } from '@dms/app/services/settings/notifications-settings.service';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['events', 'users', 'notifyBy'];
  notificationSettingLookups: NotificationSettingLookup[] = [];
  notificationSettings: NotificationSetting[] = [];
  notificationSettingsToUpdate: NotificationSetting[] = [];

  subscriptions = new Subscription();

  /**
   * 
   * @param notificationsSettingsService 
   */
  constructor(private notificationsSettingsService: NotificationsSettingsService,
    private snackBar: SnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getNotificationSettingLookups();
  }

  getNotificationSettingLookups() {
    this.subscriptions.add(this.notificationsSettingsService.notificationSettingLookups.subscribe((notificationSettingLookups: NotificationSettingLookup[]) => {
      this.notificationSettingLookups = notificationSettingLookups;

      this.notificationSettingLookups.forEach(notificationSettingLookup => {

        notificationSettingLookup.events.forEach((event: Event) => {
          event.selectedNotifyList = [];
          event.selectedUsers = [];
        });
      });

      this.getNotificationSettings();
    }));
  }

  getNotificationSettings() {
    this.subscriptions.add(this.notificationsSettingsService.allNotificationSetting.subscribe((notificationSettings: NotificationSetting[]) => {
      this.notificationSettings = notificationSettings;

      this.notificationSettings.forEach((notificationSetting: NotificationSetting) => {
        if (notificationSetting.notifyBylist.length > 0 || notificationSetting.users.length > 0) {
          this.populateValues(notificationSetting.group, notificationSetting.event, notificationSetting.notifyBylist, notificationSetting.users);
        }
      });
    }));
  }

  /**
   * 
   * @param groupName 
   * @param eventName 
   * @param notifyList 
   * @param users 
   */
  populateValues(groupName: string, eventName: string, notifyList: number[], users: number[]) {
    this.notificationSettingLookups.forEach((notificationSettingLookup: NotificationSettingLookup) => {

      if (notificationSettingLookup.name == groupName) {
        notificationSettingLookup.events.forEach((event: Event) => {

          if (eventName == event.name) {
            event.selectedNotifyList = notifyList;
            event.selectedUsers = users;
          }
        });
      }
    });
  }

  updateNotificationSettingRange() {
    this.notificationSettingLookups.forEach((notificationSettingLookup: NotificationSettingLookup) => {

      notificationSettingLookup.events.forEach((event: Event) => {
        this.notificationSettingsToUpdate.push({
          group: notificationSettingLookup.name,
          event: event.name,
          users: event.selectedUsers,
          notifyBylist: event.selectedNotifyList,
        });
      });
    });

    this.subscriptions.add(this.notificationsSettingsService.updateNotificationSettingRange(this.notificationSettingsToUpdate).subscribe((res: any) => {
      this.snackBar.openSnackBar({
        message: this.translateService.instant('Successfully updated'),
        action: this.translateService.instant('Okay'),
        duration: 2500,
      })
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
