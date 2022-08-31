

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { DriverRequest, HistoricalAuditor } from '@dms/app/models/settings/DriverRequest';
import { BusinessRegistrationRequestsService } from '@dms/app/services/tanent/business-registration-requests.service';
import { BusinessRegistrationService, Type } from '@dms/app/services/tanent/business-registration.service';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-business-registration-requests-view',
  templateUrl: './business-registration-requests-view.component.html',
  styleUrls: ['./business-registration-requests-view.component.scss']
})
export class BusinessRegistrationRequestsViewComponent implements OnInit, OnDestroy {
  @Input() status: string[];

  newColumns: string[] = ['registrationDate', 'name', 'email', 'businessCID', 'businessAddess', 'businessType', 'actions'];
  pendingColumns: string[] = ['registrationDate', 'name', 'email', 'businessCID', 'businessAddess', 'businessType', 'comment', 'actions'];
  allColumns: string[] = ['registrationDate', 'name', 'email', 'businessCID', 'businessAddess', 'businessType', 'comment', 'userRegistrationStatus', 'approvedOrRejectedByUserFullName', 'actions'];

  currentColumns: string[] = ['registrationDate', 'name', 'email', 'businessCID', 'businessAddess', 'businessType', 'actions'];

  cssClass: string = 'e-outline';
  startDate: Date;
  endDate: Date;
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;

  selectedType: number;
  selectedHistoricalAuditor: number;

  requests: DriverRequest[] = [];
  dataSource = new MatTableDataSource([]);
  historicalAuditors: HistoricalAuditor[] = [];
  types: Type[] = [];
  registerTypes = [];
  flagType: boolean = false;
  subscriptions = new Subscription();

  constructor(
    private businessRegistrationService: BusinessRegistrationService,
    private businessRegistrationRequestsService: BusinessRegistrationRequestsService,
    private router: Router,
    public dialog: MatDialog) {
    this.currentColumns = this.newColumns;
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

    this.listRequests();
    this.listTypesOfBusiness();
    this.listHistoricalAuditors();
  }

  requestDetails(id: number) {
    this.router.navigate([Routes.businessRegistrationRequestsViewDetails, id]);
  }
  requestDeliveryDetails(name: string, id: number) {
    // this.router.navigate([`/view-Delivery-configuration/${id}`]);
    this.router.navigate([Routes.deliveryConfiguration, name, id]);
    // console.log(this.router.navigate([Routes.deliveryConfiguration, id]))
  }

  listTypesOfBusiness() {
    this.subscriptions.add(this.businessRegistrationService.getTypes().subscribe(types => {
      this.types = types;
    }));
  }

  listRequests() {
    const body = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      userRegistrationStatuses: this.status,
    };

    if (this.startDate) {
      body['startDate'] = new Date(this.startDate).toISOString();
    }
    if (this.endDate) {
      body['endDate'] = new Date(this.endDate).toISOString();
    }
    if (this.selectedType) {
      body['businessType'] = this.selectedType;
    }
    if (this.selectedHistoricalAuditor) {
      body['userID'] = this.selectedHistoricalAuditor;
    }

    this.subscriptions.add(this.businessRegistrationRequestsService.allRequestsByPagination(body).subscribe((res: any) => {
      this.total = res.totalCount;
      this.dataSource.data = res.result;
      // console.log(res.result);
    }));
  }

  clearFilter() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedHistoricalAuditor = undefined;
    this.selectedType = undefined;
    this.listRequests();
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

    this.subscriptions.add(this.businessRegistrationRequestsService.historicalAuditors(body).subscribe((res: any) => {
      this.historicalAuditors = res.result;
    }));
  }

  /**
   * select audior from list
   *
   *
   * @param event
   */
  onChangeAuditor(event: MatSelectChange) {
    this.selectedHistoricalAuditor = event.value
  }

  /**
   * select type of business from list
   *
   *
   * @param event
   */
  onChangeType(event: MatSelectChange) {
    this.selectedType = event.value;
  }
  // openEdit(operation: string, id: string) {
  //   console.log('clicked id', id);
  //   const dialogRef = this.dialog.open(DeliveryConfigDialogComponent, {
  //     // width: '50%',
  //     // disableClose: true,
  //     data: {
  //       type: operation,
  //       tenant: id
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
