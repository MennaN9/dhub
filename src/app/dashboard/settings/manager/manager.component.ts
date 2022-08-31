import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageManagerComponent } from './manage-manager/manage-manager.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { FacadeService } from '../../../services/facade.service';
import { MatPaginator, PageEvent } from '@angular/material';
import { compare } from '@dms/utilities/compare';
import { MenuRoutes } from '@dms/app/constants/menu-routes';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { AuthConstants } from '../../../constants/auth';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  public readonly displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'team', 'roles', 'actions'];
  public readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this manager? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`),
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selectedManager: any;
  keywords: string = '';

  managers: any[] = [];
  dataSource = new MatTableDataSource(this.managers);
  sortedData: any[];
  searchMode: boolean = false;

  user: any;
  isUpdateAllteamManager: boolean;
  isMyteamManager: boolean;


  /**
   *
   * @param dialog
   * @param facadeService
   */
  constructor(public dialog: MatDialog,
    private facadeService: FacadeService,
    private router: Router,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private snackBar: SnackBar
  ) {
  }

  ngOnInit() {
    // get previous page if exists
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.page) {
        this.pageIndex = params.page;
      }
      this.listManagers(this.pageIndex);
    });

    this.user = JSON.parse(localStorage.getItem(AuthConstants.UserKey));
    if (this.user.permissions.includes('ManagerPermissions.Settings.UpdateAllManager')) {
      this.isUpdateAllteamManager = true;
    }

    const userRoles: string[] = this.user.roleNames
    if (userRoles.includes('Tenant')) {
      this.isUpdateAllteamManager = true;
    }

    if (this.user.permissions.includes('ManagerPermissions.Settings.UpdateTeamManager')) {
      this.isMyteamManager = true;
    }
  }

  /**
   * list all managers
   *
   *
   */
  listManagers(page: number) {
    const body = {
      pageNumber: page,
      pageSize: this.pageSize,
    };

    this.router.navigate([MenuRoutes.managers], { queryParams: { page: this.pageIndex } });
    this.facadeService.managerService.searchByPagination(body).subscribe((managers: any) => {

      // Teams to string
      managers.result.forEach(manager => {
        manager.teams = this.teamsAsString(manager['teamManagers']);
      })

      this.sortedData = this.managers = managers.result;
      this.length = this.totalCount = managers.totalCount;
    });
  }

  /**
   * reset values
   * 
   * 
   */
  clear() {
    this.keywords = '';
    this.pageIndex = 1;
    this.listManagers(this.pageIndex);
  }

  /**
   * manage role dialog
   *
   *
   */
  manageManagerDialog(operation: string): void {
    const dialogRef = this.dialog.open(ManageManagerComponent, {
      width: '75%',
      maxHeight: '75vh',
      autoFocus: false,
      data: {
        type: operation,
        manager: this.selectedManager
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.listManagers(this.pageIndex);
      dialogRef.close();
    });
  }

  /**
   * delete manager
   *
   *
   * @param event
   */
  onConfirm(event: boolean) {
    if (event) {
      const managerId = this.selectedManager['id'];
      this.facadeService.managerService.delete(managerId).subscribe(res => {

        const message: Body = {
          message: this.translateService.instant('Manager has been deleted successfully'),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);
        this.listManagers(this.pageIndex);
      });
    }
  }

  /**
   * refersh table
   *
   *
   * @param data
   */
  refreshDataSource(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @todo where is documention
   *
   *
   * @param event
   */
  seachInManagers() {
    this.pageIndex = 1;
    this.searchMode = true;

    const body = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      SearchBy: this.keywords,

    };

    this.facadeService.managerService.searchByPagination(body).subscribe(managers => {

      // Teams to string
      managers['result'].forEach(manager => {
        manager.teams = this.teamsAsString(manager['teamManagers']);
      });

      this.sortedData = this.managers = managers['result'];
      this.length = this.totalCount = managers['totalCount'];
    });
  }

  /**
  * sort table via columns
  *
  *
  * @param sort
  */
  sortData(sort: Sort) {
    const data = this.managers.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource = new MatTableDataSource(data);
      return;
    }

    this.dataSource.sort = this.sort;

    this.dataSource = new MatTableDataSource(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'name': return compare(a.firstName, b.firstName, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'team': return compare(a.teamId, b.teamId, isAsc);
        case 'phone': return compare(a.phoneNumber, b.phoneNumber, isAsc);
        default: return 0;
      }
    }));
  }


  /**
   * set selected manager
   *
   *
   * @param manager
   */
  selectManager(manager) {
    this.selectedManager = manager;
  }

  /**
   * teams as string
   *
   *
   * @param array
   */
  teamsAsString(array: []): string {
    var str = '';
    array.forEach((element, index) => {
      if (index == array.length - 1) {
        str += element['teamName'];
      } else {
        str += element['teamName'] + ',';
      }
    });

    return str;
  }

  /**
 * on change page or per page
 *
 *
 * @param event
 */
  onChangePage(event) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.listManagers(this.pageIndex)
  }
}
