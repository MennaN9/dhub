import { Task } from '@dms/app/models/main/tasks/Task';
import { MainTask } from '@dms/models/main/tasks/MainTask';
import { Component, OnInit, Output, EventEmitter, Input, Inject, Optional } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignDriverComponent } from './../assign-driver/assign-driver.component';
import { ChangeTaskStatusComponent } from './../change-task-status/change-task-status.component';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { EditTaskComponent } from './../edit-task/edit-task.component';
import { App } from '@dms/app/core/app';
import { Images } from '@dms/app/constants/images';
import { TranslateService } from '@ngx-translate/core';
import { TaskHistory } from '@dms/app/models/main/tasks/TaskHistory';
import { Lightbox } from 'ngx-lightbox';
import { Driver } from '@dms/app/models/settings/Driver';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { TaskStatus } from '@dms/app/constants/task-status-types';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';

interface TaskLocationOnMap {
  type: number;
  latitude: number;
  longitude: number;
  address: string;
}

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  public readonly taskImagesUrl = App.taskImagesUrl;
  public readonly driverImagesUrl = App.driverImagesUrl;
  public readonly baseUrl = App.backEndUrl;
  public readonly user = Images.user;

  @Input() mainTaskData: MainTask;
  @Output() onCloseTaskDetails: EventEmitter<{ closeDetails: boolean, refresh: boolean }> = new EventEmitter<{ closeDetails: boolean, refresh: boolean }>();
  @Output() onShowLocationOnMap: EventEmitter<TaskLocationOnMap> = new EventEmitter<TaskLocationOnMap>();

  taskData: Task;
  dialogContent;
  date: Date;
  taskHistories: TaskHistory[] = [];
  driver: Driver;
  routeData: any;
  taskStatus = TaskStatus;

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private lightbox: Lightbox,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) protected data: any,
    private mapMarkersService: MapMarkersService
  ) {
    console.log(this.data);
  }

  ngOnInit() {
    this.dialogContent = {
      title: this.translateService.instant(`Are you sure you want to delete this Task? You won't be able to restore the data.`),
      openBtn: this.translateService.instant(`Delete stop`),
      cancelBtn: this.translateService.instant(`Cancel`),
      okayBtn: this.translateService.instant(`Confirm`),
    }

    // from tasks page
    if (this.data && this.data.mainTaskData) {
      this.mainTaskData = this.data.mainTaskData;
      this.changeTaskData(this.mainTaskData.tasks[0].id);
    } else {

      const mainTaskId: number = this.mainTaskData.id;
      this.facadeService.taskService.getMainTask(mainTaskId).subscribe((res: any) => {
        this.mainTaskData = res;
        this.changeTaskData(this.mainTaskData.tasks[0].id);
      });
    }

  }


  /**
   * close task details
   *
   *
   */
  close(refresh: boolean) {
    this.dialog.closeAll();
    this.onCloseTaskDetails.emit({ closeDetails: true, refresh: refresh });
  }

  /**
   * confirm task deletion
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.taskService.delete(this.taskData.id).subscribe((result: any) => {

        const index = this.mainTaskData.tasks.indexOf(this.taskData);
        if (index >= 0) {
          this.mainTaskData.tasks.splice(index, 1);

          const message: Body = {
            message: this.translateService.instant(`Success task has been deleted !`),
            action: this.translateService.instant(`Okay`),
            duration: 2000
          }

          this.snackBar.openSnackBar(message);
        }
        this.taskData = this.mainTaskData.tasks[0];

        this.close(true);
      });
    }
  }


  /**
   * fetch task details
   *
   *
   * @param taskId
   */
  getTaskData(taskId: number) {
    this.taskData = null;
    this.facadeService.taskService.getTask(taskId).subscribe((result: any) => {
      this.taskData = result;
      this.close(false);
    });
  }

  /**
   * open assign form dialog drivers
   *
   *
   * @param taskData
   */
  openAssignDriverDialog(task?: Task): void {

    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '750px',
      minHeight: '250px',
      data: {
        taskId: this.mainTaskData.id,
        teamId: task.teamId,
        driverIds: [task.driverId],
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTaskData(this.taskData.id);
      } else {
        this.close(true);
      }
    });
  }

  /**
   * status dialog details
   *
   */
  openStopStatusDialog(taskData: Task) {
    const dialogRef = this.dialog.open(ChangeTaskStatusComponent, {
      width: '500px',
      minHeight: '300px',
      data: {
        taskId: taskData.id,
        taskStatusId: taskData.taskStatusId,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTaskData(taskData.id);
      } else {
        this.close(true);
      }
    });
  }

  /**
   * set task data
   *
   *
   * @param taskId
   */
  changeTaskData(taskId: number) {
    const task = this.mainTaskData.tasks.find(task => task.id == taskId);
    this.taskData = task;

    if (task.taskStatusName && task.taskStatusName != 'Unassigned') {
      this.driverDetails(this.taskData.driverId);
    }
  }

  /**
   * edit task dialog
   *
   *
   */
  openEditTaskDialog(taskData: Task) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      height: '100%',
      maxHeight: '100vh',
      width: '50%',
      position: { left: '0', bottom: '0' },
      data: {
        task: {
          tasks: this.mainTaskData.tasks
        },
        selectedIndex: taskData.id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.close(true);
    });
  }

  /**
   * convert millsec
   *
   *
   * @param duration
   */
  timeConversion(duration: number) {
    const portions: string[] = [];

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }
    return portions.join(' ');
  }

  closeLightBox(): void {
    this.lightbox.close();
  }

  /**
   * image view
   *
   *
   * @param index
   */
  openTaskSignaturesLightBox(src: string, caption?: string): void {
    const imageTodisplay = {
      src: `${this.baseUrl}/${src}`,
      caption: caption,
      thumb: src
    };

    let array: any[] = [];
    array.push(imageTodisplay);

    this.lightbox.open(array, 0);
  }

  /**
 * image view
 *
 *
 * @param index
 */
  openTasksGalleryLightBox(images: [], caption?: string): void {
    let array: any[] = [];
    if (images.length > 0) {
      images.forEach((image: any) => {
        const imageTodisplay = {
          src: `${this.baseUrl}/${image.fileURL}`,
          caption: caption,
          thumb: image.fileURL
        };

        array.push(imageTodisplay);
      });

      this.lightbox.open(array, 0);
    }
  }

  /**
   * get driver details
   *
   *
   * @param id
   */
  driverDetails(id: number) {
    if (id) {
      this.facadeService.driverService.getdriver(id).subscribe(driver => {
        this.driver = driver;

        // route to draw task tracking
        this.routeData = {
          driverLat: +this.driver.latitude,
          driverLng: +this.driver.longitude,
          taskLat: +this.taskData.latitude,
          taskLng: +this.taskData.longitude,
          driver: this.driver.firstName + ' ' + this.driver.lastName,
          address: this.taskData.address,
          taskType: this.taskData.taskTypeName
        }
      });
    }
  }

  /**
   * emit route points
   *
   *
   * @param route
   */
  drawRoute() {
    if (!this.driver) {
      return this.snackBar.openSnackBar({ message: 'Please wait, driver data loading ...', duration: 2500, action: 'okay' });
    }

    const url = `./#/task-tracking?driverLat=${this.routeData.driverLat}&driverLng=${this.routeData.driverLng}&taskLat=${this.routeData.taskLat}&taskLng=${this.routeData.taskLng}&driver=${this.routeData.driver}&address=${this.routeData.address}&taskType=${this.routeData.taskType}`;
    window.open(url, '_blank');
  }

  /**
   * export task details
   *
   *
   */
  export() {
    this.facadeService.taskService.exportTaskToExcel(this.taskData.id).subscribe(data => {
      saveFile('Task.csv', "data:attachment/text", data);
    })
  }

  /**
   * rate driver
   *
   *
   */
  rate() {
    this.router.navigate([Routes.driverRating, this.taskData.customerId, 'driver', this.mainTaskData.driverName, this.mainTaskData.driverId, 'task', this.taskData.id])
  }

  /**
   * show location on map
   *
   *
   */
  showLocationMap(history: any) {

    const marker: MapMarker = {
      lat: +history.latitude,
      lng: +history.longitude,
      windowTitle: history.address,
      task: history,
      type: history.taskTypeId == 1 ? 'pickup' : 'delivery',
    }

    this.mapMarkersService.changeMarkers([marker], false);
    this.mapMarkersService.changeView(marker);
  }

}
