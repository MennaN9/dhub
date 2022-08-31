import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { Router } from '@angular/router';
import { DispatchingManagers } from '@dms/app/models/settings/DispatchingManagers';
import { ManageDispatchingManagersComponent } from './manage-dispatching-managers/manage-dispatching-managers.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-dispatching-managers",
  templateUrl: "./dispatching-managers.component.html",
  styleUrls: ["./dispatching-managers.component.scss"],
})
export class DispatchingManagersComponent implements OnInit {
  public readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this dispatching managers? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`),
  }
  public readonly displayedColumns: string[] = [
    "id",
    "designationName",
    "managerName",
    "zones",
    "restaurants",
    "branches",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);

  selectedDispatchingManagers: DispatchingManagers;
  dispatchingManagers: DispatchingManagers[];

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;

  loading: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog,
    private translateService: TranslateService,
    private facadeService: FacadeService) { }

  ngOnInit() {
    this.getDispatchingManagers();
  }

  /**
   * manage dispatching Managers (create / edit)
   *
   *
   * @param type
   */
  openManageDispatchingManagersDialog(type: string): void {
    const dialogRef = this.dialog.open(ManageDispatchingManagersComponent, {
      width: "500px",
      minHeight: "250px",
      data: {
        dispatchingManager:
          type == "create" ? null : this.selectedDispatchingManagers,
        type: type,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDispatchingManagers();
      }
    });
  }

  /**
   * delete restaurant
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.dispatchingManagersService
        .delete(this.selectedDispatchingManagers.id)
        .subscribe((deleteResult) => {
          this.getDispatchingManagers();
        });
    }
  }

  /**
   * select dispatching managers
   *
   *
   * @param dispatchingManagers
   */
  setTSelectedDispatchingManagers(dispatchingManagers: DispatchingManagers) {
    this.selectedDispatchingManagers = dispatchingManagers;
  }

  /**
   *
   *get all dispatching Managers
   * */
  getDispatchingManagers() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    };

    this.facadeService.dispatchingManagersService
      .listByPagination(body)
      .subscribe((result: any) => {
        this.dispatchingManagers = result.result;
        this.dataSource = new MatTableDataSource(result.result);
        this.dataSource.paginator = this.paginator;
        this.length = this.totalCount = result.totalCount;
      });
  }

  /**
   * get next page of dispatching Managers
   *
   *
   * @param event
   */
  public getServerData(event?: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;

    const body = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
    };

    this.facadeService.dispatchingManagersService
      .listByPagination(body)
      .subscribe((result: any) => {
        this.length = this.totalCount = result.totalCount;
        this.dispatchingManagers = result.result;
        this.dataSource = new MatTableDataSource(result.result);
        this.dataSource.paginator = this.paginator;
      });
  }
}
