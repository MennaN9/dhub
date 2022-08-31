import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Manager } from '../../models/settings/Manager';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private static readonly endpoint = 'Manager';
  constructor(private http: HttpClientService) { }

  /**
   * get manager details
   *
   *
   * @param id
   */
  get(id: number) {
    return this.http.get<Manager>(`${ManagerService.endpoint}/Details/${id}`);
  }

  /**
   * list all managers
   *
   *
   */
  list() {
    return this.http.get<Manager[]>(`${ManagerService.endpoint}/GetAll`);
  }

  /**
 * get managers using pagination
 *
 *
 * @param body
 */
  listByPagination(body: Manager) {
    return this.http.post<Manager>(body, `${ManagerService.endpoint}/GetAllByPagination`);
  }


  /**
   * create new manager
   *
   *
   * @param model
   */
  create(model: Manager) {
    return this.http.post<Manager>(model, `${ManagerService.endpoint}/Create`);
  }

  /**
   * update manager
   *
   *
   * @param managerId
   */
  update(model: Object) {
    return this.http.put<Manager[]>(model, `${ManagerService.endpoint}/Update`);
  }

  /**
   * delete manager
   *
   *
   * @param managerId
   */
  delete(managerId: number) {
    return this.http.delete<boolean>(`${ManagerService.endpoint}/Delete/${managerId}`);
  }

  /**
   *
   * @param pageNumber
   * @param pageSize
   * @param searchBy
   * @param totalNumbers
   */
  getAllByPagination(pageNumber: number, pageSize: number, searchBy: string, totalNumbers: number = 0) {
    return this.http.get<Manager[]>(`${ManagerService.endpoint}/GetAllByPagination?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchBy=${searchBy}&totalNumbers=${totalNumbers}`);
  }

  /**
   * search using pagination
   *
   *
   * @param body
   */
  searchByPagination(body: {}) {
    return this.http.post<Manager[]>(body, `${ManagerService.endpoint}/GetPaginationBy`);
  }
}
