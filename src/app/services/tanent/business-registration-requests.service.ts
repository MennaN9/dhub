import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';

const endpoint = 'TenantRegistrationRequest';

@Injectable({
  providedIn: 'root'
})
export class BusinessRegistrationRequestsService {

  constructor(private http: HttpClientService) { }

  allRequestsByPagination(body: Object) {
    return this.http.get(`${endpoint}/GetAllByPagination`, body);
  }

  reject(body: Object) {
    return this.http.post(body, `${endpoint}/Reject`);
  }

  approve(body: Object) {
    return this.http.post(body, `${endpoint}/Approve`);
  }

  requestdetails(id: number): Observable<any> {
    return this.http.get(`${endpoint}/GetById`, { id: id });
  }

  save(body: Object, id: number) {
    body['id'] = id;
    return this.http.postFormData(body, `${endpoint}/Update`);
  }

  historicalAuditors(body: Object) {
    return this.http.get(`${endpoint}/GetHistoricalAuditors`, body);
  }

}
