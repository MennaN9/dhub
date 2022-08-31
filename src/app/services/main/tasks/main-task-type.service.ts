import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'MainTaskType';

@Injectable({
  providedIn: 'root'
})
export class MainTaskTypeService {
  constructor(private http: HttpClientService) { }

  /**
   * get mainTaskType details
   *
   *
   * @param id
   */
  getMainTaskType(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all MainTaskTypes
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new mainTaskType
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update mainTaskType
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete mainTaskType
   *
   *
   * @param mainTaskTypeId
   */
  delete(mainTaskTypeId: number) {
    return this.http.delete(`${endpoint}/Delete/${mainTaskTypeId}`);
  }
}
