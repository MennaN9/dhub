import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Observable } from 'rxjs';
import { Customer } from '@dms/app/models/settings/Customer';

const endpoint = 'ManagerDispatching'

@Injectable({
  providedIn: 'root'
})

export class DispatchingManagersService {

  constructor(private http: HttpClientService) { }

  /**
   * get dispatching managers details
   *
   *
   * @param id
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all dispatching managers
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * get dispatching managers using pagination
   *
   *
   * @param body
   */
  listByPagination(body: object) {
    return this.http.post(body,`${endpoint}/GetAllByPagination`);
  }

  /**
   * create new dispatching managers
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update dispatching managers
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete dispatching managers
   *
   *
   * @param customerId
   */
  delete(dispatchingId: number) {
    return this.http.delete(`${endpoint}/Delete/${dispatchingId}`);
  }


  /**
   * delete bulk dispatching managers
   *
   *
   * @param body
   */
  bulkDelete(body: Object) {
    return this.http.post(body, `${endpoint}/BulkDelete`);
  }




}
