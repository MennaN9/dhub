import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';

const endpoint = "TenantRegistration";
const endpointForTypes = "TanentRegistrationRequestLookups";
const endpointForDefualtRoles = "Roles";

export interface Type {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessRegistrationService {
  constructor(private http: HttpClientService) {

  }

  /**
   * create new country
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Register`);
  }

  getTypes(): Observable<Type[]> {
    return this.http.get(`${endpointForTypes}/GetAllBusinessType`);
  }

  getBusinessTypes(): Observable<Type[]> {
    return this.http.get(`${endpointForTypes}/GetAllBusinessRegistrationType`);
  }

  getAllContractRange(): Observable<Type[]> {
    return this.http.get(`${endpointForTypes}/GetAllContractRange`);
  }
  getAllDistance(): Observable<Type[]> {
    return this.http.get(`${endpointForTypes}/GetAllFeesCalculationType`);
  }

  get defaultModules() {
    return this.http.get(`${endpointForDefualtRoles}/GetDefaultModule`);
  }

}
