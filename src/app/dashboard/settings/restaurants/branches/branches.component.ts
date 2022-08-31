import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageBranchComponent } from './../manage-branch/manage-branch.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Branch } from '@dms/models/settings/branch';
import { FacadeService } from '@dms/services/facade.service';
import { Manager } from '@dms/models/settings/Manager';
import { GeoFence } from '@dms/models/settings/GeoFence';
import { TranslateService } from '@ngx-translate/core';
import { BlockBranchComponent } from './../block-branch/block-branch.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  public readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this branch ? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`),
  }

  public readonly unlockDialogContent = {
    title: this.translateService.instant("Are you sure you want to unblock this branch ?"),
    openBtn: this.translateService.instant("Unblock"),
    cancelBtn: this.translateService.instant("Cancel"),
    okayBtn: this.translateService.instant("Confirm"),
  }

  public readonly displayedColumns: string[] = ['id', 'name', 'status', 'zone', 'actions'];

  dataSource = new MatTableDataSource([]);
  selectedBranch: Branch;
  managers: Manager[] = [];
  geoFences: GeoFence[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;
  loading: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  restaurantId: number;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  /**
   *
   * @param dialog
   * @param activatedRoute
   * @param facadeService
   */
  constructor(public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.restaurantId = params['id'];
    });

    this.getAllBranches();
    this.getAllGeoFence();
  }

  /**
   * manage restaurant (create / edit)
   *
   *
   * @param type
   */
  openManageBranchDialog(type: string): void {
    const dialogRef = this.dialog.open(ManageBranchComponent, {
      width: '600px',
      height: 'calc(100vh - 25px)',
      maxHeight: '100%',
      data: {
        branch: this.selectedBranch,
        type: type,
        restaurantId: this.restaurantId
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBranches();
      }
    });
  }

  /**
   * select branch
   *
   *
   * @param branch
   */
  setTSelectablBranch(branch: Branch) {
    this.selectedBranch = branch;
  }

  /**
   * delete restaurant
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.branchService.delete(this.selectedBranch.id).subscribe(deleteResult => {
        this.getAllBranches();
      })
    }
  }

  /**
  *
  *get all branches
  *
 */
  getAllBranches() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      id: this.restaurantId,

    }

    this.facadeService.branchService.listByResturantPagination(body)
      .subscribe((result: any) => {
        this.dataSource = new MatTableDataSource(result.result);
        this.dataSource.paginator = this.paginator;
        this.length = this.totalCount = result.totalCount;
      })
  }

  /**
  * get next page of restaurants
  *
  *
  * @param event
  */
  public getServerData(event?: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;

    const body = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      id: this.restaurantId
    }

    this.facadeService.branchService.listByResturantPagination(body)
      .subscribe((result: any) => {
        this.dataSource = new MatTableDataSource(result.result);
        this.dataSource.paginator = this.paginator;
        this.length = this.totalCount = result.totalCount;
      });

    return event;
  }

  /**
   * List All managers
   *
   *
   */
  getAllManagers() {
    this.facadeService.managerService.list().subscribe(managers => {
      this.managers = managers;
    })
  }

  /**
   * List All GeoFences
   *
   *
   */
  getAllGeoFence() {
    this.facadeService.geoFenceService.list().subscribe(geoFences => {
      this.geoFences = geoFences;
    })
  }

  /**
   * Get GeoFence Name For Grid
   *
   *
   * @param id
   */
  getGeoFenceName(id: number) {
    if (this.geoFences.length > 0 && id) {
      let geoFence = this.geoFences.find(geoFence => geoFence.id == id);
      return geoFence ? geoFence.name : null;
    }
  }

  /**
   * Get Status Name For Grid
   *
   *
   * @param isActive
   */
  getStatusName(isActive: boolean) {
    return isActive ? this.translateService.instant('Active') : this.translateService.instant('blocked');
  }

  /**
   * Unblock Branch Change isActive to true
   * 
   * 
   * @param event 
   */
  unBlockBranch(event: boolean) {
    if (event) {
      const body = {
        id: this.selectedBranch.id,
        isActive: true,
      }

      this.facadeService.branchService.blockUnBlockBranch(body).subscribe(res => {
        this.getAllBranches()
      });
    }
  }

  /**
   * block branch
   *
   *
   */
  blockBranch(): void {
    const dialogRef = this.dialog.open(BlockBranchComponent, {
      width: '50%',
      data: {
        branchId: this.selectedBranch.id
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllBranches();
    });
  }
}
