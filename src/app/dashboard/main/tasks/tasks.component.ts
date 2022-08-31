import { Subscription } from 'rxjs';
import { MainTask } from '@dms/models/main/tasks/MainTask';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Task } from '@dms/app/models/main/tasks/Task';
import { FacadeService } from '@dms/services/facade.service';
import { PageEvent, MatSlideToggleChange, MatSelectionListChange, MatPaginator } from '@angular/material';
import { FilterService } from '@dms/services/state-management/filter.service';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { ChangeTaskStatusComponent } from '../change-task-status/change-task-status.component';
import { NotificationMessage, SignalRNotificationService } from '../../../services/state-management/signal-rnotification.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar, Body } from '@dms/app/utilities/snakbar';
import * as printJS from "print-js";
import { Routes } from '../../../constants/routes';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}

interface Status {
  id: number;
  color: string;
  title: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  mainTaskData: MainTask;
  statusList: any[] = [];
  readonly connectedTasks: MainTask[] = [];
  readonly displayedColumns = [
    'select',
    'id',
    'orderId',
    'teamName',
    'taskTypeName',
    'driverName',
    'name',
    'address',
    'pickupDate',
    'deliveryDate',
    'taskStatusName',
    'actions'
  ];

  readonly displayedColumnsList = [
    { name: this.translateService.instant('Task ID'), id: 'id' },
    { name: this.translateService.instant('Barcode'), id: 'barcode' },
    { name: this.translateService.instant('Order ID'), id: 'orderId' },
    { name: this.translateService.instant('Team Name'), id: 'teamName' },
    { name: this.translateService.instant('Task type'), id: 'taskTypeName' },
    { name: this.translateService.instant('Driver Name'), id: 'driverName' },
    { name: this.translateService.instant('Name'), id: 'name' },
    { name: this.translateService.instant('Address'), id: 'address' },
    { name: this.translateService.instant('Start Before'), id: 'pickupDate' },
    { name: this.translateService.instant('Complete Before'), id: 'deliveryDate' },
    { name: this.translateService.instant('Task Status'), id: 'taskStatusName' },
    { name: this.translateService.instant('Actions'), id: 'actions' }
  ];

  readonly connectedTasksDisplayedColumns: string[] = [
    'taskId',
    'orderId',
    'team',
    'driverDetails',
    'pickupDetails',
    'deliveryDetails',
    'taskStatus',
    'actions'
  ];

  name: string;
  dialogContent: Object;
  bulkDeleteContent: Object;
  dialogContentBulkDelete: Object;

  page: number = 10;
  tasks: any[] = [];
  countries: Country[] = [];
  selectedTask: Task;
  selectedMainTask: MainTask;

  loading: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;

  searchBy: string = '';
  sort: Sort;
  length: number;
  totalCount: number;
  selectedColumns: string[] = [];
  searchQuery: string = '';
  startDate: Date;
  endDate: Date;
  teamIds: number[] = [];
  branchesIds: number[];

  taskStatusIds: number[] = [];
  filtertaskStatusId: number = 0;

  dataSource: any;
  connectedTasksDataSource: any;
  connectedTasksCount: number;
  connectedTasksPageSize: number = 10;
  connectedTasksPageIndex: number = 1;

  sortedData: Task[];
  checked: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(private dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private filterService: FilterService,
    private signalrNotificationService: SignalRNotificationService,
    private translateService: TranslateService,
    private router: Router,
    private permissionsService: NgxPermissionsService) {

    this.sortedData = this.tasks.slice();
    this.branchesIds = [];

    this.startDate = new Date();
    this.endDate = new Date();
    this.teamIds = [];
    this.taskStatusIds = [];
    this.subscription.add(this.filterService.currentStatus.subscribe(state => {
      if (state.dateRange != undefined) {
        this.startDate = state.dateRange.startDate ? state.dateRange.startDate : this.startDate;
        this.endDate = state.dateRange.endDate ? state.dateRange.endDate : this.startDate;
      }
      // this.teamIds = state.teams ? state.teams : [];
      this.branchesIds = state.branchesIds ? state.branchesIds : this.branchesIds;


      this.page = 1;
      this.pageIndex = 1;
      this.connectedTasksPageIndex = 1;

      if (this.checked) {
        this.connectedTasksCount = 0;
        this.connectedTasksDataSource = [];
        this.listConnectedTasks();
      } else {
        this.sortedData = [];
        this.listTasks();
      }
    }));

    this.selectedColumns = [
      'id',
      'barcode',
      'orderId',
      'teamName',
      'taskTypeName',
      'driverName',
      'name',
      'address',
      'pickupDate',
      'deliveryDate',
      'taskStatusName',
      'actions'
    ];

  }

  ngOnInit() {

    this.filterService.reset();
    this.listTasks();
    this.listStatus();
    this.dialogContent = {
      title: this.translateService.instant("Are you sure to delete this task? you wan't be able to restore the data."),
      openBtn: this.translateService.instant("Delete"),
      cancelBtn: this.translateService.instant("Cancel"),
      okayBtn: this.translateService.instant("Confirm"),
    };

    this.dialogContentBulkDelete = {
      title: "Are you sure to delete driver(s)?",
      openBtn: this.translateService.instant("Delete"),
      cancelBtn: this.translateService.instant("Cancel"),
      okayBtn: this.translateService.instant("Confirm"),
    };

    this.bulkDeleteContent = {
      title: this.translateService.instant("Are you sure to delete this Customer(s) ?"),
      openBtn: this.translateService.instant(`Bulk delete`),
      cancelBtn: this.translateService.instant("Cancel"),
      okayBtn: this.translateService.instant("Confirm"),
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
 * list status
 *
 *
 */
  listStatus() {
    this.facadeService.taskStatusService.list().subscribe(status => {
      this.statusList = status;
    });
  }


  /**
   * list connected tasks
   *
   *
   */
  listConnectedTasks() {
    const body = {
      pageNumber: this.connectedTasksPageIndex,
      pageSize: this.connectedTasksPageSize,
      fromDate: this.startDate.toDateString(),
      toDate: this.endDate.toDateString(),
      teamIds: this.teamIds,
      taskStatusIds: this.taskStatusIds,
      searchBy: this.searchBy,
      filterColumn: this.selectedColumns,
      sortColumn: this.sort ? this.sort.active : "",
      sortOrder: this.sort ? this.sort.direction : "",
      branchesIds: this.branchesIds
    }

    this.facadeService.taskService.listConnectedTasksByPagination(body).subscribe((res: any) => {
      let result = res.result.map(task => {
        if (!task.mainTaskStatusName) {
          task.mainTaskStatusName = 'Unassigned';
        }

        return task;
      });

      this.connectedTasksDataSource = new MatTableDataSource(result);
      this.connectedTasksCount = res.totalOrderCount
    });

  }

  /**
   * delete task
   *
   *
   * @param event
   * @param type
   */
  onConfirm(event: boolean, type: string, id?: number) {
    if (event && type == 'connected') {
      this.facadeService.mainTaskService.delete(this.selectedMainTask.id).subscribe(res => {

        const message: Body = {
          message: this.translateService.instant(`Success task has been deleted !`),
          action: this.translateService.instant(`Okay`),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);

        this.listConnectedTasks();
      });
    } else if (event && type == 'notConnected') {
      this.facadeService.taskService.delete(id).subscribe(res => {

        const message: Body = {
          message: this.translateService.instant(`Success task has been deleted !`),
          action: this.translateService.instant(`Okay`),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);

        this.listTasks();
      });
    }
  }

  /**
   * current selected task
   *
   *
   * @param customer
   */
  setTSelectTask(task: Task) {
    this.selectedTask = task;
  }

  /**
   * filter table
   *
   *
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchBy = filterValue;
    this.listTasks();
    this.listConnectedTasks();
  }

  /**
   * sort by column
   *
   *
   * @param sort
   */
  sortData(sort: Sort) {
    const data = this.tasks.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.pageIndex = 1;
    this.listTasks();
  }

  /**
   * paginate server pages
   *
   *
   *
   * @param event
   */
  getServerData(event) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;
    this.loading = true;

    const body = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      fromDate: this.startDate.toDateString(),
      toDate: this.endDate.toDateString(),
      teamIds: this.teamIds,
      searchBy: this.searchBy.trim(),
      filterColumn: this.selectedColumns,
      sortColumn: this.sort ? this.sort.active : "",
      sortOrder: this.sort ? this.sort.direction : "",
      taskStatusIds: this.taskStatusIds,
      branchesIds: this.branchesIds
    }

    this.facadeService.taskService.listByPagination(body).subscribe((result: any) => {
      this.loading = false;
      this.sortedData = this.tasks = result.result;
      this.length = this.totalCount = result.totalCount;
      this.dataSource = new MatTableDataSource(this.tasks);
    });

    return event;
  }

  /**
   * refersh task list
   *
   *
   */
  listTasks(): void {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      fromDate: this.startDate.toDateString(),
      toDate: this.endDate.toDateString(),
      teamIds: this.teamIds,
      searchBy: this.searchBy.trim(),
      filterColumn: this.selectedColumns,
      sortColumn: this.sort ? this.sort.active : "",
      sortOrder: this.sort ? this.sort.direction : "",
      taskStatusIds: this.taskStatusIds,
      branchesIds: this.branchesIds
    }

    this.facadeService.taskService.listByPagination(body).subscribe((result: any) => {
      this.sortedData = this.tasks = result.result;
      this.length = this.totalCount = result.totalCount;
      this.dataSource = new MatTableDataSource(this.tasks);
    });
  }

  openAssignDriverDialog(): void {
    const dialogRef = this.dialog.open(AssignDriverComponent, {
      width: '750px',
      minHeight: '250px',
      data: {
        taskId: this.selectedTask.mainTaskId
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
      if (result) {
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * edit task dialog
   *
   *
   */
  openEditTaskDialog(task: Task) {
    let tasks: any[] = [];
    tasks.push(task);

    const dialogRef = this.dialog.open(EditTaskComponent, {
      height: '100%',
      maxHeight: 'auto',
      width: '50%',
      position: { left: '0', bottom: '0' },
      data: {
        task: {
          tasks: tasks
        },
        selectedIndex: task.id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.listTasks();
      dialogRef.close();
    });
  }

  /**
   * edit task dialog
   *
   *
   */
  openEditConnectedTaskDialog() {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      height: '100%',
      maxHeight: 'auto',
      width: '50%',
      position: { left: '0', bottom: '0' },
      data: {
        task: {
          tasks: this.selectedMainTask.tasks
        },
        selectedIndex: this.selectedMainTask.tasks[0].id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.listConnectedTasks();
      dialogRef.close();
    });
  }


  /**
   * filter columns Show / Hide
   *
   */
  onfiltersChange() {
    this.pageIndex = 1;
    this.listTasks();
  }

  /**
   * export task details
   *
   *
   */
  export() {
    this.facadeService.taskService.exportTaskToExcel(this.selectedTask.id).subscribe(data => {
      saveFile('Task.csv', "data:attachment/text", data);
    })
  }

  /**
   * task details
   *
   *
   */
  viewTaskDetails(task: Task) {
    let tasks: any[] = [];
    tasks.push(task);

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      height: '100%',
      maxHeight: '100vh',
      width: '50%',
      position: { left: '0', bottom: '0' },
      data: {
        mainTaskData: {
          tasks: tasks
        },
        selectedIndex: task.id,
        tasksPage: true,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }

  /**
   * task details (connected)
   *
   *
   */
  viewTaskDetailsForConnectedTask(task: MainTask) {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      height: '100%',
      maxHeight: '100vh',
      width: '50%',
      position: { left: '0', bottom: '0' },
      data: {
        selectedIndex: task.tasks[0]['id'],
        tasksPage: true,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.componentInstance.mainTaskData = task;
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }

  /**
   *
   * @param event
   */
  onChangeTasks(event: MatSlideToggleChange) {
    if (event.checked) {
      this.listConnectedTasks();
    }
  }

  /**
   * refersh tasks
   *
   *
   */
  refresh() {
    if (this.checked) {
      this.listConnectedTasks();
    } else {
      this.listTasks();
    }
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event, type: string) {
    switch (type) {
      case 'connectedTasks':
        this.connectedTasksPageIndex = event.pageIndex + 1;
        this.connectedTasksPageSize = event.pageSize;
        this.listConnectedTasks();
        break;

      default:
        this.pageIndex = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.listTasks();
        break;
    }
  }

  /**
   * select main task
   *
   *
   * @param task
   */
  setTSelectConnectedTasks(task: MainTask) {
    this.selectedMainTask = task;
  }

  /**
   * get selection values
   *
   *
   * @param event
   */
  onChange(event: MatSelectionListChange) {
    if (event && event.source._value.length > 0) {
      this.pageIndex = 1;
      this.paginator.pageIndex = 0;
      this.connectedTasksPageIndex = 1;
      this.taskStatusIds = event.source._value.map(Number);
      this.refresh();
    } else {
      this.taskStatusIds = [];
      this.refresh();
    }
  }

  onSelectAll() {
    this.pageIndex = 1;
    this.paginator.pageIndex = 0;
    this.connectedTasksPageIndex = 1;
    this.statusList.forEach(element => {
      this.taskStatusIds.push(element.id);
    });

    this.refresh();
  }

  onDeSelectAll() {
    this.pageIndex = 1;
    this.paginator.pageIndex = 0;
    this.connectedTasksPageIndex = 1;
    this.taskStatusIds = [];
    this.refresh();
  }

  notificationLisner() {
    const refreshMessages = [
      NotificationMessage.TaskSuccessful,
      NotificationMessage.TaskFailed,
      NotificationMessage.TaskCancel,
      NotificationMessage.TaskStart,
      NotificationMessage.TaskDecline,
      NotificationMessage.TaskAccept,
      NotificationMessage.AutoAllocationSucessfully
    ];
    this.subscription.add(
      this.signalrNotificationService.subscribeMultiple(refreshMessages, () => this.refresh())
    );
  }
  todayDate: Date = new Date();



  /**
 * status dialog details
 *
 */
  openStopStatusDialog(taskData: Task) {
    const dialogRef = this.dialog.open(ChangeTaskStatusComponent, {
      width: '500px',
      minHeight: 'auto',
      data: {
        taskId: taskData.id,
        taskStatusId: taskData.taskStatusId,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // this.getTaskData(taskData.id);
      this.listTasks();
      if (result) {
        // ...
        this.listTasks();
      } else {
        dialogRef.close();
      }
    });
  }
  isPrinting = false;
  printBarcode(barcodeId: string, id: number) {
    this.isPrinting = true;

    printJS({
      printable: barcodeId,
      type: 'html',
      maxWidth: 150,
      css: 'height:3cm; width:5cm;',
      targetStyles: ['*'],
      header: ``
    })
    this.isPrinting = false;

  }

  /**
 * status dialog details
 *
 */
  openMainTaskStatusDialog(maintaskData: MainTask) {
    const dialogRef = this.dialog.open(ChangeTaskStatusComponent, {
      width: '500px',
      minHeight: 'auto',
      data: {
        taskId: maintaskData.tasks[0].id,
        taskStatusId: maintaskData.tasks[0].taskStatusId,
        isConnectedTasks: true
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // this.getTaskData(taskData.id);
      this.listConnectedTasks();
      if (result) {
        // ...
        this.listConnectedTasks();
      } else {
        dialogRef.close();
      }
    });
  }


}
