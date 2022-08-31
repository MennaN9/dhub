import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskstatusService {

  private status = new BehaviorSubject<boolean>(false);
  currentStatus = this.status.asObservable();

  private taskdelete = new BehaviorSubject<boolean>(false);
  taskdeletetion = this.taskdelete.asObservable();

  /**
   * change status (open / close)
   * 
   * 
   * @param value 
   */
  changeStatus(value: boolean) {
    this.status.next(value)
  }



  taskDeleted(value: boolean) {
    this.taskdelete.next(value)
  }
}
