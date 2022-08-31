import { AccountLogs } from './../../../models/settings/AccountLog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { UserInfo } from '@dms/app/models/account/userInfo';
import { saveFile } from '../../../utilities/generate-download-file';

export interface Row {
  user: string;
  date: string;
  description: string;
  activityType: string;
}

@Component({
  selector: 'app-account-logs',
  templateUrl: './account-logs.component.html',
  styleUrls: ['./account-logs.component.scss']
})
export class AccountLogsComponent implements OnInit {

  accountLogs: AccountLogs[] = [];
  sortedData: AccountLogs[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;

  user: UserInfo;

  displayedColumns: string[] = ['createdBy_Id', 'activityType', 'description', 'createdDate'];
  dataSource: any;

  page: number = 10;
  startDate: Date = new Date();
  endDate: Date = new Date();
  type: string = 'All'
  UserID: string;
  cssClass: string = 'e-outline';

  /**
   * 
   * @param dialog 
   * @param facadeService 
   */
  constructor(
    public dialog: MatDialog,
    private facadeService: FacadeService) {
  }

  ngOnInit() {
    this.getAccountLogs();
    this.user = this.facadeService.accountService.user;
  }

  /**
    * fetch all Account Logs
    *
    *
    */
  getAccountLogs() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      StartDate: this.startDate.toLocaleDateString(),
      EndDate: this.endDate.toLocaleDateString(),
      SearchBy: this.type,
      UserID: this.UserID
    }

    this.facadeService.accountLogService.listByPagination(body).subscribe((result: any) => {
      this.sortedData = this.accountLogs = result.result;
      this.length = this.totalCount = result.totalCount;
      this.dataSource = new MatTableDataSource(this.accountLogs);
    });
  }

  /**
   * Export Logs
   *
   *
   */
  exportLogs() {

    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      StartDate: this.startDate.toLocaleDateString(),
      EndDate: this.endDate.toLocaleDateString(),
      SearchBy: this.type,
      UserID: this.UserID,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    this.facadeService.accountLogService.exportToExcel(body).subscribe(data => {
      saveFile("AccountLogs.csv", "data:attachment/text", data);
    });
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getAccountLogs();
  }

  /**
   * select date to filter activity logs
   *
   *
   * @param event
   */
  onSelectDate(event) {
    this.startDate = event.startDate;

    this.endDate = event.endDate;
    this.pageIndex = 0;
    this.getAccountLogs();
  }

  /**
   * filter logs
   * 
   * 
   * @param value 
   * @param flag 
   */
  filterData(event, flag) {
    const type = event.target.value
    if (flag == 1) {
      this.type = type;
    } else {
      this.UserID = type;
    }

    this.getAccountLogs();
  }

  clear() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.startDate = new Date();
    this.endDate = new Date();
    this.type = "All";

    this.getAccountLogs();
  }
}
