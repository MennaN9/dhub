import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { DriverRequest, HistoricalAuditor } from '@dms/app/models/settings/DriverRequest';
import { DriverRegistrationRequestsService } from '@dms/app/services/settings/driver-registration-requests.service';

@Component({
  selector: 'app-driver-registration-request-view',
  templateUrl: './driver-registration-request-view.component.html',
  styleUrls: ['./driver-registration-request-view.component.scss']
})
export class DriverRegistrationRequestViewComponent implements OnInit {
  @Input() status: string[];

  cssClass: string = 'e-outline';

  newColumns: string[] = ['registrationDate', 'driverName', 'driverPhone', 'driverArea', 'driverJob', 'vehicleType', 'actions'];
  pendingColumns: string[] = ['registrationDate', 'driverName', 'driverPhone', 'driverArea', 'driverJob', 'vehicleType', 'comments', 'actions'];
  allColumns: string[] = ['registrationDate', 'driverName', 'driverPhone', 'driverArea', 'driverJob', 'vehicleType', 'comments', 'userRegistrationStatus', 'approvedOrRejectedByUserFullName', 'actions'];
  currentColumns: string[] = ['registrationDate', 'driverName', 'driverPhone', 'driverArea', 'driverJob', 'vehicleType', 'actions'];

  startDate: Date;
  endDate: Date;

  page: number = 1;
  pageSize: number = 10;

  requests: DriverRequest[] = [];

  total: number = 0;
  dataSource = new MatTableDataSource([]);
  historicalAuditors: HistoricalAuditor[] = [];
  selectedHistoricalAuditor: number;

  constructor(
    private driverRegistrationRequestsService: DriverRegistrationRequestsService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.status.includes('New')) {
      this.currentColumns = this.newColumns;
    }

    if (this.status.includes('Pending')) {
      this.currentColumns = this.pendingColumns;
    }

    if (this.status.includes('Rejected') || this.status.includes('Approved')) {
      this.currentColumns = this.allColumns;
    }

    this.listHistoricalAuditors();
    this.listRequests();
  }

  requestDetails(id: number) {
    this.router.navigate([Routes.driversRegistrationRequestsViewDetails, id]);
  }

  listRequests() {

    const body = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      userRegistrationStatuses: this.status
    };

    if (this.startDate) {
      body['startDate'] = new Date(this.startDate).toISOString();
    }
    if (this.endDate) {
      body['endDate'] = new Date(this.endDate).toISOString();
    }

    if (this.selectedHistoricalAuditor) {
      body['userID'] = this.selectedHistoricalAuditor
    }

    this.driverRegistrationRequestsService.allRequestsByPagination(body).subscribe((res: any) => {
      this.total = res.totalCount;
      this.dataSource.data = res.result;
    })
  }

  onSelectDate(event): void {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.listRequests();
  }

  /**
 * on change page or per page
 *
 *
 * @param event
 */
  onChangeUser(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.listRequests();
  }

  listHistoricalAuditors() {
    const body = {
      pageNumber: 1,
      pageSize: 100,
    };

    this.driverRegistrationRequestsService.historicalAuditors(body).subscribe((res: any) => {
      this.historicalAuditors = res.result;
    });
  }

  onChangeAuditor(event: MatSelectChange) {
    this.selectedHistoricalAuditor = event.value
  }

  clearFilter() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedHistoricalAuditor = undefined;
    this.listRequests();
  }
}
