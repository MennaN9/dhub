import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'ManagerAccessControl'

@Injectable({
  providedIn: 'root'
})
export class ManagerAccessControlService {

  constructor(private http: HttpClientService) { }

  /**
   * get ManagerAccessControl details
   * 
   * 
   * @param id 
   */
  getManagerAccessControl(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all ManagerAccessControls
   * 
   * 
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }


  listAllPermissions() {
    return this.http.get(`${endpoint}/GetAllPermissions`);
  }

  /**
   * create new ManagerAccessControl
   * 
   * 
   * @param body 
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update ManagerAccessControl
   * 
   * 
   * @param ManagerAccessControlId 
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete ManagerAccessControl
   * 
   * 
   * @param ManagerAccessControlId 
   */
  delete(ManagerAccessControlId: number) {
    return this.http.delete(`${endpoint}/Delete/${ManagerAccessControlId}`);
  }
}
