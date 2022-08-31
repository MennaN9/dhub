import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrderProgressComponent } from './order-progress/order-progress.component';
import { FacadeService } from '@dms/app/services/facade.service';
import { TasksViewModel } from '@dms/app/models/task/assignDriverMainTaskViewModel';
import { TaskReportParam } from '@dms/app/models/task/report';
import { GeoFence } from '@dms/app/models/settings/GeoFence';
import { Restaurant } from '@dms/app/models/settings/restaurant';
import { Branch } from '@dms/app/models/settings/branch';
import { Driver } from '@dms/app/models/settings/Driver';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;
  dataSource: any;

  displayedColumns: string[] = ['cid','orderId', 'driverName', 'taskTypeName', 'date', 'waitingTime', 'eta', 'name', 'address', 'rating', 'comment', 'taskStatusName', 'view'];
  selection = new SelectionModel<TasksViewModel>(true, []);
  reportParam: TaskReportParam = new TaskReportParam([], [], [], [], [], [], null, null, null,null ,null,null,null, 1, 10, "", 0, 0, false);

  taskReports: TasksViewModel[] = [];
  restaurants: Restaurant[] = [];
  branches: Branch[] = [];
  drivers: Driver[] = [];
  statusList: any[] = [];
  zones: GeoFence[] = [];

  checked: boolean = false;
  submitted: boolean = false;

  constructor(public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {
    this.reportParam.pageNumber = this.pageIndex;
    this.reportParam.FromDate = new Date();
    this.reportParam.ToDate = new Date();
  }

  ngOnInit() {
    this.getRestaurants();
    this.getBranches();
    this.getDrivers();
    this.getStatus();
    this.getZones();
    this.getReports();
  }

  /**
   * get all restaurants
   * 
   * 
   */
  getRestaurants() {
    this.facadeService.restaurantService.list().subscribe((result: any[]) => {
      this.restaurants = result;

      // make all of them selected for first time
      // let ids = this.restaurants.map(branch => branch.id)
      // this.reportParam.RestaurantIds.push(...ids);
    });
  }

  /**
   * get all Branches
   * 
   * 
   */
  getBranches() {
    this.facadeService.branchService.list().subscribe((result: any) => {
      this.branches = result;

      // make all of them selected for first time
      // let ids = this.branches.map(branch => branch.id)
      // this.reportParam.BranchIds.push(...ids);
    });
  }

  /**
   * get all Drivers
   *
   *
  */
  getDrivers() {
    this.facadeService.driverService.list().subscribe((result: any[]) => {
      this.drivers = result;

      // make all of them selected for first time
      // let ids = this.drivers.map(driver => driver.id)
      // this.reportParam.DriversIds.push(...ids);
    });
  }

  /**
   * all Zones
   *
   */
  getZones() {
    this.facadeService.geoFenceService.list().subscribe((result: any[]) => {
      this.zones = result;

      // make all of them selected for first time
      // let ids = this.zones.map(branch => branch.id)
      // this.reportParam.ZonesIds.push(...ids);
    });
  }

  /**
   * all status
   *
   */
  getStatus() {
    this.facadeService.taskStatusService.list().subscribe((result: any) => {
      this.statusList = result;

      // make all of them selected for first time
      // let ids = this.statusList.map(status => status.id)
      // this.reportParam.StatusIds.push(...ids);
    });
  }

  /**
  * list all managers
  *
  *
  */
  getReports() {
    this.submitted = true;

    if (this.reportParam.FromDate == null || this.reportParam.ToDate == null) {
      return this.snackBar.openSnackBar({ message: this.translateService.instant('Start date & End date required'), duration: 2500, action: this.translateService.instant('okay') });
    } else {
      this.submitted = false;
      let tempfromDate = this.reportParam.FromDate;
      let temptoDate = this.reportParam.ToDate;

      this.reportParam.FromDate = this.reportParam.FromDate.toLocaleDateString();
      this.reportParam.ToDate = this.reportParam.ToDate.toLocaleDateString();

      this.facadeService.taskService.taskReport(this.reportParam).subscribe((result: any) => {
        this.taskReports = result.result;
        this.dataSource = new MatTableDataSource(result.result);
        this.length = this.totalCount = result.totalCount;
      });

      this.reportParam.FromDate = tempfromDate;
      this.reportParam.ToDate = temptoDate;
    }
  }

  /**
   * clear filter
   * 
   * 
   */
  Clear() {
    this.pageIndex = 1;
    this.submitted = false;
    this.reportParam.pageNumber = this.pageIndex;
    this.dataSource = null;
    this.length = 0;

    //this.reportParam = new TaskReportParam([], [], [], [], [], [], "", new Date(), new Date(), "", 1, 10, "", 0, 0, false);
    this.reportParam = new TaskReportParam([], [], [], [], [], [], "",null,null,null, new Date(), new Date(), "", 1, 10, "", 0, 0, false);

    this.getReports();
  }

  /**
   * task progresses
   * 
   * 
   * @param taskHistories 
   */
  openDialog(taskHistories: any): void {
    const dialogRef = this.dialog.open(OrderProgressComponent, {
      data: {
        task: taskHistories
      },
      width: '75%',
      height: '75%',
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
  }

  /**
  * on change page or per page
  *
  *
  * @param event
  */
  onChangePage(event) {
    this.reportParam.pageNumber = event.pageIndex + 1;
    this.reportParam.pageSize = event.pageSize;

    this.getReports();
  }

  /**
   * export orders
   * 
   * 
   * @param type(with order progress or without)
   */
  export() {
    if (!this.reportParam.FromDate && !this.reportParam.ToDate) {
      return this.snackBar.openSnackBar({ message: this.translateService.instant('Start date & End date reuired'), duration: 2500, action: this.translateService.instant('okay') });
    }

    let tempfromDate = this.reportParam.FromDate;
    let temptoDate = this.reportParam.ToDate;

    this.reportParam.FromDate = this.reportParam.FromDate.toLocaleDateString();
    this.reportParam.ToDate = this.reportParam.ToDate.toLocaleDateString();

    if (this.reportParam.isOrderProgress) {
      this.facadeService.taskService.exportReportsWitProgressToExcel(this.reportParam).subscribe(res => {
        saveFile(this.translateService.instant('Reports') + '.csv', "data:attachment/text", res);
      });

    } else {
      this.facadeService.taskService.exportReportsWithoutProgressToExcel(this.reportParam).subscribe(res => {
        saveFile(this.translateService.instant('Reports') + '.csv', "data:attachment/text", res);
      });
    }

    this.reportParam.FromDate = tempfromDate;
    this.reportParam.ToDate = temptoDate;
  }
}
