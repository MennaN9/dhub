import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class RefreshNotificationCountService {

  private state = new BehaviorSubject<boolean>(false);
  count = this.state.asObservable();

  changeCount(value: boolean) {
    this.state.next(value)
  }
}
