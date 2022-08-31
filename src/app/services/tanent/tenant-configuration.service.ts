import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';

const endpoint = "TenantConfigurations";

@Injectable({
  providedIn: 'root'
})
export class TenantConfigurationService {

  constructor(private http: HttpClientService) { }

  Add(body: Object) {
    return this.http.post(body, `${endpoint}/Add`);
  }
  Update(body: Object) {
    return this.http.put(body, `${endpoint}/Update`);
  }
  requestdetailsById(id: string): Observable<any> {
    return this.http.get(`${endpoint}/Get/${id}`);
  }
}
