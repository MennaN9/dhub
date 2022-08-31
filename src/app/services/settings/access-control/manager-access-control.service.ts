import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AccessControl, AccessControlGroup } from '@dms/app/models/settings/access-control/AccessControl.model';
import { Observable } from 'rxjs';
const endpoint = 'ManagerAccessControl';

@Injectable({
  providedIn: 'root'
})
export class ManagerAccessControlService {
  role: AccessControl;
  constructor(private http: HttpClientService) { }

  /**
   * get  manager access control details
   *
   *
   * @param roleName
   */
  getRole(RoleName: string) {
    return this.http.get(`${endpoint}/Get`, { 'roleName': RoleName });
  }

  /**
   * list all manager access control permissions
   *
   *
   * @param body
   * */
  listAllPermissions():Observable<AccessControlGroup[]> {
    return this.http.get(`${endpoint}/GetAllPermissions`);
  }
  /**
    * list all  manager access control
    *
    *
    */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new  manager access control
   *
   *
   */
  create(role) {
    return this.http.post(role, `${endpoint}/Create`);
  }

  /**
   * update  manager access control
   *
   *
   */
  update(role) {
    return this.http.put(role, `${endpoint}/Update`);
  }

  /**
   * delete  manager access control
   *
   *
   * @param roleName
   */
  delete(RoleName: string) {
    return this.http.delete(`${endpoint}/Delete/${RoleName}`);
  }
}
