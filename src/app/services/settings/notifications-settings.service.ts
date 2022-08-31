import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { NotificationSetting, NotificationSettingLookup } from '@dms/app/models/settings/notifications-settings';
import { Observable } from 'rxjs';

const endpoint = 'Settings'

@Injectable({
  providedIn: 'root'
})
export class NotificationsSettingsService {

  constructor(private http: HttpClientService) { }

  get notificationSettingLookups(): Observable<NotificationSettingLookup[]> {
    return this.http.get<NotificationSettingLookup[]>(`${endpoint}/GetNotificationSettingLookups`);
  }

  get allNotificationSetting(): Observable<NotificationSetting[]> {
    return this.http.get<NotificationSetting[]>(`${endpoint}/GetAllNotificationSetting`);
  }

  updateNotificationSettingRange(body: object): Observable<any> {
    return this.http.post(body, `${endpoint}/UpdateNotificationSettingRange`);
  }
}
