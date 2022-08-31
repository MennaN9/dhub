import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private roleSource = new BehaviorSubject('manager');
  currentRole = this.roleSource.asObservable();

  constructor(private readonly permissionsService: NgxPermissionsService, private readonly accountService: AccountService) {
    const tanent: boolean = this.accountService.isTenant;
    const driver: any = this.permissionsService.getPermission('CreateAgent');
    const manager: any = this.permissionsService.getPermission('AddManager');

    if (tanent || (manager && manager.hasOwnProperty('name') && manager.name == 'AddManager')) {
      this.roleSource.next('manager');
    } else if (driver && driver.hasOwnProperty('name') && driver.name == 'CreateAgent') {
      this.roleSource.next('driver');
    }
  }

  /**
   * change role
   * 
   * 
   * @param role 
   * @returns role type
   */
  changeRole(role: string) {
    this.roleSource.next(role)
  }

}
