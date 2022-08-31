import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Images } from "@dms/app/constants/images";
import { Driver } from "@dms/app/models/settings/Driver";
import { FacadeService } from "@dms/app/services/facade.service";
import { App } from "@dms/app/core/app";
import { MatDialog } from "@angular/material";
import { Subscription } from "rxjs";
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import { NgxPermissionsService } from "ngx-permissions";
import { TaskstatusService } from "@dms/services/state-management/taskstatus.service";
import { MapMarkersService } from "@dms/app/services/state-management/map-markers.service";
import { ManageDriverComponent } from "@dms/components/settings/driver/manage-driver/manage-driver.component";
import { NotificationMessage, SignalRNotificationService } from "@dms/services/state-management/signal-rnotification.service";
import { DriversObservableRefresherService } from "@dms/app/services/taskstatus.service";

const READ_AGENT_PERMISSION: string = 'ReadAgent';
const READ_PLATFORM_AGENT_PERMISSION: string = 'ReadPlatformAgent';

@Component({
  selector: "app-drivers",
  templateUrl: "./drivers.component.html",
  styleUrls: ["./drivers.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateY(-100%)" }),
        animate("300ms ease-in", style({ transform: "translateY(0%)" })),
      ]),
    ]),
  ],
})
export class DriversComponent implements OnInit, OnDestroy {
  readonly image = Images.user;

  freeSearchBy: string = "";
  busySearchBy: string = "";
  inactiveSearchBy: string = "";

  searchAgent: boolean = false;
  driverDetails: boolean = false;
  drivers: Driver[] = [];

  busyDrivers: Driver[] = [];
  busyDriversTotalCount: number = 0;
  busyDriversPageNumber: number = 1;
  busyDriversPageSize: number = 5;

  freeDrivers: Driver[] = [];
  freeDriversTotalCount: number = 0;
  freeDriversPageNumber: number = 1;
  freeDriversPageSize: number = 6;

  inactiveDrivers: Driver[] = [];
  inactiveDriversTotalCount: number = 0;
  inactiveDriversPageNumber: number = 1;
  inactiveDriversPageSize: number = 6;

  selectedDriver: Driver;
  subscription = new Subscription();

  ImageURL = App.driverImagesUrl;
  length: number;

  @Output() driverList: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onOpenDriverDetails: EventEmitter<boolean> = new EventEmitter<boolean>();


  teamsIds: number[] = [];
  locale: string = 'en';
  markers: MapMarker[] = [];

  constructor(
    private driversRefresher: DriversObservableRefresherService,
    private facadeService: FacadeService,
    public dialog: MatDialog,
    private signalrNotificationService: SignalRNotificationService,
    private TaskState: TaskstatusService,
    private mapMarkersService: MapMarkersService,
    private permissionsService: NgxPermissionsService
  ) {
    this.facadeService.languageService.language.subscribe(lng => {
      this.locale = lng;
    });
  }

  ngOnInit() {
    if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
      this.getDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
      this.getDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
      this.getDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
    } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
      this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
      this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
      this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
    }

    this.driversRefresher.currentStatus.subscribe(value => {
      this.freeDrivers = [];
      this.inactiveDrivers = [];
      this.busyDrivers = [];

      this.busyDriversPageNumber = 1;
      this.freeDriversPageNumber = 1;
      this.inactiveDriversPageNumber = 1;

      if (value) {
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          this.getDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          this.getDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        }
      }
    });

    this.TaskState.currentStatus.subscribe(value => {
      if (value) {
        this.freeDrivers = [];
        this.inactiveDrivers = [];
        this.busyDrivers = [];

        this.busyDriversPageNumber = 1;
        this.freeDriversPageNumber = 1;
        this.inactiveDriversPageNumber = 1;

        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          this.getDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          this.getDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        }
      }
    });

    this.TaskState.taskdeletetion.subscribe(value => {
      // if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
      //   this.getDrivers();
      // }
    });

    const taskNotificationMessages = [
      NotificationMessage.TaskSuccessful,
      NotificationMessage.TaskFailed,
      NotificationMessage.TaskStart,
    ];
    const driverNotificationMessages = [
      NotificationMessage.DriverLoggedin,
      NotificationMessage.DriverLoggedOut,
      NotificationMessage.SetDuty,
    ];

    const refreshDrivers = [
      NotificationMessage.TaskDecline,
      NotificationMessage.TaskCancel,
      NotificationMessage.TaskAccept,
      NotificationMessage.AutoAllocationSucessfully,
      NotificationMessage.AutoAllocationFailed,
    ];

    this.subscription.add(this.signalrNotificationService.subscribeMultiple(taskNotificationMessages, (payload) => {
      if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
        this.refreshDriversLists();
      } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
        this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
        this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
        this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
      }
    }));

    this.subscription.add(this.signalrNotificationService.subscribeMultiple(driverNotificationMessages, (driver) => {
      this.refreshDriversLists();
    }));

    this.subscription.add(this.signalrNotificationService.subscribeMultiple(refreshDrivers, (payload) => {
      if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
        this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
        this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
        this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
      }
    }));
  }

  getDrivers(type: string, page: number, pageSize: number) {
    let body: any = {
      pageNumber: page,
      pageSize: pageSize,
      teamIds: this.teamsIds,
    };

    switch (type) {
      case 'free':
        body.searchBy = this.freeSearchBy;
        body.statusTypes = [
          'Available',
        ],

          this.subscription.add(this.facadeService.driverService.listByPagination(body).subscribe((result: any) => {
            if (result) {
              this.freeDrivers.push(...result.result);
              this.freeDriversTotalCount = result.totalCount;

              this.freeDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });

              this.buildMarkers();
            }
          }));
        break;

      case 'inactive':
        body.searchBy = this.inactiveSearchBy;
        body.statusTypes = [
          'Blocked',
          'Unavailable',
          'Offline',
        ],

          this.subscription.add(this.facadeService.driverService.listByPagination(body).subscribe((result: any) => {
            if (result) {
              this.inactiveDrivers.push(...result.result);
              this.inactiveDriversTotalCount = result.totalCount;

              this.inactiveDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });

              // for (let index = 0; index < 10; index++) {
              //   this.inactiveDrivers.push(this.inactiveDrivers[0]);
              // }

              this.buildMarkers();
            }
          }));
        break;

      case 'busy':
        body.searchBy = this.busySearchBy;
        body.statusTypes = [
          'Busy',
        ],

          this.subscription.add(this.facadeService.driverService.listByPagination(body).subscribe((result: any) => {
            if (result) {
              this.busyDrivers.push(...result.result);
              this.busyDriversTotalCount = result.totalCount;

              this.busyDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });
              this.buildMarkers();
            }
          }));
        break;
      default:
        break;
    }
  }

  getPlatformDrivers(type: string, page: number, pageSize: number) {
    let body: any = {
      pageNumber: page,
      pageSize: pageSize,
      teamIds: this.teamsIds,
    };

    switch (type) {
      case 'free':
        body.searchBy = this.freeSearchBy;
        body.statusTypes = [
          'Available',
        ],

          this.subscription.add(this.facadeService.driverService.listByPagination(body).subscribe((result: any) => {
            if (result) {
              this.freeDrivers.push(...result.result);
              this.freeDriversTotalCount = result.totalCount;

              this.freeDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });

              this.buildMarkers();
            }
          }));
        break;

      case 'inactive':
        body.searchBy = this.inactiveSearchBy;
        body.statusTypes = [
          'Blocked',
          'Unavailable',
          'Offline',
        ],

          this.subscription.add(this.facadeService.driverService.listByPagination(body).subscribe((result: any) => {
            if (result) {
              this.inactiveDrivers.push(...result.result);
              this.inactiveDriversTotalCount = result.totalCount;

              this.inactiveDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });

              this.buildMarkers();
            }
          }));
        break;

      case 'busy':
        body.searchBy = this.busySearchBy;
        body.statusTypes = [
          'Busy',
        ],

          this.subscription.add(this.facadeService.driverService.listPlatformByPagination(body).subscribe((result: any) => {
            if (result) {
              this.busyDrivers.push(...result.result);
              this.busyDriversTotalCount = result.totalCount;

              this.busyDrivers.forEach(driver => {
                driver['fullName'] = `${driver.firstName} ${driver.lastName}`
              });
              this.buildMarkers();
            }
          }));
        break;
      default:
        break;
    }
  }

  buildMarkers() {
    this.markers = [];
    this.freeDrivers.forEach((driver: Driver) => {
      this.markers.push({
        lat: +driver.latitude,
        lng: +driver.longitude,
        type: 'driver',
        isDriver: true,
        driver: driver,
      });
    });

    this.busyDrivers.forEach((driver: Driver) => {
      this.markers.push({
        lat: +driver.latitude,
        lng: +driver.longitude,
        type: 'driver',
        isDriver: true,
        driver: driver,
      });
    });

    this.inactiveDrivers.forEach((driver: Driver) => {
      this.markers.push({
        lat: +driver.latitude,
        lng: +driver.longitude,
        type: 'driver',
        isDriver: true,
        driver: driver,
      });
    });

    this.mapMarkersService.changeMarkers(this.markers, true);
  }

  /**
   * driver details
   *
   *
   * @param driver
   */
  showDriverDetails(driver: Driver) {
    this.selectedDriver = driver;
    this.driverDetails = true;

    if (this.selectedDriver.latitude != null && this.selectedDriver.longitude != null) {
      const marker: MapMarker = {
        lat: +this.selectedDriver.latitude,
        lng: +this.selectedDriver.longitude,
        type: 'driver',
        isDriver: true,
        driver: driver
      }

      const findIndex = this.markers.indexOf(marker, 0);
      this.markers[findIndex] = marker;
      this.mapMarkersService.changeMarkers(this.markers, false);
    }

    this.onOpenDriverDetails.emit(true);
  }

  /**
   * close driver details / show drivers list
   *
   *
   */
  closeDriverDetails(event: boolean) {
    if (event) {
      this.driverDetails = false;
      this.onOpenDriverDetails.emit(false);
      this.mapMarkersService.changeMarkers(this.markers, false);
    }
  }
  /**
   * search tasks
   *
   *
   * @param event
   */
  onSearchSubmit(event: any, type: string): void {
    switch (type) {
      case 'free':
        this.freeDrivers = [];
        this.freeSearchBy = event.target.value;
        this.freeDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.freeDriversPageNumber, this.freeDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.freeDriversPageNumber, this.freeDriversPageSize);
        }
        break;

      case 'busy':
        this.busyDrivers = [];
        this.busySearchBy = event.target.value;
        this.busyDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.busyDriversPageNumber, this.busyDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.busyDriversPageNumber, this.busyDriversPageSize);
        }
        break;

      case 'inactive':
        this.inactiveDrivers = [];
        this.inactiveSearchBy = event.target.value;
        this.inactiveDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        }
        break;
      default:
        break;
    }
  }

  /**
   * reset search
   *
   *
   */
  clearSearch(type: string) {
    switch (type) {
      case 'free':
        this.freeDrivers = [];
        this.freeSearchBy = '';
        this.freeDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.freeDriversPageNumber, this.freeDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.freeDriversPageNumber, this.freeDriversPageSize);
        }
        break;

      case 'busy':
        this.busyDrivers = [];
        this.busySearchBy = '';
        this.busyDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.busyDriversPageNumber, this.busyDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.busyDriversPageNumber, this.busyDriversPageSize);
        }
        break;

      case 'inactive':
        this.inactiveDrivers = [];
        this.inactiveSearchBy = '';
        this.inactiveDriversPageNumber = 1;
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
          this.getDrivers(type, this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
          this.getPlatformDrivers(type, this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
        }
        break;
      default:
        break;
    }
  }

  /**
   * close drivers list
   *
   *
   */
  onClose() {
    this.close.emit(true);
  }

  /**
   * add driver
   *
   *
   *@param operation
   */
  addDriverDialog(): void {
    const dialogRef = this.dialog.open(ManageDriverComponent, {
      width: "1200px",
      autoFocus: false,
      maxHeight: "95vh",
      data: {
        operation: "Add",
        driver: null,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } else {
        dialogRef.close();
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshDriversLists() {
    this.freeDrivers = [];
    this.freeDriversPageNumber = 1;
    this.freeDriversTotalCount = 0;
    this.getDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);

    this.busyDrivers = [];
    this.busyDriversPageNumber = 1;
    this.busyDriversTotalCount = 0;
    this.getDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);

    this.inactiveDrivers = [];
    this.inactiveDriversPageNumber = 1;
    this.inactiveDriversTotalCount = 0;
    this.getDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);

    this.buildMarkers();
  }

  onScroll(type: string): void {
    if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
      switch (type) {
        case 'free':
          this.freeDriversPageNumber = this.freeDriversPageNumber + 1;
          this.getDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          break;

        case 'inactive':
          this.inactiveDriversPageNumber = this.inactiveDriversPageNumber + 1;
          this.getDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
          break;

        case 'busy':
          this.busyDriversPageNumber = this.busyDriversPageNumber + 1;
          this.getDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          break;
        default:
          break;
      }
    } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
      switch (type) {
        case 'free':
          this.freeDriversPageNumber = this.freeDriversPageNumber + 1;
          this.getPlatformDrivers('free', this.freeDriversPageNumber, this.freeDriversPageSize);
          break;

        case 'inactive':
          this.inactiveDriversPageNumber = this.inactiveDriversPageNumber + 1;
          this.getPlatformDrivers('inactive', this.inactiveDriversPageNumber, this.inactiveDriversPageSize);
          break;

        case 'busy':
          this.busyDriversPageNumber = this.busyDriversPageNumber + 1;
          this.getPlatformDrivers('busy', this.busyDriversPageNumber, this.busyDriversPageSize);
          break;
        default:
          break;
      }
    }
  }
}
