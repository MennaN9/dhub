import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacadeService } from '@dms/app/services/facade.service';
import { DriverReportParam } from '@dms/app/models/task/report';
import { Driver, DriverWorkingHourReport } from '@dms/app/models/settings/Driver';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.scss'],
  providers: [
    DatePipe
  ]
})
export class DriverReportComponent implements OnInit {
  pageIndex: number = 1;
  pageSize: number = 10;
  length: number = 0;
  totalCount: number;
  dataSource: any;
  allSelected: any;
  displayedColumns: string[] = ['driverId', 'driverName', 'date', 'totalHours'];

  selection = new SelectionModel<DriverWorkingHourReport>(true, []);
  reportParam: DriverReportParam = new DriverReportParam([], null, null, 1, 10, '', 0, 0, Intl.DateTimeFormat().resolvedOptions().timeZone);

  driverReports: DriverWorkingHourReport[] = [];
  drivers: Driver[] = [];

  checked: boolean = false;
  submitted: boolean = false;

  constructor(public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {
    this.reportParam.pageNumber = this.pageIndex;
    this.reportParam.driverIds = [0];

    this.reportParam.startDate = this.datePipe.transform(new Date(), 'medium');
    this.reportParam.endDate = this.datePipe.transform(new Date(), 'medium');
  }

  ngOnInit() {
    this.getDrivers();
  }

  ngAfterViewInit() {
    this.initDatePicker();
  }

  /**
   * datepicker
   *
   *
   */
  initDatePicker() {
    $(document).ready(() => {
      $('.startDatetimepicker').datetimepicker({
        onChangeDateTime: (dp: Date, inputs: any) => {
          const date = this.datePipe.transform(dp, 'medium');
          this.reportParam.startDate = date;
        },
        validateOnBlur: false,
        step: 15
      });

      $('.endDatetimepicker').datetimepicker({
        onChangeDateTime: (dp: Date, inputs: any) => {
          const date = this.datePipe.transform(dp, 'medium');

          this.reportParam.endDate = date;
        },
        validateOnBlur: false,
        step: 15
      });
    });
  }

  /**
   * get all Drivers
   *
   *
  */
  getDrivers() {
    this.facadeService.driverService.list()
      .subscribe((result: any[]) => {
        this.drivers = result;
      });
  }

  /**
  * list driver working hours report
  *
  *
  */
  getReports() {
    if (!this.reportParam.startDate || !this.reportParam.endDate) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Date from & date to are required'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else if (this.reportParam.driverIds.length === 0) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Driver name is required'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else if (new Date(this.reportParam.endDate) < new Date(this.reportParam.startDate)) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Date to must be greater than date from'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else {
      this.submitted = true;
      const request = { ...this.reportParam };
      if (request.driverIds.includes(0)) {
        request.driverIds = [];
      }

      this.facadeService.driverWorkingHourTrackingService.listByPagination(request).subscribe((result: any) => {
        if (result) {
          this.driverReports = result.result;
          this.dataSource = new MatTableDataSource(result.result);
          this.length = this.totalCount = result.totalCount;
        }

        this.submitted = false;
      });
    }
  }

  /**
   * change date
   *
   *
   * @param event
   */
  onChangeDate(event) {
    this.reportParam.startDate = event.value;
  }


  /**
   * clear filter
   *
   *
   */
  clear() {
    this.pageIndex = 1;
    this.submitted = false;
    this.reportParam.pageNumber = this.pageIndex;
    this.dataSource = null;
    this.length = 0;
    this.totalCount = 0;

    const newDate = this.datePipe.transform(new Date(), 'medium');
    this.reportParam = new DriverReportParam([0], newDate, newDate, 1, 10, "", 0, 0);
  }

  toggleAllSelection() {
    if (this.reportParam.driverIds.includes(0)) {
      this.drivers.forEach(item => {
        this.reportParam.driverIds.push(item.id);
      });
    } else {
      this.reportParam.driverIds = [];
    }
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
    if (!this.reportParam.startDate || !this.reportParam.endDate) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Date from & date to are required'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else if (this.reportParam.driverIds.length === 0) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Driver name is required'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else if (new Date(this.reportParam.endDate) < new Date(this.reportParam.startDate)) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Date to must be greater than date from'),
        duration: 2500,
        action: this.translateService.instant('okay')
      });
    } else {
      this.submitted = true;
      const request = { ...this.reportParam };
      if (request.driverIds.includes(0)) {
        request.driverIds = [];
      }


      this.facadeService.driverWorkingHourTrackingService.exportToExcel(request).subscribe(res => {
        saveFile(this.translateService.instant('Reports') + '.csv', "data:attachment/text", res);
      });
    }
  }
}
