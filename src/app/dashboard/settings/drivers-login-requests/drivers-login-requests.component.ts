import { Subscription } from 'rxjs';
import { NotificationMessage } from './../../../services/state-management/signal-rnotification.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatTabChangeEvent,
} from "@angular/material";
import { DriverLoginRequestService } from "@dms/services/settings/driver-login-request.service";
import { DriverLoginRequest } from "@dms/models/settings/driver-login-request";
import { DriverLoginRequestStatus } from "../../../enums/driver-login-request-status.enum";
import { FacadeService } from "@dms/app/services/facade.service";
import { Body, SnackBar } from "@dms/utilities/snakbar";
import { SignalRNotificationService } from "@dms/services/state-management/signal-rnotification.service";
import { MatDialog } from "@angular/material/dialog";
import { CancelReasonTypeComponent } from "./cancel-reason-type.component/cancel-reason-type.component";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { saveFile } from "../../../utilities/generate-download-file";
// declare var $: any;

export interface logoutAction {
  id: number;
  driverName: string;
  loginDate: string;
  loginLatitude: string;
  loginLongitude: string;
  logoutDate: string;
  logoutLatitude: string;
  logoutLongitude: string;
  logoutActionBy: string;
}

@Component({
  selector: "app-drivers-login-requests",
  templateUrl: "./drivers-login-requests.component.html",
  styleUrls: ["./drivers-login-requests.component.scss"],
  providers: [
    DatePipe
  ]
})
export class DriversLoginRequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subscription = new Subscription();
  statusFilter: number;
  pendingSearchFilter: string;
  allSearchFilter: string;
  dateFilter: any;
  driverName: string = '';
  filterDate: any = null;
  filterTime: any = null;
  filterStatusID: number = 0;
  pendingDataSource = new MatTableDataSource<DriverLoginRequest>([]);
  allDataSource = new MatTableDataSource<DriverLoginRequest>([]);
  logoutActionsDataSource = new MatTableDataSource<logoutAction>();

  logoutActionsColumns: string[] = ['id', 'driverName', 'loginDate', 'loginLocation', 'logoutDate', 'logoutLocation', 'logoutActionBy'];

  public readonly penddingDisplayedColumns: string[] = [
    "id",
    "driverName",
    "teamName",
    "agentTypeName",
    "status",
    "LoginDate",
    "actions",
  ];

  public readonly displayedColumns: string[] = [
    "id",
    "driverName",
    "teamName",
    "agentTypeName",
    "status",
    "LoginDate",
    "approvedOrRejectBy",
    "updatedDate",
    "reason",
    "actions",
  ];

  pendingdriverLoginRequests: DriverLoginRequest[];
  pendingdriverLoginRequestsLength: number;

  alldriverLoginRequests: DriverLoginRequest[];
  allRequestslength: number;

  pageIndex: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  logoutActionsLength: number;


  @ViewChild("pendingPaginator", { static: true })
  pendingPaginator: MatPaginator;
  @ViewChild("allPaginator", { static: true }) allPaginator: MatPaginator;

  datetime: Date;
  selectedIndex: number = 1;

  logoutPageIndex: number = 1;
  logoutPageSize: number = 10;
  logoutDriverName: string = '';
  logoutFilterDate: any;
  logoutFilterTime: any;

  constructor(
    public dialog: MatDialog,
    private driverLoginRequestService: DriverLoginRequestService,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    private signalrNotificationService: SignalRNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.initDriverLoginRequests();
    const messages = [
      NotificationMessage.LoginRequest,
      NotificationMessage.CancelLoginRequest,
      NotificationMessage.DriverLoggedOut
    ];
    this.subscription.add(
      this.signalrNotificationService.subscribeMultiple(messages, () => this.initDriverLoginRequests())
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {

  }

  initDriverLoginRequests() {
    this.loadAllDriverLoginRequest();
    this.getPendingDataSource();

    this.driverLoginTracking();
  }


  /**
   * get requests data
   *
   *
   */
  loadAllDriverLoginRequest() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      SearchBy: this.driverName,
      filterDate: this.filterDate,
      filterTime: this.filterTime,
      statusIDs: []
    };

    body.statusIDs = [];
    if (this.statusFilter > 0) {
      body.statusIDs.push(this.statusFilter);
    }

    if (this.statusFilter == 0) {
      body.statusIDs = [2, 3, 4];
    }

    this.driverLoginRequestService.listByPagination(body).subscribe((result: any) => {
      this.alldriverLoginRequests = result.result;
      this.allRequestslength = result.totalCount;
    });
  }

  /**
   * get requests data
   *
   *
   */
  driverLoginTracking() {
    const body = {
      pageNumber: this.logoutPageIndex,
      pageSize: this.logoutPageSize,
      SearchBy: this.logoutDriverName,
      logoutDate: this.logoutFilterDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.facadeService.driverService.driverLoginTracking(body).subscribe((result: any) => {
      this.logoutActionsDataSource.data = result.result;
      this.logoutActionsLength = result.totalCount;
    });
  }

  /**
   * filter all request grid by string
   *
   *
   * @param event
   */
  searchOnAllRequests(event: Event, searchOn) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allSearchFilter = filterValue;
    this.driverName = this.allSearchFilter;
    if (searchOn == 'all') {
      this.loadAllDriverLoginRequest();
    }
    else if (searchOn == 'pending') {
      this.getPendingDataSource();
    }
  }

  /**
   * filter all request grid by string
   *
   *
   * @param event
   */
  searchOnLogoutActions(event) {
    this.logoutDriverName = event.target.value;
    this.driverLoginTracking();
  }

  /**
   * return status name
   *
   *
   * @param id
   */
  getRequestStatusName(id) {
    return DriverLoginRequestStatus[id];
  }

  /**
   * approve request
   *
   *
   * @param model
   */
  approveRequest(model: DriverLoginRequest) {
    this.driverLoginRequestService
      .changeStatus(model.id, DriverLoginRequestStatus.Approved, null)
      .subscribe((approved) => {
        if (approved) {
          model.status = DriverLoginRequestStatus.Approved;
        }

        this.loadAllDriverLoginRequest();
        this.getPendingDataSource();

      });
  }

  /**
   * reject request
   *
   *
   * @param model
   */
  rejectRequest(model: DriverLoginRequest) {
    this.driverLoginRequestService.changeStatus(model.id, DriverLoginRequestStatus.Rejected, model.rejectReason).subscribe((Rejected) => {
      if (Rejected) {
        model.status = DriverLoginRequestStatus.Rejected;
      }
      this.loadAllDriverLoginRequest();
      this.getPendingDataSource();

    });
  }

  /**
   * pending requests
   *
   *
   */
  getPendingDataSource() {

    let statusIds: number[] = [];
    statusIds.push(1);
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      SearchBy: this.driverName,
      statusIDs: statusIds,
      filterDate: this.filterDate,
      filterTime: this.filterTime
    };

    this.driverLoginRequestService.listByPagination(body).subscribe((result: any) => {
      this.pendingdriverLoginRequests = result.result;
      this.pendingdriverLoginRequestsLength = result.totalCount;
    });
  }

  /**
   * force driver logout
   *
   */
  forceLogout(driverId: any) {
    this.facadeService.driverService.forceLogout(driverId).subscribe((result) => {
      const message: Body = {
        message: this.translateService.instant(`Success driver has been Logout !`),
        action: this.translateService.instant(`Okay`),
        duration: 2000
      }
      this.loadAllDriverLoginRequest();

      this.snackBar.openSnackBar(message);
    });
  }

  /**
   * cancel request
   * 
   * 
   * @param element 
   */
  cancelReasonTypeDialog(element: DriverLoginRequest): void {
    const dialogRef = this.dialog.open(CancelReasonTypeComponent, {
      width: "50%",
      minHeight: "300px",
      autoFocus: false,
      data: {
        element: element,
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rejectRequest(result);
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * select index
   * 
   * 
   * @param event 
   */
  onChangeTab(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event, pagedOn) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    if (pagedOn == 'pending') {
      this.getPendingDataSource();
    }
    else {
      this.loadAllDriverLoginRequest();
    }
  }




  /**
   * Export customers
   *
   *
   */
  //exportloginTracking() {
  //  this.facadeService.driverService.LoginTrackingexportToExcel().subscribe(data => {
  //    saveFile("Customers.csv", "data:attachment/text", data);
  //  });
  //}


  exportloginTracking() {
    const body = {
      pageNumber: this.logoutPageIndex,
      pageSize: this.logoutPageSize,
      SearchBy: this.logoutDriverName,
      logoutDate: this.logoutFilterDate,
    };
    this.facadeService.driverService.LoginTrackingexportToExcel(body).subscribe((data) => {
      saveFile("logoutactions.csv", "data:attachment/text", data);
    });
  }


  /**
   * change date
   * 
   * 
   * @param event 
   */
  onChangeDate(event) {
    this.dateFilter = this.datePipe.transform(event.value, 'short');
    this.filterTime = this.datePipe.transform(event.value, 'short');

    this.loadAllDriverLoginRequest();
  }

  /**
   * logout actions
   * 
   * 
   * @param event 
   */
  onChangeLogoutActionsDate(event) {
    this.logoutFilterDate = this.datePipe.transform(event.value, 'short');
    this.driverLoginTracking();
  }


  onChangeLogoutActionsPage(event) {
    this.logoutPageSize = event.pageSize;
    this.logoutPageIndex = event.pageIndex;

    this.driverLoginTracking();
  }
}
