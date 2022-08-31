import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { MainTaskViewModel } from '@dms/app/models/task/assignDriverMainTaskViewModel';
import { Observable } from 'rxjs';

const endpoint = 'MainTask';

@Injectable({
  providedIn: 'root'
})
export class MainTaskService {
  constructor(private http: HttpClientService) { }

  /**
   * get mainTask details
   *
   *
   * @param id
   */
  getMainTask(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }


  /**
   * get mainTask details
   *
   *
   * @param id
   */
  TryAutoAssignment(id: number) {
    return this.http.get(`${endpoint}/TryAutoAssignmentAgain/${id}`);
  }


  /**
   * list all mainTasks
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new mainTask
   *
   *
   * @param body
   */
  create(body: Object): Observable<number> {
    return this.http.postFormData(body, `${endpoint}/Create`);
  }

  /**
   * update mainTask
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete mainTask
   *
   *
   * @param mainTaskId
   */
  delete(mainTaskId: number) {
    return this.http.delete(`${endpoint}/Delete/${mainTaskId}`);
  }

  reassignMainTask(body: Object) {
    return this.http.post(body, `${endpoint}/ReassignMainTask`);
  }

  /**
   * list all Unassigned Tasks
   *
   * @param body
   */
  listUnassigned(body: Object) {
    return this.http.post(body, `${endpoint}/GetUnassigned`);
  }


  /**
 * list all assigned  Tasks
 *
 *@param body
 */
  listAssigned(body: Object) {
    return this.http.post(body, `${endpoint}/GetAssigned`);
  }


  /**
   * list all completed tasks
   *
   *@param body
   */
  listCompleted(body: Object) {
    return this.http.post(body, `${endpoint}/GetCompleted`);
  }

  /**
   * Gets boolean to indicate if the task location exists in any existing geofence
   *
   * @param mainTask
   */
  taskHasGeofences(mainTask: MainTaskViewModel): Observable<any> {
    return this.http.postFormData(mainTask, `${endpoint}/TaskHasGeofences`);
  }

  /**
   * driver tasks
   *
   */
  driverTasks(object: object): Observable<any> {
    return this.http.post(object, `${endpoint}/GetDriverTasks`);
  }
}
