import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticatedService {

  private state = new BehaviorSubject<boolean>(false);
  currentStatus = this.state.asObservable();

  /**
   * change status login / logout
   * 
   * 
   * @param value 
   */
  changeStatus(value: boolean) {
    this.state.next(value)
  }

}
