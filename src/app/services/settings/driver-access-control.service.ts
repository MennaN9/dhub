import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'DriverAccessControl'

@Injectable({
  providedIn: 'root'
})
export class DriverAccessControlService {

  constructor(private http: HttpClientService) { }

  /**
   * get Driver Access Control details
   * 
   * 
   * @param id 
   */
  getDriverAccessControl(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all DriverAccessControls
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
   * create new DriverAccessControl
   * 
   * 
   * @param body 
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update DriverAccessControl
   * 
   * 
   * @param DriverAccessControlId 
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * Delete Driver Access Control Id
   * 
   * 
   * @param driverAccessControlId 
   */
  delete(driverAccessControlId: number) {
    return this.http.delete(`${endpoint}/Delete/${driverAccessControlId}`);
  }
}
