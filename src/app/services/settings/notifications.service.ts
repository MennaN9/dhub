import { Injectable } from '@angular/core';
import { HttpClientService } from '../../core/http-client/http-client.service';

const endpoint = 'Notification'

export interface NotificationVM {
  id: number;
  title: string;
  body: string;
  date: Date;
  isSeen: boolean;
  notificationType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClientService) { }

  /**
   * list notifications
   * 
   * 
   * @param body 
   */
  listByPagination(body: Object) {
    return this.http.post<NotificationVM[]>(body, `${endpoint}/GetAllByPagination`);
  }

  /**
   * make it read
   * 
   * 
   */
  markAsRead() {
    return this.http.get(`${endpoint}/MarkAsRead`);
  }

  /**
   * count
   * 
   * 
   */
  get unReadCount() {
    return this.http.get(`${endpoint}/UnReadCount`);
  }


  /**
   * mark notifications read
   * 
   * 
   * @param body 
   */
  markThemAsRead(body: Object) {
    return this.http.post<NotificationVM[]>(body, `${endpoint}/MarkThemAsRead`);
  }

}
