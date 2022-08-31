import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriversObservableRefresherService {

  private status = new BehaviorSubject<boolean>(false);
  currentStatus = this.status.asObservable();

  /**
   * change status (open / close)
   *
   *
   * @param value
   */
  changeStatus(value: boolean) {
    this.status.next(value)
  }
  change() {
    this.changeStatus(!this.currentStatus)
  }

}
