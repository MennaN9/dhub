import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

const endpoint = 'TransportType';

@Injectable({
  providedIn: 'root'
})
export class TransportTypeService {

  constructor(private http: HttpClientService) { }


  /**
   * get Transport Type details
   *
   *
   * @param id
   */
  getTransportype(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all Transport Type
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * create new transportype
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update transportype
   *
   *
   * @param transportypeId
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete transportype
   *
   *
   * @param transportypeId
   */
  delete(transportypeId: number) {
    return this.http.delete(`${endpoint}/Delete/${transportypeId}`);
  }
}
