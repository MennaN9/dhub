import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface Filter {
  date?: Date;
  dateRange?: DateRange;
  // teams?: number[];
  branchesIds?: number[];
  viewType?: string
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  // for single date selection
  private type: Filter = {
    viewType: 'map',
    date: new Date()
  };

  constructor(private router: Router) {
    this.reset();

  }

  private state = new BehaviorSubject<Filter>(this.type);
  currentStatus = this.state.asObservable();

  private NotificationRead = new BehaviorSubject<Filter>(this.type);
  NotificationReadStatus = this.state.asObservable();

  NotificationisRead(value: Filter) {
    this.NotificationRead.next(value);
  }

  /**
   * next state
   *
   *
   * @param value
   */

  changeStatus(value: Partial<Filter>) {
    this.state.next({ ...this.state.value, ...value });
  }

  reset() {
    if (this.isTaskRoute) {
      this.type.viewType = 'list';
      this.type.dateRange = {
        startDate: new Date(),
        endDate: new Date(),
      };
    } else {
      this.type.viewType = 'map';
      this.type.date = new Date();
    }
    this.changeStatus(this.type);
  }

  /**
   * is task route
   *
   *
   */
  private get isTaskRoute(): boolean {
    if (this.router.url.includes('tasks')) {
      return true;
    } else {
      return false;
    }
  }
}
