import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

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
}
