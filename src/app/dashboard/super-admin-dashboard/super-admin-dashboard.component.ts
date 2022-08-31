import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MainTask } from '@dms/app/models/main/tasks/MainTask';
import { TaskType } from '@dms/app/models/main/tasks/TaskType';
import { Driver } from '@dms/app/models/settings/Driver';
import { AccountOrders, Dashboard, Order, Result, TotalOrders, TotalRequests } from '@dms/app/models/super-admin-dashboard/dashboard';
import { FacadeService } from '@dms/app/services/facade.service';
import { NotificationMessage, SignalRNotificationService } from '@dms/app/services/state-management/signal-rnotification.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AssignDriverComponent } from '../main/assign-driver/assign-driver.component';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit, OnDestroy {
  form: FormGroup;
  startDate: Date = new Date();
  endDate: Date = new Date();
  pageSize: number = 10;
  pageNumber: number = 1;

  result: Result;
  drivers: Driver[] = [];
  orderTypes: { id: number, name: string }[] = [];
  businessAccounts: { item1: string, item2: string }[] = [];
  taskTypes: TaskType[] = [];

  subscriptions = new Subscription();
  displayedColumns: string[] = ['orderId', 'driverName', 'taskTypeName', 'companyName', 'orderDate', 'taskStatusName', 'actions'];

  constructor(fb: FormBuilder,
    private dialog: MatDialog,
    private signalrNotificationService: SignalRNotificationService,
    private facadeService: FacadeService,
    private translateService: TranslateService) {
    this.form = fb.group({
      taskTypeIds: [["0"], [Validators.required]],
      driversIds: [["0"], [Validators.required]],
      tenantIds: [["0"], [Validators.required]],
    });

    const monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    this.startDate = new Date(monthBefore);
  }

  ngOnInit(): void {
    this.getDashboard();
    this.notificationLisner();

    this.subscriptions.add(this.facadeService.driverService.list().subscribe(drivers => {
      this.drivers = drivers;
    }));

    this.subscriptions.add(this.facadeService.superAdminDashboardService.getBusinessAccountLookups().subscribe((businessAccounts: { item1: string, item2: string }[]) => {
      this.businessAccounts = businessAccounts;
    }));

    this.subscriptions.add(this.facadeService.taskTypeService.list().subscribe((taskTypes: TaskType[]) => {
      this.taskTypes = taskTypes;
    }));
  }

  onSelectDate(dates: { startDate: Date, endDate: Date, }): void {
    this.startDate = new Date(dates.startDate);
    this.endDate = new Date(dates.endDate);
    const body: Dashboard = this.buildFilterObject();
    this.subscriptions.add(this.facadeService.superAdminDashboardService.getFirstDashbaordData(body).subscribe((result: Result) => {
      this.result = result;
    }));
  }

  reset(): void {
    const monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    this.startDate = new Date(monthBefore);
    this.endDate = new Date();

    this.form.get('taskTypeIds').setValue(["0"]);
    this.form.get('driversIds').setValue(["0"]);
    this.form.get('tenantIds').setValue(["0"]);
  }

  getDashboard(): void {
    const body: Dashboard = this.buildFilterObject();
    this.subscriptions.add(this.facadeService.superAdminDashboardService.getFirstDashbaordData(body).subscribe((result: Result) => {
      this.result = result;
    }));
  }

  OnChangeOrdersPageDashboard(event: { pageIndex: number, pageSize: number }): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    const body: Dashboard = this.buildFilterObject();
    this.subscriptions.add(this.facadeService.superAdminDashboardService.getOrdersByPagination(body).subscribe((result: AccountOrders) => {
      this.result.accountOrders.result = result.result;
      this.result.accountOrders.totalCount = result.totalCount;
    }));
  }

  buildFilterObject(): Dashboard {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      startDate: this.startDate,
      endDate: this.endDate,
      taskTypeIds: this.removeZeroFromArray(this.form.get('taskTypeIds').value),
      driversIds: this.removeZeroFromArray(this.form.get('driversIds').value),
      tenantIds: this.removeZeroFromArray(this.form.get('tenantIds').value),
    };
  }

  filter(): void {
    this.pageNumber = 1;
    this.pageSize = 10;

    this.getDashboard();
  }

  notificationLisner(): void {
    this.subscriptions.add(
      this.signalrNotificationService.subscribeMultiple([
        NotificationMessage.TaskSuccessful,
        NotificationMessage.TaskFailed,
        NotificationMessage.TaskCancel,
        NotificationMessage.TaskStart,
        NotificationMessage.TaskSuccessful,
      ], (_taskId, driver) => {
        this.subscriptions.add(this.facadeService.superAdminDashboardService.getTotalPendingRequests().subscribe((result: TotalRequests) => {
          this.result.totalRequests = result;
        }));
      })
    );

    this.subscriptions.add(this.signalrNotificationService.subscribeMultiple([
      NotificationMessage.LoginRequest,
      NotificationMessage.CancelLoginRequest,
      NotificationMessage.DriverLoggedOut
    ], driver => {
      this.subscriptions.add(this.facadeService.superAdminDashboardService.getTotalOrders().subscribe((result: TotalOrders) => {
        this.result.totalOrders = result;
      }));
    }));
  }

  removeZeroFromArray(array: (string | number)[]): (string | number)[] {
    return array.filter(element => {
      return element !== "0";
    })
  }

  openAssignDriverDialog(order: Order, label: string): void {
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '500px',
      minHeight: '300px',
      data: {
        taskId: order.orderId,
        lablel: this.translateService.instant(label),
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getDashboard();
      dialogRef.close();
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
