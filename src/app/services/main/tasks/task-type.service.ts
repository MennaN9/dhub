import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const  endpoint = 'TaskType';

@Injectable({
  providedIn: 'root'
})

export class TaskTypeService {
  constructor(private http: HttpClientService) { }

  /**
   * get task type details
   *
   *
   * @param id
   */
  getTaskType(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all task types
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new task type
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update task type
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete task type
   *
   *
   * @param taskTypeId
   */
  delete(taskTypeId: number) {
    return this.http.delete(`${endpoint}/Delete/${taskTypeId}`);
  }
}
