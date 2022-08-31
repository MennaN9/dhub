import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { FacadeService } from '@dms/services/facade.service';
import { AccessControl } from '@dms/app/models/settings/access-control/AccessControl.model';
import { SnackBar } from '@dms/utilities/snakbar';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const DURATION = 2000;

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})

export class AccessControlComponent implements OnInit {
  permissions: AccessControl;
  selectedRole: AccessControl;

  roles: any[] = [];
  currentRole: string;

  displayedColumns: string[] = ['id', 'roleName', 'creationDate', 'actions'];
  dialogContent: Object;
  header: string = '';
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<AccessControl>([]);

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {

    this.dialogContent = {
      title: this.translateService.instant(`Are you sure you want to delete this access control? You won't be able to restore the data.`),
      openBtn: this.translateService.instant('Delete'),
      cancelBtn: this.translateService.instant('Cancel'),
      okayBtn: this.translateService.instant('Confirm'),
    }

    this.facadeService.roleService.currentRole.subscribe(role => {
      this.currentRole = role;
      switch (role) {
        case 'driver':
          this.header = this.translateService.instant('Driver Access Control List');
          this.getAllRoles(this.currentRole);
          break;
        case 'manager':
          this.header = this.translateService.instant('Manager Access Control List');
          this.getAllRoles(this.currentRole);
          break;
      }
    });
  }

  ngOnInit() {
    if (this.currentRole == 'undefined') {
      this.currentRole = 'manager';
      this.facadeService.roleService.changeRole(this.currentRole);
      this.header = this.translateService.instant('Manager Access Control List');
      this.getAllRoles(this.currentRole);
    }
  }

  /**
   * list roles on role type (driver / manager)
   *
   *
   * @param type
   */
  getAllRoles(type: string) {
    // driver type
    if (type == 'driver') {
      this.facadeService.agentAccessControlService.list().subscribe((roles: any) => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
      });

      // manager type
    } else if (type == 'manager') {
      this.facadeService.managerAccessControlService.list().subscribe((roles: any) => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  /**
   * open dialog
   *
   *
   * @param role
   */
  openRoleDialog(role?: any): void {
    const AccessControlType = { 'type': this.currentRole };
    const dialogRef = this.dialog.open(ManageRoleComponent, {
      width: '65%',
      height: '95%',
      maxHeight: '100%',
      data: { AccessControlType, role },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        this.getAllRoles(result.type);
      }
    });
  }

  /**
   * confirm deletion
   *
   *
   * @param event
   */
  onConfirm(event: boolean): void {
    if (event === true) {
      this.delete(this.selectedRole.roleName);
    }
  }

  /**
   * delete role
   *
   *
   * @param roleName
   */
  delete(roleName) {
    // driver (agent)
    if (this.currentRole === 'driver') {
      this.facadeService.agentAccessControlService.delete(roleName).subscribe(result => {
        console.log(result)

        const filterResult = this.roles.find((element, index, array) => {
          return element['roleName'] === roleName;
        });

        const index: number = this.roles.indexOf(filterResult);
        this.roles.splice(index, 1);
        this.snackBar.openSnackBar({ message: `${roleName} ${this.translateService.instant('Role has been deleted successfully')}`, duration: DURATION, action: '' })
        this.getAllRoles(this.currentRole);
      }, (err) => {
        console.log(err)
      });

      // manager
    } else if (this.currentRole === 'manager') {
      this.facadeService.managerAccessControlService.delete(roleName).subscribe(result => {

        const filterResult = this.roles.filter(function (element, index, array) {
          return element['roleName'] === roleName;
        });

        const index: number = this.roles.indexOf(filterResult[0]);
        this.roles.splice(index, 1);
        this.snackBar.openSnackBar({ message: `${roleName} ${this.translateService.instant('Role has been deleted successfully')}`, duration: DURATION, action: '' })
        this.getAllRoles(this.currentRole);
      });
    }
  }
}
