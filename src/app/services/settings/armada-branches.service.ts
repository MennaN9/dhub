import { Injectable } from '@angular/core';
import { HttpClientService } from '../../core/http-client/http-client.service';

const endpoint = 'ArmadaBranches';

@Injectable({
  providedIn: 'root'
})
export class ArmadaBranchesService {



  constructor(private http: HttpClientService) {

  }


  getKeyByBranch(id: number) {
    return this.http.get(`${endpoint}/GetAPIKeyForBranch/${id}`);
  }

  /**
 * create new Settings
 *
 *
 * @param body
 */
  insertOrUpdate(body: Object) {
    return this.http.post(body, `${endpoint}/InsertOrUpdate`);
  }


  /**
   * list all Agent Types
   *
   *
   */
  list() {
    return this.http.get<any[]>(`${endpoint}/GetAll`);
  }


}
