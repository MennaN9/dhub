import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacadeService } from '@dms/app/services/facade.service';
import { TasksViewModel } from '@dms/app/models/task/assignDriverMainTaskViewModel';
import { TaskReportParam } from '@dms/app/models/task/report';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { OrderProgressComponent } from '../reports/order-progress/order-progress.component';

@Component({
  selector: 'app-manager-reports',
  templateUrl: './manger-reports.component.html',
  styleUrls: ['./manger-reports.component.scss']
})

export class ManagerReportsComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;
  dataSource: any;

  displayedColumns: string[] = ['cid', 'name', 'address', 'date', 'shippmentType', 'taskStatusName', 'view'];
  selection = new SelectionModel<TasksViewModel>(true, []);
  reportParam: TaskReportParam = new TaskReportParam([3, 5, 6, 7], [], [], [], [], [], null, null, null, null, null, null, null, 1, 10, "", 0, 0, false);

  taskReports: TasksViewModel[] = [];
  statusList: any[] = [];

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
    this.getStatus();
    this.getReports();
  }

  /**
   * all status
   *
   */
  getStatus() {
    this.facadeService.taskStatusService.list().subscribe((result: any) => {
      this.statusList = result.filter(x => x.id == 3 || x.id == 5 || x.id == 6 || x.id == 7);

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

      this.facadeService.taskService.managerTaskReport(this.reportParam).subscribe((result: any) => {
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
    this.reportParam = new TaskReportParam([3, 5, 6, 7], [], [], [], [], [], null, null, null, null, new Date(), new Date(), "", 1, 10, "", 0, 0, false);
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
        task: taskHistories,
        hideDriverColumn: true,
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

    this.facadeService.taskService.exportReportsManagerReportToExcel(this.reportParam).subscribe(res => {
      saveFile(this.translateService.instant('Reports') + '.csv', "data:attachment/text", res);
    });

    this.reportParam.FromDate = tempfromDate;
    this.reportParam.ToDate = temptoDate;
  }
}
