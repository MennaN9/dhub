import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AgentType } from '../../models/settings/AgentType';
import { AccountLogs } from '@dms/app/models/settings/AccountLog';

const endpoint = 'AccountLogs'

@Injectable({
  providedIn: 'root'
})
export class AccountLogService {

  constructor(private http: HttpClientService) { }


  /**
   * get Account Log details
   *
   *
   * @param id
   */
  getAccountLog(id: number) {
    return this.http.get < AccountLogs>(`${endpoint}/Details/${id}`);
  }

  /**
   * list all Account Logs
   *
   *
   */
  list() {
    return this.http.get<AccountLogs[]>(`${endpoint}/GetAll`);
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
