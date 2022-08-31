import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FacadeService } from '@dms/app/services/facade.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessControl } from '@dms/app/models/settings/access-control/AccessControl.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { SnackBar } from '@dms/utilities/snakbar';
import { Permissions } from "./related-permissions";
import { TranslateService } from '@ngx-translate/core';

const DURATION = 2000;

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent implements OnInit {
  color: ThemePalette = 'accent';
  isSubmitted: boolean = false;
  role: AccessControl;
  permissions: AccessControl;

  form: FormGroup;
  profilePermissions: any[] = [];
  rolePermissions = [];
  isEditMode = false;
  tempPermissions = [];
  panelOpenState = false;

  permissionFormArray: FormArray;
  step: number = 0;
  label: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    public dialogRef: MatDialogRef<ManageRoleComponent>,
    private permissionsService: Permissions,
    fb: FormBuilder,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {

    this.form = fb.group({
      roleName: ['', [Validators.required]],
      permissions: fb.array([]),
    });

    if (data.role !== undefined) {
      this.form = fb.group({
        roleName: [data.role.roleName, [Validators.required]],
      });

      this.isEditMode = true;
      this.role = data.role;
      this.rolePermissions = this.role.permissions;
    }
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.label = this.translateService.instant('Edit');
    } else {
      this.label = this.translateService.instant('Add');
    }

    // Driver (agent)
    if (this.data.AccessControlType.type === 'driver') {
      this.agentPermissionsList();

      // manager
    } else if (this.data.AccessControlType.type === 'manager') {
      this.managerPermissionsList();
    }
  }

  /**
   * driver (agent) permissions list
   *
   *
   */
  agentPermissionsList() {
    this.facadeService.agentAccessControlService.listAllPermissions().subscribe((result: any) => {
      this.permissions = new AccessControl();
      this.permissions = result;

      result.forEach(role => {
        role.permissions.forEach(permission => {
          this.tempPermissions.push(permission.value);
        });
      });
    });
  }

  /**
   * manager permissions list
   *
   *
   */
  managerPermissionsList() {
    this.facadeService.managerAccessControlService.listAllPermissions().subscribe((result: any) => {
      this.permissions = new AccessControl();
      this.permissions = result;
    });
  }

  /**
   * Update / Create role
   *
   *
   * @param role
   */
  onSubmit(role) {
    this.isSubmitted = true;
    if (this.data.role === undefined) {
      this.addRole(role);
    } else {
      this.editRole(role);
    }
  }

  /**
   * Add new role
   *
   *
   * @param role
   */
  private addRole(role) {
    this.role = new AccessControl();

    this.role.roleName = role.roleName;
    this.role.permissions = [];
    this.role.permissions = this.rolePermissions;

    // Driver (agent)
    if (this.data.AccessControlType.type === 'driver') {
      this.facadeService.agentAccessControlService.create(this.role).subscribe((role: any) => {
        this.snackBar.openSnackBar({
          message: `${this.role.roleName}  ${this.translateService.instant('Role has been added successfully')}`,
          duration: DURATION,
          action: this.translateService.instant('Okay')
        })
        this.isSubmitted = false;
        this.closeDialog('driver');
      }, error => {
        this.isSubmitted = false;

      });
    }

    // manager
    if (this.data.AccessControlType.type === 'manager') {
      this.facadeService.managerAccessControlService.create(this.role).subscribe((role: any) => {
        this.isSubmitted = false;
        this.snackBar.openSnackBar({
          message: `${this.role.roleName}  ${this.translateService.instant('Role has been added successfully')}`,
          duration: DURATION,
          action: this.translateService.instant('Okay')
        })
        this.closeDialog('manager');
      }, error => {
        this.isSubmitted = false;
      });
    }
  }


  /**
   * Edit role
   *
   *
   * @param role
   */
  private editRole(role: AccessControl) {

    this.role.roleName = role.roleName;
    this.role.permissions = [];
    this.role.permissions = this.rolePermissions;

    // driver (agent)
    if (this.data.AccessControlType.type === 'driver') {
      this.facadeService.agentAccessControlService.update(this.role).subscribe((role: any) => {
        this.snackBar.openSnackBar({ message: `${this.role.roleName} Role has been updated successfully`, duration: DURATION, action: 'Okay' })
        this.isSubmitted = false;
        this.closeDialog('driver');
      });
    }

    // manger
    if (this.data.AccessControlType.type === 'manager') {
      this.facadeService.managerAccessControlService.update(this.role).subscribe((role: any) => {
        this.snackBar.openSnackBar({ message: `${this.role.roleName} Role has been updated successfully`, duration: DURATION, action: 'Okay' })
        this.isSubmitted = false;
        this.closeDialog('manager');
      });
    }
  }

  /**
   *
   * @param permission
   */
  setValue(permission, event) {
    const selectedPermission = permission;
    // remove permission if exists
    if (!event.checked) {
      this.rolePermissions = this.rolePermissions.filter(x => x != selectedPermission['value']);
      if (this.isEditMode) {
        this.role.permissions = this.role.permissions.filter(x => x != selectedPermission['value']);
      }
    } else {
      this.rolePermissions.push(selectedPermission['value']);
      if (this.isEditMode) {
        this.role.permissions.push(selectedPermission['value']);
      }
      // set dependencies
      this.setDependencies(selectedPermission['value']);
    }
  }

  /**
   * check permission
   *
   *
   * @param permission
   */
  checkPermission(permission: string): boolean {
    if (this.role && this.role.permissions) {
      return this.role.permissions.some(item => item == permission);
    } else {
      return this.rolePermissions.some(item => item == permission);
    }
  }

  /**
   * close dialog after edit / create
   *
   *
   * @param role
   */
  closeDialog(type: string) {
    this.dialogRef.close({ type: type });
  }

  /**
   * close dialog without any action
   *
   *
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * set current index
   *
   *
   * @param index
   */
  setStep(index: number) {
    this.step = index;
  }

  /**
   * set next step
   *
   *
   */
  nextStep() {
    this.step++;
  }

  /**
   * set previous step
   *
   *
   */
  prevStep() {
    this.step--;
  }

  /**
   * check dependencies
   *
   *
   * @param permissionToCheck
   */
  setDependencies(permissionToCheck: string) {
    this.checkRoleDependenciesON(permissionToCheck);
  }

  /**
   * check Dependencies
   *
   *
   * @param permission
   */
  checkRoleDependenciesON(permission: string) {
    let relatedpermissionslist = this.permissionsService.relatedPermissions(permission);
    relatedpermissionslist.forEach(element => {

      if (this.rolePermissions.findIndex(value => value == element) < 0) {
        this.rolePermissions.push(element);
      }

      if (this.isEditMode) {
        if (this.role.permissions.findIndex(value => value == element) < 0) {
          this.role.permissions.push(element);
        }
      }
    });

    this.refershCheckedPermissions();
  }

  /**
   * referch checks
   *
   *
   */
  refershCheckedPermissions() {
    this.rolePermissions.forEach(permission => {
      this.checkPermission(permission);
    });

    if (this.isEditMode) {
      this.role.permissions.forEach(permission => {
        this.checkPermission(permission);
      });
    }
  }
}
