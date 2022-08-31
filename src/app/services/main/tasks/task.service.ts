import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'Tasks';
const mainTasksEndpoint = 'MainTask';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor(private http: HttpClientService) { }

  /**
   * get task details
   *
   *
   * @param id
   */
  getTask(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * get main task details
   *
   *
   * @param id
   */
  getMainTask(id: number) {
    return this.http.get(`${mainTasksEndpoint}/Details/${id}`);
  }

  /**
   * list all tasks
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new task
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update task
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.putFormData(body, `${endpoint}/Update`);
  }

  /**
   * delete task
   *
   *
   * @param taskId
   */
  delete(taskId: number) {
    return this.http.delete(`${endpoint}/Delete/${taskId}`);
  }

  /**
  * ChangeStatus task
  *
  *
  * @param body
  */
  changeStatus(body) {
    return this.http.put(body, `${endpoint}/ChangeStatus`);
  }


  /**
   * tasks 
   * 
   * 
   * @param body 
   */
  listByPagination(body: object) {
    return this.http.post(body, `${endpoint}/GetByPagination`);
  }

  /**
   * connected tasks
   * 
   * 
   * @param body 
   */
  listConnectedTasksByPagination(body: object) {
    return this.http.post(body, `${mainTasksEndpoint}/GetConnectedTasks`);
  }

  /**
  * reassign driver task
  *
  * 
  * 
  * @param body
  */
  reasignDriverTasks(body: object) {
    return this.http.post(body, `${endpoint}/ReasignDriverTasks`);
  }


  /**
  * get task reports
  * 
  *
  * @param body
  */
  taskReport(body) {
    return this.http.post(body, `${endpoint}/GetTasksReport`);
  }

  managerTaskReport(body) {
    return this.http.post(body, `${endpoint}/GetManagerTasksReport`);
  }
  /**
   * export with excel
   * 
   * 
   */
  exportReportsWithoutProgressToExcel(body: any) {
    body.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.http.postCustom(`${endpoint}/ExportWithoutProgressToExcel`, body, { responseType: 'blob' });
  }

  exportReportsManagerReportToExcel(body) {
    return this.http.postCustom(`${endpoint}/ExportManagerTasksReport`, body, { responseType: 'blob' });
  }
  /**
   * export with excel
   * 
   * 
   */
  exportReportsWitProgressToExcel(body: any) {
    body.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.http.postCustom(`${endpoint}/ExportWithProgressToExcel`, body, { responseType: 'blob' });
  }

  /**
   * export task to excel
   * 
   * 
   * @param number 
   */
  exportTaskToExcel(id: number) {
    return this.http.getCustom(`${endpoint}/ExportTaskToExcel?id=${id}&timeZone=${Intl.DateTimeFormat().resolvedOptions().timeZone}}`, { responseType: 'blob' });
  }

  /**
   * get driver time line
   *
   * @param body
   */
  getDriverTimeLine(body) {
    return this.http.post(body, `${endpoint}/GetDriverTimeLine`);
  }

}
