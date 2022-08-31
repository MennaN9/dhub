import { NotificationMessage } from '@dms/services/state-management/signal-rnotification.service';
import { MainTask } from '@dms/models/main/tasks/MainTask';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { options } from '@dms/app/config/map';
import { FacadeService } from '@dms/app/services/facade.service';
import { FilterService } from '@dms/services/state-management/filter.service';
import { SidebarService } from '@dms/app/services/state-management/sidebar.service';
import { SignalRNotificationService } from '@dms/services/state-management/signal-rnotification.service';
import { TaskStatus } from '@dms/app/constants/task-status-types';
import { Subscription } from 'rxjs';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import { TaskstatusService } from '../../services/state-management/taskstatus.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { DriversObservableRefresherService } from '@dms/app/services/taskstatus.service';

const READ_UNASSIGNED_TASK: string = 'ReadUnassignedTask';
import { Routes } from '../../constants/routes';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [
    MatSidenav,
  ]
})

export class MainComponent implements OnInit, OnDestroy {
  @Input() mainTaskData: MainTask;
  subscription = new Subscription();

  TaskStatus = TaskStatus;
  pageIndex: number = 1;
  pageSize: number = 600;

  unassignedTasks: MainTask[] = [];
  assignedTasks: MainTask[] = [];
  completedTasks: MainTask[] = [];

  unassignedTasksTotalCount: number = 0;
  assignedTasksTotalCount: number = 0;
  completedTasksTotalCount: number = 0;

  opened: boolean = true;
  searchTask: boolean = false;
  manageTaskStatus: boolean;
  selectedType: number;

  manageTask: boolean = false;
  selectedTasksTabIndex: number;
  viewTaskDetails: boolean = false;
  options = options;

  startDate: Date;
  endDate: Date;
  // teamsIds: number[];
  branchesIds: number[];
  searchBy: string = '';

  mainTaskObject: MainTask;

  driversContent: boolean = true;
  tasksContent: boolean = true;
  mapMarkers: MapMarker[] = [];

  permissions: string[] = [];
  driversDetails: boolean = false;

  /**
   *
   * @param activatedRoute
   * @param dialog
   */
  constructor(

    private driversRefresher: DriversObservableRefresherService,
    private activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private dialog: MatDialog,
    private filterService: FilterService,
    private sidebarService: SidebarService,
    private signalrNotificationService: SignalRNotificationService,
    private mapMarkersService: MapMarkersService,
    private TaskState: TaskstatusService,
    private permissionsService: NgxPermissionsService,
    private router: Router) {

    this.startDate = new Date();
    this.endDate = new Date();
    this.branchesIds = [];

    if (this.isMobileDevice) {
      this.tasksContent = false;
      this.driversContent = false;
    }
  }

  ngOnInit() {
    const initialLoader = document.querySelector('.initial-loader');
    if (initialLoader) {
      initialLoader.remove();
    }

    this.filterService.reset();
    // listen to calender change
    this.subscription.add(this.filterService.currentStatus.subscribe(state => {
      this.startDate = state.date ? state.date : this.startDate;
      this.endDate = state.date ? state.date : this.endDate;
      // this.teamsIds = state.teams ? state.teams : this.teamsIds;
      this.branchesIds = state.branchesIds ? state.branchesIds : this.branchesIds;
      this.refershLists();
    }));

    this.TaskState.currentStatus.subscribe(x => {
      this.refershLists();
    });

    this.subscription.add(this.activatedRoute.queryParams.subscribe(qParams => {
      if (qParams['openTask'] == 'add') {
        this.tasksContent = false;
        this.driversContent = false;
        this.viewTaskDetails = false;

        setTimeout(() => {
          this.manageTask = true;
        }, 0);
      }
    }));

    this.notificationLisner();

    this.subscription.add(this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd && value.url == '/app') {
        this.refershLists();
      }
    }));

    this.mapMarkersService.currentDriversMarkers.subscribe(markers => {
      this.mapMarkers = markers;
    });
  }

  /**
   * notfications hub
   *
   *
   */
  notificationLisner() {
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.TaskSuccessful, (_taskId, driver) => {
        if (!this.manageTask) {
          // refersh tasks lists
          // this.updateDriverOnMap(driver);
          this.driversRefresher.change();
          this.getCompletedTasks(0);
          this.getAssignedTasks(0);
        }
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.TaskFailed, (_taskId, driver) => {
        if (!this.manageTask) {
          // this.updateDriverOnMap(driver);
          this.driversRefresher.change();
          this.getCompletedTasks(0);
          this.getAssignedTasks(0);

        }
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.TaskCancel, (_taskId, _reason) => {
        this.refershLists();
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.TaskStart, (_taskId, driver) => {
        if (!this.manageTask) {
          this.driversRefresher.change();
          this.getAssignedTasks(0);
        }
      })
    );

    this.subscription.add(this.signalrNotificationService.subscribe(NotificationMessage.LocationChanged, (driverId, lng, lat) => {
      if (!(this.viewTaskDetails || this.manageTask || this.driversDetails)) {
        this.mapMarkersService.onDriverLocationChanged(driverId, lng, lat);
        this.mapMarkersService.changeMarkers(this.mapMarkers, true);
      }
    }));

    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.DriverLoggedin, (driver) => {
        if (!this.manageTask) {
        }
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.DriverLoggedOut, (driver) => {
        if (!this.manageTask) {
        }
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.AutoAllocationSucessfully, (mainTaskId) => {
        if (!this.manageTask) {
          this.getUnassignedTasks(0);
          this.getAssignedTasks(0);
        }
      })
    );
    this.subscription.add(
      this.signalrNotificationService.subscribe(NotificationMessage.AutoAllocationFailed, (mainTaskId) => {
        if (!this.manageTask) {
          this.getUnassignedTasks(this.pageIndex);
          this.getAssignedTasks(this.pageIndex);
        }
      })
    );


  }

  /**
   *  on header filter change
   *
   *
   * @param fromScroll
   */
  private refershLists(fromScroll?: boolean) {
    this.getUnassignedTasks(this.pageIndex, fromScroll);
    this.getAssignedTasks(this.pageIndex, fromScroll);
    this.getCompletedTasks(this.pageIndex, fromScroll);

    // this.mapMarkersService.changeMarkers([], false);
    this.mapMarkersService.changeMarkers(this.mapMarkers, true);
  }

  /**
   * fetch all unassigned tasks
   *
   *
   * @param page
   * @param fromScroll
   */
  private getUnassignedTasks(page: number, fromScroll?: boolean) {
    this.permissionsService.hasPermission(READ_UNASSIGNED_TASK).then(hasPermission => {
      if (hasPermission) {
        const body = {
          pageNumber: page,
          pageSize: this.pageSize,
          searchBy: this.searchBy,
          fromDate: this.startDate.toLocaleDateString(),
          toDate: this.endDate.toLocaleDateString(),
          branchesIds: this.branchesIds,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }

        this.subscription.add(this.facadeService.mainTaskService.listUnassigned(body).subscribe((result: any) => {
          if (fromScroll) {
            this.unassignedTasks.push(...result.result);
            this.unassignedTasksTotalCount = result.totalOrderCount;
          } else {
            this.unassignedTasks = result.result;
            this.unassignedTasksTotalCount = result.totalOrderCount;
          }
        }));

        this.manageTask = false;
      }
    });
  }

  /**
   * fetch all assigned Tasks
   *
   *
   * @param page
   * @param fromScroll
   */
  private getAssignedTasks(page: number, fromScroll?: boolean) {
    const body = {
      pageNumber: page,
      pageSize: this.pageSize,
      searchBy: this.searchBy,
      fromDate: this.startDate.toLocaleDateString(),
      toDate: this.endDate.toLocaleDateString(),
      branchesIds: this.branchesIds,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    this.subscription.add(this.facadeService.mainTaskService.listAssigned(body).subscribe((result: any) => {
      if (result && fromScroll) {
        this.assignedTasks.push(...result.result);
        this.assignedTasksTotalCount = result.totalOrderCount;

      } else if (result) {
        this.assignedTasks = result.result;
        this.assignedTasksTotalCount = result.totalOrderCount;
      }
    }));
  }

  /**
   * fetch all completed Tasks
   *
   *
   * @param page
   */
  private getCompletedTasks(page: number, fromScroll?: boolean) {

    const body = {
      pageNumber: page,
      pageSize: this.pageSize,
      searchBy: this.searchBy,
      fromDate: this.startDate.toLocaleDateString(),
      toDate: this.endDate.toLocaleDateString(),
      branchesIds: this.branchesIds,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    this.subscription.add(this.facadeService.mainTaskService.listCompleted(body).subscribe((result: any) => {
      if (result && fromScroll) {
        this.completedTasks.push(...result.result);
        this.completedTasksTotalCount = result.totalOrderCount;
      } else if (result) {
        this.completedTasks = result.result;
        this.completedTasksTotalCount = result.totalOrderCount;
      }
    }));
  }

  /**
   * close manage task
   *
   *
   * open drivers / task list
   *
   * @param event
   */
  onClose(event: boolean) {
    if (event) {
      this.manageTask = false;
      this.tasksContent = true;
      this.driversContent = true;

      // refersh tasks lists
      this.getUnassignedTasks(0);
      this.getAssignedTasks(0);
      this.getCompletedTasks(0);

      this.mapMarkersService.changeMarkers(this.mapMarkers, true);
    }
  }

  onTasksTabChanage(index: number) {
    this.selectedTasksTabIndex = index;
  }

  onTaskDetailsClicked(object: any, type: string) {
    this.mainTaskObject = object;
    switch (type) {
      case 'assigned':
        this.mainTaskObject['taskStatusType'] = 'assigned';
        break;

      case 'unassigned':
        this.mainTaskObject['taskStatusType'] = 'unassigned';
        break;

      default:
        break;
    }

    this.viewTaskDetails = true;
  }

  closeTaskDetails(event: { closeDetails: boolean, refresh: boolean }): void {
    if (event.closeDetails) {
      this.viewTaskDetails = false;
      this.mapMarkersService.changeMarkers(this.mapMarkers, true);
    }

    if (event.refresh) {
      this.refershLists();
    }
  }

  openAssignDriverDialog(mainTask: MainTask): void {
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '500px',
      minHeight: '300px',
      data: {
        taskId: mainTask.id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.refershLists();

      if (result) {
      } else {
        dialogRef.close();
      }
    });
  }

  onSearchSubmit(event) {
    this.searchBy = event.target.value;

    if (this.searchBy.trim().length > 0) {
      this.pageIndex = 1;
      this.refershLists();
    }
  }

  clearSearch() {
    this.searchBy = '';
    this.pageIndex = 1;
    this.refershLists();
  }

  createTask() {
    this.router.navigateByUrl('/app').then(() => {
      this.mapMarkersService.changeMarkers([], false);
      this.sidebarService.changeStatus(false);
      this.router.navigate(['app'], { queryParams: { openTask: "add" }, skipLocationChange: true });
    });
  }

  showTasksSection() {
    this.tasksContent = !this.tasksContent;
  }

  showDriversSection() {
    this.driversContent = !this.driversContent;
  }

  onCloseDrivers(event) {
    if (event) {
      this.driversContent = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  tryAutoAssignmentAgain(mainTask: any) {
    mainTask.isFailToAutoAssignDriver = false;
    this.facadeService.mainTaskService.TryAutoAssignment(mainTask.id).subscribe();
  }

  get isMobileDevice(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
  }

  onOpenDriverDetails(event: boolean) {
    this.driversDetails = event;
  }
}
