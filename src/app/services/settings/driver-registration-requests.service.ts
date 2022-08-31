import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DriverRegistrationRequestsService {

  static readonly endpoint = 'DriverRegistrationRequest';

  constructor(private http: HttpClientService) { }

  allRequestsByPagination(body: Object) {
    return this.http.get(`${DriverRegistrationRequestsService.endpoint}/GetAllByPagination`, body);
  }

  reject(body: Object) {
    return this.http.post(body, `${DriverRegistrationRequestsService.endpoint}/Reject`);
  }

  approve(body: Object) {
    return this.http.postFormData(body, `${DriverRegistrationRequestsService.endpoint}/Approve`);
  }

  requestdetails(id: number): Observable<any> {
    return this.http.get(`${DriverRegistrationRequestsService.endpoint}/GetById`, { id: id });
  }

  save(body: Object, id: number) {
    body['id'] = id;
    return this.http.putFormData(body, `${DriverRegistrationRequestsService.endpoint}/Update`);
  }

  historicalAuditors(body: Object) {
    return this.http.get(`${DriverRegistrationRequestsService.endpoint}/GetHistoricalAuditors`, body);
  }
}
