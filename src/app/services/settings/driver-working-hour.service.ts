import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'DriverWorkingHourTracking'

@Injectable({
  providedIn: 'root'
})
export class DriverWorkingHourTrackingService {

  constructor(private http: HttpClientService) { }



  /**
   * list all Account Logs
   *
   *
   */
  list() {
    return this.http.get<any[]>(`${endpoint}/GetAll`);
  }


  /**
  * list all Account Logs
  *
  *
  */
  listByPagination(body: object) {
    return this.http.post(body, `${endpoint}/GetAllByPagination`);
  }


  /**
   * Export To Excel
   *
   */
  exportToExcel(body: object) {
    return this.http.getCustom<Blob>(`${endpoint}/ExportToExcel`, { responseType: 'blob' }, body);
  }

}
