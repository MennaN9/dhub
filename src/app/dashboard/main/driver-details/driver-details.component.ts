import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockDriverComponent } from './../block-driver/block-driver.component';
import { Driver } from '@dms/app/models/settings/Driver';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/app/utilities';
import { ManageDriverComponent } from '@dms/components/settings/driver/manage-driver/manage-driver.component';
import { ReAssignTasksFromDriverComponent } from '../re-assign-tasks-from-driver/re-assign-tasks-from-driver.component';
import { DriverTimeLine } from '@dms/app/models/main/tasks/DriverTimeLine';
import { FilterService } from '@dms/app/services/state-management/filter.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSlideToggleChange } from '@angular/material';
import { App } from '@dms/app/core/app';
import { Lightbox } from 'ngx-lightbox';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {
  @Input() driver: Driver;
  @Output() onCloseDriverDetails: EventEmitter<boolean> = new EventEmitter<boolean>();

  public readonly baseUrl = App.backEndUrl;

  driverTimeLines: DriverTimeLine[] = [];
  driverTasks: any[] = [];

  dialogContent: Object;
  moreDetails: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;

  isAvaillable: boolean;

  pageIndexTasks: number = 1;
  pageSizeTasks: number = 100;
  lengthTasks: number;
  searchByTasks: string = '';
  startDate: Date;
  endDate: Date;

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(public dialog: MatDialog,
    private filterService: FilterService,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
    private lightbox: Lightbox,
    private mapMarkersService: MapMarkersService,
  ) { }

  /**
   * block driver
   *
   *
   */
  blockDriver(): void {
    const dialogRef = this.dialog.open(BlockDriverComponent, {
      width: '50%',
      data: {
        driverId: this.driver.id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.closeDriverDetails();
    });
  }

  ngOnInit() {
    this.dialogContent = {
      title: this.translateService.instant(`Are you sure to delete this driver?`),
      openBtn: this.translateService.instant(`Delete`),
      cancelBtn: this.translateService.instant(`Cancel`),
      okayBtn: this.translateService.instant(`Confirm`),
    }
    this.startDate = new Date();
    this.endDate = new Date();
    // listen to calender change
    this.filterService.currentStatus.subscribe(state => {
      this.startDate = state.date ? state.date : this.startDate;
      this.endDate = state.date ? state.date : this.endDate;

      this.getDriverTasks();
    });

    this.getDriverTimeLine();
    if (this.driver.agentStatusId == 2) {
      this.isAvaillable = true;
    } else {
      this.isAvaillable = false;
    }
  }

  /**
    * get Driver Time Line
    */
  getDriverTimeLine() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      driverId: this.driver.id
    }

    this.facadeService.taskService.getDriverTimeLine(body).subscribe((result: any) => {
      this.length = result.totalCount;
      this.driverTimeLines = result.result;
    });

  }

  /**
   * close driver details
   *
   *
   */
  closeDriverDetails() {
    this.onCloseDriverDetails.emit(true);
  }

  /**
   * open more details
   *
   *
   */
  openMoreDetails() {
    this.moreDetails = !this.moreDetails;
  }


  /**
   * confirm driver deletion
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.driverService.delete(this.driver.id).subscribe(res => {

        const message: Body = {
          message: this.translateService.instant(`Success driver has been deleted !`),
          action: this.translateService.instant(`Okay`),
          duration: 2500
        }
        this.snackBar.openSnackBar(message);
        this.closeDriverDetails();
      });
    }
  }

  /**
   * on change duty
   * 
   * 
   * @param ob 
   */
  onDutyChange(ob: MatSlideToggleChange) {
    const body = {
      driverId: this.driver.userId,
      isAvailable: ob.checked
    };

    this.facadeService.driverService.SetOnDuty(body).subscribe((result: any) => {
    });
  }

  /**
   * edit driver
   *
   *
   *@param operation
   */
  editDriverDialog(): void {
    const dialogRef = this.dialog.open(ManageDriverComponent, {
      width: '1200px',
      autoFocus: false,
      maxHeight: '95vh',
      data: {
        operation: 'Edit',
        driver: this.driver
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * re assing tasks to anther
   * 
   * 
   */
  openReassignDriverDialog(): void {
    if (this.driverTasks.length == 0) {

      const message: Body = {
        message: this.translateService.instant(`No task(s) to be re-assigned !`),
        action: this.translateService.instant(`Okay`),
        duration: 2500
      }

      return this.snackBar.openSnackBar(message);
    }

    const dialogRef = this.dialog.open(ReAssignTasksFromDriverComponent, {
      width: '50%',
      minHeight: '250px',
      data: {
        driverId: this.driver.id,
        driverStatusId: this.driver.agentStatusId,
        tasks: this.driverTasks
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
      this.closeDriverDetails();
    });
  }

  /**
    * get Driver Tasks Details
    *
    */
  getDriverTasks() {
    const body = {
      pageNumber: this.pageIndexTasks,
      pageSize: this.pageSizeTasks,
      driverId: this.driver.id,
      searchBy: this.searchByTasks,
      fromDate: this.startDate,
      toDate: this.endDate
    }

    this.facadeService.mainTaskService.driverTasks(body).subscribe((result: any) => {
      this.lengthTasks = result.totalCount;
      this.driverTasks = result.result;
    });
  }

  /**
    * search tasks
    *
    *
    * @param event
    */
  onSearchSubmit(event) {

    this.searchByTasks = event.target.value;
    this.pageIndexTasks = 1;
    this.getDriverTasks();
  }

  /**
   * check if driver blocked
   * 
   * 
   */
  get isBlocked(): boolean {
    if (this.driver.agentStatusName.trim() == 'Blocked') {
      return true;
    }
  }

  /**
   * image view
   * 
   * 
   * @param index 
   */
  openImageLightBox(src: string): void {
    if (src && src.length > 0) {
      const imageTodisplay = {
        src: `${this.baseUrl}/${src}`,
        caption: '',
        thumb: `${this.baseUrl}/${src}`,
      };

      let array: any[] = [];
      array.push(imageTodisplay);
      this.lightbox.open(array, 0);
    }
  }

  /**
   * show location on map
   * 
   * 
   * @param location 
   */
  showLocationMap(location: any) {
    let marker: MapMarker = {
      lat: +location.latitude,
      lng: +location.longitude,
      type: ''
    }

    if (location && location.taskTypeId) {
      if (location.taskTypeId == 1) {
        marker.type = 'pickup'
      } else {
        marker.type = 'delivery'
      }
      marker.task = location;
    } else {
      marker.type = 'driver'
      marker.isDriver = true;
      marker.driver = location;
    }

    this.mapMarkersService.changeMarkers([marker], false);
    this.mapMarkersService.changeView(marker);
  }
}

