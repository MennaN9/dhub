import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { TaskStatus } from '../../../models/main/tasks/TaskStatus';

const endpoint = 'TaskStatus';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  constructor(private http: HttpClientService) { }

  /**
   * get task type details
   *
   *
   * @param id
   */
  getTaskStatus(id: number) {
    return this.http.get<TaskStatus>(`${endpoint}/Details/${id}`);
  }

  /**
   * list all task status
   *
   *
   */
  list() {
    return this.http.get<TaskStatus[]>(`${endpoint}/GetAll`);
  }

  /**
   * create new task status
   *
   *
   * @param body
   */
  create(body: TaskStatus) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update task status
   *
   *
   * @param body
   */
  update(body: TaskStatus) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete task status
   *
   *
   * @param taskStatusId
   */
  delete(taskStatusId: number) {
    return this.http.delete(`${endpoint}/Delete/${taskStatusId}`);
  }
}
